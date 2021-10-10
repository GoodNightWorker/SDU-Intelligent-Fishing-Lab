Page({
    data: {
        showModel: false,
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
    }
})