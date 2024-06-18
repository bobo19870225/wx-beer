const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    tablesList: null,
    shop: null,
    showDialog: false,
    dialogData: {},
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
  onShopChange(e) {
    let shop = e.detail
    this.setData({
      shop
    })
    this.getTablesList();
  },

  async getTablesList() {
    this.setData({
      isLoading: true
    });
    if (!this.data.shop) {
      this.setData({
        isLoading: false
      });
      return
    }
    const res = await db.collection('tableSeats').where({
      isDelete: false,
      shopId: this.data.shop._id
    }).get()
    const tablesList = res?.data || [];
    this.setData({
      isLoading: false,
      tablesList
    });
  },
  deleteDishes(e) {
    this.setData({
      showDialog: true,
      dialogData: {
        id: e.currentTarget.dataset.id
      }
    })
  },
  async onDelete(e) {
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'deleteTableSeats',
        shopId: e.detail.id
      },
    });
    // console.log(res)
    if (res.result.errMsg == 'document.remove:ok') {
      this.getTablesList()
    }
  },
  changeState(e) {
    this.setData({
      isLoading: true
    });
    let data = e.currentTarget.dataset.tableseats
    const id = data._id
    delete data._id
    data.isIdle = e.detail.value
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateTableSeats',
        id,
        data
      },
    }).then((res) => {
      console.log(res);
      if (res.result.success) {

      }
      this.setData({
        isLoading: false
      });
    });
  },
  edit(e) {
    // console.log(e);
    wx.navigateTo({
      url: '/pages/manage/tables-edit/index',
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
    // wx.navigateTo({
    //     url: '/pages/manage/dishes-edit/index?id=' + e.detail.id,
    // })
  },
  addGoods() {
    wx.navigateTo({
      url: '/pages/manage/tables-edit/index',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          shop: this.data.shop
        })
      }
    })
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
    this.getTablesList();
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
})