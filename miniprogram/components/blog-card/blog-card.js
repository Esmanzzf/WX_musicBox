// components/blog-card/blog-card.js
import formatTime from '../../style/formatTime.js'
//根路径
/*import formatTime from '//utils/formatTime.js'*/

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog:Object
  },

  /*格式化时间：原理和格式化歌单播放数量一样*/
  observers: {
    ['blog.createTime'](val) {//监听blog属性对象的createTime属性并传给参数val,每当监听的数据变化(包括赋一个相同的值)时就会执行下面的代码
      if (val) {
        // console.log(val)
        this.setData({
          _createTime: formatTime(new Date(val))//将服务器时间格式转化为Js型的Date型时间格式，然后传给../../utils/formatTime.js
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''//防止造成 observes死循环
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*在blog界面的图片预览,注意这里使用了catch来绑定事件，取消了事件冒泡，防止与blog.js中的goComment函数冲突*/
    onPreviewImage(event) {
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc,
      })
    },
  }
})
