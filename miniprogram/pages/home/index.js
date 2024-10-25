const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderTotalPrice: null,
    orderTotalVipPrice: null,
    orderTotalNumber: null,
    goodsList: [],
    unPayList: [],
    orderList: [],
    showOrder: false,
    isLoading: false,
    isRefreshing: false,
    containerHeight: app.globalData.containerHeight,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    goodsTypeList: null,
    load: true,
    shop: null,
    vipLevel: null,
    vipAccount: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const shop = await app.getShop()
    this.setData({
      isLoading: true,
      shop
    })
    await this.getGoodsTypeList()
    await this.fetchGoodsList();
    this.setData({
      isLoading: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  async getGoodsTypeList() {
    const res = await db.collection('goodsType').where({
      isDelete: false
    }).orderBy('value', 'asc').get()
    if (res.data) {
      res.data.unshift({
        title: '人气Top5',
        value: 0
      })
      this.setData({
        goodsTypeList: res.data
      })
    }
  },
  /**
   * 切换店铺
   */
  onShopChange(e) {
    console.log("onShopChange", e);
    let shop = e.detail
    this.setData({
      shop
    })
  },
  async fetchGoodsList() {
    this.setData({
      isRefreshing: true
    })
    const shopId = this.data.shop._id
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'fetchGoodsList',
        shopId
      },
    });
    const goodsList = res?.result?.data || [];
    const _openid = await app.getOpenid()
    const unPayRes = await db.collection('order').where({
      isDelete: false,
      _openid,
      shopId,
      state: 0 //未付款的
    }).get()
    const unPayList = unPayRes?.data || []
    const vipLevel = await app.getVipLevel()
    const vipAccount = await app.getVipAccount()

    this.setData({
      goodsList,
      unPayList,
      vipLevel,
      vipAccount,
      isRefreshing: false
    });
  },
  addGoods(e) {
    const data = e.currentTarget.dataset.index
    const id = data._id
    this._handleOrder(id, true)
  },
  reduceGoods(e) {
    const data = e.currentTarget.dataset.index
    const id = data._id
    this._handleOrder(id, false)
  },
  _handleOrder(goodsId, isAdd = true) {
    let total = 0
    let vipTotal = 0
    let totalNumber = 0
    let guoDiTypeNumber = 0
    let guoDiOldId = null
    // console.log("OOO", this.data.goodsList)
    let temp = this.data.goodsList.map((item) => {
      // console.log("AAA&&&", item.number)
      if (item._id == goodsId + "") {
        let number = item.number || 0
        // console.log("AAA0", number)
        if (isAdd) {
          number++ //预先加一
          if (item.classify[1] == '25e993b766ee364b0bfe23013c721a88') { //锅底只能点两种
            if (guoDiOldId != item._id) {
              guoDiTypeNumber++
              guoDiOldId = item._id
            }
          }
          console.log(guoDiTypeNumber)
          if (guoDiTypeNumber > 2) {
            wx.showToast({
              title: '锅底只能点两种',
              icon: 'error'
            })
            return item //不叠加数量
          }
          item.number = number
          console.log(number)
        } else {
          item.number = number > 0 ? number - 1 : number
        }
      } else {
        if (item.classify[1] == '25e993b766ee364b0bfe23013c721a88') { //锅底只能点两种
          if (guoDiOldId != item._id) {
            let number = item.number || 0
            if (number > 0) {
              guoDiTypeNumber++
            }
            guoDiOldId = item._id
          }
        }
      }
      return item
    })

    let orderTemp = temp.filter((item) => {
      if (item.number > 0) {
        totalNumber += item.number
        total += item.number * item.price
        return true
      }
      return false
    })
    if (this.data.vipLevel) {
      vipTotal = total * this.data.vipLevel.rate / 100
    }
    this.setData({
      goodsList: temp,
      orderTotalPrice: total,
      orderTotalVipPrice: vipTotal,
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
  async goToPay(e) {
    if (this.data.orderList.length > 0) {
      const shopId = this.data.shop._id
      const dinersNumb = app.globalData.dinersNumb
      console.log("SS", dinersNumb);
      if (!dinersNumb) {
        wx.showToast({
          title: '请先确定用餐人数',
          icon: "error"
        })
        return
      }
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'updateOrder',
          entity: {
            goodsList: this.data.orderList,
            shopId,
            dinersNumb,
            // 下单成功，待支付
            state: 0
          },
        },
      }).then((res) => {
        if (res.result.success) {
          wx.navigateTo({
            url: '/pages/pay-car/index',
            success: (result) => {
              this.setData({
                showOrder: false,
                orderTotalPrice: null,
                orderTotalVipPrice: null,
                orderTotalNumber: null,
                orderList: []
              });
            }
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: '下单失败！',
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/pay-car/index',
        success: (result) => {
          this.setData({});
        }
      })
    }
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.goodsTypeList;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = this.createSelectorQuery().select("#main-" + list[i].value);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        goodsTypeList: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].value - 1) * 50,
          TabCur: list[i].value
        })
        return false
      }
    }
  }

})