const app = getApp()
var spend = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        containerHeight: app.globalData.containerHeight,
        isLoading: false,
        showDialogAdd: false,
        listSpend: [],
        shop: null,
        price: null,
        money: null,
        number: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
   async onLoad(options) {
        const shop = await app.getShop(options.shopId)
        this.setData({
            shop
        })
        const eventChannel = this.getOpenerEventChannel()
        eventChannel && eventChannel.on && eventChannel.on('postData', (data) => {
            spend = data.spend
            if (spend) {
                this.setData({
                    listSpend: spend.listSpend
                })
            }
        })
    },
    numberInput(e) {
        const number = Number.parseInt(e.detail.value);
        if (typeof number === 'number') {
            const price = this.data.price
            this.setData({
                number
            })
            if (number && price) {
                this.setData({
                    money: number * price
                })
                return
            }
        }
        this.setData({
            money: null
        })
    },
    priceInput(e) {
        this.setData({
            price: e.detail.value
        })
        const price = Number.parseFloat(e.detail.value);
        if (typeof price === 'number') {
            const number = this.data.number
            if (number && price) {
                this.setData({
                    money: (number * price).toFixed(2)
                })
                return
            }
        }
        this.setData({
            money: null
        })
    },
    moneyInput(e) {
        this.setData({
            money: e.detail.value
        })
        const money = Number.parseFloat(e.detail.value);
        if (typeof money === 'number') {
            const number = this.data.number
            if (money && number) {
                this.setData({
                    price: (money / number).toFixed(2)
                })
                return
            }
        }
        this.setData({
            price: null
        })
    },
    removeItem(e) {
        const index = e.currentTarget.dataset.index
        const listSpend = this.data.listSpend
        listSpend.splice(index, 1);
        this.setData({
            listSpend
        })
    },
    formSubmit(e) {
        const value = e.detail.value
        console.log(value);
        if (!value.name) {
            wx.showToast({
                title: '请填写支出项',
                icon: 'error'
            })
            return
        }
        if (!value.number) {
            wx.showToast({
                title: '请填写数量',
                icon: 'error'
            })
            return
        }
        if (!value.price) {
            wx.showToast({
                title: '请填写单价',
                icon: 'error'
            })
            return
        }
        if (!value.money) {
            wx.showToast({
                title: '请填写金额',
                icon: 'error'
            })
            return
        }
        const listSpend = this.data.listSpend
        listSpend.push(e.detail.value)
        this.setData({
            listSpend,
            showDialogAdd: false
        })
    },
    formReset(e) {
        this.setData({
            showDialogAdd: false
        })
    },
    async submit(e) {
        const listSpend = this.data.listSpend
        if (listSpend.length < 1) {
            wx.showToast({
                title: '请添加支出项',
                icon: 'error'
            })
            return
        }
        this.setData({
            isLoading: true
        })
        const shop = this.data.shop
        const _id = spend?._id
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'updateSpend',
                entity: {
                    _id,
                    shopId: shop._id,
                    shopName: shop.name,
                    listSpend
                }
            }
        }).then((res) => {
            console.log(res);
            this.setData({
                isLoading: false
            })
            if (res.result.success) {
                wx.navigateBack()
            }
        })
    },
    showAddDialog(e) {
        console.log(e);
        this.setData({
            showDialogAdd: true
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