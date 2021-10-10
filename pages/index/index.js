Page({
    data: {
        showModel: false,
    },

    btnAdministrator() {
        console.log("btn_administrator")
    },

    btnShowModel() {
        this.setData({
            showModel: !this.showModel
        })
    }
})