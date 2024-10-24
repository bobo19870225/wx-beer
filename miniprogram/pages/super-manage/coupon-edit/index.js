Page({
    /**
     * 页面的初始数据
     */
    data: {
        types: [{
                value: 1,
                name: '总价抵扣',
                checked: 'true'
            },
            {
                value: 1,
                name: '商品免费',
            },
        ],
        startDate: '请选择',
        endDate: '请选择',
    },
    radioChange(e) {

    },
    bindStartDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            startDate: e.detail.value
        })
    },
    bindEndDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            endDate: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的  
        let day = String(now.getDate()).padStart(2, '0');
        // let hours = String(now.getHours()).padStart(2, '0');  
        // let minutes = String(now.getMinutes()).padStart(2, '0');  
        // let seconds = String(now.getSeconds()).padStart(2, '0');  
        // ${hours}:${minutes}:${seconds}
        let nowStr = `${year}-${month}-${day}`;
        this.setData({
            startDate: nowStr,
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