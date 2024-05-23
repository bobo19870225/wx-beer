// pages/manage/shop/index.js
const app = getApp()
const db = wx.cloud.database({
  env: 'beer-1g75udik38f745cf'
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    shopList: null,
    index: null,
    shop: null,
    showDialog: false,
    dialogData: {},
    containerHeight: app.globalData.containerHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData();
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
    // this.fetchGoodsList(shop._id)
  },
  deleteShop(e) {
    this.setData({
      showDialog: true,
      dialogData: {
        shopId: e.currentTarget.dataset.shopid
      }
    })
  },
 async onDelete(e) {
    console.log(e);
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'deleteShop',
        shopId: e.detail.shopId
      },
    });
    console.log(res);
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

  },

})