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
        shop: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
        // eventChannel.emit('someEvent', {data: 'test'});
        eventChannel && eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', (data) => {
            let {
                id,
                shop
            } = data
            this.setData({
                id,
                shop
            })
        })
    },

    ChooseImage() {
        wx.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
                if (this.data.imgList.length != 0) {
                    this.setData({
                        imgList: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        imgList: res.tempFilePaths
                    })
                }
            }
        });
    },
    ViewImage(e) {
        wx.previewImage({
            urls: this.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    DelImg(e) {
        wx.showModal({
            title: '温馨提示',
            content: '确定要删除吗？',
            cancelText: '取消',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    this.setData({
                        imgList: this.data.imgList
                    })
                }
            }
        })
    },
    formSubmit(e) {
        let {
            title,
            remarks,
            price,
            vipPrice
        } = e.detail.value
        db.collection('goods').add({
            data: {
                title,
                remarks,
                price,
                vipPrice,
                img: '',
                isDelete: false
            },
            success: function (res) {
                wx.navigateBack()
            }
        })
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