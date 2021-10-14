import { objToPath } from "wx-updata";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        icon: {
            type: String,
            value: "/images/icon-userleft.svg",
        },
        message : {
            type : String,
            value : "人员离开",
        },
        time : {
            type : String,
            value : "14:30",
        },
        color: {
            type : String,
            value : "red",
        },
        detail : {
            type : String,
            value : "22°C",
        }
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
            this.closeModel();
        },

        // 关闭
        closeModel() {
            this.triggerEvent("closeCallBack");
        },
    },
});
