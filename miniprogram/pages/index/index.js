const app = getApp()
Page({
  data: {
    PageCur: 'start',
    mode: 'client'
  },
  onLoad(option) {
    this.onSwitchMode({
      detail: option.mode
    })
    this.getUser()
  },
  onSwitchMode(e) {
    const mode = e.detail
    if (!mode) {
      return
    }
    console.log('onSwitchMode', mode);
    let PageCur = null
    if (mode == 'client') {
      PageCur = 'start'
    } else if (mode == 'superManage') {
      PageCur = 'super-manage'
    } else if (mode == 'shopManage') {
      PageCur = 'watchOrder'
    }
    this.setData({
      mode,
      PageCur
    })
  },
  async getUser() {
    console.log("index getUser");
    const userInfoAll = await app.getUserInfoAll()
    const userInfo = userInfoAll.userInfo
    if (!userInfo) {
      this.addUser()
    } else {
      app.globalData.user = userInfo
    }
  },

  async addUser() {
    const _openid = await app.getOpenid()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateUser',
        entity: {
          _openid,
          isDelete: false,
        }
      },
    }).then((res) => {
      if (res.result.success) {
        app.globalData.user = res.result.data
      }
    })
  },
  onShow() {
    // 处理付款后跳转，完成后清掉app.globalData.PageCur
    const PageCur = app.globalData.PageCur
    if (PageCur) {
      this.setData({
        PageCur
      })
      app.globalData.PageCur = ''
    }
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})