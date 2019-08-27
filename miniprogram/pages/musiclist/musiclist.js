// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist:[],
    listInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//options接收到playlist组件传过来的id
    console.log(options)
    wx:wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        playlistId:options.playlistId,//将接收到的playlist的id传给云函数music的musiclist路由
        $url:'musiclist'
      }
    }).then((res)=>{//接收到了云函数music的musiclist路由返回来的音乐列表（在tracks里面）和其他一些相关信息
      console.log(res)
      this.setData({
        musiclist:res.result.playlist.tracks,//是一个数组
        listInfo:{
          coverImgUrl:res.result.playlist.coverImgUrl,
          name: res.result.playlist.name
        }
      })
      this._setMusiclist()
      wx:wx.hideLoading()
    })
  },

  _setMusiclist(){
    wx.setStorageSync('musiclistStorage',this.data.musiclist)
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