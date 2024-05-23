
// pages/manage/shop-map/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        latitude: null,
        longitude: null,
        markers: [{
            id: 0,
            latitude: 26.20252849089062,
            longitude: 105.47991719994945,
            width: 50,
            height: 50
        }],
        containerHeight: app.globalData.containerHeight,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                console.log(res);
                const latitude = res.latitude
                const longitude = res.longitude
                const speed = res.speed
                const accuracy = res.accuracy
            }
        })
        this.loadMarkers()
    },

    loadMarkers: function () {
        //生成 markers 列表，用于在地图上展示
        let markersData = this.data.markers.map(marker => {
            return {
                id: marker.id,
                longitude: marker.longitude,
                latitude: marker.latitude,
                iconPath: '../../../images/icons/Location.svg',
                width: 30,
                height: 30,
            };
        });
        this.setData({
            markers: markersData
        });
    },

    onMapTap(e) {
        console.log(e);
        let {
            latitude,
            longitude
        } = e.detail
        let markersData = this.data.markers.map(marker => {
            return {
                id: marker.id,
                longitude: longitude,
                latitude: latitude,
                iconPath: '../../../images/icons/Location.svg',
                width: 30,
                height: 30,
            };
        });
        this.setData({
            latitude,
            longitude,
            markers: markersData
        });
    },
    onSelect() {
        app.globalData.selectMap = {
            latitude:this.data.latitude,
            longitude:this.data.longitude
        }
        wx.navigateBack()
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