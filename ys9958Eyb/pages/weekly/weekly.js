// pages/weekly/weekly.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weeks: [],
    hasNoWeeks: true,
    is_buy: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.localhost + '/api/Health/index',
      data: { userId: app.globalData.userId},
      success: function(res){
        that.setData({
          weeks: res.data.show_data.health,
          hasNoWeeks: false,
          is_buy: res.data.show_data.is_buy
        })
      }
    })
  },

  /*详情链接跳转*/
  weekDt: function(e){
    var article_id = e.currentTarget.dataset.article_id;
    wx.navigateTo({
      url: '/pages/weekDt/weekDt?article_id=' + article_id,
    })
  }
})