// pages/order/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    shopList: app.globalData.shopList,
    isLoading: false,
    shop: null,
    index: null,
    containerHeight: app.globalData.containerHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
      this.setData({
        shop: this.data.shopList[e.detail.value]
      })
      this.getOrderList();
    }
  },
  async initData() {
    const shop = wx.getStorageSync('shop')
    let indexShop = 0
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
    console.log(this.data.orderList)
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
    this.initData()
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

  }
})