// pages/manage/shop-edit/index.js
const app = getApp()
const db = wx.cloud.database({
  env: 'beer-1g75udik38f745cf'
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    latitude: '',
    longitude: '',
    location: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  openMap() {
    wx.navigateTo({
      url: '/pages/manage/shop-map/index',
    })
  },

  onUploadOk(e) {
    // console.log("SC", e);
    this.setData({
      imgList: e.detail
    })
  },

  formSubmit(e) {
    let {
      name,
      remarks
    } = e.detail.value
    const imgs = this.data.imgList
    if (!name) {
      wx.showToast({
        title: '店铺名称必填',
        icon: 'error'
      })
      return
    }
    if (!this.data.longitude || !this.data.latitude) {
      wx.showToast({
        title: '请选择店铺位置',
        icon: 'error'
      })
      return
    }
    if (imgs.length != 2) {
      wx.showToast({
        title: '需要两张店铺图片',
        icon: 'error'
      })
      return
    }
    db.collection('shop').add({
      data: {
        name,
        remarks,
        imgs: this.data.imgList,
        longitude: this.data.longitude, //经度
        latitude: this.data.latitude,
        isDelete: false
      },
      success: (res) => {
        this.finishAdd()
      }
    })
  },
  async finishAdd() {
    await app.getShopList();
    wx.navigateBack()
  },
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
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
    if (app.globalData.selectMap) {
      let {
        latitude,
        longitude
      } = app.globalData.selectMap
      this.setData({
        location: '[' + latitude + ']' + '[' + latitude + ']',
        latitude,
        longitude
      })
    }
    app.globalData.selectMap = null
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