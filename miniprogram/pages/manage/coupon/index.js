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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.getTablesList()
    },

    async getTablesList() {
        const res = await app.getUserInfoAll(false)
        const vipInfo = res.vipInfo
        db.collection("coupon").where({
            isDelete: false
        }).get().then((res) => {
            const couponList = res.data
            if (vipInfo.account.coupon && vipInfo.account.coupon.length > 0) {
                vipInfo.account.coupon = vipInfo.account.coupon.map(element => {
                    for (let index = 0; index < couponList.length; index++) {
                        const coupon = couponList[index];
                        if (element.couponId == coupon._id) {
                            return Object.assign({}, element, coupon);
                        }
                    }
                    return element
                });
            }
            console.log(vipInfo.account.coupon);
            this.setData({
                couponList: vipInfo.account.coupon,
                isLoading: false,
            })
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