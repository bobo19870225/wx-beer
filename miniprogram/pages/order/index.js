// pages/order/index.js
const app = getApp()
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        shop: null,
        orderList: [],
        isLoading: false,
        isRefreshing: false,
        containerHeight: app.globalData.containerHeight,
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
                isLoading: true
            });
            await this.getOrderList();
            this.setData({
                isLoading: false
            });
        },
        async getOrderList() {
            const shopId = this.data.shop._id
            this.setData({
                isRefreshing: true
            });
            var _openid = wx.getStorageSync('openid') || await app.getOpenid()
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getOrderList',
                    shopId,
                    _openid
                },
            });
            const orderList = res?.result?.data || [];
            console.log(res);
            this.setData({
                isRefreshing: false,
                orderList
            })
        },
    },

})