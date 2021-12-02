Page({
    data:{
        labId:'',
        duration:'密钥有效期',
        deadline:'用户有效期',
        multiIndex: [0,0,0,0,0],
        multiIndex2:[0,0,0,0,0,],
        multiArray: [[], [], [], [], []],
        monthNum:[],
    },
    onLoad:function(option){
        this.upData({labId:option.id});
        var date = new Date();
        this.setData({deadline:date.getTime()});
        this.setMonthNum();
        var date = new Date();
        var arr = [date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()]
        this.setMultiArray(...arr);
    },
    setMonthNum(year){
        var Num = [31,28,31,30,31,30,31,31,30,31,30,31];
        if(year%100 ==0 && year%400 == 0){
            Num[1] = 29;
        }
        else if(year%4 == 0){
            Num[1] = 29;
        }
        this.setData({monthNum:Num});
    },
    setMultiArray(year,month,date,hour,minute,op){
        var arr = [[],[],[],[],[],[]];
        for(let i = 0; i <= 10; i++){
            arr[0].push(`${2021+i} 年`);
            this.setMonthNum(2021+i);
        }
        for(let i = month; i <= 11; i++){
            arr[1].push(`${i+1} 月`)
        }
        for(let i = date; i<= this.data.monthNum[month]; i++){
            arr[2].push(`${i} 日`)
        }
        for(let i = hour; i<= 24; i++){
            arr[3].push(`${i} 时`)
        }
        for(let i = minute; i<= 60; i++){
            arr[4].push(`${i} 分`)
        }
        if(op){
            arr[0].push('永久')
        }
        this.setData({multiArray:arr});
        console.log(this.data.multiArray)
    },
    bindMultiPickerChange(e) {
        switch(e.currentTarget.id){
            case 'duration':
                this.setData({multiIndex: e.detail.value});
                var multiArray = this.data.multiArray;
                var multiIndex = this.data.multiIndex;
                var duration = `${parseInt(multiArray[0][multiIndex[0]])}-${parseInt(multiArray[1][multiIndex[1]])}-${parseInt(multiArray[2][multiIndex[2]])} ${parseInt(multiArray[3][multiIndex[3]])}:${parseInt(multiArray[4][multiIndex[4]])}:00`;
                var date = new Date(duration);
                this.setData({duration:date.getTime()});
                break;
            case 'deadline':
                this.setData({multiIndex2: e.detail.value});
                var multiArray = this.data.multiArray;
                var multiIndex2 = this.data.multiIndex2;
                if(multiArray[0][multiIndex2[0]]=='永久'){
                    this.upData({deadline:null});
                }
                else{
                    var deadline = `${parseInt(multiArray[0][multiIndex2[0]])}-${parseInt(multiArray[1][multiIndex2[1]])}-${parseInt(multiArray[2][multiIndex2[2]])} ${parseInt(multiArray[3][multiIndex2[3]])}:${parseInt(multiArray[4][multiIndex2[4]])}:00`;
                    var date = new Date(deadline);
                    this.setData({deadline:date.getTime()});
                }
                break;
        }
        console.log(this.data)
    },
    bindMultiPickerColumnChange(e) {
        switch(e.currentTarget.id){
            case 'duration':
                this.data.multiIndex[e.detail.column]=e.detail.value;
                switch(e.detail.column){
                    case 0:
                        switch(this.data.multiIndex[0]){
                            case 0:
                                var date = new Date();
                                this.setMultiArray (date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),0);
                                break;
                            default:
                                this.setMultiArray(2021,0,1,1,1,0);
                        }
                    default:
                }
                this.upData(this.data.multiIndex);
                break;
            case 'deadline':
                this.data.multiIndex2[e.detail.column]=e.detail.value;
                switch(e.detail.column){
                    case 0:
                        switch(this.data.multiIndex2[0]){
                            case 0:
                                var date = new Date();
                                this.setMultiArray (date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),1);
                                break;
                            default:
                                this.setMultiArray(2021,0,1,1,1,1);
                        }
                    default:
                }
                this.upData(this.data.multiIndex2);
                break;
        }
      },
    addKey(){
        console.log(this.data)
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/secret/new',
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'labId':this.data.labId,
                'duration':this.data.duration,
                'deadline':this.data.deadline,
                'allowGuest':true
            }
        }).then((res)=>{
            console.log(res)
            // let pages = getCurrentPages();
            // let prePage = pages[pages.length - 2];
            // let list = prePage.data.listData;
            // list.name = this.data.newLabName;
            // prePage.upData({
            //     listData:list
            // })
            if(res.data.errCode === 0){
                wx.pro.showToast({
                    icon:'none',
                    title:'添加成功，两秒后自动跳转到上一页',
                    duration:2000,
                })
                setTimeout(()=>{
                    wx.pro.navigateBack();
                },2000)
            }
        }).catch((e)=>{
            console.log(e)
        })
    }
})