const app = getApp()
const db = wx.cloud.database()
const page = {
  pageNumber: 1,
  pageSize: 10
}
var shop = null
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    isLoading: false,
    isLoadMore: false,
    isRefreshing: false,
    hasMore: true,
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
      shop = e.detail
      this.setData({
        vipLevel,
        isLoading: true
      })

      await this.loadData();
      this.setData({
        isLoading: false
      });
    },
    gotoPayCar(e) {
      wx.navigateTo({
        url: '/pages/pay-car/index',
      })
    },
    /**
     * 分页获取订单
     */
    async getOrderList() {
      const shopId = shop._id
      const _openid = await app.getOpenid()
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOrderList',
          entity: {
            shopId,
            _openid
          },
          page
        },
      });
      const orderList = res.result.list || [];
      if (page.pageNumber == 1) {
        this.setData({
          orderList
        })
      } else {
        let orderListTemp = this.data.orderList
        orderListTemp = orderListTemp.concat(orderList);
        this.setData({
          orderList: orderListTemp
        })
      }
      this.setData({
        hasMore: orderList.length == page.pageSize,
        isRefreshing: false
      })
    },
    async loadData(e) {
      page.pageNumber = 1
      await this.getOrderList()
    },
    async loadMoreData(e) {
      if (this.data.isLoadMore || !this.data.hasMore) {
        return
      }
      page.pageNumber++
      this.setData({
        isLoadMore: true
      });
      await this.getOrderList()
      this.setData({
        isLoadMore: false
      })
    }
  },
})