// pages/pay-car/index.js
const app = getApp()
const db = wx.cloud.database()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        order: null,
        shop: null,
        total: 0,
        vipTotal: 0,
        preferential: 0,
        containerHeight: app.globalData.containerHeightNoTabBar,
        showDialogPay: false,
        tablesList: null,
        dinersNumb: app.globalData.dinersNumb,
        tableSeatsId: null,
        vipLevel: null,
        vipAccount: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const shop = await app.getShop()
        const vipLevel = await app.getVipLevel()
        const vipAccount = await app.getVipAccount()
        const _openid = await app.getOpenid()
        const res = await db.collection('order').where({
            isDelete: false,
            _openid,
            shopId: shop._id,
            state: 0
        }).orderBy('createDate', 'desc').get()
        const orderList = res.data
        this.setData({
            shop,
            vipLevel,
            vipAccount,
            orderList,
        })
        this.getTablesList()
    },
    async getTablesList() {
        this.setData({
            isLoading: true
        });
        if (!this.data.shop) {
            this.setData({
                isLoading: false
            });
            return
        }
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getIdleTable',
                entity: {
                    shopId: this.data.shop._id
                }
            }
        })
        const tablesList = res?.result.list || [];
        this.setData({
            isLoading: false,
            tablesList
        });
    },
    onCouponelecte(e) {
        console.log("onCouponelecte", e);
        let selecteCoupon = null
        for (let index = 0; index < this.data.vipAccount.coupon.length; index++) {
            const element = this.data.vipAccount.coupon[index];
            if (element._id == e.detail.value) {
                selecteCoupon = element
                break
            }
        }
        let vipTotal = this.data.vipTotal
        vipTotal -= selecteCoupon.value
        this.setData({
            vipTotal: vipTotal
        })
        // console.log("onCouponelecte", selecteCoupon);
    },
    onSelectOrder(e) {
        const orderId = e.detail.value
        const orderList = this.data.orderList.filter((value) => {
            return orderId == value._id
        })
        let preferential = null
        let total = 0;
        let vipTotal = 0;

        const order = orderList[0]
        order.goodsList.forEach(elementg => {
            total += elementg.number * elementg.price
        });
        if (this.data.vipLevel) {
            vipTotal = total * this.data.vipLevel.rate / 100
            preferential = total - vipTotal
        }
        this.setData({
            order,
            total: total,
            vipTotal: vipTotal,
            preferential: preferential,
        })
    },
    /**
     * 选桌
     * @param {*} e 
     */
    onTableSelecte(e) {
        this.setData({
            tableSeatsId: e.detail.value
        })
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
        let typeSub = e.detail.target.dataset.type
        let remarks = e.detail.value.remarks
        let total = 0
        let payType = 1
        if (typeSub == 'vipPay') {
            total = this.data.vipTotal
            payType = 1
        } else {
            total = this.data.total
            payType = 0
        }
        this.closeDialogPay()
        wx.showLoading({
            title: '正在支付...',
            mask: true
        })
        if (payType == 1) { //会员支付
            this.callPayForGoods(1, total, remarks)
        } else { //微信支付
            let that = this
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
                        },
                        fail(err) {
                            // 支付失败回调
                            console.error('唤起支付组件失败：', err);
                        },
                        complete() {
                            wx.hideLoading()
                            // 模拟支付成功
                            that.callPayForGoods(0, total, remarks)
                        }
                    });
                },
            });
        }
    },
    callPayForGoods(payType, total, remarks) {
        let entity = this.data.order
        entity.payType = payType
        entity.tableSeatsId = this.data.tableSeatsId
        //桌位
        entity.total = total
        entity.rate = this.data.vipLevel?.rate || 100
        entity.remarks = remarks
        entity.dinersNumb = this.data.dinersNumb //用餐人数
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'payForGoods',
                entity
            },
        }).then((res) => {
            wx.hideLoading()
            if (res.result.success) {
                app.globalData.PageCur = "order"
                wx.reLaunch({
                    url: '/pages/index/index',
                })
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '下单失败！' + res.errMsg,
                })
            }
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
})