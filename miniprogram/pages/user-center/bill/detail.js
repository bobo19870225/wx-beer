const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        bill: null,
        orderDetail: null,
        shopDetail: null,
        vipPackageDetail: null,
        spendDetail: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel && eventChannel.on && eventChannel.on('bill', (data) => {
            console.log(data);
            this.setData({
                bill: data
            })
            if (data.shopId) {
                this.getShopById(data.shopId)
            }
            if (data.orderId) {
                this.getOrderById(data.orderId)
            }
            if (data.vipPackageId) {
                this.getVipPackageById(data.vipPackageId)
            }
            if (data.spendId) {
                this.getSpendById(data.spendId)
            }
        })
    },
    getOrderById(orderId) {
        db.collection('order').doc(orderId).get().then((res) => {
            console.log("order", res);
            this.setData({
                orderDetail: res.data
            })
        })
    },
    getVipPackageById(vipPackageId) {
        db.collection('vipPackage').doc(vipPackageId).get().then((res) => {
            console.log("vipPackage", res);
            this.setData({
                vipPackageDetail: res.data
            })
        })
    },
    getSpendById(spendId) {
        db.collection('spend').doc(spendId).get().then((res) => {
            console.log("spend", res);
            this.setData({
                spendDetail: res.data
            })
        })
    },
    getShopById(shopId) {
        db.collection('shop').doc(shopId).get().then((res) => {
            console.log("shop", res);
            this.setData({
                shopDetail: res.data
            })
        })
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