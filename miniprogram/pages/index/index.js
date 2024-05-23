const app = getApp()
Page({
  data: {
    PageCur: 'home'
  },
  onLoad() {},
  onShow() {},
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})