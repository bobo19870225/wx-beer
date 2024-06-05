// app.js
App({
  onLaunch: function () {
    console.log("APP_OnLaunch")
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'beer-1g75udik38f745cf',
        traceUser: true,
      });
    }
    this.globalData = {};
    this.initUI()
    console.log("APP_OnLaunch END")
  },

  initUI() {
    const windowInfo = wx.getWindowInfo()
    // px转换到rpx的比例
    let pxToRpxScale = 750 / windowInfo.windowWidth;
    this.globalData.StatusBar = windowInfo.statusBarHeight * pxToRpxScale;
    let capsule = wx.getMenuButtonBoundingClientRect();
    if (capsule) {
      this.globalData.Custom = capsule;
      this.globalData.CustomBar = (capsule.bottom + capsule.top - windowInfo.statusBarHeight) * pxToRpxScale;
    } else {
      this.globalData.CustomBar = (windowInfo.statusBarHeight + 50) * pxToRpxScale;
    }
    this.globalData.containerHeight = windowInfo.windowHeight * pxToRpxScale - this.globalData.CustomBar - 50 * pxToRpxScale;
    this.globalData.containerHeightNoTabBar = windowInfo.windowHeight * pxToRpxScale - this.globalData.CustomBar
  },
  /**
   * 获取_openid
   */
  getOpenid: async function () {
    if (!this.globalData._openid) {
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOpenId',
        },
      })
      this.globalData._openid = res.result.openid
    }
    // console.log("getOpenid", this.globalData._openid);
    return this.globalData._openid
  },
  /**
   * 获取全部店铺
   */
  async getShopList() {
    if (!this.globalData.shopList) {
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getShopList'
        },
      });
      this.globalData.shopList = res?.result?.data || []
    }
    return this.globalData.shopList;
  },
  /**
   * 获取当前店铺
   */
  // async getShop() {
  //   let shop = this.globalData.shop
  //   if (!shop) {
  //     const shopList = await this.getShopList()
  //     shop = shopList.length > 0 ? shopList[0] : null
  //     this.getShopList.shop = shop
  //   }
  //   return this.globalData.shop;
  // },
});