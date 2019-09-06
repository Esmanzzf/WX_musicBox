// pages/my-playHistory/my-playHistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: []//用于存放播放历史歌单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取全局里的openid,并传给Storage的key，得到对应的本地存储(数组)
    const playHistory = wx.getStorageSync(app.globalData.openid)
    if (playHistory.length == 0) {
      wx.showModal({
        title: '播放历史为空',
        content: '',
      })
    } else {
      // storage里面musiclistStorage存储的musiclist替换成播放历史的歌单playHistory,用于在历史的歌单实现上一首、下一首
      wx.setStorage({
        key: 'musiclistStorage',
        data: playHistory,
      })
      this.setData({
        musiclist: playHistory//这部分是要与wxml交互渲染
      })
    }
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