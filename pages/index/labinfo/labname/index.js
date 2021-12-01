Page({
    data:{
        labName:'',
        labId:'',
        newLabName:'',
    },
    upData(data) {
        return this.setData(objToPath(data))
    },
    onLoad:function(option){
        this.upData({labName:option.value,labId:option.id});
    },
    getInput(e){
        //console.log(e.detail.value)
        this.upData({newLabName:e.detail.value});
    },
    changeName(){
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/update',
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'name':this.data.newLabName,
                'labId':this.data.labId,
            }
        }).then((res)=>{
            let pages = getCurrentPages();
            let prePage = pages[pages.length - 2];
            let list = prePage.data.listData;
            list.name = this.data.newLabName;
            prePage.upData({
                listData:list
            })
            wx.pro.navigateBack({url:`/pages/index/labinfo/index`})
        }).catch((e)=>{
            console.log(e)
        })
    }
})