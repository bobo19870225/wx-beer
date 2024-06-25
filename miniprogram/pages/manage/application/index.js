const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    list: null,
    shop: null,
    showDialog: false,
    dialogData: {},
    isRefreshing: false,
    containerHeight: app.globalData.containerHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 切换店铺
   */
  async onShopChange(e) {
    console.log(e);
    let shop = e.detail
    this.setData({
      shop,
      isLoading: true
    })
    await this.getApplicationList();
    this.setData({
      isLoading: false
    })
  },

  async getApplicationList() {
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getApplication',
        where: {
          shopId: this.data.shop._id,
          // state: 0 
        }
      },
    });
    // console.log(res);
    const list = res?.result?.data || [];
    this.setData({
      list,
      isRefreshing: false
    });
  },
  /**
   * 审核通过
   * @param {*} e 
   */
  async applicationPass(e) {
    const task = e.currentTarget.dataset.item
    // console.log(task);
    this.setData({
      isLoading: true,
    });
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateShopManager',
        entity: task
      }
    })
    if (res.result.success) {
      await this.getApplicationList()
    }
    this.setData({
      isLoading: false,
    });
  },
  edit(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/manage/dishes-edit/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          id: e.currentTarget.dataset.id,
          shop: this.data.shop
        })
      }
    })
  },
  /**
   * 驳回
   */
  async applicationDispass() {
    const task = e.currentTarget.dataset.item
    // console.log(task);
    this.setData({
      isLoading: true,
    });
    task.state = 2 //驳回
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateTask',
        entity: task
      }
    })
    if (res.result.success) {
      await this.getApplicationList()
    }
    this.setData({
      isLoading: false,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

})