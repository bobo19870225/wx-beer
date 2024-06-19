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
        roleList: [],
        shopNumber: 0,
        totalIncom: 0
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
                this.setData({
                    totalIncom: res.result?.list[0]?.total || 0
                })
            })
        },
        async getUser(forceupdates) {
            console.log("super-manage getUser");
            const res = await app.getUserInfoAll(forceupdates)
            const userInfo = res.userInfo
            const isSuperManage = userInfo?.isSuperManage || false
            const isShopManage = userInfo?.isShopManage || false
            if (isSuperManage) {
                this.setData({
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
                    }]
                })
            } else if (isShopManage) {
                this.setData({
                    roleList: [{
                        text: '店长',
                        value: 'shopManage'
                    }, {
                        text: '客户',
                        value: 'client'
                    }]
                })
            }
            this.setData({
                userInfo,
                isRefreshing: false
            })
        },
        onChooseAvatar(e) {
            const {
                avatarUrl
            } = e.detail
            const userInfo = this.data.userInfo
            userInfo.avatarUrl = avatarUrl
            this.setData({
                userInfo
            })
            wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'updateUser',
                    entity: userInfo
                }
            }).then((res) => {
                console.log("TTT", res);
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
                url: `/pages/user-center/bill/index`,
            });
        },
        goToOperation() {
            wx.navigateTo({
                url: '/pages/manage/operation/index',
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