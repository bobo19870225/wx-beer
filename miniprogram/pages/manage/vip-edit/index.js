const app = getApp()
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        vip: null,
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
                this.getVip(id)
            }
        })
    },
    getVip(id) {
        this.setData({
            isLoading: true
        })
        db.collection('vipPackage').doc(id).get().then((res) => {
            console.log(res);
            this.setData({
                vip: res.data,
                isLoading: false
            })
        })
    },
    formSubmit(e) {
        let {
            name,
            remarks,
            price,
            entry,
            beer,
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
        if (!beer) {
            wx.showToast({
                title: '赠送啤酒数必填',
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
        price = Number.parseInt(price)
        entry = Number.parseInt(entry)
        beer = Number.parseInt(beer)
        rate = Number.parseInt(rate)
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'updateVipPackage',
                id: this.data.id,
                data: {
                    name,
                    price,
                    entry,
                    beer,
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