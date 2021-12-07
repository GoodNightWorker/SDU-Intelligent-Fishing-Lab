Page({
    data:{
        labId:'',
        key:'',
    },
    onLoad:function(option){
        console.log('option',option);
        console.log('scene',option.scene);
        console.log('de_scene',decodeURIComponent(option.scene))

        if(!option.scene){
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
        }
        else{
            //let scene = decodeURIComponent(option.scene);
            let scene = option.scene
            let arr = scene.split('*');
            this.setData({labId:arr[0],key:arr[1]})
            wx.pro.navigateTo({url:`/pages/index/labinfo/labkeylist/labkeyinfo/index?id=${this.data.labId}&&key=${this.data.key}`})
        }
    }
})