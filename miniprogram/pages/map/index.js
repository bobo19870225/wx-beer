const app = getApp()
var keyWords = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    latitude: null,
    longitude: null,
    shopList: null,
    shop: null,
    markers: [],
    searchKey: '',
    containerHeight: app.globalData.containerHeightNoTabBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initShopList()
  },
  onMapLoaded(e) {

  },
  async onSearch(e) {
    if (!keyWords) {
      await this.resetShopList()
      return
    }
    this.setData({
      isLoading: true
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getShopListByKey',
        entity: {
          keyWords
        }
      },
    }).then((res) => {
      this.setData({
        shopList: res.result.list || [],
        isLoading: false
      })
    })
  },
  async resetShopList() {
    if (keyWords) {
      keyWords = ''
    }
    const shopList = await app.getShopList()
    this.setData({
      searchKey: '',
      shopList
    })
  },
  onInput(e) {
    keyWords = e.detail.value
  },
  /**
   * 初始化商店
   */
  async initShopList() {
    this.setData({
      isLoading: true
    })
    const shopList = await app.getShopList()
    let shop = app.globalData.shop
    let index = 0
    if (shop) {
      shopList.forEach((element, shopIndex) => {
        if (shop._id == element._id) {
          index = shopIndex
        }
      });
    } else {
      shop = shopList[index]
    }
    app.globalData.shop = shop
    this.setData({
      shopList,
      shop
    })
    await this.loadMarkers()
    this.setData({
      isLoading: false
    })
  },
  async loadMarkers() {
    const shopList = this.data.shopList
    let markersData = this.data.markers
    if (shopList) {
      shopList.forEach((value, index) => {
        let markers = {
          id: index,
          longitude: value.longitude,
          latitude: value.latitude,
          iconPath: '../../images/icons/shop-location.png',
          callout: {
            content: value.name,
            color: '#200e32',
            display: 'ALWAYS',
            padding: 6,
            borderRadius: 3
          },
          width: 30,
          height: 30,
        }
        markersData.push(markers)
      })
    }
    this.setData({
      markers: markersData
    });
    const shop = await app.getShop()
    const mapContext = wx.createMapContext('mapId', this)
    mapContext.moveToLocation({
      latitude: shop.latitude,
      longitude: shop.longitude,
      success: (res) => {
        console.log("moveToLocation", res);
      },
      fail: (e) => {
        console.log("moveToLocation", e);
      }
    })
  },

  onMapSelect(e) {
    const index = e.detail.markerId
    const shop = this.data.shopList[index]
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel && eventChannel.emit) {
      eventChannel.emit(
        /** 事件名称 */
        'callbackData',
        /** 事件参数 */
        shop
      )
    }
    wx.navigateBack()
  },
  onSelect(e) {
    const index = e.currentTarget.dataset.index
    const shop = this.data.shopList[index]
    this.setData({
      shop
    })
    const mapContext = wx.createMapContext('mapId', this)
    mapContext.moveToLocation({
      latitude: shop.latitude,
      longitude: shop.longitude,
      success: (res) => {
        console.log("moveToLocation", res);
      },
      fail: (e) => {
        console.log("moveToLocation", e);
      }
    })
  },
  onSure(e) {
    const shop = this.data.shop
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel && eventChannel.emit) {
      eventChannel.emit(
        /** 事件名称 */
        'callbackData',
        /** 事件参数 */
        shop
      )
    }
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

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

  }
})