// pages/blog-edit/blog-edit.js

// 输入文字最大的个数
const MAX_WORDS_NUM = 120
// 最大上传图片数量
const MAX_IMG_NUM = 9

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
  onLoad: function (options) {
    console.log(options)
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