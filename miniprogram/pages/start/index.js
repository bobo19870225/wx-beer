// pages/start/index.js
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
    shop: null
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
    containerHeight: app.globalData.containerHeight,
    step: 0,
    selecteIndex: 3
  },

  /**
   * 组件的方法列表
   */
  methods: {
    orderNow(e) {
      wx.navigateTo({
        url: '/pages/map/index',
        events: {
          callbackData: async (shop) => {
            const shopId = shop._id
            if (shopId) {
              this.setData({
                shop,
                step: 1
              })
              if (this.properties.cacheable) {
                app.globalData.shop = shop
                await app.getUserInfoAll(true, 'start') //强制更新用户信息
              }
              console.log("RRR", this.data.step);
            }
          },
        },
        success: (res) => {

        }
      })
    },
    onSelecte(e) {
      this.setData({
        selecteIndex: e.currentTarget.dataset.value
      })
    },
    gotoGoodsPage(e) {
      let that = this
      wx.navigateTo({
        url: '/pages/home/index',
        success(result) {
          app.globalData.dinersNumb = that.data.selecteIndex
          console.log(app.globalData.dinersNumb);
        }
      })
    },
  }
})