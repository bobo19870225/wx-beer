const app = getApp()
Page({
    data: {
        PageCur: 'home'
    },
    onLoad() {

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