Page({
    data:{
        labId:'',
        key:'',
    },
    onLoad:function(option){
        if(option.scene){
          let scene = option.scene
          let arr = scene.split('*');
          this.setData({labId:arr[0],key:arr[1]})
        }
        setTimeout(()=>{
          //登录获取token
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
              wx.setStorageSync('token',token);
              console.log(token);
              //如果已经填写过信息，判断正常跳转还是扫码跳转
              // if(wx.getStorageSync('flag')){
              //   if(option.scene){
              //     wx.pro.redirectTo({url:`/pages/index/labinfo/labkeylist/labkeyinfo/index?id=${this.data.labId}&key=${this.data.key}&type=scan`})
              //   }
              //   else wx.pro.switchTab({url:'/pages/index/index'})
              // }
              // //flag不存在，获取用户信息
              // else{
                wx.pro.request({
                  url:"https://api.yumik.top/api/v1/user/info",
                  method:'get',
                  header:{
                    'content-type':'application/x-www-form-urlencoded',
                    'Authorization':wx.getStorageSync('token')
                  },
                }).then((res)=>{
                  console.log(res)
                  if(res.data.errCode==-3){
                     //无信息登录
                     wx.pro.redirectTo({url:'/pages/login/index'})
                  }
                  else{
                    //有信息跳转
                    wx.setStorageSync('flag',true);
                    if(option.scene){
                      wx.pro.redirectTo({url:`/pages/index/labinfo/labkeylist/labkeyinfo/index?id=${this.data.labId}&key=${this.data.key}&type=scan`})
                    }
                    else wx.pro.switchTab({url:'/pages/index/index'})
                  }
                }).catch((e)=>{
                  console.log(e)
                })
              }
            // }
          }).catch((e)=>console.log(e));
          }).catch((e)=>console.log(e))
        },3000)
    }
})