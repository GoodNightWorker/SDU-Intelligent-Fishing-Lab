Page({
    data:{
        labId:'',
        keyList:[]
    },
    onLoad:function(option){
        this.upData({labId:option.id})
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
            var list = [];
            for(var key in res.data.data){
                res.data.data[key]['key'] = key;
                list.push(res.data.data[key]);
            }
            this.setData({keyList:list});
        }).catch((e)=>{
            console.log(e);
        })
    },
    addKey(){
        wx.pro.navigateTo({url:`/pages/index/labinfo/labkeylist/addkey/index?id=${this.data.labId}`});
    },
    getKeyInfo(e){
        wx.pro.navigateTo({url:`/pages/index/labinfo/labkeylist/labkeyinfo/index?key=${e.currentTarget.id}&id=${this.data.labId}&type=skip`});
    }
})