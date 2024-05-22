const app = getApp()
Page({
    data: {
        orderTotalPrice: null,
        orderTotalVipPrice: null,
        orderTotalNumber: null,
        goodsList: [],
        orderList: [],
        shopList: null,
        showOrder: false,
        isLoading: false,
        index: null,
        containerHeight: app.globalData.containerHeight,
    },

    onLoad() {

    },
    onShow() {
        this.initData();
    },
    /**
     * 切换店铺
     */
    bindPickerChange: function (e) {
        let id = this.data.shopList[e.detail.value]._id
        if (id) {
            this.setData({
                index: e.detail.value
            })
            wx.setStorage({
                key: "shop",
                data: this.data.shopList[e.detail.value]
            })
            this.fetchGoodsList(id);
        }

    },

    async initData() {
        const shop = wx.getStorageSync('shop')
        let indexShop = 0
        const shopList = app.globalData.shopList || await app.initGlobalData()
        this.setData({
            shopList
        })
        if (shop) {
            this.data.shopList.forEach((element, index) => {
                if (shop._id == element._id) {
                    indexShop = index
                }
            });
        } else {
            indexShop = 0
            shop = this.data.shopList[indexShop]
        }

        this.setData({
            index: indexShop,
            shop
        })
        this.fetchGoodsList(shop._id)
    },

    async fetchGoodsList(shopId) {
        this.setData({
            isLoading: true
        });
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'fetchGoodsList',
                shopId
            },
        });
        const goodsList = res?.result?.data || [];
        this.setData({
            isLoading: false,
            goodsList
        });
    },

    addGoods(e) {
        let id = e.currentTarget.dataset.index
        this._handleOrder(id, true)
    },
    reduceGoods(e) {
        let id = e.currentTarget.dataset.index
        this._handleOrder(id, false)
    },
    _handleOrder(goodsId, isAdd = true) {
        let total = 0
        let vipTotal = 0
        let totalNumber = 0
        let temp = this.data.goodsList.map((item) => {
            // console.log(goodsId, item._id)
            if (item._id == goodsId + "") {
                let number = item.number
                if (isAdd) {
                    item.number = number ? number + 1 : 1
                } else {
                    item.number = number > 0 ? number - 1 : number
                }
            }
            return item
        })
        let orderTemp = temp.filter((item) => {
            if (item.number > 0) {
                totalNumber += item.number
                total += Math.round(item.number * item.price / 100)
                vipTotal += Math.round(item.number * item.vipPrice / 100)
                return true
            }
            return false
        })
        this.setData({
            goodsList: temp,
            orderTotalPrice: total,
            orderTotalVipPrice: vipTotal,
            orderTotalNumber: totalNumber,
            orderList: orderTemp
        });
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
    goToPay(e) {
        let goodsJ = JSON.stringify(this.data.orderList)
        wx.navigateTo({
            url: '/pages/pay-car/index?goods=' + goodsJ
        })
    }
})