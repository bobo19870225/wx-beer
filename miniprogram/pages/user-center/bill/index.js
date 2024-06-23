const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    isRefreshing: false,
    billList: [],
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
  gotoDetail(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/user-center/bill/detail',
      success: (res) => {
        res.eventChannel.emit('bill', e.currentTarget.dataset.item)
      }
    })
  },
  /**
   * 加载账单
   */
  async loadData() {
    const _openid = await app.getOpenid()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getBillList',
        entity: {
          _openid
        }
      }
    }).then((res) => {
      this.setData({
        isRefreshing: false
      })
      if (res.result.success) {
        this.setData({
          billList: res.result.data
        })
      }
    })
  },
  loadMore(e) {
    console.log("loadMore", e);
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