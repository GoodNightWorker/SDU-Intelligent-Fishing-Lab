Page({
    data:{
        userInfo:[],
        avatarUrl:'',
    },
    onShow:function(){
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/user/info',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token')
            }
        }).then((res) => {
            //获取用户头像
            this.upData({ userInfo: res.data.data.userInfo })
            wx.pro.request({
                url: 'https://api.yumik.top/api/v1/face/base64',
                method: 'get',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': wx.getStorageSync('token')
                },
                data: {
                    'userId': res.data.data.userInfo.tableUserId,
                    'min': true
                }
            }).then((res) => {
                this.upData({ avatarUrl: res.data.data.base64 })
            }).catch((e) => {
                console.log(e)
            })
        }).catch((e) => {
            console.log(e)
        })
    },
    changeInfo(){
        wx.pro.navigateTo({url:`/pages/mine/changeinfo/index?name=${this.data.userInfo.name}&academy=${this.data.userInfo.academy}&telephone=${this.data.userInfo.telephone}&sduNumber=${this.data.userInfo.sduNumber}`})
    },
    toPR(){
        wx.pro.navigateTo({url:"/pages/mine/pr/index"})
    },
    toAbout(){
        wx.pro.navigateTo({url:"/pages/mine/about/index"})
    }
})