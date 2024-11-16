const app = getApp()
const db = wx.cloud.database()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showDialog: false,
        dialogData: {},
        orderList: [],
        order: null,
        shop: null,
        total: 0,
        totalOld: 0,
        vipTotal: 0,
        vipTotalOld: 0,
        preferential: 0,
        containerHeight: app.globalData.containerHeightNoTabBar,
        showDialogPay: false,
        tablesList: null,
        // dinersNumb: app.globalData.dinersNumb,
        tableSeatsId: null,
        vipLevel: null,
        vipAccount: null,
        selecteCoupon: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const shop = await app.getShop()
        const vipLevel = await app.getVipLevel()
        const vipAccount = await app.getVipAccount()

        this.setData({
            shop,
            vipLevel,
            vipAccount,
        })
        this.getOrderList()
        this.getTablesList()
    },
    async getOrderList() {
        wx.showLoading({
            title: '加载中...'
        })
        const shop = this.data.shop
        const _openid = await app.getOpenid()
        const res = await db.collection('order').where({
            isDelete: false,
            _openid,
            shopId: shop._id,
            state: 0
        }).orderBy('createDate', 'desc').get()
        const orderList = res.data
        wx.hideLoading()
        this.setData({
            orderList,
        })
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
        let selecteCoupon = null
        let vipAccount = this.data.vipAccount
        for (let index = 0; index < vipAccount.coupon.length; index++) {
            const element = vipAccount.coupon[index];
            if (element._id == e.detail.value) {
                selecteCoupon = element
                element.checked = true
            } else {
                element.checked = false
            }
        }
        let vipTotal = this.data.vipTotalOld
        vipTotal -= selecteCoupon.value
        let total = this.data.totalOld
        total -= selecteCoupon.value
        console.log("III", vipAccount);
        this.setData({
            vipAccount,
            vipTotal,
            total,
            selecteCoupon
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
        let vipAccount = this.data.vipAccount
        if (vipAccount.coupon) {
            vipAccount.coupon = vipAccount.coupon.map((item) => {
                const startDate = new Date(item.startDate)
                const endDate = new Date(item.endDate)
                const now = new Date()
                if (item.number <= 0) {
                    item.disabled = true
                    item.tips = '已用完'
                } else if (item.usePrice > total) {
                    item.disabled = true
                    const d = item.usePrice - total
                    item.tips = '还差' + d + '元可以使用'
                } else if (startDate.getTime() > now.getTime()) {
                    item.disabled = true
                    item.tips = item.startDate + '后可以使用'
                } else if (endDate.getTime() < now.getTime()) {
                    item.disabled = true
                    item.tips = '已过期'
                } else {
                    item.disabled = false
                }
                item.checked = false
                return item
            })
            console.log(vipAccount.coupon);
        }
        this.setData({
            order,
            totalOld: total,
            total: total,
            vipTotal: vipTotal,
            vipTotalOld: vipTotal,
            preferential,
            vipAccount
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

    closeDialogPay(e) {
        if (e) { //点关闭
            let total = this.data.total
            let vipTotal = this.data.vipTotal
            let selecteCoupon = this.data.selecteCoupon
            if (selecteCoupon) {
                total += selecteCoupon.value
                vipTotal += selecteCoupon.value
                this.setData({
                    total,
                    vipTotal,
                    selecteCoupon: null,
                })
            }
        }
        let vipAccount = this.data.vipAccount
        for (let index = 0; index < vipAccount.coupon.length; index++) {
            let element = vipAccount.coupon[index]
            element.checked = false
        }
        this.setData({
            vipAccount,
            showDialogPay: false
        })
    },
    async cancelOrder(e) {
        this.setData({
            showDialog: true,
            dialogData: {
                id: e.currentTarget.dataset.id
            }
        })
    },
    addOrder(e) {
        console.log(e.currentTarget.dataset.item);
        wx.navigateTo({
            url: '/pages/home/index',
            success: (res) => {
                res.eventChannel.emit('order', e.currentTarget.dataset.item)
            }
        })
    },
    async onDelete(e) {
        const id = e.detail.id
        wx.showLoading({
            title: '处理中...',
            mask: true
        })
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'updateOrder',
                entity: {
                    _id: id,
                    isDelete: true
                },
            },
        });
        wx.hideLoading()
        console.log(res)
        if (res.result.success) {
            this.getOrderList()
        }
    },
    async formSubmit(e) {
        let typeSub = e.detail.target.dataset.type
        let remarks = e.detail.value.remarks
        let total = 0
        let payType = 1
        console.log(e);
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
                    data: {
                        description: '微信点餐',
                        total //金额
                    }
                },
                success: (res) => {
                    console.log('下单结果: ', res);
                    const paymentData = res.result?.data;
                    if (!paymentData) {
                        wx.hideLoading()
                        wx.showToast({
                            title: '金额异常',
                            icon: 'error'
                        })
                        return
                    }
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
                            that.callPayForGoods(0, total, remarks)
                        },
                        fail(err) {
                            wx.showToast({
                                title: '取消支付',
                                icon: 'error'
                            })
                            // 支付失败回调
                            console.error('唤起支付组件失败：', err);
                        },
                        complete() {
                            wx.hideLoading()
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
        let selecteCoupon = this.data.selecteCoupon
        if (selecteCoupon) {
            let coupon = this.data.vipAccount.coupon.map((item) => {
                if (item._id == this.data.selecteCoupon._id) {
                    if (item.number > 0) {
                        item.number -= 1
                    }
                }
                delete item.checked
                return item
            })
            entity.coupon = coupon
        }
        console.log(entity)
        // return
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
                    title: res.result.errMsg,
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