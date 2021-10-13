// components/switch/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: {
            type: String,
            value: "half",
        },
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        btnTap() {
            var type = this.properties.type;
            this.setData({
                type: type == "off" ? "on" : "off",
            });
        },
        touchstart(e) {
            this.offsetX = e.changedTouches[0].pageX;
        },
        touchend(e) {
            const offset = this.offsetX - e.changedTouches[0].pageX;
            if (offset > 0) {
                this.setData({
                    type: "off",
                });
            } else if (offset < 0) {
                this.setData({
                    type: "on",
                });
            }
        }
    },
});
