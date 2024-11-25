// pages/shop-manage/spend-management/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        containerHeight: app.globalData.containerHeight,
        isLoading: false,
        isCustom: false,
        spend: [],
        shop: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const shop = await app.getShop(options.shopId)
        app.globalData.shop = shop
        this.setData({
            isCustom: options.shopId ? true : false,
            shop
        })
        this.getSpend()
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
        this.getSpend()
    },
    async getSpend() {
        this.setData({
            isLoading: true
        })
        const shop = this.data.shop
        if (!shop) {
            return
        }
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getSpendList',
                entity: {
                    shopId: shop._id
                }
            }
        }).then((res) => {
            console.log(res);
            this.setData({
                isLoading: false
            })
            if (res.result.success) {
                this.setData({
                    spend: res.result.data
                })
            }
        })
    },
    loadMore(e) {},
    handleEdit(e) {
        console.log(e.currentTarget.dataset.item);
        wx.navigateTo({
            url: '/pages/shop-manage/spend-management-edit/index',
            success: (res) => {
                res.eventChannel.emit('postData', {
                    spend: e.currentTarget.dataset.item
                })
            }
        })
    },
    handleAdd(e) {
        wx.navigateTo({
            url: '/pages/shop-manage/spend-management-edit/index',
            success: (res) => {
                // res.eventChannel.emit('postData', {
                //     spend: e.currentTarget.dataset.item
                // })
            }
        })
    },
    handleDelete(e) {

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