// pages/pay-car/index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    order: null,
    shop: null,
    total: 0,
    vipTotal: 0,
    preferential: 0,
    containerHeight: app.globalData.containerHeightNoTabBar,
    showDialogPay: false,
    tablesList: null,
    dinersNumb: app.globalData.dinersNumb,
    tableSeatsId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const shop = await app.getShop()
    const vipLevel = await app.getVipLevel()
    const _openid = await app.getOpenid()
    const res = await db.collection('order').where({
      isDelete: false,
      _openid,
      shopId: shop._id,
      state: 0
    }).orderBy('createDate', 'desc').get()
    const orderList = res.data
    this.setData({
      shop,
      vipLevel,
      orderList,
    })
    this.getTablesList()
  },
  async getTablesList() {
    this.setData({
      isLoading: true
    });
    if (!this.data.shop) {
      this.setData({
        isLoading: false
      });
      return
    }
    const res = await db.collection('tableSeats').where({
      isDelete: false,
      shopId: this.data.shop._id
    }).get()
    const tablesList = res?.data || [];
    this.setData({
      isLoading: false,
      tablesList
    });
  },
  onSelectOrder(e) {
    console.log("onSelectOrder", e);
    const orderId = e.detail.value
    const orderList = this.data.orderList.filter((value) => {
      return orderId == value._id
    })
    let preferential = total - vipTotal
    let total = 0;
    let vipTotal = 0;
    const order = orderList[0]
    order.goodsList.forEach(elementg => {
      total += elementg.number * elementg.price
      // vipTotal += elementg.number * elementg.vipPrice
    });
    vipTotal = total * this.data.vipLevel.rate / 100
    preferential = total - vipTotal
    this.setData({
      order,
      total: total,
      vipTotal: vipTotal,
      preferential: preferential
    })
  },
  /**
   * 选桌
   * @param {*} e 
   */
  onTableSelecte(e) {
    // console.log(e);
    this.setData({
      tableSeatsId: e.detail.value
    })
  },
  /**
   * 用户支付
   */
  pay(e) {
    this.setData({
      showDialogPay: true
    })
  },

  closeDialogPay() {
    this.setData({
      showDialogPay: false
    })
  },
  async formSubmit(e) {
    // console.log(e);
    let typeSub = e.detail.target.dataset.type
    let remarks = e.detail.value.remarks
    let total = 0
    let payType = 1
    // const _openid = await app.getOpenid()
    if (typeSub == 'vipPay') {
      total = this.data.vipTotal
      payType = 1
    } else {
      total = this.data.total
      payType = 0
    }
    const tableSeatsId = this.data.tableSeatsId
    this.closeDialogPay()
    const that = this
    wx.showLoading({
      title: '正在支付...',
      mask: true
    })
    if (payType == 1) { //会员支付
      let entity = that.data.order
      entity.payType = payType
      entity.tableSeatsId = tableSeatsId //桌位
      entity.total = total
      entity.rate = this.data.vipLevel.rate
      entity.remarks = remarks
      entity.dinersNumb = that.data.dinersNumb //用餐人数
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'payForGoods',
          entity
        },
      }).then((res) => {
        wx.hideLoading()
        console.log("updateOrder", res);
        if (res.result.success) {
          app.globalData.PageCur = "order"
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '下单失败！',
          })
        }
      })
    } else { //普通支付
      wx.cloud.callFunction({
        name: 'wxpayFunctions',
        data: {
          type: 'wxpay_order',
        },
        success: (res) => {
          console.log('下单结果: ', res);
          const paymentData = res.result?.data;
          // 唤起微信支付组件，完成支付
          wx.requestPayment({
            timeStamp: paymentData?.timeStamp,
            nonceStr: paymentData?.nonceStr,
            package: paymentData?.packageVal,
            paySign: paymentData?.paySign,
            signType: 'RSA', // 该参数为固定值
            success(res) {
              // 支付成功回调，实现自定义的业务逻辑
              console.log('唤起支付组件成功：', res);
            },
            fail(err) {
              // 支付失败回调
              console.error('唤起支付组件失败：', err);
            },
            complete() {

            }
          });
        },
      });
    }

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