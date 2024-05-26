// pages/pay-car/index.js
const app = getApp()
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        shop: null,
        total: 0,
        vipTotal: 0,
        preferential: 0,
        containerHeight: app.globalData.containerHeightNoTabBar,
        showDialogPay: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        var shop = app.globalData.shop
        this.setData({
            shop
        })
        let goods = null
        if (options) {
            goods = options.goods
            if (goods) {
                let orderListT = JSON.parse(options.goods)
                let total = 0;
                let vipTotal = 0;
                orderListT.forEach(element => {
                    total += element.number * element.price
                    vipTotal += element.number * element.vipPrice
                });
                const preferential = total - vipTotal
                this.setData({
                    orderList: orderListT,
                    total: total / 100,
                    vipTotal: vipTotal / 100,
                    preferential: preferential / 100
                })
            }
        }
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

    },
    /**
     * 用户支付
     */
    pay(e) {
        this.setData({
            showDialogPay: true
        })
    },

    closeDialogPay() {
        this.setData({
            showDialogPay: false
        })
    },
    async formSubmit(e) {
        // console.log(e);
        let typeSub = e.detail.target.dataset.type
        let remarks = e.detail.value.remarks
        let total = 0
        let type = 1
        const _openid = wx.getStorageSync('openid') || await app.getOpenid()
        if (typeSub == 'vipPay') {
            total = this.data.vipTotal
            type = 1
        } else {
            total = this.data.total
            type = 0
        }
        this.closeDialogPay()
        const shopId = this.data.shop._id
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'updateOrder',
                data: {
                    _openid,
                    type,
                    createDate: new Date(),
                    goodsList: this.data.orderList,
                    shopId,
                    total,
                    remarks,
                    // 下单成功，制作中
                    state: 1
                },
            },
        }).then((res) => {
            if (res.result.success) {
                app.globalData.PageCur = "order"
                wx.navigateBack()
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '下单失败！',
                })
            }
        })
    },
})