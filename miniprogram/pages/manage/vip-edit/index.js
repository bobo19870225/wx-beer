const app = getApp()
const db = wx.cloud.database()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        vip: null,
        coupons: [],
        selectCoupons: [],
        showCoupons: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel && eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', (data) => {
            let {
                id
            } = data
            this.setData({
                id
            })
            if (id) {
                this.getVipPackage(id)
            }
        })
        this.getCoupon()
    },
    getCoupon() {
        this.setData({
            isLoading: true
        })
        db.collection('coupon').where({
            isDelete: false,
        }).get().then((res) => {
            this.setData({
                coupons: res.data.map((item) => {
                    item.number = 1
                    return item
                }),
                isLoading: false
            })
        })
    },
    addCouponNumber(e) {
        console.log(e.currentTarget.dataset.id)
        const id = e.currentTarget.dataset.id
        let temp = this.data.selectCoupons.map((item) => {
            if (item._id == id) {
                item.number += 1
            }
            return item
        })
        this.setData({
            selectCoupons: temp
        })
    },
    moveCouponNumber(e) {
        const id = e.currentTarget.dataset.id
        let temp = this.data.selectCoupons.map((item) => {
            if (item._id == id) {
                if (item.number > 1) {
                    item.number -= 1
                }
            }
            return item
        })
        this.setData({
            selectCoupons: temp
        })
    },
    showCoupons(e) {
        this.setData({
            showCoupons: true
        })
    },

    hideCoupons(e) {
        if (e.currentTarget.dataset.value == 'ok') {

        }
        this.setData({
            showCoupons: false
        })
    },
    ChooseCheckbox(e) {
        let items = this.data.coupons;
        let selectCoupons = [];
        let ids = e.currentTarget.dataset.value;
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            if (items[i]._id == ids) {
                items[i].checked = !items[i].checked;
            }
            if (items[i].checked) {
                selectCoupons.push(items[i])
            }
        }
        this.setData({
            coupons: items,
            selectCoupons
        })
    },
    getVipPackage(id) {
        this.setData({
            isLoading: true
        })
        db.collection('vipPackage').doc(id).get().then((res) => {
            console.log(res);
            let coupon = res.data.coupon
            const couponNumber = res.data.couponNumber
            let selectCoupons = []
            if (coupon) {
                let coupons = this.data.coupons.map((value) => {
                    coupon.forEach((element, index) => {
                        const number = couponNumber[index]
                        if (value._id == element) {
                            value.number = number
                            value.checked = true
                            selectCoupons.push(value)
                        }
                    })
                    return value
                });
                console.log("LLL", selectCoupons);
                this.setData({
                    coupons,
                    selectCoupons
                })
            }
            this.setData({
                vip: res.data,
                isLoading: false
            })
        })
    },
    formSubmit(e) {
        console.log(e);
        let {
            name,
            remarks,
            price,
            entry,
            rate,
        } = e.detail.value
        if (!name) {
            wx.showToast({
                title: '名称必填',
                icon: 'error'
            })
            return
        }
        if (!price) {
            wx.showToast({
                title: '套餐价格必填',
                icon: 'error'
            })
            return
        }
        if (!entry) {
            wx.showToast({
                title: '实际到账必填',
                icon: 'error'
            })
            return
        }

        if (!rate) {
            wx.showToast({
                title: '折扣率必填',
                icon: 'error'
            })
            return
        }
        price = Number.parseFloat(price)
        entry = Number.parseFloat(entry)
        rate = Number.parseInt(rate)
        let coupon = []
        let couponNumber = []
        this.data.selectCoupons.forEach((item) => {
            coupon.push(item._id)
            couponNumber.push(item.number)
        })
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'updateVipPackage',
                id: this.data.id,
                data: {
                    name,
                    price,
                    entry,
                    coupon,
                    couponNumber,
                    rate,
                    remarks,
                    isDelete: false
                },
            },
        }).then((res) => {
            console.log(res.result.success);
            if (res.result.success) {
                this.finishAdd()
            }
        });
    },
    async finishAdd() {
        wx.navigateBack()
    },
    formReset(e) {
        console.log('form发生了reset事件，携带数据为：', e.detail.value)
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
        if (app.globalData.selectMap) {
            let {
                latitude,
                longitude
            } = app.globalData.selectMap
            this.setData({
                location: '[' + latitude + ']' + '[' + longitude + ']',
                latitude,
                longitude
            })
        }
        app.globalData.selectMap = null
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