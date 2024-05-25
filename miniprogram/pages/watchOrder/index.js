const app = getApp()
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 页面的初始数据
     */
    data: {
        orderList: [],
        newOrder: null,
        isLoading: false,
        shop: null,
        containerHeight: app.globalData.containerHeight,
    },
    attached() {
        // this.watchOrder()
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 切换店铺
         */
        onShopChange(e) {
            let shop = e.detail
            this.setData({
                shop
            })
            this.watchOrder()
            this.getOrderList();
        },
        watchOrder() {
            db.collection('order').where({
                    shopId: this.data.shop._id,
                    state: 1
                })
                .watch({
                    onChange: function (res) {
                        //监控数据发生变化时触发
                        if (res.docChanges != null) {
                            for (const changeData of res.docChanges) {
                                if (changeData.dataType == "add") {
                                    console.log("add");
                                    setData({
                                        newOrder: changeData.doc
                                    })
                                }
                                if (changeData.dataType == "remove") {
                                    console.log("remove");
                                    // that.removeCommentInList(changeData.docId)
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
            this.setData({
                isLoading: true
            });
            const res = await db.collection('order').where({
                shopId: this.data.shop._id,
                state: 1
            }).orderBy('createDate', 'desc').get()

            let orderList = res?.data || [];
            // orderList = orderList.map((value) => {
            //     if (value.createDate) {
            //         value.createDate = value.createDate.toISOString()
            //     }
            //     return value
            // })
            console.log(orderList);
            this.setData({
                isLoading: false,
                orderList
            });
        },
        setOrderFinish(e) {
            const id = e.currentTarget.dataset.id
            console.log(id);
            wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'updateOrder',
                    id,
                    data: {
                        state: 2
                    },
                },
            }).then((res) => {
                if (res.result.success) {
                   wx.showToast({
                     title: '设置成功',
                   })
                } else {
                   
                }
            })
        }
    },

})