Page({
    data:{
        listData:{
            name:'实验室',
            labId:'',
            adminName:'',
            telephone:'',
            member:' >',
            key:'',
            
        },
        deviceList:{},
        iconList:{
            "温度计":"/images/icon-thermometer.svg",
            "摄像头":"/images/icon-camera.svg",
            "湿度计":"/images/icon-humidity.svg",
            "有害气体":"/images/icon-nose.svg",
            "实验室门禁":"/images/icon-door.svg",
            "温湿度传感器":"/images/icon-tem&hum.svg"
        }
    },
    onLoad:function(option){
        this.data.listData.labId = option.id;
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/get',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'labId':option.id
            }
        }).then((res)=>{
            var list = this.data.listData;
            list.name = res.data.data.lab.name;
            wx.pro.request({
                url:'https://api.yumik.top/api/v1/user/info',
                method:'get',
                header:{
                    'content-type':'application/x-www-form-urlencoded',
                    'Authorization':wx.getStorageSync('token'),
                },
                data:{
                    'otherUserId':res.data.data.lab.tableUserId
                }
            }).then((res)=>{
                list.adminName = res.data.data.userInfo.name;
                list.telephone = res.data.data.userInfo.telephone;
                this.upData({listData:list})
            }).catch((e)=>{
                console.log(e);
            })
        }).catch((e)=>{
            console.log(e);
        })
    },
    onShow:function(){
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/secret/list',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'labId':this.data.listData.labId
            }
        }).then((res)=>{
            var list = this.data.listData;
            var arr = Object.keys(res.data.data)
            list.key = arr.length;
            this.setData({listData:list})
            return wx.pro.request({
                url:'https://api.yumik.top/api/v1/device/list',
                method:'get',
                header:{
                    'content-type':'application/x-www-form-urlencoded',
                    'Authorization':wx.getStorageSync('token'),
                },
                data:{
                    'labId':this.data.listData.labId,
                    'page':1,
                }
            })
        }).then((res)=>{
            this.setData({deviceList:res.data.data.deviceList})
            var list = this.data.deviceList;
            this.data.deviceList.map((item,index)=>{
                wx.pro.request({
                    url:'https://api.yumik.top/api/v1/device/online',
                    method:'get',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token'),
                    },
                    data:{
                        'deviceName':item.name,
                    }
                }).then((res)=>{
                    console.log(res)
                    list[index].icon = this.data.iconList[item.description];
                    list[index].online = (res.data.data.online.online?'on':'off');
                    this.setData({deviceList:list});
                })
            })
        })
    },

    scrollToTop() {
        this.setAction({
            scrollTop: 0
        })
    },
    
    toDetail(e){
        switch(e.currentTarget.dataset.name){
            case '名称':
                wx.pro.navigateTo({url:`/pages/index/labinfo/labname/index?value=${this.data.listData.name}&id=${this.data.listData.labId}`});
                break;
            case '成员':
                wx.pro.navigateTo({url:`/pages/index/labinfo/labmember/index?id=${this.data.listData.labId}`});
                break;
            case '密钥':
                wx.pro.navigateTo({url:`/pages/index/labinfo/labkeylist/index?id=${this.data.listData.labId}`});
                break;
        }
    },
    getDeviceDetail(e){
        //console.log(e.currentTarget.dataset.name);
        wx.pro.navigateTo({url:`/pages/index/labinfo/deviceinfo/index?name=${e.currentTarget.dataset.name}&description=${e.currentTarget.dataset.description}&type=${e.currentTarget.dataset.description.type}`})
    },
    deleteLab(){
        wx.pro.showModal({
            title:'提示',
            content: '确定要删除该实验室吗？'
        }).then((res)=>{
            if(res.confirm){
                wx.pro.request({
                    url:'https://api.yumik.top/api/v1/lab/delete',
                    method:'post',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token'),
                    },
                    data:{
                        'labId':this.data.listData.labId
                    }
                }).then((res)=>{
                    console.log(res)
                    if(res.data.errCode === 0){
                        wx.pro.showToast({
                            title:'删除成功，两秒后自动返回上一页',
                            icon:'none',
                            duration:2500
                        })
                        setTimeout(()=>{
                            wx.pro.navigateBack({url:`/pages/index/index`})
                        },2500)       
                    }
                }).catch((e)=>{
                    console.log(e);
                })
            }
        }).catch((e)=>{
            console.log(e)
        })
    }
})