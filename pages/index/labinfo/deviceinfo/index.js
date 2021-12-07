Page({
    data:{
        deviceName:'',
        description:'',
        deviceInfo:[],
        type:'',
    },
    onLoad:function(option){
        this.setData({deviceName:option.name,description:option.description,type:option.type})
    },
    onShow:function(){
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/device/parameter',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'deviceName':this.data.deviceName
            }
        }).then((res)=>{
            this.setData({deviceInfo:JSON.parse(res.data.data.shadow.json)})
        }).catch((e)=>{
            console.log(e);
        })
    },
    changeProps(e){
        let data = e.currentTarget.dataset.data;
        wx.pro.navigateTo({url:`/pages/index/labinfo/deviceinfo/changedeviceinfo/index?name=${e.currentTarget.dataset.name}&deviceName=${this.data.deviceName}&deviceVersion=${this.data.deviceInfo.version}&max_danger=${data.max_danger}&max_warning=${data.max_warning}&min_danger=${data.min_danger===undefined?data.rate_danger:data.min_danger}&min_warning=${data.min_warning===undefined?data.rate_warning:data.min_warning}`})
    },
    unbindDevice(){
        wx.pro.showModal({
            title:'提示',
            content: '确定要解绑该设备吗？'
        }).then((res)=>{
            if(res.confirm){
                wx.pro.request({
                    url:'https://api.yumik.top/api/v1/device/unbind',
                    method:'post',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token'),
                    },
                    data:{
                        'deviceName':this.data.deviceName
                    }
                }).then((res)=>{
                    console.log(res)
                    if(res.data.errCode === 0){
                        wx.pro.showToast({
                            title:'解绑成功，两秒后自动返回上一页',
                            icon:'none',
                            duration:2000
                        })
                        setTimeout(()=>{
                            wx.pro.navigateBack()
                        },2000)       
                    }
                }).catch((e)=>{
                    console.log(e);
                })
            }
        }).catch((e)=>{
            console.log(e)
        })
    },
    getDeviceJson(){
        wx.pro.navigateTo({url:`/pages/index/labinfo/deviceinfo/devicejson/index?name=${this.data.deviceName}`})
    },
    getHistory(){
        wx.pro.navigateTo({url:`/pages/index/labinfo/deviceinfo/devicehistory/index?name=${this.data.deviceName}&type=${this.data.type}`})
    }
})