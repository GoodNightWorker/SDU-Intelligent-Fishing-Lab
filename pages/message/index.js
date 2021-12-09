Page({
    data:{
        index:[0,0],
        array:[[],[]],
        deviceName:[],
        deviceListDetail:[],
        labList:[],
        labListDetail:[],
        eventList:[],
        type:1,
        page:1,
        flag:1,
        lab_device:[],
        errorName:['正常','低','高','超低','超高'],
        color:['green','yellow','yellow','red','red']
    },
    onShow:function(){
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/lab/lab/list',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token'),
            },
            data: {
                'page': 1
            }
        }).then((res) => {
            //根据列表获取实验室名称
            this.setData({ labList: res.data.data.labList })
            this.getLabInfo(this.data.labList, this.data.labList.length - 1, [])
        })
    },
    getLabInfo(labList, i, list) {
        let item = labList[i]
        wx.pro.request({
            url: 'https://api.yumik.top/api/v1/lab/get',
            method: 'get',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': wx.getStorageSync('token'),
            },
            data: {
                'labId': item['tableLabId']
            }
        }).then((res) => {
            res.data.data.lab['tableLabId'] = item['tableLabId']
            list = [res.data.data.lab, ...list]
            this.data.array[0] = [res.data.data.lab.name,...this.data.array[0]];
            if (i == 0) {
                this.upData({ labListDetail: list })
                this.upData({array:this.data.array})
                this.getDeviceInfo(this.data.labList, this.data.labList.length - 1, [],[] )
            } else {
                this.getLabInfo(labList, i - 1, list)
            }
               
        }).catch((e) => {
            console.log(e)
        })
    },
    getDeviceInfo(labList,i,list,list2){
        let item = labList[i];
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/device/list',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'labId':item['tableLabId'],
                'page':1,
            }
        }).then((res)=>{
            this.setData({deviceListDetail:res.data.data.deviceList})
            var arr = [];
            var arr2=[];
            for(let index = 0; index <= res.data.data.deviceList.length-1; index++) {
                arr[index] = res.data.data.deviceList[index].description
                arr2[index] = res.data.data.deviceList[index].name
            }
            list[i] = arr;
            list2[i] = arr2;
            if(!arr.length){
                list[i] = ['暂无设备']
                list2[i] =[]
            }
            if (i == 0) {
                this.data.array[1] = list[0]
                this.upData({ deviceName:list,array:this.data.array,lab_device:list2})
                return wx.pro.request({
                    url:'https://api.yumik.top/api/v1/device/event/list',
                    method:'get',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token'),
                    },
                    data:{
                        name:this.data.lab_device[0][0],
                        page:this.data.page,
                    }
                }).then((res)=>{
                    var list = [];
                    res.data.data.eventList.map((item,index)=>{
                        list[index] = {'event':JSON.parse(item.json),'time':this.toTime(item.gmtOnline)}
                        if(list[index].event.name!=undefined){
                            if(list[index].event.name==0){
                                list[index].event.name = '未知人员';
                            }
                            else{
                                wx.pro.request({
                                    url:'https://api.yumik.top/api/v1/user/info',
                                    method:'get',
                                    header:{
                                        'content-type':'application/x-www-form-urlencoded',
                                        'Authorization':wx.getStorageSync('token')
                                    },
                                    data:{
                                        otherUserId:list[index].event.name
                                    }
                                }).then((res)=>{
                                    list[index].event.name=res.data.data.userInfo.name
                                    this.setData({eventList:list})
                                }).catch((e)=>{
                                    console.log(e)
                                })
                            }
                        }
                        else{
                            let json = JSON.parse(item.json);
                            //console.log(item)
                            list[index].event['color_tem'] = this.data.color[json.alarm[0]];
                            list[index].event['color_hum'] = this.data.color[json.alarm[1]];
                            if(json.alarm[0]==0&&json.alarm[1]==0){
                                list[index].event['type']='温湿度正常'
                            }
                            else if(json.alarm[0]!=0&&json.alarm[1]!=0){
                                list[index].event['type']='温湿度异常'
                            }
                            else if(json.alarm[0]==0&&json.alarm[1]!=0){
                                list[index].event['type']='湿度异常'
                            }
                            else{
                                list[index].event['type']='温度异常'
                            }
                            this.setData({eventList:list})
                            //console.log(list)
                        }
                    })
                })
            } else {
                this.getDeviceInfo(labList, i - 1, list,list2)
            }
            
        })
    },
    toTime(timestamp){
        var date = new Date(timestamp);
        let year = date.getFullYear();
        let month = ((date.getMonth() + 1 )> 9?(date.getMonth() + 1):'0'+(date.getMonth() + 1));
        let day = (date.getDate() > 9?date.getDate():'0'+date.getDate());
        let hour = (date.getHours() > 9?date.getHours():'0'+date.getHours());
        let minute = (date.getMinutes() > 9?date.getMinutes():'0'+date.getMinutes());
        let str = `${year}年${month}月${day}日 ${hour}时${minute}分`;
        return str;
    },
    scrollToLower(){
        if(this.data.flag){
            this.setData({page:this.data.page+1})
            var list = [];
            wx.pro.request({
                url:'https://api.yumik.top/api/v1/device/event/list',
                method:'get',
                header:{
                    'content-type':'application/x-www-form-urlencoded',
                    'Authorization':wx.getStorageSync('token'),
                },
                data:{
                    name:this.data.lab_device[this.data.index[0]][this.data.index[1]],
                    page:this.data.page,
                }
            }).then((res)=>{
                if(res.data.data.eventList.length==0){
                    this.setData({flag:0})
                }
                else{
                    res.data.data.eventList.map((item,index)=>{
                        list[index] = {'event':JSON.parse(item.json),'time':this.toTime(item.gmtOnline)}
                        if(list[index].event.name!=undefined){
                            if(list[index].event.name==0){
                                list[index].event.name = '未知人员';
                            }
                            else{
                                wx.pro.request({
                                    url:'https://api.yumik.top/api/v1/user/info',
                                    method:'get',
                                    header:{
                                        'content-type':'application/x-www-form-urlencoded',
                                        'Authorization':wx.getStorageSync('token')
                                    },
                                    data:{
                                        otherUserId:list[index].event.name
                                    }
                                }).then((res)=>{
                                    list[index].event.name=res.data.data.userInfo.name
                                    this.data.eventList = this.data.eventList.concat(list)
                                    this.setData({eventList:this.data.eventList})
                                }).catch((e)=>{
                                    console.log(e)
                                })
                            }
                        }
                        else{
                            let json = JSON.parse(item.json);
                            list[index].event['color_tem'] = this.data.color[json.alarm[0]];
                            list[index].event['color_hum'] = this.data.color[json.alarm[1]];
                            if(json.alarm[0]==0&&json.alarm[1]==0){
                                list[index].event['type']='温湿度正常'
                            }
                            else if(json.alarm[0]!=0&&json.alarm[1]!=0){
                                list[index].event['type']='温湿度异常'
                            }
                            else if(json.alarm[0]==0&&json.alarm[1]!=0){
                                list[index].event['type']='湿度异常'
                            }
                            else{
                                list[index].event['type']='温度异常'
                            }
                            this.data.eventList = this.data.eventList.concat(list)
                            this.setData({eventList:this.data.eventList})
                        }
                    })
                    
                }
            }).catch((e)=>{
                console.log(e)
            })
        }
        else return;
    },
    bindPickerChange(e){
        this.setData({index:e.detail.value,flag:1,page:1})
        if(this.data.array[1][this.data.index[1]]=='实验室门禁'){
            this.setData({type:1})
        }
        else if(this.data.array[1][this.data.index[1]]=='温湿度传感器'){
            this.setData({type:2})
        }
        else{
            this.setData({type:0})
        }
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/device/event/list',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                name:this.data.lab_device[this.data.index[0]][this.data.index[1]],
                page:this.data.page,
            }
        }).then((res)=>{
            var list = [];
            res.data.data.eventList.map((item,index)=>{
                list[index] = {'event':JSON.parse(item.json),'time':this.toTime(item.gmtOnline)}
                if(list[index].event.name!=undefined){
                    if(list[index].event.name==0){
                        list[index].event.name = '未知人员';
                    }
                    else{
                        wx.pro.request({
                            url:'https://api.yumik.top/api/v1/user/info',
                            method:'get',
                            header:{
                                'content-type':'application/x-www-form-urlencoded',
                                'Authorization':wx.getStorageSync('token')
                            },
                            data:{
                                otherUserId:list[index].event.name
                            }
                        }).then((res)=>{
                            list[index].event.name=res.data.data.userInfo.name
                            this.setData({eventList:list})
                        }).catch((e)=>{
                            console.log(e)
                        })
                    }
                }
                else{
                    let json = JSON.parse(item.json);
                    list[index].event['color_tem'] = this.data.color[json.alarm[0]];
                    list[index].event['color_hum'] = this.data.color[json.alarm[1]];
                    if(json.alarm[0]==0&&json.alarm[1]==0){
                        list[index].event['type']='温湿度正常'
                    }
                    else if(json.alarm[0]!=0&&json.alarm[1]!=0){
                        list[index].event['type']='温湿度异常'
                    }
                    else if(json.alarm[0]==0&&json.alarm[1]!=0){
                        list[index].event['type']='湿度异常'
                    }
                    else{
                        list[index].event['type']='温度异常'
                    }
                    this.setData({eventList:list})
                }
            })
        })
    },
    bindPickerColumnChange(e){
        if(e.detail.column == 0){
            this.data.array[1] = this.data.deviceName[e.detail.value];
            this.setData({array:this.data.array})
        }
    }
})