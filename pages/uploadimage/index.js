Page({
    data: {
        showModel: false,
        showDialog: false,
        filePath:"",
        cWidth: 0,
        cHeight : 0,
    },
    upData(data) {
        return this.setData(objToPath(data))
    },
    chooseImage() {
        wx.pro.chooseImage({
            count:1,
            sizeType:['original','compressed'],
            sourceType:['album','camera'],
        }).then((res)=>{
            wx.pro.getImageInfo({
                src:res.tempFilePaths[0],
            }).then((res)=>{
                var ratio = 2;
                var canvasWidth = res.width;
                var canvasHeight = res.height;
                var path = res.path;
                while (canvasWidth * canvasHeight >= 65536){
                    canvasWidth = Math.trunc(res.width / ratio);
                    canvasHeight = Math.trunc(res.height / ratio);
                    ratio++;
                    console.log(canvasHeight,canvasWidth);
                }
                this.data.cWidth = canvasWidth;
                this.data.cHeight = canvasHeight;
                wx.createSelectorQuery()
                    .select("#canvas")
                    .fields({node:true,size:true})
                    .exec((res)=>{
                        const cvs= res[0].node;
                        const ctx = cvs.getContext('2d');
                        const img = cvs.createImage();
                        img.src = path;
                        ctx.drawImage(img,0,0,canvasWidth,canvasHeight);
                        wx.canvasToTempFilePath({
                            canvas:cvs
                        }).then((res)=>{
                            this.data.filePath = res.tempFilePath;
                        }).catch((e)=>{
                            console.log(e);
                        })
                    })
            })
            wx.pro.showToast({
                icon:"loading",
                title:'正在上传'
            })
        }).catch((e)=>{
            console.log(e);
        })
    },
    submitImage(){
        wx.pro.uploadFile({
            url:'https://api.yumik.top/api/v1/face/upload',
            filePath:this.data.filePath,
            name:'file',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            },
        }).then((res)=>{
                console.log(res);
                if(JSON.parse(res.data).errCode==0){
                    this.upData({showDialog:true})
                    setTimeout(()=>{
                        this.upData({showDialog:false})
                    },800)
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
                        title:'此图片已存在，请重新上传！'
                    })
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
