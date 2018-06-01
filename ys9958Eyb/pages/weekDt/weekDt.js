// pages/weekDt/weekDt.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageInfo: {
      article_id: '',
      article_time: '',
      content: '',
      img: '',
      title: '',
    },
    article_url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var article_id = options.article_id;
    wx.request({
      url: app.globalData.localhost + '/api/Health/healthInfo',
      data: {
        userId: app.globalData.userId,
        article_id: article_id
      },
      success: function(res){
        that.setData({
          pageInfo: res.data.show_data,
          article_url: 'https://www.ys9958.com/localWeb/eryibao/weekDt.html?article_id='+res.data.show_data.article_id
        })
      }
    })
  }
})