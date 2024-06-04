const app = getApp()
Page({
  data: {
    PageCur: 'start'
  },
  onLoad() {
    this.getUser()
  },
  async getUser() {
    const _openid = await app.getOpenid()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getUser',
        _openid
      },
    }).then((res) => {
      // console.log(res);
      const user = res.result?.data
      // console.log(user);
      if (!user || user.length < 1) {
        this.addUser()
      } else {
        app.globalData.user = user[0]
      }
    })
  },
  async addUser() {
    // console.log("addUser");
    const _openid = await app.getOpenid()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateUser',
        data: {
          _openid,
          isDelete: false,
          createDate: new Date()
        }
      },
    }).then((res) => {
      // console.log(res);
      if (res.result.success) {
        app.globalData.user = res.result.data
      }
    })
  },
  onShow() {
    const PageCur = app.globalData.PageCur
    if (PageCur) {
      this.setData({
        PageCur
      })
    }
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})