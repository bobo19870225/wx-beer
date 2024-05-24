const app = getApp()
Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    data: {
        orderTotalPrice: null,
        orderTotalVipPrice: null,
        orderTotalNumber: null,
        goodsList: [],
        orderList: [],
        showOrder: false,
        isLoading: false,
        containerHeight: app.globalData.containerHeight,
    },

    attached() {
        console.log("home", "attached")
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
            this.fetchGoodsList(shop._id);
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
    },
})