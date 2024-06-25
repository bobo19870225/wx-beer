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
    containerHeight: app.globalData.containerHeight,
    showRoleDialog: false,
    shop: null,
    roleList: [],
    totalIncom: 0,
    orderCound: 0
  },
  attached() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    async loadData() {
      await this.getUser(true);
      this.getTotalIncom();
      this.getCountOrder();
      this.setData({
        isRefreshing: false
      })
    },
    getTotalIncom() {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getTotalIncom',
          entity: {
            shopId: this.data.shop._id
          }
        }
      }).then((res) => {
        console.log(res);
        this.setData({
          totalIncom: res.result?.list[0]?.total || 0
        })
      })
    },
    getCountOrder() {
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getCountOrder',
          entity: {
            shopId: this.data.shop._id
          }
        }
      }).then((res) => {
        console.log("getCountOrder", res);
        this.setData({
          orderCound: res.result?.list[0]?.count || 0
        })
      })
    },
    async getUser(forceupdates) {
      console.log("shop-manage getUser");
      const res = await app.getUserInfoAll(forceupdates)
      const userInfo = res.userInfo
      const isSuperManage = userInfo?.isSuperManage || false
      const isShopManage = userInfo?.manageShopIds?.length > 0 || false
      if (isSuperManage) {
        this.setData({
          roleList: [{
              text: '管理员',
              value: 'superManage'
            }, {
              text: '店长',
              value: 'shopManage',
              checked: true
            },
            {
              text: '客户',
              value: 'client'
            }
          ]
        })
      } else if (isShopManage) {
        this.setData({
          roleList: [{
            text: '店长',
            value: 'shopManage',
            checked: true
          }, {
            text: '客户',
            value: 'client'
          }]
        })
      }
      this.setData({
        userInfo
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
      this.loadData();
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

    gotoBuyManage() {
      wx.navigateTo({
        url: `/pages/shop-manage/spend-management/index`,
      });
    },
    goToOperation() {
      wx.navigateTo({
        url: '/pages/manage/operation/index?isShopManage=true',
      })
    },
    gotoBillPage() {
      wx.navigateTo({
        url: `/pages/user-center/bill/index?isShopManage=true`,
      });
    },
    goTopManageDishes() {
      wx.navigateTo({
        url: '/pages/manage/dishes/index',
      })
    },
    goTopManageTables() {
      wx.navigateTo({
        url: '/pages/manage/tables/index',
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