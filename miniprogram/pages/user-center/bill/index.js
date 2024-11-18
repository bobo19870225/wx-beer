const app = getApp()
var _this = null
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        containerHeight: app.globalData.containerHeight,
        isShopManage: false,
        isSuperManage: false,

        listIn: [],
        getListDataIn: null,
        pageIn: {
            pageNumber: 1,
            pageSize: 15
        },

        listUser: [],
        getListDataUser: null,
        pageUser: {
            pageNumber: 1,
            pageSize: 15
        },

        listSpend: [],
        getListDataSpend: null,
        pageSpend: {
            pageNumber: 1,
            pageSize: 15
        },

        TabCur: 0,
        scrollLeft: 0,
        tables: [{
            title: '收入',
            value: 1,
        }, {
            title: '消费',
            value: 2,
        }, {
            title: '支出',
            value: 3,
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.setData({
            isShopManage: options.isShopManage == 'true',
            isSuperManage: options.isSuperManage == 'true',
        })
        _this = this
    },
    tabSelect(e) {
        const TabCur = e.currentTarget.dataset.id
        this.setData({
            TabCur,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
        if (TabCur == 0) {
            this.getPageDataIn(this.data.pageIn)
        }
        if (TabCur == 1) {
            this.getPageDataUser(this.data.pageUser)
        }
        if (TabCur == 2) {
            this.getPageDataSpend(this.data.pageSpend)
        }
    },
    gotoDetail(e) {
        console.log(e);
        wx.navigateTo({
            url: '/pages/user-center/bill/detail',
            success: (res) => {
                res.eventChannel.emit('bill', e.currentTarget.dataset.item)
            }
        })
    },
    async onShopChange(e) {
        this.setData({
            isLoading: true
        })
        if (this.data.isSuperManage || this.data.isShopManage) {
            await this.getPageDataIn(this.data.pageIn)
            await this.getPageDataUser(this.data.pageUser)
            await this.getPageDataSpend(this.data.pageSpend)
        } else {//客户端
            await this.getPageDataIn(this.data.pageIn)
        }
        this.setData({
            isLoading: false
        })
    },
    /**
     * 收入
     * @param {*} page 
     */
    getPageDataIn: async function (page) {
        const shop = await app.getShop()
        const entity = {
            shopId: shop._id,
            typeArr: [0, 2]
        }
        entity.isClient = !_this.data.isShopManage && !_this.data.isSuperManage
        console.log(entity)
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getBillList',
                entity: entity,
                page
            }
        })
        if (res.result.success) {
            const list = res.result.data
            if (page.pageNumber == 1) {
                _this.setData({
                    listIn: list
                })
            } else {
                let listTemp = _this.data.listIn
                listTemp = listTemp.concat(list);
                _this.setData({
                    listIn: listTemp
                })
            }
            return list.length == page.pageSize
        }
        return false
    },

    /**
     * 消费
     * @param {*} page 
     */
    getPageDataUser: async function (page) {
        const shop = await app.getShop()
        const entity = {
            shopId: shop._id,
            typeArr: [1, 2]
        }
        entity.isClient = !_this.data.isShopManage && !_this.data.isSuperManage
        console.log(entity)
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getBillList',
                entity: entity,
                page
            }
        })
        if (res.result.success) {
            const list = res.result.data
            if (page.pageNumber == 1) {
                _this.setData({
                    listUser: list
                })
            } else {
                let listTemp = _this.data.listUser
                listTemp = listTemp.concat(list);
                _this.setData({
                    listUser: listTemp
                })
            }
            return list.length == page.pageSize
        }
        return false
    },
    /**
     * 支出
     * @param {*} page 
     */
    getPageDataSpend: async function (page) {
        const shop = await app.getShop()
        const entity = {
            shopId: shop._id,
            typeArr: [3]
        }
        entity.isClient = !_this.data.isShopManage && !_this.data.isSuperManage
        console.log(entity)
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getBillList',
                entity: entity,
                page
            }
        })
        if (res.result.success) {
            const list = res.result.data
            if (page.pageNumber == 1) {
                _this.setData({
                    listSpend: list
                })
            } else {
                let listTemp = _this.data.listSpend
                listTemp = listTemp.concat(list);
                _this.setData({
                    listSpend: listTemp
                })
            }
            return list.length == page.pageSize
        }
        return false
    },
    loadMore(e) {
        console.log("loadMore", e);
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
        this.setData({
            getListDataIn: this.getPageDataIn,
            getListDataUser: this.getPageDataUser,
            getListDataSpend: this.getPageDataSpend,
        })
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