// pages/about/about.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aboutInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.localhost + '/api/User/about',
      data: { userId: app.globalData.userId },
      success: function (res) {
        that.setData({
          aboutInfo: res.data.show_data
        })
      }
    })
  }
})