Page({
    data: {
        showModel: false,
        showDialog: false,
        switchType: "on",
    },

    btnUserSelectCard(e) {
        switch (e.currentTarget.dataset.role) {
            case "Administrator":
                console.log("Administrator");
                break;
            case "User":
                console.log("User");
                break;
            case "Guest":
                console.log("Guest");
                break;
        }
    },

    btnShowModel() {
        this.upData({
            showModel: true,
        });
    },

    modelCloseCallBack() {
        this.upData({
            showModel: false,
        });
    },

    btnShowDialog() {
        this.upData({
            showDialog: true,
        });
    },

    dialogCloseCallBack() {
        this.upData({
            showDialog: false,
        });
    },
    btnSwitch() {
        switch (this.data.switchType) {
            case "on":
                this.upData({ switchType: "half" });
                break;
            case "half":
                this.upData({ switchType: "off" });
                break;
            case "off":
                this.upData({ switchType: "on" });
                break;
            default:
                this.upData({ switchType: "half" });
                break;
        }
    },

    btnLogin() {
        wx.pro
            .login()
            .then((res) => {
                wx.pro
                    .request({
                        url: "https://api.yumik.top/api/v1/login/wechat",
                        data: {
                            code: res.code,
                            compulsory: true
                        },
                        method: "post",
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                    })
                    .then((res) => {
                        console.log(res)
                        if (res.data.data.token != undefined)
                            wx.setStorageSync('token', res.data.data.token)
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    },

    btnCheck() {
        wx.pro
            .request({
                url: "https://api.yumik.top/api/v1/login/check",
                method: "get",
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': wx.getStorageSync('token')
                },
            })
            .then((res) => console.log(res))
            .catch((error) => console.log(error));
    },

    btnImage() {
        wx.pro.chooseImage({
            sizeType: ['compressed'],
            count: 1,
        }).then((res) => {
            console.log(res)
            this.filePath = res.tempFilePaths[0]
            return wx.pro.getFileInfo({
                filePath: this.filePath,
            })
        }).then((file) => {
            console.log(file)
            if (file.size > 64 * 1024 - 1) {
                console.log("larger")
                return wx.pro.compressImage({
                    src: this.filePath,
                    quality: 0
                })
            } else {
                console.log("ok")
            }
        }).then((compress) => {
            console.log(compress)
            this.filePath = compress.tempFilePath
            return wx.pro.getImageInfo({
                src: this.filePath,
            })
        }).then((image) => {
            console.log(image)
            return wx.pro.getFileInfo({
                filePath: this.filePath,
            })
        }).then((file) => {
            console.log(file)
            return wx.pro.saveImageToPhotosAlbum({
                filePath: this.filePath,
            })
        }).then((success) => {
            console.log(success)
        }).catch((e) => { console.log(e) })
    },

    btnPicker() {

    }
});
