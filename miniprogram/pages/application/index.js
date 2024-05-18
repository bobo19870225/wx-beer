// pages/application/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _openid: '11',
        isLoading: false,
        shopLisp:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getOpenid()
        this.getShopList()
    },
    async getShopList() {
        this.setData({
            isLoading: true
        });
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getShopList'
            },
        });
        const shopLisp = res?.result?.data || [];
        this.setData({
            isLoading: false,
            shopLisp
        });
    },
    async getOpenid() {
        var _openid = wx.getStorageSync('openid') || await app.getOpenid()
        this.setData({
            _openid: _openid,
            imgList: [],
            index: null,
            shopList: [],
        })
        console.log("WW", this.data._openid)
    },

    PickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value
        })
    },

    ChooseImage() {
        wx.chooseImage({
            count: 2, //默认9
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
        console.log('form发生了submit事件，携带数据为：', e)
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
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