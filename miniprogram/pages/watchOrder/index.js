const app = getApp()
const db = wx.cloud.database()
var load = true
var that = null
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        tableList: [],
        isLoading: false,
        isRefreshing: false,
        showDialogTable: false,
        orderCur: null,
        tableSeatsIdCur: null,
        shop: null,
        containerHeight: app.globalData.containerHeight,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
        getListData: null
    },
    attached() {
        that = this
        this.setData({
            getListData: this.getOrderList
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
            let shop = e.detail
            this.setData({
                shop
            })
            await this.getTablesList();
            this.watchOrder()
            await this.getOrderList();
        },
        async getTablesList() {
            if (!this.data.shop) {
                this.setData({
                    isLoading: false
                });
                return
            }
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getIdleTable',
                    entity: {
                        shopId: this.data.shop._id
                    }
                }
            })
            // console.log(res);
            let tableList = res?.result.list || [];
            tableList = tableList.map((item, index) => {
                item.value = index
                return item
            })
            tableList.push({
                _id: null,
                name: '未选桌',
                value: tableList.length
            })
            this.setData({
                tableList
            });
        },
        watchOrder() {
            let that = this
            db.collection('order').where({
                    shopId: this.data.shop._id,
                    state: 1
                })
                .watch({
                    onChange: (res) => {
                        console.log("onChange", res);
                        //监控数据发生变化时触发
                        if (res.docChanges != null) {
                            for (const changeData of res.docChanges) {
                                if (changeData.dataType == "update") {
                                    console.log("watch", changeData);
                                    that.getOrderList()
                                }
                                if (changeData.dataType == "remove") {
                                    console.log("remove");
                                }
                            }
                        }
                    },
                    onError: (err) => {
                        console.error(err)
                    }
                })
        },

        async getOrderList(page = {
            pageNumber: 1,
            pageSize: 10
        }) {
            that.setData({
                isLoading: true
            })
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getOngoingOrdersList',
                    entity: {
                        shopId: that.data.shop._id,
                    },
                    page,
                },
            });
            console.log("AA", res);
            const orderList = res.result.data || [];
            if (page.pageNumber == 1) {
                that.setData({
                    orderList,
                    isLoading: false,
                })
            } else {
                let listTemp = that.data.orderList
                listTemp = listTemp.concat(orderList)
                that.setData({
                    orderList: listTemp,
                    isLoading: false,
                })
            }
            return orderList.length == page.pageSize
        },
        async setOrderServing(e) {
            const data = e.currentTarget.dataset.data
            this.setData({
                orderCur: data
            })
            if (!data.tableSeatsId) {
                await this.getTablesList()
                this.setData({
                    showDialogTable: true
                })
                return
            }
            this.setOrderServingRel(data)
        },
        setOrderServingRel(data) {
            console.log(data);
            wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'updateOrder',
                    entity: {
                        _id: data._id,
                        tableSeatsId: data.tableSeatsId,
                        state: 2
                    }
                },
            }).then((res) => {
                if (res.result.success) {
                    wx.showToast({
                        title: '设置成功',
                    })
                } else {
                    wx.showToast({
                        title: res.result.errMsg,
                        icon: 'error'
                    })
                    console.log(res);
                }
            })
        },
        onTableSelecte(e) {
            this.setData({
                tableSeatsIdCur: e.detail.value
            })
        },
        onSure(e) {
            this.setData({
                showDialogTable: false
            })
            const data = this.data.orderCur
            data.tableSeatsId = this.data.tableSeatsIdCur
            this.setOrderServingRel(data)
        },
        onCancle(e) {
            this.setData({
                showDialogTable: false
            })
        },
        setOrderFinish(e) {
            const data = e.currentTarget.dataset.data
            wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'updateOrder',
                    entity: {
                        _id: data._id,
                        state: 3
                    }
                },
            }).then((res) => {
                if (res.result.success) {
                    wx.showToast({
                        title: '设置成功',
                    })
                    this.getOrderList()
                } else {
                    console.log(res);
                }
            })
        },
    },

})