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
    this.initGlobalData()
    console.log("APP_OnLaunch END")
  },
  async initGlobalData() {
    await this.getShopList()
    this.getUserInfoAll(true, 'app')
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
    return this.globalData._openid
  },
  /**
   * 获取全部店铺
   */
  async getShopList() {
    if (!this.globalData.shopList) {
      console.log("run getShopList");
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
   * 获取全量用户信息
   */
  async getUserInfoAll(forceupdates, callPage) {
    if (!forceupdates && this.globalData.userInfoAll) {
      return this.globalData.userInfoAll
    }
    console.log("app getUser", callPage);
    const shop = await this.getShop()
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getUser',
        entity: {
          shopId: shop._id
        }
      }
    })
    const userList = res.result.list
    let userInfo = null
    if (userList && userList.length > 0) {
      userInfo = userList[0]
    }
    let vipInfo = null
    if (userInfo && userInfo.vipList.length > 0) {
      vipInfo = userInfo.vipList[0]
    }
    const db = wx.cloud.database()
    const resVipPackage = await db.collection('vipPackage').where({
      isDelete: false,
    }).orderBy('price', 'asc').get()
    const vipPackageInfo = resVipPackage.data
    if (vipPackageInfo && vipInfo) {
      for (let index = 0; index < vipPackageInfo.length; index++) {
        const element = vipPackageInfo[index];
        const d = element.price - vipInfo.account.recharge
        if (d == 0) {
          vipInfo.vipLevel = element
          vipInfo.vipLevel.next = vipPackageInfo[index + 1].price - element.price || 0
          break
        }
        if (d > 0) {
          vipInfo.vipLevel = vipPackageInfo[index - 1] || vipPackageInfo[0]
          vipInfo.vipLevel.next = d
          break
        }
      }
      if (!vipInfo.vipLevel) { //已经超过最高级别
        vipInfo.vipLevel = vipPackageInfo[vipPackageInfo.length - 1]
        vipInfo.vipLevel.next = 0
      }
    }
    this.globalData.userInfoAll = {
      userInfo,
      vipInfo
    }
    return this.globalData.userInfoAll
  },

  /**
   * 获取vip级别信息
   */
  async getVipLevel(forceupdates) {
    console.log("APP getVipLevel", forceupdates);
    const userInfoAll = await this.getUserInfoAll(forceupdates)
    return userInfoAll.vipInfo?.vipLevel
  },
  /**
   * 获取vip账户信息
   */
  async getVipAccount(forceupdates) {
    console.log("APP getVipAccount");
    const userInfoAll = await this.getUserInfoAll(forceupdates)
    return userInfoAll.vipInfo?.account
  },
  /**
   * 获取当前店铺
   */
  async getShop() {
    let shop = this.globalData.shop
    if (!shop) {
      const shopList = await this.getShopList()
      shop = shopList.length > 0 ? shopList[0] : null
      this.globalData.shop = shop
    }
    return this.globalData.shop;
  },
});