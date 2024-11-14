const app = getApp()
const db = wx.cloud.database()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        couponList: [],
        containerHeight: app.globalData.containerHeight,
        getListData: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {

    },

    getCouponListData: async function (page = {
        pageNumber: 1,
        pageSize: 10
    }) {
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getCouponList',
                entity: {},
                page
            }
        })
        if (res.result.success) {
            let listTemp = res.result.data
            if (page.pageNumber == 1) {
                this.setData({
                    couponList: listTemp
                })
            } else {
                let couponList = this.data.couponList
                listTemp = couponList.concat(listTemp);
                this.setData({
                    couponList: listTemp
                })
            }
            return listTemp.length == page.pageSize
        }
        return false
    },

    add() {
        wx.navigateTo({
            url: '/pages/super-manage/coupon-edit/index',
        })
    },
    handleEdit(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/super-manage/coupon-edit/index',
            events: {
                acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                },
                someEvent: function (data) {
                    console.log(data)
                }
            },
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    id: e.currentTarget.dataset.id,
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
        this.setData({
            getListData: this.getCouponListData
        })
        this.getCouponListData()
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