// pages/manage/dishes/index.js
const app = getApp()
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        shopList: null,
        goodsList: null,
        index: null,
        shop: null,
        showDialog: false,
        dialogData: {},
        containerHeight: app.globalData.containerHeight,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    async initData() {
        const shopList = app.globalData.shopList || await app.initGlobalData()
        this.setData({
            shopList,
            index: 0,
            shop: shopList[0]
        })
        this.fetchGoodsList(this.data.shop._id)
    },
    async fetchGoodsList(shopId) {
        this.setData({
            isLoading: true
        });
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'fetchGoodsList',
                shopId
            },
        });
        const goodsList = res?.result?.data || [];
        this.setData({
            isLoading: false,
            goodsList
        });
    },
    deleteShop(e) {
        this.setData({
            showDialog: true,
            dialogData: {
                id: e.currentTarget.dataset.id
            }
        })
    },
    async onDelete(e) {
        // const res = await wx.cloud.callFunction({
        //     name: 'quickstartFunctions',
        //     data: {
        //         type: 'deleteShop',
        //         shopId: e.detail.shopId
        //     },
        // });
    },
    editShop(e) {
        console.log(e);
        wx.navigateTo({
            url: '/pages/manage/dishes-edit/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                },
                someEvent: function (data) {
                    console.log(data)
                }
            },
            success: (res) => {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    id: e.currentTarget.dataset.id,
                    shop: this.data.shop
                })
            }
        })
        // wx.navigateTo({
        //     url: '/pages/manage/dishes-edit/index?id=' + e.detail.id,
        // })
    },
    addDishes() {
        wx.navigateTo({
            url: '/pages/manage/dishes-edit/index',
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
        this.initData();
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

    },

})