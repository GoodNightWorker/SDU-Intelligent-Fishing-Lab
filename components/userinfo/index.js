import { objToPath } from "wx-updata";

Component({
    properties:{
        info:[
            {
                icon:{
                    type:String,
                    value:"/images/icon-msg-user",
                },
                placeholder:{
                    type:String,
                    value:"请输入您的姓名",
                }
            },
        ]
    },
    data:{},
    methods:{
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
    }
})