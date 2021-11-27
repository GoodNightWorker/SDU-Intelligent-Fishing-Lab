Page({
    data:{
        listData:[
            {
                "name":"名称",
                "value":"实验室 N5-101 >"
            },
            {
                "name":"管理员",
                "value":"张三"
            },
            {
                "name":"联系方式",
                "value":"12345678900"
            },
            {
                "name":"成员",
                "value":">"
            },
            {
                "name":"密钥",
                "value":"1永久 2临时 >"
            },
            {
                "name":"备注",
                "value":"信息实验室 >"
            },
        ],
        deviceList:[
            {
                "title":"温度计",
                "image":"/images/icon-thermometer.svg",
                "isOn":"on"
            },
            {
                "title":"摄像头",
                "image":"/images/icon-camera.svg",
                "isOn":"on"
            },
            {
                "title":"湿度计",
                "image":"/images/icon-humidity.svg",
                "isOn":"on"
            },
            {
                "title":"有害气体",
                "image":"/images/icon-nose.svg",
                "isOn":"on"
            },
        ]
    },
    
      scrollToTop() {
        this.setAction({
          scrollTop: 0
        })
      },
})