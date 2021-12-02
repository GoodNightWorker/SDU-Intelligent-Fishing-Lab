Page({
    data:{
        labId:'31',
    },
    onLoad:function(option){
        //this.upData({labId:option.id})
        // wx.pro.request({
        //     url:'https://api.yumik.top/api/v1/secret/list',
        //     method:'get',
        //     header:{

        //     }
        // })
    },
    addKey(){
        wx.pro.navigateTo({url:`/pages/index/labinfo/labkeylist/addkey/index?id=${this.data.labId}`});
    }
})