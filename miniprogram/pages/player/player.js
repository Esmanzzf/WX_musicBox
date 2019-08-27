// pages/player/player.js
let musiclist = []

let nowPlayingIndex = 0
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()//调用全局属性或方法

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false,//表示当前不播放
    isLyricShow:false,//表示当前歌词不显示
    lyric:'',
    isSame:false//表示是否点击了同一首歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//获取点击了歌曲后传递过来的参数(歌的id，歌对应的index)
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclistStorage')//是一个musiclist数组,取到值后放在当前js全局
    this._loadMusicDetail(options.musicId)//这个Id是string型的
  },
  
  /*加载音乐*/
  _loadMusicDetail(musicId){
    if(musicId == app.getPlayMusicId()){//判断是否点击了同一首歌曲
      this.setData({
        isSame:true
      })
    }else{
      this.setData({
        isSame: false
      })
    }
    if(!this.data.isSame){
      backgroundAudioManager.stop()//不是同一首才需要停止播放
    }

    let music = musiclist[nowPlayingIndex]//根据index查找Storage数组，找到对应的音乐（就能得到对应音乐的相关信息参数）
    console.log(music)
    wx.setNavigationBarTitle({
      title:'曲名：'+ music.name,
    })
    this.setData({
      picUrl:music.al.picUrl,
      isPlaying:false,
    })

    /*将musicId传递给全局（它是一个string）*/
    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: '歌曲加载中',
    })
    //然后使用云函数
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId:musicId,//将点击的歌曲的musicId传给云函数的musicUrl的router
        $url:'musicUrl'
      }
    }).then((res)=>{//得到云函数返回来的结果
      console.log(res)
      console.log(JSON.parse(res.result))
      if (JSON.parse(res.result).data[0].url == null) {//说明该音乐可能为VIP音乐，将它传给backgroundAudioManager.src会报错
        wx.showToast({
          title: '暂无权限播放该音乐',
          icon: 'none',
          duration: 5000
        })
        return//退出then的回调函数
      }
      if(!this.data.isSame){//不是同一首才需要重新获取音乐资源
        backgroundAudioManager.src = JSON.parse(res.result).data[0].url//在结果的data里面就有音乐的url
        backgroundAudioManager.title = music.name//这行不写会报错
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
      }
      this.setData({
        isPlaying:true
      })
      wx.hideLoading()
      //继续使用云函数获取歌词信息(是写在then里面的)
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,//将点击的歌曲的musicId传给云函数的lyric的router
          $url: 'lyric'
        }
      }).then((res) => {
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if (lrc){
          lyric = lrc.lyric//得到歌词
        }
        this.setData({
          lyric: lyric
        })
      })
    })
  },


  /*播放暂停函数*/
  togglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying:!this.data.isPlaying
    })
  },
  /*上一首下一首*/
  onPrev(){
    nowPlayingIndex--
    if (nowPlayingIndex<0){
      nowPlayingIndex = musiclist.length-1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)//_loadMusicDetail函数需要一个musicId,我们可以通过本地存储的id属性获取
  },
  onNext(){
    nowPlayingIndex++
    if (nowPlayingIndex > musiclist.length-1) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  /*歌词显示函数*/
  onChangeLyricShow(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  /*将从progress-bar组件传来的currentTime传给lyric组件，实现组件与组件的通信*/
  timeUpdate(event){
    //通过class选择器选中组件
    this.selectComponent('.lyric').update(event.detail.currentTime)/*update方法先在lyric.js中定义好*/
  },
  
  /*用来联动全局播放器和播放暂停面板的动画效果*/
  onPlay(){
    this.setData({
      isPlaying: true,/*播放暂停面板的动画效果是由isPlaying来判断控制的*/
    })
  },
  onPause(){
    this.setData({
      isPlaying: false,
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