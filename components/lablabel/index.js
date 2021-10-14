import { objToPath } from "wx-updata";

Component({
    properties:{
        message:[
            {
                label:{
                    type:String,
                    value:"名称"
                },
                detail:{
                    type:String,
                    value:"实验室 N5-101",
                },
                color:{
                    type:String,
                    value:"gray"
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