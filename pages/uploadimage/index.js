Page({
    data: {
        showModel: false,
        showDialog: false,
    },
    upData(data) {
        return this.setData(objToPath(data))
    },
    chooseImage(){
        wx.chooseImage({
            count:1,
            sizeType:['original','compressed'],
            sourceType:['album','camera'],
            success:function(res){
                var filePaths = res.tempFilePaths;
                wx.setStorageSync('filePaths',filePaths);
                wx.showToast({
                    icon:"loading",
                    title:'正在上传'
                })
            }
        })
    },
    submitImage(){
        wx.pro.uploadFile({
            url:'https://api.yumik.top/api/v1/face/upload',
            filePath:wx.getStorageSync('filePaths')[0],
            name:'file',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            },
            success:(res)=>{
                console.log(res);
                if(JSON.parse(res.data).errCode==0){
                    this.upData({showDialog:true})
                    setTimeout(()=>{
                        this.upData({showDialog:false})
                    },800)
                }
                if(JSON.parse(res.data).errCode==40102){
                    wx.showToast({
                        icon:'none',
                        title:'登录过期，请重新登录！'
                    })
                }
            }
        })
    }
});
