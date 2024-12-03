const app = getApp()
const page = {
    pageNumber: 1,
    pageSize: 10
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        isLoading: false,
        isLoadMore: false,
        isRefreshing: false,
        hasMore: true,
        fileUrl: null,
        containerHeight: app.globalData.containerHeight,
        shop: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    loadMore(e) {},
    async onShopChange(e) {
        let shop = e.detail
        this.setData({
            shop
        })
        this.setData({
            isLoading: true
        })
        await this.loadData()
        this.setData({
            isLoading: false
        })
    },
    async savaExcel() {
        this.setData({
            isLoading: true
        })
        const excelData = this.data.list.map((item) => {
            item.name = item.user.name
            item.phone = item.user.phone
            item.balance = item.account.balance
            item.beer = item.account.beer
            item.recharge = item.account.recharge
            return item
        })
        const shop = await app.getShop()
        const res = await wx.cloud.callFunction({
            name: 'excel',
            data: {
                fileName: shop.name + '会员数据.xlsx',
                rowAndKey: {
                    row: ['余额', '累计充值', '昵称', '电话', '_openid'],
                    key: ['balance', 'recharge', 'name', 'phone', '_openid']
                },
                sheetName: 'vip',
                excelData
            }
        })
        console.log(res);
        this.getFileUrl(res.result.fileID)

    },
    //获取云存储文件下载地址，这个地址有效期一天
    getFileUrl(fileID) {
        let that = this;
        wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                // get temp file URL
                console.log("文件下载链接", res.fileList[0].tempFileURL)
                that.setData({
                    fileUrl: res.fileList[0].tempFileURL
                })
            },
            fail: err => {
                // handle error
            },
            complete: res => {
                that.setData({
                    isLoading: false
                })
            }
        })
    },
    //复制excel文件下载链接
    copyFileUrl() {
        let that = this
        wx.setClipboardData({
            data: that.data.fileUrl,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        wx.showToast({
                            title: '复制成功',
                            icon: 'success'
                        })
                        console.log("复制成功", res.data) // data
                    }
                })
            }
        })
    },
    async loadData(e) {
        page.pageNumber = 1
        await this.getListData()
    },
    async getListData() {
        const shop = this.data.shop
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getVip',
                entity: {
                    shopId: shop._id
                }
            }
        })
        this.setData({
            isRefreshing: false,
            list: res.result.list || []
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