const app = getApp()
const db = wx.cloud.database({
  env: 'beer-1g75udik38f745cf'
})
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  data: {
    orderTotalPrice: null,
    orderTotalVipPrice: null,
    orderTotalNumber: null,
    goodsList: [],
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
    shop: null
  },

  attached() {
    console.log("home", "attached")
    this.getGoodsTypeList()
  },
  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getGoodsTypeList() {
      this.setData({
        isLoading: true
      })
      db.collection('goodsType').where({
        isDelete: false
      }).orderBy('value', 'asc').get().then((res) => {
        if (res.data) {
          res.data.unshift({
            title: '人气Top5',
            value: 0
          })
          this.setData({
            isLoading: false,
            goodsTypeList: res.data
          })
        }
      })
    },
    /**
     * 切换店铺
     */
    onShopChange(e) {
      let shop = e.detail
      this.setData({
        shop,
        goodsList: []
      })
      this.fetchGoodsList();
    },
    async fetchGoodsList() {
      const shopId = this.data.shop._id
      this.setData({
        isRefreshing: true
      });
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'fetchGoodsList',
          shopId
        },
      });
      const goodsList = res?.result?.data || [];
      this.setData({
        // isLoading: false,
        isRefreshing: false,
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
          vipTotal += item.number * item.vipPrice
          return true
        }
        return false
      })
      // Math.round(）
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
    goToPay(e) {
      let goodsJ = JSON.stringify(this.data.orderList)
      wx.navigateTo({
        url: '/pages/pay-car/index?goods=' + goodsJ
      })
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
  },
})