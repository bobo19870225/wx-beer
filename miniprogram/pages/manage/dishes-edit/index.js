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
        goodsTypeList: [],
        id: null,
        shop: null,
        isLoading: false,
        goods: null,
        eventChannel: null,
        index: [0, 0],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({
            isLoading: true
        })
        await this.getGoodsTypeList()
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
    async getGoodsTypeList() {
        const res = await db.collection('goodsType').where({
            isDelete: false
        }).get()
        if (res.data) {
            const arr = res.data
            let g0 = arr.filter((value) => {
                return value.group == 0
            })
            g0.unshift({
                title: '常规',
                _id: '-1'
            })
            const g1 = arr.filter((value) => {
                return value.group == 1
            })
            this.setData({
                goodsTypeList: [g0, g1],
                index: [0, 0]
            })
        }
    },
    bindPickerChange(e) {
        const index = e.detail.value
        this.setData({
            index
        })
    },
    getGoods(id) {
        db.collection('goods').doc(id).get().then((res) => {
            let classify = res.data.classify
            let index0 = 0
            let index1 = 0
            if (classify) {
                const id0 = classify[0]
                const id1 = classify[1]
                // console.log("OOO",this.data.goodsTypeList);
                const arr0 = this.data.goodsTypeList[0]
                const arr1 = this.data.goodsTypeList[1]
                arr0.forEach((value, index) => {
                    if (value._id == id0) {
                        index0 = index
                    }
                })
                arr1.forEach((value, index) => {
                    if (value._id == id1) {
                        index1 = index
                    }
                })
            }

            this.setData({
                goods: res.data,
                index: [index0, index1],
                isLoading: false,
                imgList: [res.data.img]
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
        console.log(e);
        let {
            title,
            remarks,
            price,
            vipPrice,
            classify
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
        price = Number.parseInt(price)
        vipPrice = Number.parseInt(vipPrice)
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
        if (classify == null || classify == undefined) {
            wx.showToast({
                title: '请选择分类',
                icon: 'error'
            })
            return
        }
        let title0 = this.data.goodsTypeList[0][classify[0]].title
        let title1 = this.data.goodsTypeList[1][classify[1]].title
        let classifyTag = title0 == '常规' ? title1 : title0 + ',' + title1
        classify = [this.data.goodsTypeList[0][classify[0]]._id, this.data.goodsTypeList[1][classify[1]]._id]

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
                    classify,
                    classifyTag,
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