// pages/order/index.js
const app = getApp()
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    isLoading: false,
    shopList: null,
    shop: null,
    index: null,
    containerHeight: app.globalData.containerHeight,
  },
  attached() {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
        this.setData({
          shop: this.data.shopList[e.detail.value]
        })
        this.getOrderList();
      }
    },
    async initData() {
      const shop = wx.getStorageSync('shop')
      let indexShop = 0
      this.setData({
        shopList: app.globalData.shopList || await app.getShopList()
      })
      this.data.shopList.forEach((element, index) => {
        if (shop._id == element._id) {
          indexShop = index
        }
      });
      this.setData({
        index: indexShop,
        shop
      })
      this.getOrderList()
    },

    async getOrderList() {
      this.setData({
        isLoading: true
      });
      var _openid = wx.getStorageSync('openid') || await app.getOpenid()
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOrderList',
          shopId: this.data.shop._id,
          _openid
        },
      });
      const orderList = res?.result?.data || [];
      this.setData({
        isLoading: false,
        orderList
      });
    },
  },

})