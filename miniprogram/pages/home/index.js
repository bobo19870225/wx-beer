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
    vipAccount: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const shop = await app.getShop()
    // console.log("TT", shop);
    this.setData({
      isLoading: true,
      shop
    })
    await this.getGoodsTypeList()
    await this.fetchGoodsList();
    // console.log(this.data.goodsTypeList);
    this.setData({
      isLoading: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    // this.fetchGoodsList();
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
    let id = e.currentTarget.dataset.index
    this._handleOrder(id, true)
  },
  reduceGoods(e) {
    let id = e.currentTarget.dataset.index
    this._handleOrder(id, false)
  },
  _handleOrder(goodsId, isAdd = true) {
    let total = 0
    let vipTotal = 0
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
        total += item.number * item.price
        return true
      }
      return false
    })
    vipTotal = total * this.data.vipLevel.rate / 100
    this.setData({
      goodsList: temp,
      orderTotalPrice: total / 100,
      orderTotalVipPrice: vipTotal / 100,
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
      var _openid = await app.getOpenid()
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'updateOrder',
          entity: {
            _openid,
            createDate: new Date(),
            isDelete: false,
            goodsList: this.data.orderList,
            shopId,
            // 下单成功，待支付
            state: 0
          },
        },
      }).then((res) => {
        //   console.log(res);
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
    // console.log(e.currentTarget.dataset.id);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    // console.log(e);
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