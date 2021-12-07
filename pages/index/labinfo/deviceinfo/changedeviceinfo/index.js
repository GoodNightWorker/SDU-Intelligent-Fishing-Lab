Page({
    data:{
        propsName:'',
        deviceName:'',
        deviceVersion:'',
        max_danger:0,
        min_danger:0,
        max_warning:0,
        min_warning:0,
    },
    onLoad:function(option){
        this.setData({
            propsName:option.name,
            deviceName:option.deviceName,
            deviceVersion:option.deviceVersion,
            max_danger:option.max_danger,
            max_warning:option.max_warning,
            min_danger:option.min_danger,
            min_warning:option.min_warning
        })
        setTimeout(()=>{
            if(this.data.propsName=='消息速率'){
                this.setData({max_danger:0,max_warning:0})
            }
        },1000)
    },
    getInput(e){
        switch(e.currentTarget.dataset.name){
            case 'max_danger':
                this.setData({max_danger:e.detail.value})
                break;
            case 'min_danger':
                this.setData({min_danger:e.detail.value})
                break;
            case 'max_warning':
                this.setData({max_warning:e.detail.value})
                break;
            case 'min_warning':
                this.setData({min_warning:e.detail.value})
                break;
        }
    },
    changeProps(){
        if(isNaN(this.data.max_danger)||isNaN(this.data.max_warning)||isNaN(this.data.min_danger)||isNaN(this.data.min_warning)){
            wx.pro.showToast({
                title:"请输入有效数字！",
                icon:'none',
                duration:2000
            })
        }
        else if(this.data.max_warning===''||this.data.max_danger===''||this.data.min_warning===''||this.data.min_danger===''){
            wx.pro.showToast({
                title:"参数不能为空！",
                icon:'none',
                duration:2000
            })
        }
        else{
            var string = '';
            switch(this.data.propsName){
                case '湿度':
                    string = `{"humidity":{"max_danger":${this.data.max_danger},"min_danger":${this.data.min_danger},"max_warning":${this.data.max_warning},"min_warning":${this.data.min_warning}}}`
                    break;
                case '温度':
                    string = `{"temperature":{"max_danger":${this.data.max_danger},"min_danger":${this.data.min_danger},"max_warning":${this.data.max_warning},"min_warning":${this.data.min_warning}}}`
                    break;
                case '消息速率':
                    string = `{"rate":{"rate_danger":${this.data.min_danger},"rate_warning":${this.data.min_warning}}}`
                    break;
            }
            wx.pro.request({
                url:'https://api.yumik.top/api/v1/device/parameter',
                method:'post',
                header:{
                    'content-type':'application/x-www-form-urlencoded',
                    'Authorization':wx.getStorageSync('token'),
                },
                data:{
                    deviceName:this.data.deviceName,
                    deviceParameters:string,
                    deviceVersion:this.data.deviceVersion
                }
            }).then((res)=>{
                console.log(res)
                if(res.data.errCode===0){
                    wx.pro.showToast({
                        title:'修改参数成功，两秒后回到上一页',
                        icon:'none',
                        duration:2000
                    })
                    setTimeout(()=>{
                        wx.pro.navigateBack();
                    },2000)
                }
                else if(res.data.errCode===40408){
                    wx.pro.showToast({
                        title:'参数未修改，两秒后回到上一页',
                        icon:'none',
                        duration:2000
                    })
                    setTimeout(()=>{
                        wx.pro.navigateBack();
                    },2000)
                }
            }).catch((e)=>{
                console.log(e)
            })
        }
    }
})