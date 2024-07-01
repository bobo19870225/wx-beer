Component({
    /**
     * 组件的一些选项
     */
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        style: {
            type: String,
            value: ''
        },
        getListData: {
            type: Function,
        },
        page: {
            type: Object,
            value: {
                pageNumber: 1,
                pageSize: 10
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isLoadMore: false,
        hasMore: true,
        isRefreshing: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async loadData() {
            this.properties.page.pageNumber = 1
            console.log(this.properties.getListData);
            const hasMore = await this.properties.getListData(this.properties.page)
            console.log(hasMore);
            this.setData({
                hasMore,
                isRefreshing: false
            })
        },
        async loadMoreData() {
            console.log("loadMoreData");
            if (this.data.isLoadMore || !this.data.hasMore) {
                return
            }
            this.properties.page.pageNumber++
            this.setData({
                isLoadMore: true
            });
            const hasMore = await this.properties.getListData(this.properties.page)
            this.setData({
                hasMore,
                isLoadMore: false
            })
        }
    }
})