// pages/order/index.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        isLoading: false,
        shop: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var shop = wx.getStorageSync('shop')
        this.setData({
            shop
        })
    },
    async getOrderList() {
        this.setData({
            isLoading: true
        });

        var _openid = wx.getStorageSync('openid') || await app.getOpenid()
        // let _openid = 'o4AG06_p2p4obaDiycY703GN8Nas'
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getOrderList',
                shopId:this.data.shop._id,
                _openid
            },
        });

        const orderList = res?.result?.data || [];
        this.setData({
            isLoading: false,
            orderList
        });
        console.log(this.data.orderList)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getOrderList()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})