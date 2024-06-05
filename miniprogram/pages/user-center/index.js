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
        userInfo: {},
        vipUserInfo: null,
        vipLoading: true,
        containerHeight: app.globalData.containerHeight,
        showPayDialog: false,
        vips: null,
        vipPackage: null,
        vipPackageBuy: null,
        shop: null,
    },
    attached() {
        this.getUser();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async getUser() {
            const _openid = await app.getOpenid()
            const res = await db.collection('user').where({
                isDelete: false,
                _openid
            }).get()
            console.log(res);
            const userInfo = res.data[0] || {}
            this.setData({
                userInfo
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
            await this.getVipUser();
            this.setData({
                vipLoading: false,
            })
        },
        async getVipUser() {
            this.setData({
                vipUserInfo: null
            })
            const _openid = await app.getOpenid()
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getVip',
                    _openid,
                    shopId: this.data.shop._id
                }
            })
            console.log(res);
            const vipData = res.result?.result?.data
            if (vipData && vipData.length > 0) {
                let vipUserInfo = vipData[0]
                // this.data.vips.forEach(element => {
                //     if (element._id == vipUserInfo.vipPackageId) {
                //         vipUserInfo.vipPackage = element
                //     }
                // });
                this.setData({
                    vipUserInfo: vipUserInfo
                })
                console.log("AAA", this.data.vipUserInfo);
            }
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
                    console.log("callbackData",userInfo);
                    that.setData({
                      userInfo
                    })
                  },
                },
            })
        }
    },
});