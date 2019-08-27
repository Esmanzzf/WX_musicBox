// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  app.router('playlist',async(ctx,next)=>{
    ctx.body = await cloud.database().collection('playlist')
    .skip(event.start).limit(event.count)
    .orderBy('createTime', 'desc')//根据插入的时间逆向排序
    .get()
    .then((res)=>{
      return res
    })
  })
  app.router('musiclist',async(ctx,next)=>{
    ctx.body= await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
    //根据pages的musiclist的playlistId（这个id是通过点击playlist组件传给的musiclist的），拼接路径，发送请求给服务器
    .then((res)=>{
      return JSON.parse(res)//请求成功后服务器返回了一个errMsg（里面的tracks就有音乐列表），通过app.server（）返回给pages/musiclist
    })
  })
  app.router('musicUrl',async(ctx,next)=>{
    ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`)//根据musicId 请求服务器
    .then((res)=>{
      return res
    })
  })
  app.router('lyric',async(ctx,next)=>{
    ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`)
    .then((res)=>{
      return res
    })
  })

  return app.serve()
}