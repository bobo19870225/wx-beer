const app = getApp()
var _this = null
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        containerHeight: app.globalData.containerHeight,

        listShare: [],
        getListData: null,
        page: {
            pageNumber: 1,
            pageSize: 15
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        _this = this
        this.setData({
            isLoading: true
        })
        await this.getPageData(this.data.page)
        this.setData({
            isLoading: false
        })
    },
    getPageData: async function (page) {
        const entity = {}
        const res = await wx.cloud.callFunction({
            name: 'modelsFunctions',
            data: {
                type: 'getShareList',
                entity: entity,
                page
            }
        })
        if (res.result.success) {
            const list = res.result.data
            if (page.pageNumber == 1) {
                _this.setData({
                    listShare: list
                })
            } else {
                let listTemp = _this.data.listShare
                listTemp = listTemp.concat(list);
                _this.setData({
                    listShare: listTemp
                })
            }
            return list.length == page.pageSize
        }
        return false
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
        this.setData({
            getListData: this.getPageData,
        })
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