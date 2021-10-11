import { objToPath } from "wx-updata";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: "验证成功",
        },
        subtitle: {
            type: String,
            value: "密钥有效期：\n" + "2021年9月14日 00点00分",
        },
        type: {
            type: String,
            value: "right",
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
        upData(data) {
            return this.setData(objToPath(data));
        },

        // 阻止向下的滚动传递
        touchMove() {},

        tap() {
            this.closeDialog();
        },

        // 关闭
        closeDialog() {
            this.triggerEvent("closeCallBack");
        },
    },
});
