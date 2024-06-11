const app = getApp()
const db = wx.cloud.database({
    env: 'beer-1g75udik38f745cf'
})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        list: null,
        shop: null,
        showDialog: false,
        dialogData: {},
        containerHeight: app.globalData.containerHeight,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 切换店铺
     */
    onShopChange(e) {
        console.log(e);
        let shop = e.detail
        this.setData({
            shop
        })
        this.getApplicationList();
    },

    async getApplicationList() {
        this.setData({
            isLoading: true
        });
        const res = await wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
                type: 'getApplication',
                where: {
                    shopId: this.data.shop._id,
                    state: 0 //未处理
                }
            },
        });
        // console.log(res);
        const list = res?.result?.data || [];
        this.setData({
            isLoading: false,
            list
        });
    },
    /**
     * 审核通过
     * @param {*} e 
     */
    async applicationPass(e) {
        const task = e.currentTarget.dataset.item
        console.log(task);
        this.setData({
            isLoading: true,
        });
        const res = await db.collection('user').where({
            _openid: task._openid
        }).get()
        const userList = res.data
        if (userList && userList.length > 0) {
            const user = userList[0]
            if (user.roleList) {
                if (!user.roleList.includes('6e4509e966481f250116f98a68547370')) {
                    user.roleList.push('6e4509e966481f250116f98a68547370')
                }
            } else {
                user.roleList = ['6e4509e966481f250116f98a68547370']
            }
            const res = await wx.cloud.callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'updateUser',
                    entity: user
                }
            })
            if (res.result.success) {
                task.state = 1
                const resTask = await wx.cloud.callFunction({
                    name: 'quickstartFunctions',
                    data: {
                        type: 'updateTask',
                        entity: task
                    }
                })
                console.log(resTask);
                this.setData({
                    isLoading: false,
                });
                if (resTask.result.success) {
                    this.getApplicationList()
                }
            } else {
                this.setData({
                    isLoading: false,
                });
            }
        }
    },
    edit(e) {
        console.log(e);
        wx.navigateTo({
            url: '/pages/manage/dishes-edit/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data) {
                    console.log(data)
                },
                someEvent: function (data) {
                    console.log(data)
                }
            },
            success: (res) => {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    id: e.currentTarget.dataset.id,
                    shop: this.data.shop
                })
            }
        })
        // wx.navigateTo({
        //     url: '/pages/manage/dishes-edit/index?id=' + e.detail.id,
        // })
    },
    addGoods() {
        wx.navigateTo({
            url: '/pages/manage/dishes-edit/index',
            success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    shop: this.data.shop
                })
            }
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

    },

})