import WxValidate from '../../utils/WxValidate';
var Validate=""
Page({
    data: {
        showModel: false,
        showDialog: false,
        name:'',
        academy:'',
        telephone:'',
        sduNumber:'',
        check:false
    },
    onLoad:function(){
        const rules = {
            name:{
                required:true,
                maxlength:10,
            },
            academy:{
                required:true,
                rangelength:[5,12],
            },
            telephone:{
                required:true,
                tel:true,
            },
            sduNumber:{
                required:true,
                rangelength:[9,12],
                digits:true,
            }
        };
        const message = {
            name:{
                required:"请输入姓名",
                maxlength:"姓名不可超过十个字！",
            },
            academy:{
                required:"请输入学院",
                rangelength:"请输入正确的学院名称！",
            },
            telephone:{
                required:"请输入手机号码",
                tel:"请输入正确的手机号码！",
            },
            sduNumber:{
                required:"请输入学号",
                rangelength:"学号位数不正确!",
                digits:"学号必需为数字！"
            }
        }
        Validate = new WxValidate(rules,message)
    },
    getInput(e){
        switch(e.currentTarget.dataset.name){
            case 'name':
                this.setData({name:e.detail.value});
                break;
            case 'academy':
                this.setData({academy:e.detail.value});
                break;
            case 'telephone':
                this.setData({telephone:e.detail.value});
                break;
            case 'sduNumber':
                this.setData({sduNumber:e.detail.value})
                break;
        }
    },
    submitList(e){
        if(!this.data.check){
            wx.pro.showToast({
                title:'请先阅读并同意用户协议！',
                icon:'none',
                duration:2000
            })
        }
        else{
            const form = {
                name:this.data.name,
                academy:this.data.academy,
                telephone:this.data.telephone,
                sduNumber:this.data.sduNumber
            }
            if(!Validate.checkForm(form)){
                let error = Validate.errorList[0]
                wx.showToast({
                    icon:'none',
                    title:error.msg
                })
                return false;
            }
            wx.pro.request({
                url:"https://api.yumik.top/api/v1/user/info",
                method:'post',
                header:{
                  'content-type':'application/x-www-form-urlencoded',
                  'Authorization':wx.getStorageSync('token')
                },
                data:
                {
                    name:this.data.name,
                    academy:this.data.academy,
                    telephone:this.data.telephone,
                    sduNumber:this.data.sduNumber,
                    role:wx.getStorageSync('role')
                },
            }).then((res)=>{
                if(res.data.errCode == 0){
                    wx.pro.showToast({
                        title:'填写成功，两秒后跳转到上传照片页',
                        icon:'none',
                        duration:2000
                    })
                    setTimeout(()=>{
                        wx.navigateTo({url:'/pages/uploadimage/index'});
                    },2000)
                    wx.setStorageSync('flag',true);
                }
            }).catch((e)=>{
                console.log(e)
            })
        }
        
    },
    changeCheck(e){
        this.setData({check:!this.data.check})
    }
});
