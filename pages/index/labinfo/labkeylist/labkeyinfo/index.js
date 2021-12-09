Page({
    data:{
        labId:'',
        key:'',
        type:'skip',
        keyList:[],
        tempFilePath: '',
		isShow: false,
        keyImage:'',
        labName:'',
        shareName:'',
        background:'/images/Subtract.png'
    },
    onLoad:function(option){
        this.setData({labId:option.id,key:option.key,type:option.type})
        wx.hideHomeButton()
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
                'labId':this.data.labId
            }
        }).then((res)=>{
            var list = res.data.data[this.data.key];
            list.duration = this.toTime(list.duration);
            list.deadline = this.toTime(list.deadline);
            this.setData({keyList:list});
        }).catch((e)=>{
            console.log(e);
        })
    },
    copyKey(e){
        wx.pro.setClipboardData({
            data:e.currentTarget.id
        }).then(()=>{
        }).catch((e)=>{
            console.log(e);
        })
    },
    toTime(timestamp){
        if(timestamp === null){
            return "永久";
        }
        var date = new Date(timestamp);
        let year = date.getFullYear();
        let month = ((date.getMonth() + 1 )> 9?(date.getMonth() + 1):'0'+(date.getMonth() + 1));
        let day = (date.getDate() > 9?date.getDate():'0'+date.getDate());
        let hour = (date.getHours() > 9?date.getHours():'0'+date.getHours());
        let minute = (date.getMinutes() > 9?date.getMinutes():'0'+date.getMinutes());
        let str = `${year}年${month}月${day}日 ${hour}时${minute}分`;
        return str;
    },
    preventTouchMove() {},
    getPic(){
        this.setData({isShow:true})
        if(this.data.tempFilePath){
            this.shareImg();
            return; 
        }else{
            wx.pro.showLoading({title:'加载中'});
        }

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
            //console.log('获取实验室名称',res.data.data.lab.name)
            this.setData({labName:res.data.data.lab.name})
            return wx.pro.request({
                url:"https://api.yumik.top/api/v1/user/info",
                method:'get',
                header:{
                  'content-type':'application/x-www-form-urlencoded',
                  'Authorization':wx.getStorageSync('token')
                },
            })
        }).then((res)=>{
            //console.log('获取分享者姓名',res.data.data.userInfo.name)
            this.setData({shareName:res.data.data.userInfo.name})
            const scene = `${this.data.labId}*${this.data.key}`;
            //console.log(encodeURIComponent(scene))
            const info = wx.pro.getAccountInfoSync();
            return wx.pro.request({
                url:"https://api.yumik.top/api/v1/get/qrcode",
                method:'post',
                header:{
                    'content-type':'application/x-www-form-urlencoded',
                    'Authorization':wx.getStorageSync('token')
                },
                data:{
                    scene:scene,
                    envVersion:info.miniProgram.envVersion,
                    page:'pages/welcome/index',
                }
            })
        }).then((res)=>{
            console.log('获取qrcode',res)
            this.setData({keyImg:res.data.data.generateQRCode})
            const buffer = wx.base64ToArrayBuffer(this.data.keyImg),
            filePath = `${wx.env.USER_DATA_PATH}/temp_image.png`;
            return wx.getFileSystemManager().writeFile({ 
                filePath,
                data: buffer,
                encoding: 'base64',
                success:()=>{
                    this.setData({keyImage:filePath});
                    this.drawPic();
                },
            })
        }).catch(() => {
            this.setData({isShow: false});
            wx.hideLoading()
            wx.showToast({
                title: '加载失败',
                duration: 2000,
                icon: 'none'
            })
        })
    },
    drawPic(){
        const ctx = wx.createCanvasContext('canvas');
        const dpr = wx.getSystemInfoSync.pixelRatio;
        ctx.fillStyle="#F2F2F2";
        //ctx.scale(dpr,dpr)
        ctx.fillRect(0,0,352,366)
        ctx.drawImage(this.data.background,1,1,350,364);
        ctx.drawImage(this.data.keyImage,25,268,88,88);
        ctx.setTextBaseline("top");
        ctx.setTextAlign("center")
        ctx.setFontSize(24)
        ctx.setFillStyle("#333333");
        ctx.fillText(this.data.labName,352/2,12);
        ctx.setFontSize(14)
        ctx.setFillStyle("#666666");
        ctx.setTextAlign("left")
        ctx.fillText(`管理员：${this.data.keyList.userName}`,74,78);
        ctx.fillText(`联系电话：${this.data.keyList.telephone}`,60,106);
        ctx.fillText(`密钥时限：${this.data.keyList.duration}`,60,134);
        ctx.fillText(`成员时限：${this.data.keyList.deadline}`,60,162);
        ctx.setTextAlign("center")
        ctx.setFillStyle("#C74242");
        ctx.fillText("请注意实验室相关事项，注意实验安全",352/2,210);
        ctx.fillText('实验室',307,319);
        ctx.setTextAlign("left");
        ctx.setFillStyle("#585858");
        ctx.fillText(`${this.data.shareName}已经加入实验室`,130,291)
        ctx.fillText('长按小程序码，立即加入',130,319);
        ctx.draw(false,()=>{
            setTimeout(()=>{
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 352,
                    height: 366,
                    destWidth: 352*dpr,
                    destHeight: 366*dpr,
                    canvasId: 'canvas',
                    quality: 1,
                    success: (res) => {
                        console.log('success',res)
                        var tempFilePath = res.tempFilePath;
                        this.setData({
                            show:false,
                            tempFilePath: tempFilePath
                        })
                        wx.hideLoading();
                        this.shareImg();
                    },
                    fail: res => {
                        console.log('fail',res)
                        wx.hideLoading()
                        wx.showToast({
                            title: '海报加载失败',
                            duration: 2000,
                            icon: 'none'
                        })
                    }
                })
            },100)
        })
    },
    shareImg(){
        wx.pro.showShareImageMenu({
            path:this.data.tempFilePath
        }).then((res)=>{
            console.log(res)
        }).catch((e)=>{
            console.log(e)
        })
    },
    hidePaper: function () {
        this.setData({isShow: false});
        wx.hideLoading()
    },
    deleteKey(){
        wx.pro.showModal({
            title:'提示',
            content: '确定要删除该密钥吗？'
        }).then((res)=>{
            if(res.confirm){
                wx.pro.request({
                    url:'https://api.yumik.top/api/v1/secret/remove',
                    method:'post',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token'),
                    },
                    data:{
                        'labId':this.data.labId,
                        secretKey:this.data.key
                    }
                }).then((res)=>{
                    console.log(res)
                    if(res.data.errCode === 0){
                        wx.pro.showToast({
                            title:'删除成功，两秒后自动返回上一页',
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
    enterLab(){
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/user/insert',
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                labId:this.data.labId,
                secretKey:this.data.key
            }
        }).then((res)=>{
            console.log(res)
            if(res.data.errCode == -3){
                wx.pro.showToast({
                    title:'您已经是实验室成员，请勿重复添加，两秒后自动跳转到首页',
                    icon:'none',
                    duration:2000
                })
                setTimeout(()=>{
                    wx.pro.switchTab({url:`/pages/index/index`})
                },2000)
            }
            else if(res.data.errCode == 0){
                wx.pro.showToast({
                    title:'加入实验室成功，两秒后跳转到首页',
                    icon:'none',
                    duration:2000
                })
                wx.pro.switchTab({url:`/pages/index/index`})
            }
        })
    }
})