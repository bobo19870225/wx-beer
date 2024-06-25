const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    applicationList: [],
    containerHeight: app.globalData.containerHeight,
    isLoadMore: false,
    isRefreshing: false,
    hasMore: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  async loadData() {
    this.setData({
      isLoading: true
    })
    await this.getApplication()
    this.setData({
      isLoading: false,
    })
  },
  loadMoreData() {

  },
  gotoEdit(e) {
    wx.navigateTo({
      url: '/pages/application/edit',
    })
  },
  async getApplication() {
    const shop = await app.getShop()
    const res = await db.collection("task").where({
      shopId: shop._id,
    }).get()
    console.log(res);
    this.setData({
      applicationList: res.data || []
    })
    this.setData({
      hasMore: orderList.length == page.pageSize,
      isRefreshing: false
    })
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
    this.loadData()
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