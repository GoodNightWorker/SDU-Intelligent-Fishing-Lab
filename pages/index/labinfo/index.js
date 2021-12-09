Page({
    data: {
        loading: true,
        listData: {
            name: '实验室',
            labId: '',
            adminName: '',
            adminId: '',
            telephone: '',
            member: ' >',
            key: '',
        },
        selfId: '',
        deviceList: {},
        iconList: {
            "温度计": "/images/icon-thermometer.svg",
            "摄像头": "/images/icon-camera.svg",
            "湿度计": "/images/icon-humidity.svg",
            "有害气体": "/images/icon-nose.svg",
            "实验室门禁": "/images/icon-door.svg",
            "温湿度传感器": "/images/icon-tem&hum.svg"
        }
    },
    onLoad: function (option) {
        this.data.listData.labId = option.id;
        this.setData({ selfId: wx.getStorageSync('selfId') })
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/lab/get',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token'),
            },
            data: {
                'labId': option.id
            }
        }).then((res) => {
            var list = this.data.listData;
            list.name = res.data.data.lab.name;
            list.adminId = res.data.data.lab.tableUserId;
            wx.pro.setStorageSync('adminId',list.adminId)
            wx.pro.request({
                url: 'https://api.yumik.top/api/v1/user/info',
                method: 'get',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': wx.getStorageSync('token'),
                },
                data: {
                    'otherUserId': res.data.data.lab.tableUserId
                }
            }).then((res) => {
                list.adminName = res.data.data.userInfo.name;
                list.telephone = res.data.data.userInfo.telephone;
                this.upData({ listData: list })
                this.upData(({ loading: false }))
            }).catch((e) => {
                console.log(e);
            })
        }).catch((e) => {
            console.log(e);
        })
    },
    onShow: function () {
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/secret/list',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token'),
            },
            data: {
                'labId': this.data.listData.labId
            }
        }).then((res) => {
            var list = this.data.listData;
            var arr = Object.keys(res.data.data)
            list.key = arr.length;
            this.setData({ listData: list })
            return wx.pro.request({
                url: 'https://api.yumik.top/api/v1/device/list',
                method: 'get',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': wx.getStorageSync('token'),
                },
                data: {
                    'labId': this.data.listData.labId,
                    'page': 1,
                }
            })
        }).then((res) => {
            //console.log(res)
            this.setData({ deviceList: res.data.data.deviceList })
            var list = this.data.deviceList;
            this.data.deviceList.map((item, index) => {
                wx.pro.request({
                    url: 'https://api.yumik.top/api/v1/device/online',
                    method: 'get',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': wx.getStorageSync('token'),
                    },
                    data: {
                        'deviceName': item.name,
                    }
                }).then((res) => {
                    //console.log(res)
                    list[index].icon = this.data.iconList[item.description];
                    list[index].online = (res.data.data.online.online ? 'on' : 'off');
                    this.setData({ deviceList: list });
                })
            })
        })
    },

    scrollToTop() {
        this.setAction({
            scrollTop: 0
        })
    },

    toDetail(e) {
        switch (e.currentTarget.dataset.name) {
            case '名称':
                wx.pro.navigateTo({ url: `/pages/index/labinfo/labname/index?value=${this.data.listData.name}&id=${this.data.listData.labId}` });
                break;
            case '成员':
                wx.pro.navigateTo({ url: `/pages/index/labinfo/labmember/index?id=${this.data.listData.labId}` });
                break;
            case '密钥':
                wx.pro.navigateTo({ url: `/pages/index/labinfo/labkeylist/index?id=${this.data.listData.labId}` });
                break;
        }
    },
    getDeviceDetail(e) {
        wx.pro.navigateTo({ url: `/pages/index/labinfo/deviceinfo/index?name=${e.currentTarget.dataset.name}&description=${e.currentTarget.dataset.description}&type=${e.currentTarget.dataset.type}` })
    },
    addDevice() {
        wx.pro.scanCode({

        }).then((res) => {
            let result = (JSON.parse(this.base64_decode(res.result)))
            wx.pro.request({
                url: 'https://api.yumik.top/api/v1/device/bind',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': wx.getStorageSync('token'),
                },
                data: {
                    'deviceName': result.device,
                    labId: this.data.listData.labId
                }
            }).then((res) => {
                if (res.data.errCode == 40402) {
                    wx.showToast({
                        title: '该设备已被实验室绑定，请更换设备或先解绑',
                        icon: 'none',
                        duration: 2000
                    })
                }
                if (res.data.errCode == 0) {
                    wx.showToast({
                        title: '成功',
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(() => {
                        wx.pro.request({
                            url: 'https://api.yumik.top/api/v1/device/list',
                            method: 'get',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Authorization': wx.getStorageSync('token'),
                            },
                            data: {
                                'labId': this.data.listData.labId,
                                'page': 1,
                            }
                        }).then((res) => {
                            //console.log(res)
                            this.setData({ deviceList: res.data.data.deviceList })
                            var list = this.data.deviceList;
                            this.data.deviceList.map((item, index) => {
                                wx.pro.request({
                                    url: 'https://api.yumik.top/api/v1/device/online',
                                    method: 'get',
                                    header: {
                                        'content-type': 'application/x-www-form-urlencoded',
                                        'Authorization': wx.getStorageSync('token'),
                                    },
                                    data: {
                                        'deviceName': item.name,
                                    }
                                }).then((res) => {
                                    //console.log(res)
                                    list[index].icon = this.data.iconList[item.description];
                                    list[index].online = (res.data.data.online.online ? 'on' : 'off');
                                    this.setData({ deviceList: list });
                                })
                            })
                        }, 1000)
                    })

                }
            })
        })
    },
    base64_decode(input) { // 解码，配合decodeURIComponent使用
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = base64EncodeChars.indexOf(input.charAt(i++));
            enc2 = base64EncodeChars.indexOf(input.charAt(i++));
            enc3 = base64EncodeChars.indexOf(input.charAt(i++));
            enc4 = base64EncodeChars.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        return this.utf8_decode(output);
    },
    utf8_decode(utftext) { // utf-8解码
        var string = '';
        let i = 0;
        let c = 0;
        let c1 = 0;
        let c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c1 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;
            } else {
                c1 = utftext.charCodeAt(i + 1);
                c2 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;
            }
        }
        return string;
    },
    deleteLab() {
        wx.pro.showModal({
            title: '提示',
            content: '确定要删除该实验室吗？'
        }).then((res) => {
            if (res.confirm) {
                wx.pro.request({
                    url: 'https://api.yumik.top/api/v1/lab/delete',
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': wx.getStorageSync('token'),
                    },
                    data: {
                        'labId': this.data.listData.labId
                    }
                }).then((res) => {
                    console.log(res)
                    if (res.data.errCode === 0) {
                        wx.pro.showToast({
                            title: '删除成功，两秒后自动返回上一页',
                            icon: 'none',
                            duration: 2500
                        })
                        setTimeout(() => {
                            wx.pro.navigateBack({ url: `/pages/index/index` })
                        }, 2500)
                    }
                }).catch((e) => {
                    console.log(e);
                })
            }
        }).catch((e) => {
            console.log(e)
        })
    }
})