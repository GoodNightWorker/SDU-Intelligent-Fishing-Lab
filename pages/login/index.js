Page({
    data: {
        showModel: false,
        showDialog: false,
    },

    btnUserSelectCard(e) {
        const role = e.currentTarget.dataset.role;
        switch(role){
            case 'Administrator':
                wx.setStorageSync('role',1);
                wx.navigateTo({url:'/pages/userinfo/index'});
                break;
            case 'User':
                wx.setStorageSync('role',2);
                wx.navigateTo({url:'/pages/userinfo/index'});
                break;
            // case 'Guest':
            //     wx.setStorageSync('role',3); 
            //     wx.navigateTo({url:'/pages/administrator/index'});
            //     break;
        }
        
    }
});
