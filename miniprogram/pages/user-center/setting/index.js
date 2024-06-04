// pages/user-center/setting/index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    mobile: null,
    birthday: '请选择',
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
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
    this.setData({
      birthday: e.detail.value
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

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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