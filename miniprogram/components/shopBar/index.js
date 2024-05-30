const app = getApp();
Component({
    /**
     * 组件的一些选项
     */
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        cacheable: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        shop: null
    },
    attached() {
        this.initShopList()
    },
    /**
     * 组件的方法列表
     */
    methods: {
        async initShopList() {
            const shopList = app.globalData.shopList || await app.getShopList()
            let shop = app.globalData.shop
            let index = 0
            if (shop) {
                shopList.forEach((element, shopIndex) => {
                    if (shop._id == element._id) {
                        index = shopIndex
                    }
                });
            } else {
                shop = shopList[index]
                if (this.properties.cacheable) {
                    app.globalData.shop = shop
                }
            }
            this.setData({
                shop
            })
            this.triggerEvent('onShopChange', shop)
        },
        openMap() {
            wx.navigateTo({
                url: '/pages/map/index',
                events: {
                    callbackData: (shop) => {
                        const shopId = shop._id
                        if (shopId) {
                            if (this.properties.cacheable) {
                                app.globalData.shop = shop
                            }
                            this.setData({
                                shop
                            })
                            this.triggerEvent('onShopChange', shop)
                        }
                    },
                },
                success: (res) => {

                }
            })
        },
        /**
         * 切换店铺
         */
        bindPickerChange(e) {
            const index = e.detail.value
            const shop = this.data.shopList[index]
            const shopId = shop._id
            if (shopId) {
                this.setData({
                    index
                })
                if (this.properties.cacheable) {
                    app.globalData.shop = shop
                }
                this.triggerEvent('onShopChange', shop)
            }
        },
    }
})