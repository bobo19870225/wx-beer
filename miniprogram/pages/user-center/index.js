// pages/me/index.js
const app = getApp()
const db = wx.cloud.database({
  env: 'beer-1g75udik38f745cf'
})
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    userInfo: {},
    vipUserInfo: null,
    _openid: null,
    vipLoading: true,
    money: 0,
    points: 0,
    containerHeight: app.globalData.containerHeight,
    showPayDialog: false,
    vips: [{
        value: [288, 88],
        name: '充值¥288,送88积分'
      },
      {
        value: [388, 188],
        name: '充值¥388,送188积分'
      },
      {
        value: [488, 288],
        name: '充值¥488,送288积分'
      },
      {
        value: [888, 888],
        name: '充值¥888,送888积分',
        checked: true
      },
    ],
    shopList: null,
    shop: null,
    index: null,
  },
  attached() {
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async initData() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                })
              }
            })
          }
        }
      })

      const shop = wx.getStorageSync('shop')
      let indexShop = 0
      this.setData({
        _openid: wx.getStorageSync('openid') || await app.getOpenid(),
        shopList: app.globalData.shopList || await app.initGlobalData()
      })
      this.data.shopList.forEach((element, index) => {
        if (shop._id == element._id) {
          indexShop = index
        }
      });
      this.setData({
        index: indexShop,
        shop
      })
      this.getVip()
    },
    /**
     * 切换店铺
     */
    bindPickerChange: function (e) {
      let id = this.data.shopList[e.detail.value]._id
      if (id) {
        this.setData({
          index: e.detail.value
        })
        wx.setStorage({
          key: "shop",
          data: this.data.shopList[e.detail.value]
        })
        this.setData({
          shop: this.data.shopList[e.detail.value]
        })
        this.getVip();
      }
    },
    async getVip() {
      this.setData({
        vipLoading: true
      })
      this.setData({
        vipUserInfo: null
      })
      db.collection('user').where({
        _openid: this.data._openid,
        shopId: this.data.shop._id,
      }).get().then((res) => {
        if (res.data && res.data.length > 0) {
          this.setData({
            vipUserInfo: res.data[0]
          })
        }
        this.setData({
          vipLoading: false
        })
      })
    },
    gotoApplicationPage() {
      wx.navigateTo({
        url: `/pages/application/index`,
      });
    },
    radioChange(e) {
      let data = e.detail.value.split(',')
      console.log('radio发生change事件，携带value值为：', data)
      this.setData({
        money: data[0],
        points: data[1]
      })
    },
    toBeVip() {
      this.setData({
        showPayDialog: true
      })
    },
    async payVip() {
      this.setData({
        isLoading: true
      })
      const shop = this.data.shop
      const balance = Number.parseInt(this.data.money)
      const points = Number.parseInt(this.data.points)
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'payForVip',
          shopId: shop._id,
          _openid: this.data._openid,
          name: this.data.userInfo.nickName,
          balance,
          points
        },
      });
      this.getVip()
      this.closePayDialog()
      this.setData({
        isLoading: false
      })
    },
    closePayDialog() {
      this.setData({
        showPayDialog: false
      })
    },
  },
});