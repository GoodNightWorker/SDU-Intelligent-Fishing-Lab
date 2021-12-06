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
            console.log('获取实验室名称',res.data.data.lab.name)
            this.setData({labName:res.data.data.lab.name})
            this.getPic()
        }).catch((e)=>{
            console.log(e)
        })
    },
    getPic(){
        const scene = `labId=${this.data.labId}&key=${this.data.key}`;
        const info = wx.pro.getAccountInfoSync();
        wx.pro.request({
            url:"https://api.yumik.top/api/v1/get/qrcode",
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            },
            data:{
                scene:scene,
                envVersion:info.miniProgram.envVersion
            }
        }).then((res)=>{
            console.log('获取qrcode',res)
            this.setData({keyImg:res.data.data.generateQRCode})
        }).catch((e)=>{
            console.log(e)
        })
    },
    drawPic(){
        const ctx = wx.createCanvasContext('canvas');
        const dpr = wx.getSystemInfoSync().pixelRatio
        ctx.scale(2,2);
        ctx.drawImage("/images/Subtract.svg",0,0,176,183);
        ctx.textBaseline = "top";
        ctx.textAlign = "center"
        ctx.font = `600 ${12}px 黑体`;
        ctx.fillStyle="#333333";
        ctx.fillText(this.data.labName,176/2,12);
        ctx.font = `400 ${14}px 黑体`;
        ctx.fillStyle="#666666";
        ctx.textAlign = "left"
        ctx.fillText(`管理员：${this.data.userName}`,74,78);
        ctx.fillText(`联系电话：${this.data.telephone}`,60,106);
        ctx.fillText(`密钥时限：${this.data.duration}`,60,134);
        ctx.fillText(`成员时限：${this.data.deadline}`,60,162);
        ctx.textAlign = "center"
        ctx.fillStyle="#C74242";
        ctx.fillText("请注意实验室相关事项，注意实验安全",352/2,210);
        ctx.fillText('实验室',307,319);
        ctx.textAlign = "left";
        ctx.fillStyle="#585858";
        ctx.fillText(`${this.data.shareName}已经加入实验室`,130,291)
        ctx.fillText('长按小程序码，立即加入',130,319);
        const buffer = wx.base64ToArrayBuffer(this.data.keyImg),
        filePath = `${wx.env.USER_DATA_PATH}/temp_image.png`;
        wx.getFileSystemManager().writeFile({ 
            filePath,
            data: buffer,
            encoding: 'base64',
            success:()=>{
                console.log('写成功')
                ctx.drawImage(filePath,25,268,88,88);
                ctx.draw();
            }
        })
    },
    shareImg(){
        const query = wx.createSelectorQuery()
        const dpr = wx.getSystemInfoSync().pixelRatio
        query.select('.canvas')
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