// pages/start/index.js
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
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
    containerHeight: app.globalData.containerHeight,
    step: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    orderNow(e) {
      wx.navigateTo({
        url: '/pages/map/index',
        success: (res) => {
          this.setData({
            step: 1
          })
        }
      })
    }
  }
})