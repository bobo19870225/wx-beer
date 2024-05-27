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
        vipList: null,
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
        db.collection("vipPackage").get().then((res)=>{
          console.log(res);
          const vipList = res.data
          this.setData({
            vipList
          })
        })
    },
    delete(e) {
        this.setData({
            showDialog: true,
            dialogData: {
                shopId: e.currentTarget.dataset.shopid
            }
        })
    },
    async onDelete(e) {
        // console.log(e);
        await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'deleteShop',
                shopId: e.detail.shopId
            },
        });
        // await app.getShopList();
        this.initData()
    },
    add() {
        wx.navigateTo({
            url: '/pages/manage/vip-edit/index',
        })
    },
    edit(e) {
        console.log(e);
        wx.navigateTo({
            url: '/pages/manage/vip-edit/index',
            events: {
                acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                },
                someEvent: function (data) {
                    console.log(data)
                }
            },
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    id: e.currentTarget.dataset.id
                })
            }
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