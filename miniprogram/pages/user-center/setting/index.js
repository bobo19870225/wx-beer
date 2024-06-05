const app = getApp()
const db = wx.cloud.database({
  env: 'beer-1g75udik38f745cf'
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    birthday: null
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    const userInfo = this.data.userInfo
    userInfo.avatarUrl = avatarUrl
    this.setData({
      userInfo
    })
  },
  getPhoneNumber(e) {
    console.log(e);
    var that = this;
    wx.showToast({
      title: '企业账号才能调用',
    })
    // wx.cloud.callFunction({
    //   name: 'getMobile',
    //   data: {
    //     weRunData: wx.cloud.CloudID(e.detail.cloudID),
    //   }
    // }).then(res => {
    //   that.setData({
    //     mobile: res.result,
    //   })
    // }).catch(err => {
    //   console.error(err);
    // });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // const userInfo = this.data.userInfo
    const birthday = e.detail.value
    this.setData({
      birthday
    })
  },
  formSubmit(e) {
    const phone = e.detail.value.phone
    const birthday = e.detail.value.birthday
    const name = e.detail.value.name
    if (!name) {
      wx.showToast({
        title: '姓名必填',
        icon: 'error'
      })
      return
    }
    if (!phone) {
      wx.showToast({
        title: '手机号必填',
        icon: 'error'
      })
      return
    }
    if (!birthday) {
      wx.showToast({
        title: '生日必填',
        icon: 'error'
      })
      return
    }
    console.log('提交携带数据为：', e.detail.value)
    this.setData({
      isLoading: true
    })
    const userInfo = this.data.userInfo
    userInfo.name = name
    userInfo.phone = phone
    userInfo.birthday = birthday
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'updateUser',
        data: userInfo
      }
    }).then((res) => {
      if (res.result.success) {
        this.setData({
          isLoading: false
        })
        this.getOpenerEventChannel()?.emit('callbackData', userInfo)
        wx.navigateBack()
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo()
  },
  async getUserInfo() {
    const _openid = await app.getOpenid()
    const res = await db.collection('user').where({
      isDelete: false,
      _openid
    }).get()
    // console.log(res);
    const userInfo = res.data[0] || {}
    const birthday = userInfo.birthday
    this.setData({
      userInfo,
      birthday
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

  }
})