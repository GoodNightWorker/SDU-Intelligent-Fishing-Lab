import {
    objToPath
} from 'wx-updata'

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

    },

    /**
     * 组件的方法列表
     */
    methods: {
        upData(data) {
            return this.setData(objToPath(data))
        },

        // 阻止向下的滚动传递
        touchMove() {

        },

        tap() {
            if (this.properties.enableClose == true) {
                this.closeModel()
            }
        },

        // 关闭
        closeModel() {
            this.upData({
                showModel: false
            })
            this.triggerEvent('show-model-changed', false)
        }
    },
})