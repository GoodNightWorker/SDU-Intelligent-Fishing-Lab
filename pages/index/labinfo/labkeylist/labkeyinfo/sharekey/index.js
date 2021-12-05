Page({
    data:{
        labId:53,
        key:'3H8IFT',
        labName:'实验室 N5-101',
        userName:'赵丽华',
        telephone:'19953213840',
        duration:'0000年00月00日 00时00分',
        deadline:'0000年00月00日 00时00分',
        shareName:'赵丽华',
        keyImg:'',
        path:'',
    },
    onLoad:function(option){
        this.setData({
            labId:option.labId,
            key:option.key,
            userName:option.userName,
            telephone:option.telephone,
            duration:option.duration,
            deadline:option.deadline,
            labName:option.labName,
            shareName:option.shareName
        })
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/get',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            },
            data:{
                'labId':this.data.labId
            }
        }).then((res)=>{
            this.setData({labName:res.data.data.lab.name})
        }).catch((e)=>{
            console.log(e)
        })
        const scene = `labId=${this.data.labId}&key=${this.data.key}`;
        wx.pro.request({
            url:"https://api.yumik.top/api/v1/get/qrcode",
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            },
            data:{
                scene:scene,
                envVersion:'develop'
            }
        }).then((res)=>{
            this.setData({keyImg:res.data.data.generateQRCode})
            this.drawPic()
        }).catch((e)=>{
            console.log(e)
        })
    },
    drawPic(){
        const query = wx.createSelectorQuery()
        query.select('#canvas')
        .fields({node:true,size:true})
        .exec((res)=>{
            const canvas = res[0].node;
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            const ctx = canvas.getContext('2d');
            let img = canvas.createImage();
            img.src = "/images/Subtract.svg";
            img.onload = () =>{
                ctx.drawImage(img,1,1,canvas.width,canvas.height);
                ctx.textBaseline = "top";
                ctx.textAlign = "center"
                ctx.font = `600 ${24*dpr}px 黑体`;
                ctx.fillStyle="#333333";
                ctx.fillText(this.data.labName,res[0].width * dpr/2,24*dpr);
                ctx.font = `400 ${14*dpr}px 黑体`;
                ctx.fillStyle="#666666";
                ctx.textAlign = "left"
                ctx.fillText(`管理员：${this.data.userName}`,74*dpr,78*dpr);
                ctx.fillText(`联系电话：${this.data.telephone}`,60*dpr,106*dpr);
                ctx.fillText(`密钥时限：${this.data.duration}`,60*dpr,134*dpr);
                ctx.fillText(`成员时限：${this.data.deadline}`,60*dpr,162*dpr);
                ctx.textAlign = "center"
                ctx.fillStyle="#C74242";
                ctx.fillText("请注意实验室相关事项，注意实验安全",res[0].width * dpr/2,210*dpr);
                ctx.fillText('实验室',307*dpr,319*dpr)
                const buffer = wx.base64ToArrayBuffer(this.data.keyImg),
                filePath = `${wx.env.USER_DATA_PATH}/temp_image.png`;
                wx.getFileSystemManager().writeFile({ 
                    filePath,
                    data: buffer,
                    encoding: 'base64',
                    success:()=>{
                        const code = canvas.createImage();
                        code.src = filePath;
                        code.onload=()=>{
                            ctx.drawImage(code,25*dpr,268*dpr,88*dpr,88*dpr)
                        }
                    }
                })
                ctx.textAlign = "left";
                ctx.fillStyle="#585858";
                ctx.fillText(`${this.data.shareName}已经加入实验室`,130*dpr,291*dpr)
                ctx.fillText('长按小程序码，立即加入',130*dpr,319*dpr)
            }
            ctx.restore();
        })
    },
    shareImg(){
        const query = wx.createSelectorQuery()
        const dpr = wx.getSystemInfoSync().pixelRatio
        query.select('#canvas')
        .fields({node:true,size:true})
        .exec((res)=>{
            const canvas = res[0].node;
            wx.pro.canvasToTempFilePath({
                x:0,
                y:0,
                width:352*dpr,
                height:366*dpr,
                canvas:canvas
            }).then((res)=>{
                this.setData({path:res.tempFilePath})
                wx.pro.showShareImageMenu({
                    path:this.data.path
                }).then((res)=>{
                    console.log(res)
                })
            })
        })
        
        
        
    }
})