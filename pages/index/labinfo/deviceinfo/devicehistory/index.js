Page({
    data:{
        name:'',
        eventList:[],
        type:'',
        page:1,
        flag:1,
        errorName:['正常','低','高','超低','超高'],
        color:['green','yellow','yellow','red','red'],
        list:[],
    },
    onLoad:function(option){
        const adminId = wx.pro.getStorageSync('adminId');
        this.setData({name:option.name,type:option.type})
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/device/event/list',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                name:this.data.name,
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
                        if(list[index].event.name==adminId){
                            list[index].event.isAdmin = 1;
                        }
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
            
        }).catch((e)=>{
            console.log(e)
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
        const adminId = wx.pro.getStorageSync('adminId');
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
                    name:this.data.name,
                    page:this.data.page,
                }
            }).then((res)=>{
                console.log(res)
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
                                if(list[index].event.name==adminId){
                                    list[index].event.isAdmin = 1;
                                }
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
                                    this.setData({list:list})
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
                            this.setData({list:list})
                        }
                    })
                    this.data.eventList = this.data.eventList.concat(this.data.list)
                    this.setData({eventList:this.data.eventList})
                }
            }).catch((e)=>{
                console.log(e)
            })
        }
        else return;
    }
})