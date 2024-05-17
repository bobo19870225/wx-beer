Page({
  data: {
    orderTotalPrice: null,
    orderTotalNumber: null,
    goodsList: [],
    orderList: [],
    showOrder: false,
    isLoading: false
  },

  onLoad() {
    this.fetchGoodsList();
  },

  async fetchGoodsList() {
    this.setData({
      isLoading: true
    });
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'fetchGoodsList'
      },
    });
    const goodsList = res?.result?.data || [];
    this.setData({
      isLoading: false,
      goodsList
    });
  },

  addGoods(e) {
    let id = e.currentTarget.dataset.index
    this._handleOrder(id, true)
  },
  reduceGoods(e) {
    let id = e.currentTarget.dataset.index
    this._handleOrder(id, false)
  },
  _handleOrder(goodsId, isAdd = true) {
    let total = 0
    let totalNumber = 0
    let temp = this.data.goodsList.map((item) => {
      // console.log(goodsId, item._id)
      if (item._id == goodsId + "") {
        let number = item.number
        if (isAdd) {
          item.number = number ? number + 1 : 1
        } else {
          item.number = number > 0 ? number - 1 : number
        }
      }
      return item
    })
    let orderTemp = temp.filter((item) => {
      if (item.number > 0) {
        totalNumber += item.number
        total += item.number * item.price / 100
        return true
      }
      return false
    })
    this.setData({
      goodsList: temp,
      orderTotalPrice: total,
      orderTotalNumber: totalNumber,
      orderList: orderTemp
    });
  },
  //关闭弹窗
  closePopup() {
    this.setData({
      showOrder: false
    })
  },
  // 打开弹窗
  openPopup(e) {
    this.setData({
      showOrder: true
    })
  },
})