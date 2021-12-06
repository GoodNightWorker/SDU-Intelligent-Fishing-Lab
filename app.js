// app.js

import {promisifyAll} from 'wx-promise-pro'
// https://github.com/youngjuning/wx-promise-pro
import {updataInit} from 'wx-updata'
// https://github.com/SHERlocked93/wx-updata

var mqtt = require('./utils/mqtt');
var client = null;

const connectMqtt = () => {
  const options={
    connectTimeout:4000,
    clientId:wx.getStorageSync('clientId'),
    port:8084,
    password:wx.getStorageSync('token'),
    username:'wechat',
  }
  client = mqtt.connect("wxs://api.yumik.top/mqtt",options)
  client.on('reconnect',(error)=>{
    console.log('正在重连',error)
  })
  client.on('error',(error)=>{
    console.log('连接失败',error)
  })
  let that = this;
  client.on('connect',(e)=>{
    console.log('成功连接服务器')
    client.subscribe('message.queue',{
      qos:0
    },function(error){
      if(!error){
        console.log('订阅成功')
      }
    })
    client.on('message',function(topic,message){
      console.log('received msg:'+message.toString());
    })
  })
}

promisifyAll()
updataInit()

App({
  onLaunch() {
    // connectMqtt();
    setTimeout(()=>{
      wx.pro.login().then((res)=>{
        wx.pro.request({
        url:"https://api.yumik.top/api/v1/login/wechat",
        data:{
          code:res.code,
          compulsory:true
        },
        method:'post',
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },
      })
      .then((res)=>{
        if(res.data.errCode === 0){
          var token = res.data.data.token;
          var clientId = res.data.data.mqttId;
          wx.setStorageSync('token',token);
          wx.setStorageSync('clientId',clientId);
          console.log(token);
          if(wx.getStorageSync('flag')){
            wx.pro.switchTab({url:'/pages/index/index'})
          }
          else{
            wx.pro.request({
              url:"https://api.yumik.top/api/v1/user/info",
              method:'get',
              header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
              },
            }).then((res)=>{
              if(res.data.data.userInfo.name){
                wx.setStorageSync('flag',true);
                wx.pro.switchTab({url:'/pages/index/index'})
              }
              else{
                wx.pro.redirectTo({url:'/pages/login/index'})
              }
            }).catch((e)=>{
              console.log(e)
            })
          }
        }
      }).catch((e)=>console.log(e));
      }).catch((e)=>console.log(e))
    },3000)
    Page = updataInit(Page, {
      debug: false
    }) 
  },
})