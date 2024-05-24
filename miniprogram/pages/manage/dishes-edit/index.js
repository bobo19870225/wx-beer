// pages/manage/dishes-edit/index.js
const app = getApp()
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})

Page({
    /**
     * 页面的初始数据
     */
    data: {
        imgList: [],
        id: null,
        shop: null,
        isLoading: false,
        goods: null,
        eventChannel: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            eventChannel: this.getOpenerEventChannel()
        })
        const eventChannel = this.data.eventChannel
        eventChannel && eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', (data) => {
            let {
                id,
                shop
            } = data
            this.setData({
                id,
                shop
            })
            if (id) {
                this.getGoods(id)
            }
        })
    },
    getGoods(id) {
        this.setData({
            isLoading: true
        })
        db.collection('goods').doc(id).get().then((res) => {
            // console.log(res);
            this.setData({
                goods: res.data,
                isLoading: false,
                imgList:[res.data.img]
            })
            this.setData({
                
            })
        })
    },
    onUploadOk(e) {
        // console.log("SC", e);
        this.setData({
            imgList: e.detail
        })
    },

    formSubmit(e) {
        let {
            title,
            remarks,
            price,
            vipPrice
        } = e.detail.value
        let img = this.data.imgList[0]
        const shopId = this.data.shop._id
        if (!title) {
            wx.showToast({
                title: '名称必填',
                icon: 'error'
            })
            return
        }
        if (!price || !vipPrice) {
            wx.showToast({
                title: '价格必填',
                icon: 'error'
            })
            return
        }
        if (!img) {
            wx.showToast({
                title: '请上传一张商品图片',
                icon: 'error'
            })
            return
        }
        if (!shopId) {
            wx.showToast({
                title: '无店铺',
                icon: 'error'
            })
            return
        }
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'updateGoods',
                id: this.data.id,
                data: {
                    title,
                    remarks,
                    price,
                    vipPrice,
                    shopId,
                    img,
                    isDelete: false
                }
            },
        }).then((res) => {
            wx.navigateBack()
        });
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
                location: '[' + latitude + ']' + '[' + latitude + ']',
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