// pages/pay-car/index.js
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})
Page({
    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        total: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options)
        let goods = null
        if (options) {
            goods = options.goods
            if (goods) {
                let orderListT = JSON.parse(options.goods)
                let total = 0;
                orderListT.forEach(element => {
                    total += element.number * element.price / 100
                });
                this.setData({
                    orderList: orderListT,
                    total: total
                })
            }
        }
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

    },
    /**
     * 用户支付
     */
    pay(e) {
        var shopId = wx.getStorageSync('shopId')
        db.collection('order').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                description: "learn cloud database",
                createDate: new Date(),
                goodsList: this.data.orderList,
                shopId,
                total: this.data.total,
                // 下单成功，制作中
                state: 1
            },
            success: function (res) {
                // wx.showToast({
                //     title: '下单成功',
                // })
                wx.navigateBack({
                    delta: 1
                });
            }
        })
    },
})