Page({
    data:{
        labId:'',
        userList:[],
        adminId:'',
        selfId:'',
        isShow:false,
        userInfo:[],
        img:'',
        auth:'',
        showDel:false,
    },
    onLoad:function(option){
        this.setData({
            labId:option.id,
            selfId:wx.pro.getStorageSync('selfId')
        });
    },
    onShow:function(){
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/lab/user/list',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token'),
            },
            data:{
                'labId':this.data.labId,
                'page':1
            }
        }).then((res)=>{
            this.setData({userList:res.data.data.userList,adminId:res.data.data.userList[0].tableUserId});
            this.data.userList.map((item,index)=>{
                wx.pro.request({
                    url:'https://api.yumik.top/api/v1/face/base64',
                    method:'get',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token')
                    },
                    data:{
                        'userId':item.tableUserId,
                        'min':true
                    }
                }).then((res)=>{
                    this.data.userList[index].img = res.data.data.base64;
                    this.upData({userList:this.data.userList});
                }).catch((e)=>{
                    console.log(e)
                })
            })
        })
    },
    showMessage(e){
        if(e.currentTarget.id==this.data.adminId){
            this.setData({auth:'实验室管理员',showDel:false})
        }
        else{
            if(this.data.selfId == this.data.adminId){
                this.setData({auth:'实验室成员',showDel:true})
            }
            else{
                this.setData({auth:'实验室成员',showDel:false})
            }
        }
        wx.pro.request({
            url:'https://api.yumik.top/api/v1/user/info',
            method:'get',
            header:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization':wx.getStorageSync('token')
            },
            data:{
                'otherUserId':e.currentTarget.id
            }
        }).then((res)=>{
            this.setData({userInfo:res.data.data.userInfo})
            wx.pro.request({
                url:'https://api.yumik.top/api/v1/face/base64',
                method:'get',
                header:{
                    'content-type':'application/x-www-form-urlencoded',
                    'Authorization':wx.getStorageSync('token')
                },
                data:{
                    'userId':e.currentTarget.id,
                    'min':true
                }
            }).then((res)=>{
                this.setData({isShow:true,img:res.data.data.base64})
            }).catch((e)=>{
                console.log(e)
            })
        }).catch((e)=>{
            console.log(e)
        })
    },
    unShowMessage(){
        this.setData({isShow:false})
    },
    deleteMember(e){
        //console.log(e.currentTarget.id)
        wx.pro.showModal({
            title:'提示',
            content: '确定要删除该成员吗？'
        }).then((res)=>{
            if(res.confirm){
                wx.pro.request({
                    url:'https://api.yumik.top/api/v1/lab/user/delete',
                    method:'post',
                    header:{
                        'content-type':'application/x-www-form-urlencoded',
                        'Authorization':wx.getStorageSync('token'),
                    },
                    data:{
                        userId:e.currentTarget.id,
                        labId:this.data.labId
                    }
                }).then((res)=>{
                    if(res.data.errCode === 0){
                        wx.pro.showToast({
                            title:'删除成功',
                            icon:'success',
                            duration:2000
                        })
                        this.unShowMessage();
                        wx.pro.request({
                            url:'https://api.yumik.top/api/v1/lab/user/list',
                            method:'get',
                            header:{
                                'content-type':'application/x-www-form-urlencoded',
                                'Authorization':wx.getStorageSync('token'),
                            },
                            data:{
                                'labId':this.data.labId,
                                'page':1
                            }
                        }).then((res)=>{
                            this.setData({userList:res.data.data.userList,adminId:res.data.data.userList[0].tableUserId});
                            this.data.userList.map((item,index)=>{
                                wx.pro.request({
                                    url:'https://api.yumik.top/api/v1/face/base64',
                                    method:'get',
                                    header:{
                                        'content-type':'application/x-www-form-urlencoded',
                                        'Authorization':wx.getStorageSync('token')
                                    },
                                    data:{
                                        'userId':item.tableUserId,
                                        'min':true
                                    }
                                }).then((res)=>{
                                    this.data.userList[index].img = res.data.data.base64;
                                    this.upData({userList:this.data.userList});
                                }).catch((e)=>{
                                    console.log(e)
                                })
                            })
                        })
                    }
                }).catch((e)=>{
                    console.log(e);
                })
            }
        }).catch((e)=>{
            console.log(e)
        })
    }
})