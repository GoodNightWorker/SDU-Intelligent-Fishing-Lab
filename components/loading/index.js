Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showModel: {
            type: Boolean,
            value: true
        },
        enableClose: {
            type: Boolean,
            value: true
        },
        title: {
            type: String,
            value: "数据请求中"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        dShowModel: true
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 阻止向下的滚动传递
        touchMove() {

        },

        tap() {
            this.closeModel()
        },

        // 关闭
        closeModel() {
            if (this.properties.enableClose == true) {
                this.setData({
                    dShowModel: false
                })
            }
        }
    },

    observers: {
        'showModel': function (showModel) {
            this.setData({
                dShowModel: showModel
            })
        }
    },
})