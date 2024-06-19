var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
Page({
  data: {
    categoriesWx: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    series: [],
    windowWidth: 320,
    lineChart: null,
    zcLineChart: null,
    incom: 0,
    out: 0,
    isShopManage: false
  },
  onShopChange(e) {
    this.getBillStatistics()
  },
  onLoad: function (e) {
    this.setData({
      isShopManage: e.isShopManage == 'true'
    })
    try {
      var res = wx.getSystemInfoSync();
      const windowWidth = res.windowWidth;
      this.setData({
        windowWidth
      })

    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
  },
  onReady: function (e) {

  },
  async getBillStatistics() {
    const shop = await app.getShop()
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getBillStatistics',
        entity: {
          type: 3,
          shopId: shop._id,
        },
      },
    }).then((res) => {
      const list = res.result.list
      const data = []
      let out = 0
      for (let index = 1; index < 13; index++) {
        let value = 0
        for (let i = 0; i < list.length; i++) {
          const element = list[i];
          if (index == element._id) {
            value = Math.abs(element.money)
            break
          }
        }
        out += value
        data.push(value)
      }
      const series = [{
        name: '支出',
        data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }]
      const zcLineChart = new wxCharts({
        canvasId: 'zcLineCanvas',
        type: 'line',
        categories: this.data.categoriesWx,
        animation: true,
        background: '#fff',
        series,
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          title: '成交金额 (元)',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: this.data.windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      this.setData({
        out,
        zcLineChart
      })
    })
    const resVip = await wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getBillStatistics',
        entity: {
          type: 0,
          shopId: shop._id,
        },
      },
    })
    const list = resVip.result.list
    const data = []
    let incom = 0
    for (let index = 1; index < 13; index++) {
      let value = 0
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if (index == element._id) {
          value = element.money
          break
        }
      }
      incom += value
      data.push(value)
    }
    this.setData({
      series: [{
        name: '会员充值',
        data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      }]
    })
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getBillStatistics',
        entity: {
          type: 2,
          shopId: shop._id,
        },
      },
    }).then((res) => {
      const list = res.result.list
      const data = []
      for (let index = 1; index < 13; index++) {
        let value = 0
        for (let i = 0; i < list.length; i++) {
          const element = list[i];
          if (index == element._id) {
            value = element.money
            break
          }
        }
        incom += value
        data.push(value)
      }
      const series = this.data.series
      series.push({
        name: '微信支付',
        data,
        format: function (val, name) {
          return val.toFixed(2) + '元';
        }
      })
      this.setData({
        incom,
        series
      })
      const lineChart = new wxCharts({
        canvasId: 'wxLineCanvas',
        type: 'line',
        categories: this.data.categoriesWx,
        animation: true,
        background: '#fff',
        series: this.data.series,
        xAxis: {
          disableGrid: true,
        },
        yAxis: {
          title: '成交金额 (元)',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: this.data.windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      this.setData({
        lineChart
      })
    })
  },
  touchHandler: function (e) {
    this.data.lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  zcTouchHandler(e) {
    this.data.zcLineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  }
});