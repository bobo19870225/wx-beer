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
        _openid: null,
        vipLoading: true,
        money: 0,
        points: 0,
        containerHeight: app.globalData.containerHeight,
        showPayDialog: false,
        vips: null,
        vipPackage: null,
        shop: null,
    },
    attached() {

    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 切换店铺
         */
        async onShopChange(e) {
            let shop = e.detail
            this.setData({
                shop
            })
            this.setData({
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
            const res = await db.collection('user').where({
                _openid: this.data._openid,
                shopId: this.data.shop._id
            }).get()
            console.log(res);
            if (res.data && res.data.length > 0) {
                let vipUserInfo = res.data[0]
                this.data.vips.forEach(element => {
                    if (element._id == vipUserInfo.vipPackageId) {
                        vipUserInfo.vipPackage = element
                    }
                });
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
            let data = e.detail.value.split(',')
            console.log('radio发生change事件，携带value值为：', data)
            this.setData({
                money: data[0],
                points: data[1]
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
            const balance = Number.parseInt(this.data.money)
            const points = Number.parseInt(this.data.points)
            await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'payForVip',
                    shopId: shop._id,
                    _openid: this.data._openid,
                    name: this.data.userInfo.nickName,
                    balance,
                    points
                },
            });
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
    },
});