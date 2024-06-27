const app = getApp()
const db = wx.cloud.database()
Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        containerHeight: app.globalData.containerHeight,
        isLoading: false,
        tablesList: null,
        shop: null,
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
            this.getTablesList();
        },
        async getTablesList() {
            this.setData({
                isLoading: true
            });
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
            const tablesList = res?.data || [];
            this.setData({
                isLoading: false,
                tablesList
            });
        },
    }
})