const app = getApp()
const db = wx.cloud.database()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        isMyLoading: false,
        couponList: [],
        activeCouponList: [],
        containerHeight: app.globalData.containerHeight,
        TabCur: 0,
        scrollLeft: 0,
        tables: [{
            title: '我的优惠券',
            value: 1,
        }, {
            title: '活动券',
            value: 2,
        }],
        getListDataMy: null,
        getListDataAct: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({
            isLoading: true,
            isMyLoading: true
        })
    },

    tabSelect(e) {
        const TabCur = e.currentTarget.dataset.id
        this.setData({
            TabCur,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
        if (TabCur == 1) {
            this.getActiveCouponList()

        }
    },
    qiang(e) {
        wx.showLoading({
            title: '全力拼抢...',
        })
        const shop = app.globalData.shop
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'qiangCoupon',
                shopId: shop._id,
                entity: e.currentTarget.dataset.item
            },
        }).then((res) => {
            wx.hideLoading()
            if (res.result.success) {
                wx.showToast({
                    title: '领取成功',
                })
                this.getActiveCouponList()
            } else {
                wx.showToast({
                    title: res.result.errMsg,
                    icon: 'error'
                })
            }
        })
    },
    async getActiveCouponList(page = {
        pageNumber: 1,
        pageSize: 10
    }) {
        this.setData({
            isLoading: true,
            activeCouponList: []
        })
        let vipAccount = await app.getVipAccount(true)
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getActiveCouponList',
                entity: {
                    page: {
                        pageNumber: 1,
                        pageSize: 100
                    }
                }
            },
        })

        let activeCouponList = res.result.data
        console.log(vipAccount.coupon);
        let couponIds = ''
        if (vipAccount.coupon) {
            let couponidArr = []
            vipAccount.coupon.forEach(element => {
                couponidArr.push(element._id)
            });
            couponIds = couponidArr.join()
        }
        activeCouponList = activeCouponList.map((element) => {
            if (couponIds && couponIds.indexOf(element._id) > 0) {
                element.get = true
            } else {
                element.get = false
            }
            return element
        })
        this.setData({
            activeCouponList,
            isLoading: false
        })
        return activeCouponList.length == page.pageSize
    },

    async getMyList() {
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
            this.setData({
                couponList: vipInfo.account.coupon,
                isLoading: false,
                isMyLoading: false,
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
        this.setData({
            getListDataAct: this.getActiveCouponList
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