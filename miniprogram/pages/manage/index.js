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
        //   events: {
        //     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        //     acceptDataFromOpenedPage: function (data) {
        //       console.log(data)
        //     },
        //     someEvent: function (data) {
        //       console.log(data)
        //     }
        //   },
        //   success: function (res) {
        //     // 通过eventChannel向被打开页面传送数据
        //     res.eventChannel.emit('acceptDataFromOpenerPage', {
        //       data: 'test'
        //     })
        //   }
      })
    },
  }
})