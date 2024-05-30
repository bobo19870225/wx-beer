// pages/manage/shop-map/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: null,
        longitude: null,
        shopList: null,
        eventChannel: null,
        markers: [],
        containerHeight: app.globalData.containerHeightNoTabBar,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            eventChannel: this.getOpenerEventChannel()
        })
        this.initShopList()
    },
    onMapLoaded(e) {

    },
    /**
     * 初始化商店
     */
    async initShopList() {
        const shopList = app.globalData.shopList || await app.getShopList()
        // let shop = app.globalData.shop
        this.setData({
            shopList,
        })
        this.loadMarkers()
    },
    loadMarkers: function () {
        const shopList = this.data.shopList
        let markersData = this.data.markers
        if (shopList) {
            shopList.forEach((value, index) => {
                let markers = {
                    id: index,
                    longitude: value.longitude,
                    latitude: value.latitude,
                    iconPath: '../../images/icons/shop-location.png',
                    callout: {
                        content: value.name,
                        color: '#13227a',
                        display: 'ALWAYS',
                        padding: 6,
                        borderRadius: 3
                    },
                    width: 30,
                    height: 30,
                }
                markersData.push(markers)
            })
        }
        this.setData({
            markers: markersData
        });
    },

    onSelect(e) {
        const index = e.detail.markerId
        const shop = this.data.shopList[index]
        if (this.data.eventChannel && this.data.eventChannel.emit) {
            this.data.eventChannel.emit(
                /** 事件名称 */
                'callbackData',
                /** 事件参数 */
                shop
            )
        }
        wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        const mapContext = wx.createMapContext('mapId', this)
        console.log("onMapLoaded", mapContext);
        mapContext.moveToLocation({
            success: (res) => {
                console.log("moveToLocation", res);
                mapContext.getCenterLocation({
                    success: (res) => {
                        console.log("getCenterLocation", res);
                        let {
                            latitude,
                            longitude
                        } = res
                        this.setData({
                            latitude,
                            longitude
                        })
                    }
                })
            },
            fail: (e) => {
                console.log("moveToLocation", e);
            }
        })
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