// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalShow: Boolean//接受到父组件blog传来的isModalShow，还要把它继续传给bottom-modal组件
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(event) {//用户点击了授权button是触发
      console.log(event)
      const userInfo = event.detail.userInfo
      //判断当前是选择了允许授权还是拒绝授权
      if (userInfo) {
        this.setData({
          isModalShow: false
        })
        this.triggerEvent('loginsuccess', userInfo)//向父组件blog抛出一个事件，同时将userInfo传出去
      } else {
        this.triggerEvent('loginfail')
      }
    }
  }
})
