const app = getApp()
const db = wx.cloud.database()
var load = true
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
        shop: null,
        containerHeight: app.globalData.containerHeight,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
    },
    attached() {

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
            this.setData({
                isLoading: true
            });
            await this.getTablesList();
            this.watchOrder()
            await this.getOrderList();
            this.setData({
                isLoading: false
            });
        },
        async getTablesList() {
            if (!this.data.shop) {
                this.setData({
                    isLoading: false
                });
                return
            }
            const res = await db.collection('tableSeats').where({
                isDelete: false,
                shopId: this.data.shop._id
            }).get()
            let tableList = res?.data || [];
            tableList = tableList.map((item, index) => {
                item.value = index
                return item
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

        async getOrderList() {
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getOrderList',
                    entity: {
                        shopId: this.data.shop._id,
                        state: 1
                    }
                },
            });
            const orderList = res?.result?.list || [];
            this.setData({
                isRefreshing: false,
                orderList
            });
        },
        setOrderFinish(e) {
            const data = e.currentTarget.dataset.data
            wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'updateOrder',
                    entity: {
                        _id: data._id,
                        state: 2
                    }
                },
            }).then((res) => {
                if (res.result.success) {
                    wx.showToast({
                        title: '设置成功',
                    })
                } else {
                    console.log(res);
                }
            })
        },
        tabSelect(e) {
            console.log("RRR", e);
            this.setData({
                TabCur: e.currentTarget.dataset.index,
                MainCur: e.currentTarget.dataset.index,
                VerticalNavTop: (e.currentTarget.dataset.index - 1) * 50
            })
        },
        VerticalMain(e) {
            let that = this;
            let list = this.data.tableList;
            let tabHeight = 0;
            if (load) {
                for (let i = 0; i < list.length; i++) {
                    let view = this.createSelectorQuery().select("#main-" + list[i].value);
                    view.fields({
                        size: true
                    }, data => {
                        list[i].top = tabHeight;
                        tabHeight = tabHeight + data.height;
                        list[i].bottom = tabHeight;
                    }).exec();
                }
                load = false
                that.setData({
                    tableList: list
                })
            }
            let scrollTop = e.detail.scrollTop + 20;
            for (let i = 0; i < list.length; i++) {
                if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                    that.setData({
                        VerticalNavTop: (list[i].value - 1) * 50,
                        TabCur: list[i].value
                    })
                    return false
                }
            }
        }
    },

})