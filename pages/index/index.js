Page({
    data:{
        userInfo:{},
        avatarUrl:'',
        labCount:0,
        labList:[],
        labListDetail:[],
    },
    color:['yellow','green','blue'],
    onShow:function(){
        //获取用户头像
        wx.pro.getSetting({
        }).then((res)=>{
          if(res.authSetting['scope.userInfo']){
            wx.pro.getUserInfo({})
            .then((res)=>{
              this.upData({avatarUrl:res.userInfo.avatarUrl})
            }).catch((e)=>{
                console.log(e);
            })
          }
        }).catch((e)=>{
            console.log(e);
        })
        //获取用户的名字、学号、学院
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/user/info',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            }
        }).then((res)=>{
            this.upData({userInfo:res.data.data.userInfo});
        }).catch((e)=>{
            console.log(e);
        })
        //获取实验室个数
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/user/count',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            }
        }).then((res)=>{
            this.upData({labCount:res.data.data.count});
        }).catch((e)=>{
            console.log(e);
        })
        //获取实验室列表
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/lab/list',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'page':1
            }
        }).then((res)=>{
            //根据列表获取实验室名称
            var list = [];
            this.setData({labList:res.data.data.labList});
            this.data.labList.map((item,index)=>{
                wx.pro.request({
                    url:'https://api.yumik.top/api/v1/lab/get',
                    method:'get',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token'),
                    },
                    data:{
                        'labId':item['tableLabId']
                    }
                }).then((res)=>{
                    res.data.data.lab['tableLabId'] = item['tableLabId'];
                    res.data.data.lab['color'] = this.color[index%3];
                    list = [...list,res.data.data.lab];
                    this.setData({labListDetail:list});
                }).catch((e)=>{
                    console.log(e);
                })
            })
        }).catch((e)=>{
            console.log(e);
        })
    },
    addLab(){
        wx.pro.navigateTo({url:'/pages/index/addlab/index'})
    },

    getLabDetail(e){
        wx.pro.navigateTo({url:`/pages/index/labinfo/index?id=${e.currentTarget.id}`})
    }
})