const {
    envList
} = require('../../envList');

// pages/me/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        openId: '',
        showUploadTip: false,
        canIUseGetUserProfile: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad(options) {
        // if (wx.getUserProfile) {
        //     this.setData({
        //         canIUseGetUserProfile: true
        //     })
        // }
        // 查看是否授权
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: (res) => {
                            console.log(res.userInfo)
                            this.setData({
                                hasUserInfo: true
                            })
                        }
                    })
                }
            }
        })
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        this.getOpenId();
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    bindGetUserInfo(e) {
        console.log(e.detail.userInfo)
        this.setData({
            hasUserInfo: true
        })
    },
    getOpenId() {
        // console.log("TTT",resp.result.openid)
        wx.showLoading({
            title: '',
        });
        wx.cloud
            .callFunction({
                name: 'quickstartFunctions',
                data: {
                    type: 'getOpenId',
                },
            })
            .then((resp) => {
                console.log("WW", this.data.userInfo)
                console.log("WW", resp)

                this.setData({
                    haveGetOpenId: true,
                    openId: resp.result.openid,
                });
                wx.hideLoading();
            })
            .catch((e) => {
                this.setData({
                    showUploadTip: true,
                });
                wx.hideLoading();
            });
    },

    gotoWxCodePage() {
        wx.navigateTo({
            url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
        });
    },
});