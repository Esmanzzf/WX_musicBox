// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const TcbRouter = require('tcb-router')

const db = cloud.database()//要用到数据库，就要先初始化
const _ = db.command
let blogList

/*获取blog集合*/
const blogCollection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  
  app.router('bloglist',async (ctx,next)=>{
    const keyword = event.keyword
    let w = []
    if (keyword.trim() != '') {//判断搜索框有无关键字，有的话在下面获取blogList时给他一个where（）方法
      //这里不能写成w={content：/keyword/i}，因为keyword是变量，不能写在正则符号里     
      w=[
         {
           content:new db.RegExp({
            regexp:keyword,//变量
            options:'i'
            })
          },
         {
           nickName:new db.RegExp({
            regexp: keyword,//变量
            options: 'i'
              })
         },/*
         {
           createTime:new db.RegExp({
             regexp: db.cloud.database(keyword),//变量,这里将时间转化为云服务器时间形式？
             options: 'i'
           })
         }*/
        ]
       blogList = await blogCollection.where(_.or(w)).skip(event.start).limit(event.count)
        .orderBy('createTime', 'desc').get().then((res) => {
          return res.data
        })
    }else{
        blogList = await blogCollection.skip(event.start).limit(event.count)
          .orderBy('createTime', 'desc').get().then((res) => {
            return res.data
          })}
    ctx.body = blogList
  })
  return app.serve()
}


