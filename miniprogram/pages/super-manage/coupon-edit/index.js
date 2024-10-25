const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    types: [{
        value: 1,
        name: '会员券',
        checked: 'true'
      },
      {
        value: 2,
        name: '活动券',
        disabled: true
      },
      // {
      //   value: 3,
      //   name: '商品免费',
      //   disable:true
      // },
    ],
    coupon: {

    },
    type: null,
    isLoading: false,
  },
  radioChange(e) {
    console.log(e);
    this.setData({
      type: e.detail.value
    })
  },
  bindStartDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let coupon = this.data.coupon
    coupon.startDate = e.detail.value
    this.setData({
      coupon
    })
  },
  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let coupon = this.data.coupon
    coupon.endDate = e.detail.value
    this.setData({
      coupon
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的  
    let day = String(now.getDate()).padStart(2, '0');
    // let hours = String(now.getHours()).padStart(2, '0');  
    // let minutes = String(now.getMinutes()).padStart(2, '0');  
    // let seconds = String(now.getSeconds()).padStart(2, '0');  
    // ${hours}:${minutes}:${seconds}
    let nowStr = `${year}-${month}-${day}`;
    this.setData({
      startDate: nowStr,
    })
    let eventChannel = this.getOpenerEventChannel()
    eventChannel && eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', (data) => {
      let {
        id
      } = data
      this.setData({
        id
      })
      if (id) {
        this.getCoupon(id)
      }
    })
  },
  getCoupon(id) {
    db.collection("coupon").where({
      _id: id,
      isDelete: false
    }).get().then((res) => {
      const coupon = res.data[0]
      console.log(coupon)
      if (coupon && coupon.type) {
        this.setData({
          coupon,
          type: coupon.type,
        })
      }
      this.setData({
        isLoading: false,
      })
    })
  },
  async formSubmit(e) {
    console.log(e)
    const detailValue = e.detail.value
    const name = detailValue.name
    const value = parseFloat(detailValue.value)
    const usePrice = parseFloat(detailValue.usePrice)
    const type = parseInt(detailValue.type)
    const remarks = detailValue.remarks
    console.log(value, usePrice, type)
    if (!name) {
      wx.showToast({
        title: '请输入名称',
        icon: "error"
      })
      return
    }
    if (!type) {
      wx.showToast({
        title: '请选择类型',
        icon: "error"
      })
      return
    }
    if (!value) {
      wx.showToast({
        title: '请输入价值',
        icon: "error"
      })
      return
    }
    if (!usePrice) {
      wx.showToast({
        title: '请输入起始金额',
        icon: "error"
      })
      return
    }
    if (usePrice < value) {
      wx.showToast({
        title: '起始小于价值',
        icon: "error"
      })
      return
    }
    if (!remarks) {
      wx.showToast({
        title: '请输入备注',
        icon: "error"
      })
      return
    }
    let coupon = this.data.coupon
    coupon.name = name
    coupon.type = type
    coupon.value = value
    coupon.usePrice = usePrice
    coupon.remarks = remarks
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateCoupon',
        entity: coupon,
      }
    });
    console.log(res)
    if (res.result.rusult) {
      wx.navigateBack()
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

  }
})