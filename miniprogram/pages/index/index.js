const app = getApp()
Page({
    data: {
        PageCur: 'start',
        // app.globalData.mode
        mode: 'client'
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
            if (userInfo.roleList) {
                if (userInfo.roleList.includes('71fb15f966481f6c01133cc442e52654')) { //管理员

                }
                if (userInfo.roleList.includes('6e4509e966481f250116f98a68547370')) { //店长

                }
            }
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
                    createDate: new Date()
                }
            },
        }).then((res) => {
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