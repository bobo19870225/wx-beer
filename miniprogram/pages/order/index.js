const app = getApp()
const db = wx.cloud.database()
var that = null
const page = {
    pageNumber: 1,
    pageSize: 10
}
var shop = null
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        isLoading: false,
        isLoadMore: false,
        isRefreshing: false,
        hasMore: true,
        containerHeight: app.globalData.containerHeight,
        vipLevel: null,
        getListData: null,
        page: {
            pageNumber: 1,
            pageSize: 5
        }
    },
    attached() {
        that = this
        this.setData({
            getListData: this.getPageData
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 切换店铺
         */
        async onShopChange(e) {
            const vipLevel = await app.getVipLevel()
            console.log(vipLevel);
            shop = e.detail
            this.setData({
                vipLevel,
                isLoading: true
            })
            await this.getPageData(this.data.page);
            this.setData({
                isLoading: false
            });
        },
        gotoPayCar(e) {
            console.log(e)
            wx.navigateTo({
                url: '/pages/pay-car/index',
            })
        },
        async cancelOrder(e) {
            this.setData({
                showDialog: true,
                dialogData: {
                    id: e.currentTarget.dataset.id
                }
            })
        },
        addOrder(e) {
            wx.navigateTo({
                url: '/pages/home/index',
                success: (res) => {
                    res.eventChannel.emit('order', e.currentTarget.dataset.item)
                }
            })
        },
        async onDelete(e) {
            const id = e.detail.id
            wx.showLoading({
                title: '处理中...',
                mask: true
            })
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'updateOrder',
                    entity: {
                        _id: id,
                        isDelete: true
                    },
                },
            });
            wx.hideLoading()
            console.log(res)
            if (res.result.success) {
                this.getPageData(this.data.page);
            }
        },
        /**
         * 分页获取订单
         */
        async getPageData(page) {
            console.log(that);
            const shopId = shop._id
            const _openid = await app.getOpenid()
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getOrderList',
                    entity: {
                        shopId,
                        _openid
                    },
                    page
                },
            });
            const list = res.result.list || [];
            if (page.pageNumber == 1) {
                that.setData({
                    list
                })
            } else {
                let listTemp = that.data.list
                listTemp = listTemp.concat(list)
                that.setData({
                    list: listTemp
                })
            }
            return list.length == page.pageSize
        },
    },
})