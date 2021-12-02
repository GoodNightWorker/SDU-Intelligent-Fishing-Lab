Page({
    data:{
        newName:'',
    },
    getInput(e){
        this.data.newName = e.detail.value;
    },
    addLab(){
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/insert',
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'name':this.data.newName,
            }
        }).then((res)=>{
            if(res.data.errCode==0){
                wx.pro.showToast({
                    title:'添加成功，两秒后自动回到上一页',
                    icon:'none',
                    duration:2500
                })
                setTimeout(()=>{
                    wx.pro.navigateBack()
                },2500)
            }
        }).catch((e)=>{
            console.log(e);
        })
    },
})