// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      pl:{
        type:Object
      }
  },
  
  /*
  *组件的数据监听器
  */
  observers:{
        ['pl.playCount'](count){//监听pl属性对象的playCount并传给参数count,每当监听的数据变化(包括赋一个相同的值)时就会执行下面的代码
            //console.log(this._tranNum(count,2))
            this.setData({
              //这里不能对pl.playCount监听，否则会死循环
              _count: this._tranNum(count, 2)
            })
        }
  },


  /**
   * 组件的初始数据
   */
  data: {
        _count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
      goToMusicList(){
        //点击组件跳转到音乐列表页面（同时传递了一个playlist组件id）
        wx.navigateTo({
          url: `../../pages/musiclist/musiclist?playlistId=${this.properties.pl.id}`,
        })
      },

      _tranNum(num,point){
          let numStr = num.toString().split('.')[0]
          if(numStr.length<6){
            return numStr
          }else if(numStr.length>=6 && numStr.length<=8){
            let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
            return parseFloat(parseInt(num/10000) + '.' + decimal)+'万'
          }else if(numStr.length>8){
            let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
            return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
          }     
      }
  }
})
