const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        isRefreshing: false,
        billList: [],
        containerHeight: app.globalData.containerHeight,
        isShopManage: false,
        isSuperManage: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({
            isShopManage: options.isShopManage == 'true',
            isSuperManage: options.isSuperManage == 'true',
        })

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
    async onShopChange(e) {
        this.setData({
            isLoading: true
        })
        await this.loadData()
        this.setData({
            isLoading: false
        })
    },
    /**
     * 加载账单
     */
    async loadData() {
        const shop = await app.getShop()
        const entity = {
            shopId: shop._id
        }
        if (!this.data.isShopManage && !this.data.isSuperManage) {
            entity['_openid'] = await app.getOpenid()
        }
        console.log(entity);
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getBillList',
                entity: entity
            }
        }).then((res) => {
            this.setData({
                isRefreshing: false
            })
            if (res.result.success) {
                this.setData({
                    billList: res.result.data
                })
            }
        })
    },
    loadMore(e) {
        console.log("loadMore", e);
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