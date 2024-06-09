const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        isRefreshing: false,
        billList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadData()
    },
    gotoDetail(e) {
        console.log(e);
        wx.navigateTo({
            url: '/pages/user-center/bill/detail',
            success: (res) => {
                res.eventChannel.emit('bill', e.currentTarget.dataset.item)
            }
        })
    },
    /**
     * 加载账单
     */
    async loadData() {
        this.setData({
            isLoading: true
        })
        const _openid = await app.getOpenid()
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getBillList',
                entity: {
                    _openid
                }
            }
        }).then((res) => {
            this.setData({
                isLoading: false
            })
            if (res.result.success) {
                this.setData({
                    billList: res.result.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})