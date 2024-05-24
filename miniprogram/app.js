// app.js
App({
  onLaunch: function () {
    console.log("APP_OnLaunch")
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'beer-1g75udik38f745cf',
        traceUser: true,
      });
    }
    this.globalData = {};
    this.initUI()
  },
  async initGlobalData() {
     await getShopList()
  },
  /**
   * 获取全部店铺
   */
  async getShopList() {
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getShopList'
      },
    });
    this.globalData.shopList = res?.result?.data || []
    return this.globalData.shopList;
  },
  initUI() {
    const windowInfo = wx.getWindowInfo()
    console.log("APP", windowInfo)
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
  getOpenid: async function () {
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId',
      },
    }).then((resp) => {
      wx.setStorageSync('openid', resp.result.openid)
    }).catch((e) => {
      console.log("APP", e)
    });
  },
});