// components/lyric/lyric.js
let lyricHeight = 0//初始化歌词高度

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false,
    },
    lyric:String
  },

  observers:{
    lyric(lrc) {//监听lyric属性对象并传给参数lrc,每当监听的数据变化(包括赋一个相同的值)时就会执行下面的代码
      console.log(lrc)//是一大串字符
      if (lrc == '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc: '暂无歌词',
            time: 0,
          }, 
          {
            lrc: '(当前可能为纯音乐播放)',
            time: 0,
          }],
          nowLyricIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0, // 当前选中的歌词的索引
    scrollTop: 0, // 滚动条滚动的高度
  },

  /*组件的生命周期*/
  lifetimes: {
    ready() {
      // 不同手机设备的宽度都是750rpx
      wx.getSystemInfo({
        success(res) {
          // console.log(res)
          // 求出1rpx对应是多少px，然后*64即歌词的行高
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //
    update(currentTime) {//currentTime作为形参，准备在player.js的timeUpdate(event)函数中接受 event.detail.currentTime实参
      console.log(currentTime)
      let lrcList = this.data.lrcList
      if (lrcList.length == 0) {
        return
      }
      if (currentTime > lrcList[lrcList.length - 1].time) {//处理歌曲尾声currentTime大于lrcList.time的情况
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,//没有高亮歌词了
            scrollTop: lrcList.length * lyricHeight//继续往下滚动
          })
        }
      }
      for (let i = 0, len = lrcList.length; i < len; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break//但找到了那一行就可以退出循环
        }
      }
    },

    _parseLyric(sLyric){
      let line = sLyric.split('\n')//将一大串字符通过换行分割，并返回一个字符串数组
      let _lrcList = []//用来存放单位时间对应的歌词
      line.forEach((elem)=>{//foreach()方法调用数组的每一个元素（这里每个元素是字符串），并传递给回调函数
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)//根据正则匹配字符串,返回时间字符串的数组（因为foreach所以最终是字符串组成的数组）
        if(time != null){
          let lrc = elem.split(time)[1]//得到每行的歌词字符串的数组（注意：当以split的参数是正则时，也会一起返回，因此这里的[0]就是时间，[1]才是歌词）
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          console.log(timeReg)
          // 把时间转换为秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,//对应歌词
            time: time2Seconds,//单位时间
          })
        }
      })
      //foreach循环结束后
      this.setData({
        lrcList: _lrcList
      })
    } 
  }
})
