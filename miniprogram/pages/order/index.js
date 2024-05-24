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
        orderList: [],
        isLoading: false,
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
        onShopChange(e) {
            let shop = e.detail
            this.getOrderList(shop._id);
        },
        async getOrderList(shopId) {
            this.setData({
                isLoading: true
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
            this.setData({
                isLoading: false,
                orderList
            });
        },
    },

})