const app = getApp()
const db = wx.cloud.database()
Component({
    options: {
        addGlobalClass: true,
    },

    /**
     * 页面的初始数据
     */
    data: {
        isLoading: false,
        loading: true,
        isRefreshing: false,
        userInfo: {},
        vipInfo: null,
        containerHeight: app.globalData.containerHeight,
        showPayDialog: false,
        showRoleDialog: false,
        vips: null,
        vipPackage: null,
        vipPackageBuy: null,
        shop: null,
        isShopManage: false,
        roleList: [],
        totalCouponNumber: 0
    },
    attached() {

    },
    show() {
        console.log("show");
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async getUser(forceupdates) {
            const res = await app.getUserInfoAll(forceupdates, "user-center")
            const userInfo = res.userInfo
            const vipInfo = res.vipInfo
            const isSuperManage = userInfo?.isSuperManage || false
            const isShopManage = userInfo?.manageShopIds?.length > 0 || false
            if (isSuperManage) {
                this.setData({
                    roleList: [{
                        text: '管理员',
                        value: 'superManage'
                    }, {
                        text: '店长',
                        value: 'shopManage'
                    }, {
                        text: '客户',
                        value: 'client',
                        checked: true
                    }]
                })
            } else if (isShopManage) {
                this.setData({
                    roleList: [{
                        text: '店长',
                        value: 'shopManage'
                    }, {
                        text: '客户',
                        value: 'client',
                        checked: true
                    }]
                })
            }
            // 计算优惠券总数量
            let totalCouponNumber = 0;
            if (vipInfo && vipInfo.account.coupon && vipInfo.account.coupon.length > 0) {
                vipInfo.account.coupon.forEach(element => {
                    totalCouponNumber += element.number
                });
            }
            this.setData({
                userInfo,
                isShopManage,
                vipInfo,
                totalCouponNumber,
                isRefreshing: false
            })
        },
        /**
         * 更换头像
         * @param {*} e 
         */
        onChooseAvatar(e) {
            wx.showLoading({
                title: '上传中...'
            })
            const {
                avatarUrl
            } = e.detail
            const userInfo = this.data.userInfo
            const cloudPath = 'userAvatar/' + userInfo._openid + Date.now() + '.png'
            // 将图片上传至云存储空间
            wx.cloud.uploadFile({
                // 指定上传到的云路径
                cloudPath: cloudPath,
                // 指定要上传的文件的小程序临时文件路径
                filePath: avatarUrl,
                // 成功回调
                success: res => {
                    userInfo.avatarUrl = res.fileID
                    wx.cloud.callFunction({
                        name: 'quickstartFunctions',
                        data: {
                            type: 'updateUser',
                            entity: {
                                _id: userInfo._id,
                                avatarUrl: userInfo.avatarUrl
                            }
                        }
                    }).then((res) => {
                        if (res.result.success) {
                            this.setData({
                                userInfo
                            })
                        }
                        wx.hideLoading()
                        console.log("updateUser", res);
                    })
                },
                complete: res => {}
            })
        },
        /**
         * 切换店铺
         */
        async onShopChange(e) {
            let shop = e.detail
            this.setData({
                shop,
            })
            this.initData()
        },
        /**
         * 拉取数据
         */
        async initData() {
            this.setData({
                loading: true,
                vipPackageBuy: null
            })
            await this.getUser(true)
            await this.getVipType();
            let vips = this.data.vips.map((item) => {
                item.checked = false
                return item
            })
            this.setData({
                loading: false,
                vips
            })
        },
        /**
         * 切换角色
         * @param {*} e 
         */
        onSelecteRole(e) {
            const mode = e.detail.value
            this.triggerEvent('onSwitchMode', mode)
        },
        closeRoleDialog() {
            this.setData({
                showRoleDialog: false
            })
        },
        async getVipType() {
            const res = await db.collection('vipPackage').where({
                isDelete: false
            }).get()
            let vips = res.data
            if (this.data.vipInfo && this.data.vipInfo.isBuyFans) {
                vips.shift()
            }
            this.setData({
                vips
            })
        },
        gotoApplicationPage() {
            wx.navigateTo({
                url: `/pages/application/index`,
            });
        },
        gotoBillPage() {
            wx.navigateTo({
                url: `/pages/user-center/bill/index`,
            });
        },
        gotoCouponPage() {
            wx.navigateTo({
                url: `/pages/manage/coupon/index`,
            });
        },

        radioChange(e) {
            let id = e.detail.value
            let vipPackageBuy = null
            this.data.vips.forEach(element => {
                if (element._id == id) {
                    vipPackageBuy = element
                }
            });
            this.setData({
                vipPackageBuy
            })
        },
        /**
         * 在线充值
         * 先判断 用户信息是否完善，不完善跳转设置页面
         */
        toBeVip() {
            if (this.data.userInfo?.phone) {
                this.setData({
                    showPayDialog: true
                })
            } else {
                const that = this
                wx.showModal({
                    title: '重要提示',
                    content: '为保障您的会员权益和提供优质的会员服务，需要您完善个人信息后再购买会员套餐。',
                    success(res) {
                        if (res.confirm) {
                            that.gotoSettingPage()
                        }
                    }
                })

            }
        },
        async payVip() {
            const vipPackageBuy = this.data.vipPackageBuy
            if (!vipPackageBuy) {
                wx.showToast({
                    title: '请选择会员套餐',
                    icon: "error"
                })
                return
            }
            const shop = await app.getShop()
            const price = Number.parseFloat(vipPackageBuy.price)
            const entry = Number.parseFloat(vipPackageBuy.entry)
            const couponNumber = vipPackageBuy.couponNumber
            const coupon = vipPackageBuy.coupon.map((value, index) => {
                return {
                    couponId: value,
                    number: couponNumber[index]
                }
            })
            console.log(price);
            wx.showLoading({
                title: '正在支付...',
                mask: true
            })
            /**
             * 调起微信支付
             */
            let that = this
            wx.cloud.callFunction({
                name: 'wxpayFunctions',
                data: {
                    type: 'wxpay_order',
                    data: {
                        description: 'VIP充值',
                        // total: 0.01 //测试
                        total: price //金额
                    }
                },

                success: (res) => {
                    console.log('下单结果: ', res);
                    const paymentData = res.result?.data;
                    if (!paymentData) {
                        wx.hideLoading()
                        wx.showToast({
                            title: '金额异常',
                            icon: 'error'
                        })
                        return
                    }
                    // 唤起微信支付组件，完成支付
                    wx.requestPayment({
                        timeStamp: paymentData?.timeStamp,
                        nonceStr: paymentData?.nonceStr,
                        package: paymentData?.packageVal,
                        paySign: paymentData?.paySign,
                        signType: 'RSA', // 该参数为固定值
                        success(res) {
                            // 支付成功回调，实现自定义的业务逻辑
                            console.log('唤起支付组件成功：', res);
                            const vipPackageId = vipPackageBuy._id
                            that.setData({
                                isLoading: true
                            })
                            wx.cloud.callFunction({
                                name: 'quickstartFunctions',
                                data: {
                                    type: 'payForVip',
                                    entity: {
                                        shopId: shop._id,
                                        name: that.data.userInfo.name,
                                        vipPackageId,
                                        price,
                                        entry,
                                        coupon
                                    }
                                },
                            }).then((res) => {
                                that.setData({
                                    isLoading: false
                                })
                                that.closePayDialog()
                                that.initData()
                            });
                        },
                        fail(err) {
                            wx.showToast({
                                title: '取消支付',
                                icon: 'error'
                            })
                            // 支付失败回调
                            console.error('唤起支付组件失败：', err);
                        },
                        complete() {
                            wx.hideLoading()
                        }
                    });
                },
            });
        },
        closePayDialog() {
            let vips = this.data.vips.map((item) => {
                item.checked = false
                return item
            })
            this.setData({
                showPayDialog: false,
                vips,
                vipPackageBuy: null
            })
        },
        gotoSettingPage(e) {
            const that = this
            wx.navigateTo({
                url: '/pages/user-center/setting/index',
                events: {
                    callbackData: (userInfo) => {
                        // console.log("callbackData", userInfo);
                        that.setData({
                            userInfo
                        })
                    },
                },
            })
        },
        switchMode() {
            this.setData({
                showRoleDialog: true
            })
        }
    },

});