// pages/me/index.js
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
    isRefreshing: false,
    userInfo: {},
    vipInfo: null,
    vipLoading: true,
    containerHeight: app.globalData.containerHeight,
    showPayDialog: false,
    showRoleDialog: false,
    vips: null,
    vipPackage: null,
    vipPackageBuy: null,
    shop: null,
    isSuperManage: false,
    isShopManage: false,
    roleList: []
  },
  attached() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getUser(forceupdates) {
      this.setData({
        isRefreshing: true
      })
      const res = await app.getUserInfoAll(forceupdates)
      const userInfo = res.userInfo
      const vipInfo = res.vipInfo
      const isSuperManage = userInfo?.isSuperManage || false
      const isShopManage = userInfo?.isShopManage || false
      if (isSuperManage) {
        this.setData({
          roleList: [{
            text: '管理员',
            value: 'superManage',
            checked: true
          }, {
            text: '店长',
            value: 'shopManage'
          }, {
            text: '客户',
            value: 'client'
          }]
        })
      } else if (isShopManage) {
        this.setData({
          roleList: [{
            text: '店长',
            value: 'shopManage'
          }, {
            text: '客户',
            value: 'client'
          }]
        })
      }
      this.setData({
        userInfo,
        isSuperManage,
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
        vipLoading: true,
      })
      await this.getUser(true);
      this.setData({
        vipLoading: false,
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
    goToVipManage() {
      wx.navigateTo({
        url: '/pages/manage/vip/index',
      })
    },
    goTopManageShop() {
      wx.navigateTo({
        url: '/pages/manage/shop/index',
      })
    },
    goToApplicationManage() {
      wx.navigateTo({
        url: '/pages/manage/application/index',
      })
    },
    gotoBillPage() {
      wx.navigateTo({
        url: `/pages/user-center/bill/index`,
      });
    },
    goToOperation() {
      wx.navigateTo({
        url: '/pages/manage/operation/index',
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