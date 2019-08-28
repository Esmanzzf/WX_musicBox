// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false//控制底部弹出层是否显示
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
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,//传给那边onload的参数options
    })
  },
  onLoginFail(){
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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