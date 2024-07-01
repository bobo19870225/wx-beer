const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        list: [],
        containerHeight: app.globalData.containerHeight,
        isShopManage: false,
        isSuperManage: false,
        getListData: null,
        page: {
            pageNumber: 1,
            pageSize: 15
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({
            isShopManage: options.isShopManage == 'true',
            isSuperManage: options.isSuperManage == 'true',
            getListData: this.getPageData
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
        await this.getPageData(this.data.page)
        this.setData({
            isLoading: false
        })
    },
    /**
     * 加载账单
     */
    getPageData: async function (page) {
        const shop = await app.getShop()
        const entity = {
            shopId: shop._id
        }
        entity.isClient = !this.data.isShopManage && !this.data.isSuperManage
        console.log(entity)
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getBillList',
                entity: entity,
                page
            }
        })
        if (res.result.success) {
            const list = res.result.data
            if (page.pageNumber == 1) {
                this.setData({
                    list
                })
            } else {
                let listTemp = this.data.list
                listTemp = listTemp.concat(list);
                this.setData({
                    list: listTemp
                })
            }
            return list.length == page.pageSize
        }
        return false
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