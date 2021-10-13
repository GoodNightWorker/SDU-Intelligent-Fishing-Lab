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
});
