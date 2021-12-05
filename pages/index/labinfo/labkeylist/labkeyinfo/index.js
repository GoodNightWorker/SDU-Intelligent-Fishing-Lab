Page({
    data:{
        labId:'',
        key:'',
        keyList:[],
    },
    onLoad:function(option){
        this.setData({labId:option.id,key:option.key})
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
        }).then((res)=>{
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
        let month = (date.getMonth() + 1 > 9?date.getMonth() + 1:'0'+date.getMonth() + 1);
        let day = (date.getDate() > 9?date.getDate():'0'+date.getDate());
        let hour = (date.getHours() > 9?date.getHours():'0'+date.getHours());
        let minute = (date.getMinutes() > 9?date.etMinutes():'0'+date.etMinutes());
        let str = `${year}年${month}月${day}日 ${hour}时${minute}分`;
        return str;
    },
    shareKey(){
        const props = this.data.keyList;
        wx.pro.navigateTo({
            url:`/pages/index/labinfo/labkeylist/labkeyinfo/sharekey/index?labId=${this.data.labId}&&key=${this.data.key}&&userName=${props.userName}&&telephone=${props.telephone}&&duration=${props.duration}&&deadline=${props.deadline}`
        })
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
    }
})