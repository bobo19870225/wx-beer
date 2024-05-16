
Page({
  data: {
    goodsList: [{
      _id: '1',
      title: '商品1',
      price: 1,
    }],
  },

  onLoad() {
    // wx.cloud.init({ env: 'beer-1g75udik38f745cf' });
    // const db =  wx.cloud.database();
    this.fetchGoodsList();
    // db.collection('sales').get().then((res)=>{
    //     console.log("EEE",res)
    //     const goodsList = res?.data || [];
    //     this.setData({
    //         isLoading: false,
    //         goodsList
    //       });
    // });
  },

  async fetchGoodsList() {
    this.setData({ isLoading: true });
    const res = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: { type: 'fetchGoodsList' },
    });
    console.log("QQQ",res)
    const goodsList = res?.result?.dataList || [];
    this.setData({
      isLoading: false,
      goodsList
    });
  },

  async generateMPCode() {
    wx.showLoading();
    const resp = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'genMpQrcode',
        pagePath: 'pages/goods-list/index',
      }
    });
    this.setData({ codeModalVisible: true, codeImageSrc: resp?.result });
    wx.hideLoading();
  },
});   