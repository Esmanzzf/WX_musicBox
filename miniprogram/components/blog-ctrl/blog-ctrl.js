// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
//将评论插入数据库
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //接受父组件blog的blogId属性
    blogId:String
  },
  /*接受外部样式*/
  externalClasses: ['iconfont', 'icon-pinglun','icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow: false,
    // 底部弹出层是否显示
    modalShow: false,
    //评论内容
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //实现评论功能函数
    onComment() {
      //获取授权信息
      wx.getSetting({
        success: (res) => {
         // 判断用户是否授权
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({//如果已授权则获取用户信息（头像昵称）
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          } else {
            this.setData({
              loginShow: true,
            })
          }
        }
      })
    },
    /*授权成功*/
    onLoginsuccess(event) {
      //如果点击评论时还没授权，获取不到userInfo,会执行loginShow: true,此时点击授权会触发login组件的onGetUserInfo函数，
      //该函数抛出onLoginsuccess事件和userInfo（这里通过event接受）
      userInfo = event.detail
      // 授权框消失，评论框显示
      this.setData({
        loginShow: false,
      }, () => {//setData里的表示回调函数
        this.setData({
          modalShow: true,//评论框显示
        })
      })
    },
    /*授权失败*/
    onLoginFail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },

    /*
    textarea的bind：onInput不需要了，因为使用了form会自动把内容传给onSend函数的event
    onInput(event){
      this.setData({
        content:event.detail.value
      })
    },*/

    //写完评论后点击发送
    onSend(event){
      //插入数据库
      let formId = event.detail.formId//每提交一次表单会产生一个formId，可进行一次消息推送
      // let content = this.data.content
      let content = event.detail.value.content
      if (content.trim()==''){
        wx.showModal({
          title: '评论不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评价发送中',
        mask:true
      })
      //注意：在小程序端插入数据会带有_openid，在云函数那里插入则没有
      db.collection('blog-comment').add({//将评论内容、时间、blogid、头像昵称
        data:{
          content,
          creatTime:db.serverDate(),
          blogId:this.data.blogId,
          nickName:userInfo.nickName,//设在该js的全局，在onComment（）判断授权后赋予
          avatarUrl:userInfo.avatarUrl//头像
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.showToast({
          title:"评论成功"
        })
        this.setData({
          modalShow:false,
          content:''
        })
      })
      //推送模板消息
      wx.cloud.callFunction({
        name: 'sendMessage',//调用sendMessage云函数，传递内容、formId、blogId过去
        data: {
          content,
          formId,
          blogId: this.properties.blogId
        }
      }).then((res) => {
        console.log(res)
      })
    }
  }
})
