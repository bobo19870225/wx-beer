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
    isLoading: false,
    loading: true,
    isRefreshing: false,
    userInfo: {},
    vipInfo: null,
    containerHeight: app.globalData.containerHeight,
    showPayDialog: false,
    showRoleDialog: false,
    vips: null,
    vipPackage: null,
    vipPackageBuy: null,
    shop: null,
    isShopManage: false,
    roleList: []
  },
  attached() {
    console.log("attached");
  },
  show() {
    console.log("show");
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getUser(forceupdates) {
      const res = await app.getUserInfoAll(forceupdates)
      console.log("user-center getUser", res);
      const userInfo = res.userInfo
      const vipInfo = res.vipInfo
      const isSuperManage = userInfo?.isSuperManage || false
      const isShopManage = userInfo?.manageShopIds?.length > 0 || false
      if (isSuperManage) {
        this.setData({
          roleList: [{
            text: '管理员',
            value: 'superManage'
          }, {
            text: '店长',
            value: 'shopManage'
          }, {
            text: '客户',
            value: 'client',
            checked: true
          }]
        })
      } else if (isShopManage) {
        this.setData({
          roleList: [{
            text: '店长',
            value: 'shopManage'
          }, {
            text: '客户',
            value: 'client',
            checked: true
          }]
        })
      }
      this.setData({
        userInfo,
        isShopManage,
        vipInfo,
        isRefreshing: false
      })
    },
    onChooseAvatar(e) {
      const {
        avatarUrl
      } = e.detail
      const userInfo = this.data.userInfo
      userInfo.avatarUrl = avatarUrl
      this.setData({
        userInfo
      })
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'updateUser',
          entity: userInfo
        }
      }).then((res) => {
        console.log("TTT", res);
      })
    },
    /**
     * 切换店铺
     */
    async onShopChange(e) {
      let shop = e.detail
      this.setData({
        shop,
      })
      console.log("######");
      this.getVipType();
      this.setData({
        loading: true
      })
      await this.getUser(true)
      this.setData({
        loading: false
      })
    },
    /**
     * 切换角色
     * @param {*} e 
     */
    onSelecteRole(e) {
      const mode = e.detail.value
      this.triggerEvent('onSwitchMode', mode)
    },
    closeRoleDialog() {
      this.setData({
        showRoleDialog: false
      })
    },
    async getVipType() {
      const res = await db.collection('vipPackage').where({
        isDelete: false
      }).get()
      this.setData({
        vips: res.data
      })
    },
    gotoApplicationPage() {
      wx.navigateTo({
        url: `/pages/application/index`,
      });
    },
    gotoBillPage() {
      wx.navigateTo({
        url: `/pages/user-center/bill/index`,
      });
    },
    radioChange(e) {
      let id = e.detail.value
      let vipPackageBuy = null
      this.data.vips.forEach(element => {
        if (element._id == id) {
          vipPackageBuy = element
        }
      });
      this.setData({
        vipPackageBuy
      })
    },
    toBeVip() {
      this.setData({
        showPayDialog: true
      })
    },
    async payVip() {
      this.setData({
        isLoading: true
      })
      const shop = await app.getShop()
      const vipPackageBuy = this.data.vipPackageBuy
      const price = Number.parseInt(vipPackageBuy.price)
      const entry = Number.parseInt(vipPackageBuy.entry)
      const beer = Number.parseInt(vipPackageBuy.beer)
      const _openid = await app.getOpenid()
      const vipPackageId = vipPackageBuy._id
      let res = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'payForVip',
          entity: {
            shopId: shop._id,
            _openid,
            name: this.data.userInfo.name,
            vipPackageId,
            price,
            entry,
            beer
          }
        },
      });
      console.log(res);
      await this.getUser(true)
      this.closePayDialog()
      this.setData({
        isLoading: false
      })
    },
    closePayDialog() {
      this.setData({
        showPayDialog: false
      })
    },
    gotoSettingPage(e) {
      const that = this
      wx.navigateTo({
        url: '/pages/user-center/setting/index',
        events: {
          callbackData: (userInfo) => {
            console.log("callbackData", userInfo);
            that.setData({
              userInfo
            })
          },
        },
      })
    },
    switchMode() {
      this.setData({
        showRoleDialog: true
      })
    }
  },

});