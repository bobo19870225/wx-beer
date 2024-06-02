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
    async onLoad(options) {
        var shop = app.globalData.shop
        this.setData({
            shop
        })
        const _openid = wx.getStorageSync('openid') || await app.getOpenid()
        const res = await db.collection('order').where({
            isDelete: false,
            _openid,
            shopId: shop._id,
            state: 0
        }).orderBy('createDate', 'desc').get()
        const orderList = res.data
        this.setData({
            orderList,
        })
    },
    onSelectOrder(e) {
        console.log("onSelectOrder", e);
        const orderIds = e.detail.value

        const orderList = this.data.orderList.filter((value) => {
            for (let index = 0; index < orderIds.length; index++) {
                const element = orderIds[index]
                if (element == value._id) {
                    return true
                }
            }
            return false
        })

        let preferential = total - vipTotal
        let total = 0;
        let vipTotal = 0;

        orderList.forEach(element => {
            element.goodsList.forEach(elementg => {
                total += elementg.number * elementg.price
                vipTotal += elementg.number * elementg.vipPrice
            });
        });
        preferential = total - vipTotal
        this.setData({
            total: total / 100,
            vipTotal: vipTotal / 100,
            preferential: preferential / 100
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

        wx.cloud.callFunction({
            name: 'wxpayFunctions',
            data: {
                type: 'wxpay_order',
            },
            success: (res) => {
                console.log('下单结果: ', res);
                const paymentData = res.result?.data;
                // 唤起微信支付组件，完成支付
                wx.requestPayment({
                    timeStamp: paymentData?.timeStamp,
                    nonceStr: paymentData?.nonceStr,
                    package: paymentData?.packageVal,
                    paySign: paymentData?.paySign,
                    signType: 'RSA', // 该参数为固定值
                    success(res) {
                        // 支付成功回调，实现自定义的业务逻辑
                        console.log('唤起支付组件成功：', res);

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
                    fail(err) {
                        // 支付失败回调
                        console.error('唤起支付组件失败：', err);
                    },
                });
            },
        });
    },
})