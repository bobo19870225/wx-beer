const app = getApp()
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    TablesList: [],
    id: null,
    shop: null,
    tableSeats: null,
    isLoading: false,
    eventChannel: null,
    index: [0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      isLoading: true
    })
    this.setData({
      eventChannel: this.getOpenerEventChannel()
    })
    const eventChannel = this.data.eventChannel
    eventChannel && eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', (data) => {
      let {
        id,
        shop
      } = data
      this.setData({
        id,
        shop
      })
      if (id) {
        this.getTableSeats(id)
      }
    })
  },

  bindPickerChange(e) {
    const index = e.detail.value
    this.setData({
      index
    })
  },
  getTableSeats(id) {
    db.collection('tableSeats').doc(id).get().then((res) => {
      this.setData({
        tableSeats: res.data,
        isLoading: false,
        imgList: [res.data.img]
      })
    })
  },
  onUploadOk(e) {
    // console.log("SC", e);
    this.setData({
      imgList: e.detail
    })
  },

  formSubmit(e) {
    console.log(e);
    let {
      name,
      guiGe,
      remarks,
    } = e.detail.value
    let img = this.data.imgList[0]
    const shopId = this.data.shop._id
    if (!name) {
      wx.showToast({
        name: '名称必填',
        icon: 'error'
      })
      return
    }
    if (!guiGe) {
      wx.showToast({
        title: '规格必填',
        icon: 'error'
      })
      return
    }
    guiGe = Number.parseInt(guiGe)
    if (!img) {
      wx.showToast({
        title: '请上传一张桌位图片',
        icon: 'error'
      })
      return
    }
    if (!shopId) {
      wx.showToast({
        title: '无店铺',
        icon: 'error'
      })
      return
    }

    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateTableSeats',
        id: this.data.id,
        data: {
          name,
          guiGe,
          remarks,
          shopId,
          img,
          isDelete: false,
          isIdle: true
        }
      },
    }).then((res) => {
      console.log(res);
      if (res.result.success) {
        wx.navigateBack()
      }
    });
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