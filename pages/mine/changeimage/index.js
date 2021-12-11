Page({
    data: {
        showModel: false,
        showDialog: false,
        filePath:"",
        isShow:false,
    },
    chooseImage() {
        wx.pro.chooseImage({
            sizeType: ['compressed'],
            count: 1,
        }).then((res) => {
            //console.log(res)
            this.filePath = res.tempFilePaths[0];
            return wx.pro.getFileInfo({
                filePath: this.filePath,
            })
        }).then((image) => {
            //console.log(image)
            return wx.pro.getFileInfo({
                filePath: this.filePath,
            })
        }).then(() => {
            this.setData({filePath:this.filePath,isShow:true})
        }).catch((e) => { console.log(e) })
    },
    submitImage(){
        wx.pro.showLoading({
            title:'正在上传'
        })
        wx.pro.uploadFile({
            url:'https://api.yumik.top/api/v1/face/upload',
            filePath:this.filePath,
            name:'file',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            },
        }).then((res)=>{
            wx.pro.hideLoading()
                if(JSON.parse(res.data).errCode==0){
                    this.upData({showDialog:true})
                    setTimeout(()=>{
                        this.upData({showDialog:false});
                        wx.pro.navigateBack();
                    },2000)
                }
                if(JSON.parse(res.data).errCode==40304){
                    wx.pro.showToast({
                        icon:'none',
                        title:'未识别到人脸，请重新上传！'
                    })
                }
                if(JSON.parse(res.data).errCode==40305){
                    wx.pro.showToast({
                        icon:'none',
                        title:'与上次人脸不一致，请重新上传！'
                    })
                    setTimeout(()=>{
                        wx.pro.navigateBack();
                    },2000)
                }
                if(JSON.parse(res.data).errCode==40102){
                    wx.pro.showToast({
                        icon:'none',
                        title:'登录过期，请重新登录！'
                    })
                }
        }).catch((e)=>{
            console.log(e)
        })
    }
});
