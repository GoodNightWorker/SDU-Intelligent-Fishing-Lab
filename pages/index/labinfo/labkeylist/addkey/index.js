Page({
    data:{
        labId:0,
        duration:0,
        deadline:-1,
        durationIndex:0,
        durationRange:['15 分钟','1 小时','12 小时','1 天','3 天','7 天'],
        timeIndex:0,
        timeRange:['永久','临时'],
        deadlineIndex: [0,0,0,0,0],
        deadlineRange: [[], [], [], [], []],
        monthNum:[],
    },
    onLoad:function(option){
        this.upData({labId:option.id});
        this.setMonthNum();
        this.setDeadlineRange();
        var date = new Date();
        date.setMinutes(date.getMinutes()+15);
        this.setData({duration:date.getTime()});
    },
    setDuration(e){
        this.setData({durationIndex: e.detail.value});
        var date = new Date();
        switch(this.data.durationIndex){
            case '0':
                date.setMinutes(date.getMinutes()+15);
                break;
            case '1':
                date.setHours(date.getHours()+1);
                break;
            case '2':
                date.setHours(date.getHours()+12);
                break;
            case '3':
                date.setDate(date.getDate()+1);
                break;
            case '4':
                date.setDate(date.getDate()+3);
                break;
            case '5':
                date.setDate(date.getDate()+7);
                break;
        }
        this.setData({duration:date.getTime()});
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
    setDeadlineRange(year,month){
        var arr = [[],[],[],[],[],[]];
        this.setMonthNum(year);
        for(let i = 0; i <= 10; i++){
            arr[0].push(`${2021+i} 年`);
        }
        for(let i = 0; i <= 11; i++){
            arr[1].push(`${i+1} 月`)
        }
        for(let i = 1; i<= (month?this.data.monthNum[month]:31); i++){
            arr[2].push(`${i} 日`)
        }
        for(let i = 0; i<= 24; i++){
            arr[3].push(`${i} 时`)
        }
        for(let i = 0; i<= 60; i++){
            arr[4].push(`${i} 分`)
        }
        this.setData({deadlineRange:arr});
    },
    timeChange(e){
        this.setData({timeIndex: e.detail.value});
    },
    deadlineChange(e) {
        this.setData({deadlineIndex: e.detail.value});
        var deadlineRange = this.data.deadlineRange;
        var deadlineIndex = this.data.deadlineIndex;
        var deadline = `${parseInt(deadlineRange[0][deadlineIndex[0]])}-${parseInt(deadlineRange[1][deadlineIndex[1]])}-${parseInt(deadlineRange[2][deadlineIndex[2]])} ${parseInt(deadlineRange[3][deadlineIndex[3]])}:${parseInt(deadlineRange[4][deadlineIndex[4]])}:00`;
        var date = new Date(deadline);
        this.setData({deadline:date.getTime()});
    },
    deadlineColumnChange(e) {
        this.data.deadlineIndex[e.detail.column]=e.detail.value;
        this.setDeadlineRange(parseInt(this.data.deadlineRange[0][this.data.deadlineIndex[0]]),parseInt(this.data.deadlineRange[1][this.data.deadlineIndex[1]])-1)
        this.upData(this.data.deadlineIndex);
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