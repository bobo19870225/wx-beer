const app = getApp()
const db = wx.cloud.database()
Component({
    options: {
        addGlobalClass: true,
    },

    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        isRefreshing: false,
        userInfo: {},
        containerHeight: app.globalData.containerHeight,
        showRoleDialog: false,
        roleList: [{
            text: '管理员',
            value: 'superManage',
            checked: true
        }, {
            text: '店长',
            value: 'shopManage'
        }, {
            text: '客户',
            value: 'client'
        }],
        shopNumber: 0,
        totalIncom: 0,
        totalUser: 0,
        shopExpend: 0,
    },
    attached() {
        app.getShopList().then((res) => {
            this.setData({
                shopNumber: res.length
            })
        })
        this.loadData();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        loadData() {
            this.getUser(true);
            this.getTotalIncom();
        },
        getTotalIncom() {
            wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getTotalIncom',
                }
            }).then((res) => {
                let totalIncom = 0
                let totalUser = 0
                let shopExpend = 0
                if (res.result.list) {
                    res.result.list.forEach(element => {
                        if (element._id == 0) {//会员充值
                            totalIncom = element.total
                        }
                        if (element._id == 1) {//会员消费
                            totalUser = element.total
                        }
                        if (element._id == 2) {//微信消费
                            totalUser += element.total
                            totalIncom += element.total
                        }
                        if (element._id == 3) {//店铺支出
                            shopExpend = element.total
                        }
                    });
                }
                this.setData({
                    totalIncom,
                    totalUser,
                    shopExpend
                })
            })
        },
        async getUser(forceupdates) {
            console.log("super-manage getUser");
            const res = await app.getUserInfoAll(forceupdates)
            const userInfo = res.userInfo
            this.setData({
                userInfo,
                isRefreshing: false
            })
        },
        /**
         * 更换头像
         * @param {*} e 
         */
        onChooseAvatar(e) {
            wx.showLoading({
                title: '上传中...'
            })
            const {
                avatarUrl
            } = e.detail
            const userInfo = this.data.userInfo
            const cloudPath = 'userAvatar/' + userInfo._openid + Date.now() + '.png'
            // 将图片上传至云存储空间
            wx.cloud.uploadFile({
                // 指定上传到的云路径
                cloudPath: cloudPath,
                // 指定要上传的文件的小程序临时文件路径
                filePath: avatarUrl,
                // 成功回调
                success: res => {
                    userInfo.avatarUrl = res.fileID
                    wx.cloud.callFunction({
                        name: 'quickstartFunctions',
                        data: {
                            type: 'updateUser',
                            entity: {
                                _id: userInfo._id,
                                avatarUrl: userInfo.avatarUrl
                            }
                        }
                    }).then((res) => {
                        if (res.result.success) {
                            this.setData({
                                userInfo
                            })
                        }
                        wx.hideLoading()
                        console.log("updateUser", res);
                    })
                },
                complete: res => {}
            })
        },

        /**
         * 切换角色
         * @param {*} e 
         */
        onSelecteRole(e) {
            const mode = e.detail.value
            this.triggerEvent('onSwitchMode', mode)
        },
        closeRoleDialog() {
            this.setData({
                showRoleDialog: false
            })
        },
        goToVipManage() {
            wx.navigateTo({
                url: '/pages/manage/vip/index',
            })
        },
        goToCouponManage() {
            wx.navigateTo({
                url: '/pages/super-manage/coupon/index',
            })
        },
        goTopManageShop() {
            wx.navigateTo({
                url: '/pages/manage/shop/index',
            })
        },
        goToApplicationManage() {
            wx.navigateTo({
                url: '/pages/manage/application/index',
            })
        },
        gotoBillPage() {
            wx.navigateTo({
                url: `/pages/user-center/bill/index?isSuperManage=true`,
            });
        },
        goToOperation() {
            wx.navigateTo({
                url: '/pages/manage/operation/index?isSuperManage=true',
            })
        },
        gotoSettingPage(e) {
            const that = this
            wx.navigateTo({
                url: '/pages/user-center/setting/index',
                events: {
                    callbackData: (userInfo) => {
                        console.log("callbackData", userInfo);
                        that.setData({
                            userInfo
                        })
                    },
                },
            })
        },
        switchMode() {
            this.setData({
                showRoleDialog: true
            })
        }
    },

});