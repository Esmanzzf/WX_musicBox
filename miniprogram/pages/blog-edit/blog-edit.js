// pages/blog-edit/blog-edit.js

// 输入文字最大的个数
const MAX_WORDS_NUM = 120
// 最大上传图片数量
const MAX_IMG_NUM = 9
//初始化数据库：要存放发布的信息
const db = wx.cloud.database()
// 输入的文字内容
let content = ''
//用户信息：昵称、头像
let userInfo = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum:0,//输入的文字个数
    footerBottom: 0,//控制footer的位置
    images: [],//存放已选择的图片
    selectPhoto: true, // 添加图片的那个加号是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//用户头像和昵称，从login授权组件传来
    console.log(options)
    userInfo = options
  },

  onInput(event){
    //console.log(event)
    //console.log(event.detail.value)
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value//将文本文字保存
  },
  //获取焦点和失去焦点
  onFocus(event) {
    // 模拟器获取的键盘高度为0
    // console.log(event)
    this.setData({
      footerBottom: event.detail.height,//键盘高度
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },
  //选择上传图片函数
  onChooseImage() {
    // 最多还能再选图片的数量
    let max = MAX_IMG_NUM - this.data.images.length//9-已选数量
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],//图片的类型：初始的、压缩的
      sourceType: ['album', 'camera'],//图片的来源：手机相册的、直接拍照的
      success: (res) => {//注意用箭头函数
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)//已选的图片拼上选中的图片地址
        })
        //再次判断还能再选几张图片，如果满9张了就隐藏加号图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  /*删除图片*/
  onDelImage(event) {
    //注意splice()返回的是被删除的那个，因此不能直接把它setData给images，否则等于将删除的项赋给images
    this.data.images.splice(event.target.dataset.index, 1)//找到删除图片的索引，然后删除1个（//bindtap穿过来的自定义属性放在target.dataset里面）
    this.setData({
      images: this.data.images
    })
    //删除后如果图片数量等于8，说明加号图片应该重新显示
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  /*预览图片函数*/
  onPreviewImage(event) {
    console.log(event)
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,//bindtap穿过来的自定义属性放在target.dataset里面，其中imgsrc是自定义属性的名称
    })
  },

  /*将编辑好的信息送给数据库，最后再由blog向数据库拿数据*/
  send(){
    // 2、数据 -> 云数据库
    /* 数据库：文本（在onInput函数找）、
    图片fileID（wx.cloud.uploadFile将图片传到云存储时生成fileID作为标识）、
    openid（提交后自带）、
    昵称、头像（在onLoad: function (options)中找）、
    时间（创建服务器时间）*/
    // 1、图片 -> 云存储 fileID 云文件ID

    //首先判断用户是否有输入内容，trim()方法是删除字符串中的空格
    if (content.trim() === '') {
      wx.showToast({
        title: '请输入文字内容',
        icon:'none',
        duration:1500
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true,//生成一个蒙版阻挡用户的其他操作
    })

    let promiseArr = []
    let fileIds = []
    //将图片上传到云存储，得到图片的fileID，注意他是异步的
    for (let i = 0, len = this.data.images.length;i<len;i++){
      let p = new Promise((resolve,reject)=>{
        let item = this.data.images[i]
        // 文件扩展名正则
        let suffix = /\.\w+$/.exec(item)[0]//exec() 方法用于检索字符串中的正则表达式的匹配
        wx.cloud.uploadFile({//这个API接口每次只能上传一张，需循环遍历图片
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,//图片的临时路径
          success: (res) => {
            //console.log(item)
            console.log(res.fileID)
            fileIds = fileIds.concat(res.fileID)//要保存多个fileID
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }

    //将文本、图片fileID、openid、昵称、头像、时间送给数据库
    Promise.all(promiseArr).then((res)=>{
      db.collection('blog').add({//找到云数据库的blog集合，并往里面添加数据
        data:{
          ...userInfo,//将userInfo数据中的每个元素（头像、昵称）列出来
          content,
          img: fileIds,
          createTime: db.serverDate(), // 服务端的时间
        }
      }).then((res) => {//这个then嵌套在上一个then里面
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        //返回blog页面
        wx.navigateBack()
        //并且刷新（子界面调用父界面的方法：onPullDownRefresh）
        const pages = getCurrentPages()
        // console.log(pages)
        // 取到上一个界面
        const prevPage = pages[pages.length - 2]//减1则是当前界面
        prevPage.onPullDownRefresh()
      })  
    }).catch((err) => {//当整个Promise失败时
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})