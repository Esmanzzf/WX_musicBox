// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
//接受components / blog - ctrl / blog - ctrl.js传过来的评论内容、formId、blogId
exports.main = async (event, context) => {
  //获取openid
  const {OPENID} = cloud.getWXContext()
  const result = cloud.openapi.templateMessage.send({
    touser:OPENID,
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,//设置真机点击微信的模板会跳转的页面
    data: {
      keyword1: {
        value: '评价完成'
      },
      keyword2: {
        value: event.content
      }
    },
    templateId: 'yMc2nvgonoZEFOxm4czaZ4qwaob_o6PXEYX4C0YRVsY',//模板ID
    formId: event.formId
  })
  return result
}