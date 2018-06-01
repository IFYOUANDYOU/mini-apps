// pages/greenSee/greenSee.js
const app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.localhost + '/api/Medical/medicalProducts',
      data: { userId: app.globalData.userId},
      success: function(res){
        if (res.data.status == 200){
          that.setData({
            show_data: res.data.show_data
          })
        }
      }
    })
  },

  /*预约*/
  bookTime: function(e){
    var userId = app.globalData.userId;
    var order_id = e.currentTarget.dataset.order_id;
    wx.request({
      url: app.globalData.localhost + '/api/Login/information',
      data:{
        userId: userId,
        order_id: order_id,
        type: 1
      },
      success: function(res){
        if (res.data.status == 200){
          if (res.data.show_data == 1){
            util.navigateTo('/pages/verify/verify?order_id=' + order_id)
          }else{
            util.navigateTo('/pages/detection/detection?order_id=' + order_id)
          }
        } else {
          util.showToast(res.data.message)
        }
      },
      fail: function(res){
        util.showToast(res.data.message)
      },
      complete: function(res){
        wx.hideLoading()
      }
    })
  },
})