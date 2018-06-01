// pages/verify/verify.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_data: {
      customer: '',
      code_num: '',
      usetime: '',
      hospital: ''
    }
  },

  phoneCall: function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNum
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.localhost + '/api/Order/useLogInfo',
      data: { userId: app.globalData.userId},
      success: function(res){
        if (res.data.status == 200){
          that.setData({
            show_data: res.data.show_data
          })
        }else{
          util.showToast(res.data.message)
        }
      },
      fail: function(res){
        util.showToast(res.data.message)
      },
      complete: function(res){
        wx.hideLoading();
      }
    })
  }
})