const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    cacheable: {
      type: Boolean,
      value: true
    },
    selectable: {
      type: Boolean,
      value: true
    },
    isShopManage: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    shop: null,
    selectable: null,
    isShopManage: false,
    shopList: [],
    index: 0
  },
  attached() {
    this.initShopList()
    this.setData({
      selectableUi: this.properties.selectable,
      isShopManageUi: this.properties.isShopManage
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async initShopList() {
      let shopList = await app.getShopList()
      let userInfoAll = null
      if (this.properties.isShopManage) {
        userInfoAll = await app.getUserInfoAll()
        const userInfo = userInfoAll.userInfo
        console.log(userInfoAll);
        if (!userInfo.isSuperManage) {
          shopList = shopList.filter((value) => {
            return userInfo?.manageShopIds?.includes(value._id)
          })
        }
      }
      let shop = app.globalData.shop
      let index = 0
      if (shop) {
        shopList.forEach((element, shopIndex) => {
          if (shop._id == element._id) {
            index = shopIndex
          }
        });
      }
      shop = shopList[index]
      if (this.properties.cacheable) {
        app.globalData.shop = shop
      }
      console.log("shopBar", shopList);
      this.setData({
        index,
        shopList,
        shop
      })
      this.triggerEvent('onShopChange', shop)
    },
    openMap() {
      if (!this.properties.selectable) {
        return
      }
      wx.navigateTo({
        url: '/pages/map/index',
        events: {
          callbackData: (shop) => {
            const shopId = shop._id
            if (shopId) {
              if (this.properties.cacheable) {
                app.globalData.shop = shop
              }
              this.setData({
                shop
              })
              this.triggerEvent('onShopChange', shop)
            }
          },
        },
        success: (res) => {

        }
      })
    },
    /**
     * 切换店铺
     */
    bindPickerChange(e) {
      const index = e.detail.value
      const shop = this.data.shopList[index]
      const shopId = shop._id
      if (shopId) {
        this.setData({
          index
        })
        if (this.properties.cacheable) {
          app.globalData.shop = shop
        }
        this.triggerEvent('onShopChange', shop)
      }
    },
  }
})