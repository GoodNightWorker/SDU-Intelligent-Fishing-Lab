import { objToPath } from "wx-updata";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        name: {
            type: String,
            value: "赵丽华",
        },
        sduNumber: {
            type: String,
            value: "201805121155",
        },
        academy: {
            type: String,
            value: "信息科学与工程学院",
        },
        auth:{
            type:String,
            value:"管理员",
        },
        img:{
            type:String,
            value:"",
        },
        showDel:{
            type:Boolean,
            value:false,
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
        delete(){
            this.deleteMember();
        },

        // 关闭
        closeDialog() {
            this.triggerEvent("closeCallBack");
        },
        deleteMember(){
            this.triggerEvent("deleteMember")
        }
    },
    
});
