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
});
