// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()//初始化云数据库
const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'//服务器地址
const playlistCollection = db.collection('playlist')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
    //const list = await playlistCollection.get()//注意这种写法最多只能get到100条（对象）
    const coustResult = await playlistCollection.count()
    //coustResult是个对象，使用.total转为数字
    const total = coustResult.total
    const getTimes = Math.ceil(total / MAX_LIMIT)
    const tasks = []
    for(let i=0; i<getTimes; i++){
      let getData = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(getData)
    }
    let list = {
      data:[]
    }
    if(tasks.length>0){
      list = (await Promise.all(tasks)).reduce((prev,cur) =>{
        return{
          data:prev.data.concat(cur.data)
        }
      })
    }

     //rp(URL)向服务器发送请求(异步),返回的数据传给res参数
    const playlist = await rp(URL).then((res)=>{
      return JSON.parse(res).result
    })
    //console.log(playlist)

    //插入数据之前的数组去重(找到playlist中不在list里的数据并插入)
    const newData = []
    for(let i=0, len1=playlist.length; i<len1; i++){
      let flag = true
      for(let j=0, len2=list.data.length; j<len2; j++){
        if(playlist[i].id===list.data[j].id){
          flag = false
          break
        }
      }
      if(flag){
        newData.push(playlist[i])
      }
    }
    
    for(let i = 0,len = newData.length; i<len;i++){  
      //获取云数据库中创建好的的playlist集合，插入服务器返回的(并且解析去重处理好)的newData数据
      await playlistCollection.add({
        data:{
          ...newData[i],//展开数组里的数据滨用逗号分隔
          createTime:db.serverDate(),
        }
      }).then((res)=>{
        console.log('插入成功')
      }).catch((err)=>{
        console.log('插入失败')
      })
    }
    return newData.length
}