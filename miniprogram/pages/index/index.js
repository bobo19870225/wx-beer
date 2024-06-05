const app = getApp()
Page({
    data: {
        PageCur: 'start',
        mode: app.globalData.mode
    },
    onLoad() {
        this.getUser()
    },
    onSwitchMode(e) {
        console.log(e);
        const mode = app.globalData.mode
        const PageCur = e.detail
        this.setData({
            mode,
            PageCur
        })
    },
    async getUser() {
        const userInfoAll = await app.getUserInfoAll()
        const userInfo = userInfoAll.userInfo
        if (!userInfo) {
            this.addUser()
        } else {
            app.globalData.user = userInfo
        }
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