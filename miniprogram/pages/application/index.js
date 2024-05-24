// pages/application/index.js
const app = getApp()
const db = wx.cloud.database({
  env: 'beer-1g75udik38f745cf'
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    _openid: null,
    isLoading: false,
    shopList: null,
    imgList: [],
    index: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initData()
  },
  async initData() {
    const shop = wx.getStorageSync('shop')
    let indexShop = 0
    this.setData({
      shopList: app.globalData.shopList || await app.initGlobalData()
    })
    this.data.shopList.forEach((element, index) => {
      if (shop._id == element._id) {
        indexShop = index
      }
    });
    var _openid = wx.getStorageSync('openid') || await app.getOpenid()
    this.setData({
      _openid,
      index: indexShop,
      shop
    })
  },


  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  onUploadOk(e) {
    console.log("SC", e);
    this.setData({
      imgList: e.detail
    })
  },
  formSubmit(e) {
    const phone = e.detail.value.phone
    const remarks = e.detail.value.remarks
    const shopId = this.data.shopList[e.detail.value.shopIndex]._id
    const imgs = this.data.imgList
    if (!phone) {
      wx.showToast({
        title: '手机号必填',
        icon: 'error'
      })
      return
    }
    if (!shopId) {
      wx.showToast({
        title: '店铺必填',
        icon: 'error'
      })
      return
    }
    if (imgs.length != 2) {
      wx.showToast({
        title: '需要两张身份证图片',
        icon: 'error'
      })
      return
    }
    console.log('提交携带数据为：', e.detail.value)
    this.setData({
      isLoading: true
    })
    db.collection('task').add({
      data: {
        type: 1,
        phone,
        shopId,
        imgs,
        remarks: remarks ? remarks : "无"
      },
      success: (res) => {
        wx.navigateBack()
      },
      complete: (res) => {
        this.setData({
          isLoading: false
        })
      }
    })
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