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
    //全局属性
    this.globalData = {
      playingMusicId:-1//在player.js（处理是否为同一首歌）和组件musiclist.js（点击下一首返回后实现对应高亮）都会用到
    }
  },
  //在player的加载音乐_loadMusicDetail函数的时候执行，将id保存为全局的
  setPlayMusicId(musicId){
    this.globalData.playingMusicId = musicId
  },
  getPlayMusicId(){
    return this.globalData.playingMusicId
  }
})
