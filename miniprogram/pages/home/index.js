const app = getApp()
const db = wx.cloud.database()
/**
 * 旧订单（加菜）
 */
let oldOrder = null
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderTotalPrice: null,
        orderTotalVipPrice: null,
        orderTotalNumber: null,
        goodsList: [],
        unPayList: [],

        orderList: [],
        showOrder: false,
        showAddOrder: false, //显示加菜结算清单
        isLoading: false,
        isRefreshing: false,
        containerHeight: app.globalData.containerHeight,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
        goodsTypeList: null,
        load: true,
        shop: null,
        vipLevel: null,
        vipAccount: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel()
        oldOrder = null
        eventChannel && eventChannel.on && eventChannel.on('order', (data) => {
            oldOrder = data
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        const shop = await app.getShop()
        this.setData({
            isLoading: true,
            shop
        })
        await this.getGoodsTypeList()
        await this.fetchGoodsList();
        this.setData({
            isLoading: false
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    hideModal(e) {
        this.setData({
            showAddOrder: false
        })
    },
    async getGoodsTypeList() {
        const res = await db.collection('goodsType').where({
            isDelete: false
        }).orderBy('value', 'asc').get()
        if (res.data) {
            res.data.unshift({
                title: '人气Top5',
                value: 0
            })
            this.setData({
                goodsTypeList: res.data
            })
        }
    },
    /**
     * 切换店铺
     */
    onShopChange(e) {
        console.log("onShopChange", e);
        let shop = e.detail
        this.setData({
            shop
        })
    },
    async fetchGoodsList() {
        this.setData({
            isRefreshing: true
        })
        const shopId = this.data.shop._id
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'fetchGoodsList',
                shopId
            },
        });
        const goodsList = res?.result?.data || [];
        const _openid = await app.getOpenid()
        const unPayRes = await db.collection('order').where({
            isDelete: false,
            _openid,
            shopId,
            state: 0 //未付款的
        }).get()
        const unPayList = unPayRes?.data || []
        const vipLevel = await app.getVipLevel()
        const vipAccount = await app.getVipAccount()

        this.setData({
            goodsList,
            unPayList,
            vipLevel,
            vipAccount,
            isRefreshing: false
        });
    },
    addGoods(e) {
        const data = e.currentTarget.dataset.index
        const id = data._id
        this._handleOrder(id, true)
    },
    reduceGoods(e) {
        const data = e.currentTarget.dataset.index
        const id = data._id
        this._handleOrder(id, false)
    },
    _handleOrder(goodsId, isAdd = true) {
        let total = 0
        let vipTotal = 0
        let totalNumber = 0
        let guoDiTypeNumber = 0
        let guoDiOldId = null
        // console.log("OOO", this.data.goodsList)
        let temp = this.data.goodsList.map((item) => {
            // console.log("AAA&&&", item.number)
            if (item._id == goodsId + "") {
                let number = item.number || 0
                // console.log("AAA0", number)
                if (isAdd) {
                    number++ //预先加一
                    if (item.classify[1] == '25e993b766ee364b0bfe23013c721a88') { //锅底只能点两种
                        if (guoDiOldId != item._id) {
                            guoDiTypeNumber++
                            guoDiOldId = item._id
                        }
                    }
                    console.log(guoDiTypeNumber)
                    if (guoDiTypeNumber > 2) {
                        wx.showToast({
                            title: '锅底只能点两种',
                            icon: 'error'
                        })
                        return item //不叠加数量
                    }
                    item.number = number
                    console.log(number)
                } else {
                    item.number = number > 0 ? number - 1 : number
                }
            } else {
                if (item.classify[1] == '25e993b766ee364b0bfe23013c721a88') { //锅底只能点两种
                    if (guoDiOldId != item._id) {
                        let number = item.number || 0
                        if (number > 0) {
                            guoDiTypeNumber++
                        }
                        guoDiOldId = item._id
                    }
                }
            }
            return item
        })

        let orderTemp = temp.filter((item) => {
            if (item.number > 0) {
                totalNumber += item.number
                total += item.number * item.price
                return true
            }
            return false
        })

        if (this.data.vipLevel) {
            vipTotal = total * this.data.vipLevel.rate / 100
        }
        this.setData({
            goodsList: temp,
            orderTotalPrice: total,
            orderTotalVipPrice: vipTotal,
            orderTotalNumber: totalNumber,
            orderList: orderTemp
        });
    },
    vipPay() {
        wx.showLoading({
            title: '正在支付...',
            mask: true
        })
        this.callPayForGoods(1)
    },
    wxPay() {
        wx.showLoading({
            title: '正在支付...',
            mask: true
        })

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
                        that.callPayForGoods(0)
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
    },
    callPayForGoods(payType) {
        let entity = oldOrder
        entity.payType = payType
        entity.remarks = '加菜'
        entity.tableSeatsId = this.data.tableSeatsId
        let total = 0;
        if (payType == 1) { //会员支付才有折扣
            total = this.data.orderTotalVipPrice
            entity.rate = this.data.vipLevel?.rate || 100
        } else {
            total = this.data.orderTotalPrice
        }
        entity.total = total
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
    //关闭弹窗
    closePopup() {
        this.setData({
            showOrder: false
        })
    },
    // 打开弹窗
    openPopup(e) {
        this.setData({
            showOrder: true
        })
    },
    async goToPay(e) {
        let goodsList = this.data.orderList
        if (goodsList.length > 0) {
            if (oldOrder) { //加菜,已支付
                oldOrder.addTimes = oldOrder.addTimes ? oldOrder.addTimes + 1 : 1
                goodsList = goodsList.map((item) => {
                    item.isAdd = true
                    item.addIndex = oldOrder.addTimes
                    return item
                })
                oldOrder.goodsList = oldOrder.goodsList.concat(goodsList);
                this.updateOrder(oldOrder)

            } else {
                const shopId = this.data.shop._id
                let dinersNumb = app.globalData.dinersNumb
                let addTimes = 0
                if (!dinersNumb) {
                    wx.showToast({
                        title: '请先确定用餐人数',
                        icon: "error"
                    })
                    return
                }
                this.updateOrder({
                    goodsList: this.data.orderList,
                    shopId,
                    dinersNumb,
                    addTimes,
                    // 下单成功，待支付
                    state: 0
                })
            }
        } else {
            wx.navigateTo({
                url: '/pages/pay-car/index',
                success: (result) => {
                    this.setData({});
                }
            })
        }
    },
    updateOrder(entity) {
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'updateOrder',
                entity,
            },
        }).then((res) => {
            if (res.result.success) {
                if (entity.state != 0) {
                    this.setData({
                        showAddOrder: true
                    })
                } else {
                    wx.navigateTo({
                        url: '/pages/pay-car/index',
                        success: (result) => {
                            this.setData({
                                showOrder: false,
                                orderTotalPrice: null,
                                orderTotalVipPrice: null,
                                orderTotalNumber: null,
                                orderList: []
                            });
                            oldOrder = null
                        }
                    })
                }
            } else {
                wx.showToast({
                    icon: 'error',
                    title: '下单失败！',
                })
            }
        })
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            MainCur: e.currentTarget.dataset.id,
            VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
        })
    },
    VerticalMain(e) {
        let that = this;
        let list = this.data.goodsTypeList;
        let tabHeight = 0;
        if (this.data.load) {
            for (let i = 0; i < list.length; i++) {
                let view = this.createSelectorQuery().select("#main-" + list[i].value);
                view.fields({
                    size: true
                }, data => {
                    list[i].top = tabHeight;
                    tabHeight = tabHeight + data.height;
                    list[i].bottom = tabHeight;
                }).exec();
            }
            that.setData({
                load: false,
                goodsTypeList: list
            })
        }
        let scrollTop = e.detail.scrollTop + 20;
        for (let i = 0; i < list.length; i++) {
            if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                that.setData({
                    VerticalNavTop: (list[i].value - 1) * 50,
                    TabCur: list[i].value
                })
                return false
            }
        }
    }

})