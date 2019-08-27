// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ml:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    checkedId:-1
  },

  /*组件所在页面的生命周期*/
  pageLifetimes: {
    show() {//当musiclist页面被show的时候将全局的playingMusicId拿过来，更新当前播放的音乐的checkedId
      this.setData({
        checkedId: parseInt(app.getPlayMusicId())
        /*注意：将这个musicId转化成number型，因为从全局获取来的id是string型，
        这样做全等比较会失败，导致被选中的musiclist不高亮
        1.通过点击歌曲获得的id是从
        全局->
        player.js的_loadMusicDetail()函数->
        本js的onSelect的wx.navigateTo的url拼接?musicId=${event.currentTarget.dataset.musicid}传给player.js中的onLoad: function (options)（它是string）
        2.而通过下一首按钮获得的id是从Storage中获取的（它是number）*/
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){//event是点击音乐列表一首歌时所带的参数（包括歌的id，歌对应的index）,这些都将传给player去使用
      //console.log(event.currentTarget.dataset.musicid)
      this.setData({
        checkedId: event.currentTarget.dataset.musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${event.currentTarget.dataset.musicid}&index=${event.currentTarget.dataset.index}`,
      })
    }
  }
})
