// pages/manage/index.js
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isLoading: false,
    shopList: null,
    index: null,
    shop: null,
    containerHeight: app.globalData.containerHeight,
  },
  attached() {
    this.initData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
      // this.fetchGoodsList(shop._id)
    },
    goTopManageShop() {
      wx.navigateTo({
        url: '/pages/manage/shop/index',
      })
    },
    goTopManageDishes() {
        wx.navigateTo({
          url: '/pages/manage/dishes/index',
        })
      },
  }
})