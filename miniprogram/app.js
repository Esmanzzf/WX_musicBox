//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        //环境ID
        env: 'music-test-24j2m',
        traceUser: true,
      })
    }

    this.getOpenid()
    //全局属性
    this.globalData = {
      playingMusicId:-1,//在player.js（处理是否为同一首歌）和组件musiclist.js（点击下一首返回后实现对应高亮）都会用到
      openid: -1,//在my页面中使用
    }
  },
  //在player的加载音乐_loadMusicDetail函数的时候执行，将id保存为全局的
  setPlayMusicId(musicId){
    this.globalData.playingMusicId = musicId
  },
  getPlayMusicId(){
    return this.globalData.playingMusicId
  },
  //从login云函数和获取openid，放到本地存储里,在my页面中使用
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      const openid = res.result.openid
      this.globalData.openid = openid//把它放到全局变量里
      if (wx.getStorageSync(openid) == '') {//如果openid为空，则初始化一个
        wx.setStorageSync(openid, [])//参数是key和value
      }
    })
  },
})
