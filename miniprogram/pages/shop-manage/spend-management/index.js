// pages/shop-manage/spend-management/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerHeight: app.globalData.containerHeight,
    isLoading: false,
    showDialogAdd: false,
    listSpend: [],
    price: null,
    money: null,
    number: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  numberInput(e) {
    const number = Number.parseInt(e.detail.value);
    if (typeof number === 'number') {
      const price = this.data.price
      this.setData({
        number
      })
      if (number && price) {
        this.setData({
          money: number * price
        })
        return
      }
    }
    this.setData({
      money: null
    })
  },
  priceInput(e) {
    const price = Number.parseInt(e.detail.value);
    if (typeof price === 'number') {
      const number = this.data.number
      this.setData({
        price
      })
      if (number && price) {
        this.setData({
          money: number * price
        })
        return
      }
    }
    this.setData({
      money: null
    })
  },
  moneyInput(e) {
    const money = Number.parseInt(e.detail.value);
    if (typeof money === 'number') {
      const number = this.data.number
      this.setData({
        money
      })
      if (money && number) {
        this.setData({
          price: (money / number).toFixed(2)
        })
        return
      }
    }
    this.setData({
      price: null
    })
  },
  removeItem(e) {
    // console.log(e);
    const item = e.currentTarget.dataset.item
    console.log(item);
    let listSpend = this.data.listSpend
    const index = arr.indexOf(item);
    if (index !== -1) {
      listSpend.splice(index, 1);
    }
    // listSpend = listSpend.slice(listSpend.indexOf(item), 1)
    console.log(listSpend);
    this.setData({
      listSpend
    })

  },
  formSubmit(e) {
    const value = e.detail.value
    console.log(value);
    if (!value.name) {
      wx.showToast({
        title: '请填写支出项',
        icon: 'error'
      })
      return
    }
    if (!value.number) {
      wx.showToast({
        title: '请填写数量',
        icon: 'error'
      })
      return
    }
    if (!value.price) {
      wx.showToast({
        title: '请填写单价',
        icon: 'error'
      })
      return
    }
    if (!value.money) {
      wx.showToast({
        title: '请填写金额',
        icon: 'error'
      })
      return
    }
    const listSpend = this.data.listSpend
    listSpend.push(e.detail.value)
    this.setData({
      listSpend,
      showDialogAdd: false
    })
  },
  formReset(e) {
    this.setData({
      showDialogAdd: false
    })
  },
  submit(e) {

  },
  showAddDialog(e) {
    console.log(e);
    this.setData({
      showDialogAdd: true
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