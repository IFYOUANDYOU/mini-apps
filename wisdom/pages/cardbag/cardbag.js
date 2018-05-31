// pages/cardbag/cardbag.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    couponlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcards()
  },
  //获取电子券
  getcards: function (e) {
    var _this = this;
    var userid = app.globalData.userId;
    var url = app.globalData.url + "/follow.php/Couponlis/" + userid;
    util.showLoading("提交中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        _this.setData({
          statu: true,
          couponlist: res.data.data
        })
        if (res.data.code != 200) {
          util.showToast(res.data.msg ? res.data.msg : '未知错误')
        }
      },
      //失败
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    )
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})