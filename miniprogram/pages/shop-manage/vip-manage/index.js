const app = getApp()
const page = {
  pageNumber: 1,
  pageSize: 10
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isLoading: false,
    isLoadMore: false,
    isRefreshing: false,
    hasMore: true,
    containerHeight: app.globalData.containerHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      isLoading: true
    })
    await this.loadData()
    this.setData({
      isLoading: false
    })
  },
  loadMore(e) {},
  onShopChange(e) {

  },
  async loadData(e) {
    page.pageNumber = 1
    await this.getListData()
  },
  async getListData() {
    const shop = await app.getShop()
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getVip',
        entity: {
          shopIp: shop._id
        }
      }
    })
    this.setData({
      isRefreshing: false,
      list: res.result.list || []
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