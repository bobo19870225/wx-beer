// pages/me/index.js
const app = getApp()
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})
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
        vipInfo: null,
        vipLoading: true,
        containerHeight: app.globalData.containerHeight,
        showPayDialog: false,
        vips: null,
        vipPackage: null,
        vipPackageBuy: null,
        shop: null,
    },
    attached() {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        async getUser() {
            this.setData({
                isRefreshing: true
            })
            const res = await app.getUserInfoAll()
            const userInfo = res.userInfo
            const vipInfo = res.vipInfo
            this.setData({
                userInfo,
                vipInfo,
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
                    data: userInfo
                }
            }).then((res) => {
                console.log("TTT", res);
            })
        },
        /**
         * 切换店铺
         */
        async onShopChange(e) {
            let shop = e.detail
            this.setData({
                shop,
                vipLoading: true,
            })
            await this.getVipType();
            await this.getUser();
            this.setData({
                vipLoading: false,
            })
        },

        async getVipType() {
            const res = await db.collection('vipPackage').where({
                isDelete: false
            }).get()
            this.setData({
                vips: res.data
            })
        },
        gotoApplicationPage() {
            wx.navigateTo({
                url: `/pages/application/index`,
            });
        },
        gotoBillPage() {
            wx.showToast({
                title: '开发中...',
            })
        },
        radioChange(e) {
            let id = e.detail.value
            console.log('radio发生change事件，携带value值为：', id)
            let vipPackageBuy = null
            this.data.vips.forEach(element => {
                if (element._id == id) {
                    vipPackageBuy = element
                }
            });
            this.setData({
                vipPackageBuy
            })
        },
        toBeVip() {
            this.setData({
                showPayDialog: true
            })
        },
        async payVip() {
            this.setData({
                isLoading: true
            })
            const shop = this.data.shop
            const vipPackageBuy = this.data.vipPackageBuy
            const entry = Number.parseInt(vipPackageBuy.entry)
            const beer = Number.parseInt(vipPackageBuy.beer)
            const _openid = await app.getOpenid()
            let res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'payForVip',
                    shopId: shop._id,
                    _openid,
                    name: this.data.userInfo.name,
                    // vipPackageId: vipPackageBuy._id,
                    entry,
                    beer
                },
            });
            console.log(res);
            await this.getVipUser()
            this.closePayDialog()
            this.setData({
                isLoading: false
            })
        },
        closePayDialog() {
            this.setData({
                showPayDialog: false
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
            let PageCur = null
            if (app.globalData.mode == 'client') {
                app.globalData.mode = 'manage'
                PageCur = 'watchOrder'
            } else {
                app.globalData.mode = 'client'
                PageCur = 'start'
            }
            this.triggerEvent('onSwitchMode', PageCur)
        }
    },

});