// components/search/search.js
let keyword = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'请输入关键字...'
    }
  },

  /*组件接受外部样式传入的类icon-sousuo*/
  externalClasses:[
    'iconfont',
    'icon-sousuo'
  ],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event){//将搜索框输入的内容传递过来
      //console.log(event)
      keyword = event.detail.value
    },
    onSearch(){
      console.log(keyword)
      //抛出一个search事件，并将keyword传递出去（传递到wxml的search组件）
      this.triggerEvent('search',{
        keyword
      })
    }
  }
})
