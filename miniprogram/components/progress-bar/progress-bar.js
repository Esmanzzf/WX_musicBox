// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec =-1//用于判断是否过了一秒
let duration = 0//表示当前歌曲的总时长（是一个数字代表有多少秒，与totalTime表示方式不一样而已，用于计算）
let isMoving = false //表示当前进度条是否在滑动，解决滑动时如果音乐在播放执行的onTimeUpdate函数的冲突（因为这个函数setData了progress、movableDis）

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean//用于点击同一首歌曲时页面重新渲染totalTime为00：:00的问题
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime:{
      currentTime:"00:00",
      totalTime: "00:00",
    },

    movableDis:0,
    progress:0,
  },

  /*组件的生命周期函数*/
  lifetimes:{
    ready(){
      if(this.properties.isSame && this.data.showTime.totalTime=='00:00'){//表示点击了同一首歌
        this._setTime()
      }
      this._getmovableDis()
      this._bindMusicEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event){
      //拖动
      if(event.detail.source == 'touch'){
        //注意这里只是保存了这个值，并没有setData，否则会造成性能问题
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd() {
      const currentTimeFmt = this._timeFormat(backgroundAudioManager.currentTime)//得到一个返回的对象（min，sec）
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec,//与模板字符串功能相同
      })
      //接受一个以秒为单位的数字，播放对应时间的音乐内容
      backgroundAudioManager.seek(duration * this.data.progress / 100)/*duration在_setTime函数中（在onCanPlay的时候已执行）已获取到音乐时长*/
      isMoving = false
    },

    _getmovableDis(){
      const query = this.createSelectorQuery()//如果不是写在组件里应该是wx.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()//根据css选择器获取元素宽度
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        //console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    _bindMusicEvent(){
      backgroundAudioManager.onPlay(()=>{
        console.log('onPlay')
        isMoving: false//解决当滑动停止后，他会在调用一次onChange，导致isMoving右边为true的BUG
        this.triggerEvent('musicPlay')//将事件抛出给父组件player
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
        this.triggerEvent('musicPause')//将事件抛出给父组件player
      })
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        console.log(backgroundAudioManager.duration)//当给播放器一个音乐的src之后，他就会有这些属性
        if (typeof backgroundAudioManager.duration != 'undefined'){
          this._setTime()
        }else{
          setTimeout(()=>{
            this._setTime()
          },1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        if(!isMoving){
          console.log('onTimeUpdate')
          /*进度条同步*/
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const currentTimeFmt = this._timeFormat(currentTime)
          if (currentTime.toString().split('.')[0] != currentSec) {//防止1秒setData好几次
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
            })
            currentSec = currentTime.toString().split('.')[0]
            //联动歌词，自定义一个事件,每onTimeUpdate一次都会将抛出timeUpdate事件，将currentTime传递出去（传递到player）
            this.triggerEvent('timeUpdate', {currentTime})
          }
        }
      })
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        //组件通信：向外抛出一个事件,在player.wxml的组件标签用bind绑定
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        console.log('onError')
        console.log(res.errMsg)
        console.log(res.errCode)
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },
    /*获取音乐的时长*/
    _setTime(){
      duration = backgroundAudioManager.duration//全局变量
      console.log(duration)
      const durationFmt = this._timeFormat(duration)/*得到一个对象*/
      console.log(durationFmt)
      this.setData({
        //注意：只修改data中一个对象里面的其中一个属性值，可以通过['对象名.属性名']来赋值
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    /*格式化时间*/
    _timeFormat(sec){
      //分钟
      const min = Math.floor(sec/60)
      //秒钟(注意这里无需重复声明了)
      sec = Math.floor(sec%60)
      /*然后返回一个对象给durationFmt*/
      return{
        'min':this._parse0(min),
        'sec':this._parse0(sec)
      }
    },
    /*渲染时间前补零*/
    _parse0(sec){
      return sec < 10 ? '0' + sec : sec
    },
  }
})
