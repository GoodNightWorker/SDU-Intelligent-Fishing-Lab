import WxValidate from '../../utils/WxValidate';
var Validate=""
Page({
    data: {
        showModel: false,
        showDialog: false,
        info:[
            {
                "icon":"/images/icon-msg-name.svg",
                "placeholder":"请输入您的姓名",
                "id":"name",
                "value":"",
            },
            {
                "icon":"/images/icon-msg-academy.svg",
                "placeholder":"请输入您的学院",
                "id":"academy",
                "value":"",
            },
            {
                "icon":"/images/icon-msg-telephone.svg",
                "placeholder":"请输入您的联系方式",
                "id":"telephone",
                "value":"",
            },
            {
                "icon":"/images/icon-msg-sduNumber.svg",
                "placeholder":"请输入您的学号",
                "id":"sduNumber",
                "value":"",
            },
        ],
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
    submitList(e){
        const form = e.detail.value;
        if(!Validate.checkForm(form)){
            let error = Validate.errorList[0]
            console.log(error)
            wx.showToast({
                icon:'none',
                title:error.msg
            })
            return false;
        }
        console.log("role",wx.getStorageSync('role'))
        wx.pro.request({
            url:"https://api.yumik.top/api/v1/user/info",
            data:{
              name:form['name'],
              academy:form['academy'],
              telephone:form['telephone'],
              sduNumber:form['sduNumber'],
              role:wx.getStorageSync('role'),
            },
            method:'post',
            header:{
              'content-type':'application/x-www-form-urlencoded',
              'Authorization':wx.getStorageSync('token')
            },
        }).then((res)=>{
            console.log(res)
        }).catch((e)=>{
            console.log(e)
        })
    }
});
