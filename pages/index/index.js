Page({
    data:{
        userInfo:{},
        avatarUrl:'',
        labCount:0,
        labList:[],
        labListDetail:[],
        showDialog:false,
    },
    color: ['yellow', 'green', 'blue'],
    onShow: function () {
        wx.hideHomeButton() //隐藏小房子
        //获取用户的名字、学号、学院
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
        //获取实验室个数
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/lab/user/count',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token')
            }
        }).then((res) => {
            this.upData({ labCount: res.data.data.count })
        }).catch((e) => {
            console.log(e)
        })
        //获取实验室列表
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/lab/lab/list',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token'),
            },
            data: {
                'page': 1
            }
        }).then((res) => {
            //根据列表获取实验室名称
            this.setData({ labList: res.data.data.labList })
            this.getLabInfo(this.data.labList, this.data.labList.length - 1, [])

        }).catch((e) => {
            console.log(e)
        })
    },
    addLab() {
        wx.pro.navigateTo({ url: '/pages/index/addlab/index' })
    },
    enterLab() {
        wx.pro.scanCode({

        }).then((res) => {
            console.log(res)
        })
    },

    getLabDetail(e) {
        wx.pro.navigateTo({ url: `/pages/index/labinfo/index?id=${e.currentTarget.id}` })
    },

    getLabInfo(labList, i, list) {
        let item = labList[i]
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/lab/get',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token'),
            },
            data: {
                'labId': item['tableLabId']
            }
        }).then((res) => {
            res.data.data.lab['tableLabId'] = item['tableLabId']
            res.data.data.lab['color'] = this.color[i % 3]
            list = [res.data.data.lab, ...list]
            if (i == 0) {
                this.upData({ labListDetail: list })
            } else {
                this.getLabInfo(labList, i - 1, list)
            }
        }).catch((e) => {
            console.log(e)
        })
    }
})

