const app = getApp()
Page({
    data: {
        PageCur: 'start',
        mode: 'client',
        openId: null
    },
    async onLoad(option) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        const openId = await app.getOpenid()
        this.setData({
            openId
        })
        const enterOptions = wx.getEnterOptionsSync()
        if (enterOptions.shareTicket) {
            // const that = this
            wx.authPrivateMessage({
                shareTicket: enterOptions.shareTicket,
                success(res) {
                    if (res.valid) {

                        const activityId = option.activityId
                        const shareID = option.shareID

                        wx.cloud.callFunction({
                            name: 'modelsFunctions',
                            data: {
                                type: 'handleShare',
                                activityId,
                                shareID
                            },
                        }).then((res) => {
                            // wx.showModal({
                            //     title: activityId,
                            //     content: res,
                            //     complete: (res) => {
                            //         if (res.cancel) {}
                            //         if (res.confirm) {}
                            //     }
                            // })
                        })
                    }
                },
                fail(res) {

                }
            })
        }

        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getActivityId',
            }
        }).then((res) => {
            if (res.result.activityId) {
                this.setData({
                    activityId: res.result.activityId
                })
                wx.updateShareMenu({
                    isPrivateMessage: true,
                    activityId: res.result.activityId,
                    withShareTicket: true,
                    success(res) {
                        console.log(res);
                    },
                    fail(res) {
                        console.log(res);
                    }
                })
            }
        })

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
    /**
     * 分享触发
     */
    onShareAppMessage(res) {
        const activityId = this.data.activityId
        wx.cloud.callFunction({
            name: 'modelsFunctions',
            data: {
                type: 'updateShare',
                entity: {
                    activityId
                }
            },
        }).then((res) => {
            console.log("TEST", res);
        })
        return {
            title: '我的朋友开新店，进店就送千元礼包，快快加入！',
            path: 'pages/index/index?activityId=' + activityId + '&shareID=' + this.data.openId,
            imageUrl: 'cloud://dev-1gic3map3d8dabe0.6465-dev-1gic3map3d8dabe0-1330757186/share/fx.png'
        }
    },
    /**
     * 分享朋友圈触发
     */
    onShareTimeline() {

    },
    NavChange(e) {
        this.setData({
            PageCur: e.currentTarget.dataset.cur
        })
    },
})