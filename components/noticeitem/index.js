import { objToPath } from "wx-updata";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        icon: {
            type: String,
            value: "",
        },
        message : {
            type : String,
            value : "",
        },
        time : {
            type : String,
            value : "",
        },
        color: {
            type : String,
            value : "red",
        },
        color1: {
            type : String,
            value : "red",
        },
        detail : {
            type : String,
            value : "",
        },
        detail1 : {
            type : String,
            value : "",
        },
        isShow:{
            type:String,
            value:"display:none"
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
