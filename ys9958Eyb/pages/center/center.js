// pages/center/center.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    userCenter: {},
    hasUser: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx:wx.request({
      url: app.globalData.localhost + '/api/User/index',
      data: { userId: app.globalData.userId },
      success: function(res) {
        if (res.data.status == 200){
          that.setData({
            hasUser: true,
            userCenter: res.data.show_data
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})