Page({
    data: {
        showModel: false,
        showDialog: true,
    },

    btnAdministrator() {
        console.log("btn_administrator")
    },

    btnShowModel() {
        this.upData({
            showModel: !this.data.showModel
        })
    },

    showModelChanged(e) {
        this.upData({
            showModel: e.detail
        })
    },

    btnShowDialog() {
        this.upData({
            showDialog: !this.data.showDialog
        })
    },

    showDialogChanged(e) {
        this.upData({
            showDialog: e.detail
        })
    }
})