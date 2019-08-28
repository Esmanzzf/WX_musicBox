// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalShow:Boolean
  },


  options:{//关闭样式隔离
    styleIsolation:'apply-shared',//表示页面wxss会影响到自定义组件，而自定义组件指定的样式不会影响页面
    multipleSlots:true//启用多个插槽，要配合具名插槽使用
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCloseModal(){
      this.setData({
        isModalShow:false
      })
    },
  }
})
