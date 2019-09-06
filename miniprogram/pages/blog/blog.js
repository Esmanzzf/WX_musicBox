// pages/blog/blog.js
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,//控制底部弹出层是否显示
    blogList:[]

  },

  /*发布功能函数*/
  onPublish(){
    // 判断用户是否授权
    wx.getSetting({// 获取用户当前的授权状态
      success: (res) => {//注意这里要用箭头函数，否则下面的this.setData会出错（因为写在wx.里面）
        console.log(res)
        if (res.authSetting['scope.userInfo']) {//判断是否已经授权
          wx.getUserInfo({//获取用户信息
            success:(res)=> {//注意这里也要用箭头函数，否则下面的this..onLoginSuccess会出错（因为写在wx.里面）
              //console.log(res)
              //如果成功则无需进入授权确定或拒绝弹出层，直接将userInfo作为参数调用onLoginSuccess函数
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {//不成功则显示modalShow进入授权确定或拒绝弹出层
          this.setData({
            modalShow: true,
          })
        }
      }
    })
  },
  //接受到授权成功时login子组件传过来的userInfo
  onLoginSuccess(event){
    console.log(event)
    const detail = event.detail//这个detail和 this.onLoginSuccess中的detail是对应的
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,//传给blog-edit那边的onload的参数options
    })
  },
  onLoginFail(){
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  /*接收到从search组件抛过来的事件:这种方式传过来的值（keyword）一般都放在event.detail里面*/
  onSearch(event) {
    console.log(event.detail.keyword)
    this.setData({
      blogList: [],
    })
    keyword = event.detail.keyword//将它定义在本地
    this._loadBlogList(0)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('lajsdlih')
    this._loadBlogList()
  },


  _loadBlogList(start=0){//ES6写法：参数默认值
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        start,
        //start:0,
        count: 10,
        $url: 'bloglist',
        keyword//将搜索关键字传给云数据库
      }
    }).then((res)=>{
      console.log(res)
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  /*在blog界面点击卡片跳转到详情界面*/
  goComment(event){
    wx.navigateTo({
      //跳转并将f-blogcard组件中的自定义属性data-blogid传递给blog-comment页面的onLoad: function (options)
      url: '../../pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
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
  onPullDownRefresh: function () {//记得去设置.json文件中的 "enablePullDownRefresh": true
    this.setData({
      blogList:[]
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})