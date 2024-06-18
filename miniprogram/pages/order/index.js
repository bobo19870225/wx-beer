const app = getApp()
const db = wx.cloud.database()
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    shop: null,
    orderList: [],
    isLoading: false,
    isRefreshing: false,
    containerHeight: app.globalData.containerHeight,
    vipLevel: null
  },
  attached() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换店铺
     */
    async onShopChange(e) {
      const vipLevel = await app.getVipLevel()
      console.log(vipLevel);
      let shop = e.detail
      this.setData({
        vipLevel,
        shop
      })
      this.setData({
        isLoading: true
      });
      await this.getOrderList();
      this.setData({
        isLoading: false
      });
    },
    gotoPayCar(e) {
      wx.navigateTo({
        url: '/pages/pay-car/index',
      })
    },
    async getOrderList() {
      const shopId = this.data.shop._id
      this.setData({
        isRefreshing: true
      });
      var _openid = await app.getOpenid()
      // const _ = db.command
      const res = await db.collection("order").where({
        isDelete: false,
        _openid,
        shopId,
      }).orderBy('createDate', 'desc').get()
      const orderList = res?.data || [];
      console.log(res);
      this.setData({
        isRefreshing: false,
        orderList
      })
    },
    loadMore(e) {
      console.log(e);
    }
  },
})