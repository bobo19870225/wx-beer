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
    orderList: [],
    isLoading: false,
    isRefreshing: false,
    shop: null,
    containerHeight: app.globalData.containerHeight,
  },
  attached() {
    // this.watchOrder()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换店铺
     */
    async onShopChange(e) {
      let shop = e.detail
      this.setData({
        shop
      })
      this.setData({
        isLoading: true
      });
      this.watchOrder()
      await this.getOrderList();
      this.setData({
        isLoading: false
      });
    },
    watchOrder() {
      let that = this
      db.collection('order').where({
          shopId: this.data.shop._id,
          state: 1
        })
        .watch({
          onChange: (res) => {
            console.log("onChange", res);
            //监控数据发生变化时触发
            if (res.docChanges != null) {
              for (const changeData of res.docChanges) {
                if (changeData.dataType == "add") {
                  console.log("watch", changeData);
                  that.getOrderList()
                }
                if (changeData.dataType == "remove") {
                  console.log("remove");
                }
              }
            }
          },
          onError: (err) => {
            console.error(err)
          }
        })
    },

    async getOrderList() {
      const res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOrderList',
          entity: {
            shopId: this.data.shop._id,
            state: 1
          }
        },
      });

      const orderList = res?.result?.list || [];
      // console.log(orderList);
      this.setData({
        isRefreshing: false,
        orderList
      });
    },
    setOrderFinish(e) {
      const data = e.currentTarget.dataset.data
      console.log(data);
      data.state = 2
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'updateOrder',
          entity: data
        },
      }).then((res) => {
        if (res.result.success) {
          wx.showToast({
            title: '设置成功',
          })
          this.getOrderList()
        } else {
          console.log(res);
        }
      })
    }
  },

})