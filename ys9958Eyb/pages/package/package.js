// pages/package/package.js
const app = getApp();
var util = require('../../utils/util.js');
var PI = Math.PI;
var EARTH_RADIUS = 6378137.0; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packageInfo: {
      price: '',
      price_yh: '',
      needing: '',
      lecture_content: '',
      lecture: '',
      weekly_content: '',
      weekly: '',
      green_content: '',
      green: '',
      pro_id: ''
    },
    hidden: true,
    location: {},
    distance: 0,
    hospitals: [
      { name: '重庆二郎医院', tel: '023-68691200', longitude: '106.462780', latitude: '29.503440', distance: '0' },
      { name: '重庆三九医院', tel: '023-68168120', longitude: '106.450550', latitude: '29.504160', distance: '0' },
      { name: '重庆西城医院', tel: '023-68501999', longitude: '106.478970', latitude: '29.503040', distance: '0' },
      { name: '重庆文心医院', tel: '023-68603266', longitude: '106.488880', latitude: '29.507700', distance: '0' }
    ]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.showBusy('加载中');
    var that = this;
    var ds = [];
    var hospitals = that.data.hospitals;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var longitude = res.longitude, latitude = res.latitude;
        that.setData({
          location: {
            latitude: latitude,
            longitude: longitude,
          }
        });
        for (var i = 0; i < hospitals.length; i++) { 
          var lon = Number(hospitals[i].longitude);
          var lat = Number(hospitals[i].latitude);
          ds.push(that.getGreatCircleDistance(lat, lon, Number(that.data.location.latitude), Number(that.data.location.longitude)));
          hospitals[i].distance = ds[i];
          var dis = hospitals[i].distance
          that.setData({
            hospitals: hospitals
          })
        }
        console.log(that.data.hospitals)
      },
      fail: function(res){
        util.showModel('位置获取失败')
      }
    })
    wx.request({
      url: app.globalData.localhost + '/api/Medical/index',
      data: {userId: app.globalData.userId},
      success: function(res) {
        console.log(res)
        if (res.data.status == 200){
          wx.hideLoading();
          that.setData({
            packageInfo: res.data.show_data
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  //根据经纬度算距离
  getGreatCircleDistance: function (lat1, lng1, lat2, lng2, distance){
    var f = this.getRad((lat1 + lat2) / 2);
    var g = this.getRad((lat1 - lat2) / 2);
    var l = this.getRad((lng1 - lng2) / 2);
   
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);
    
    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;
    
    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;
   
    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;

    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    
    distance = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    distance = (distance / 1000).toFixed(1);

    return distance;
  },

  getRad: function(d) {
    return d * PI / 180.0;
  },

  //支付回调
  payMent: function(e){
    util.showBusy('请稍候');
    var that = this;
    var products_id = e.currentTarget.dataset.pro_id;
    wx.request({
      url: app.globalData.localhost + '/api/Medical/orderPay',
      data: {
        userId: app.globalData.userId,
        money: that.data.packageInfo.price_yh,
        openid: app.globalData.openid,
        products_id: products_id
      },
      success: function(res) {
        var data = res.data.show_data;
        if (res.data.status == 200){
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function (res) {
              util.showSuccess('支付成功，请稍等');
              util.navigateTo('/pages/order/order');
            },
            fail: function (res) {
              util.showModel(res.data.message)
            }
          })
        }else{
          util.showModel(res.data.message)
        }
      },
      fail: function(res) {
        util.showModel(res.data.message)
      },
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },

  /* 分享朋友圈 */
  onShareAppMessage: function () {
    if (res.from === 'button') {}
    return {
      title: '自定义转发标题',
      path: '/pages/package/package?userid=2',
      success: function (res) {
        console.log(res)
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  }
})