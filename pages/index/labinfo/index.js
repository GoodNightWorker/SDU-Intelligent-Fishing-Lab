Page({
    data:{
        listData:{
            name:' >',
            labId:'',
            adminName:'',
            telephone:'',
            member:' >',
            key:'1永久 2临时 >',
            note:' >',
        },
        deviceList:[
            {
                "title":"温度计",
                "image":"/images/icon-thermometer.svg",
                "isOn":"on"
            },
            {
                "title":"摄像头",
                "image":"/images/icon-camera.svg",
                "isOn":"on"
            },
            {
                "title":"湿度计",
                "image":"/images/icon-humidity.svg",
                "isOn":"on"
            },
            {
                "title":"有害气体",
                "image":"/images/icon-nose.svg",
                "isOn":"on"
            },
        ]
    },
    
    upData(data) {
        return this.setData(objToPath(data))
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
                console.log(e);
                break;
            case '密钥':
                wx.pro.navigateTo({url:`/pages/index/labinfo/labkeylist/index?id=${this.data.listData.labId}`});
                break;
        }
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