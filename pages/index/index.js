Page({
    data: {
        showModel: false,
        showDialog: false,
        info:[
            {
                "icon":"/images/icon-msg-user.svg",
                "placeholder":"请输入您的姓名",
            },
            {
                "icon":"/images/icon-msg-master.svg",
                "placeholder":"请输入您的专业",
            },
            {
                "icon":"/images/icon-msg-idnum.svg",
                "placeholder":"请输入您的学号",
            },
        ],
        message:[
            {
                "label":"区域",
                "detail":"实验室 N5-101",
                "color":"gray"
            },
            {
                "label":"报警温度",
                "detail":"28C",
                "color":"red"
            },
            {
                "label":"目前状态",
                "detail":"设备正常",
                "color":"green"
            }
        ]
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
    
    uploadImage(){
        wx.chooseImage({
            count:1,
            sizeType:['original','compressed'],
            sourceType:['album','camera'],
            success:function(res){
                var filePaths = res.tempFilePaths;
                wx.showToast({
                    icon:"loading",
                    title:'正在上传'
                }),
                wx.uploadFile({
                    url:'https://api.yumik.top/api/v1/face/upload',
                    filePath:filePaths[0],
                    name:'file',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token')
                    },
                    success:function(res){
                        console.log(res);
                        if(JSON.parse(res.data).errCode==0){
                            wx.showToast({
                                icon:'success',
                                title:'上传成功！'
                            })
                        }
                        if(JSON.parse(res.data).errCode==40304){
                            wx.showToast({
                                icon:'none',
                                title:'人脸未注册！'
                            })
                        }
                    }
                })
            }
        })
    },
    
});
