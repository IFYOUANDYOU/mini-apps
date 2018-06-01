// pages/activity/activity.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamDesc: '',
    experts: [
      {expertid: '12', imgsrc: '/images/expert.jpg', name: '范仲会', physician: '主任医师/教授', hospital: '重庆市第三人民医院', department: '小儿内科', goodat: '儿科专家，专业三十年。'},
      {expertid: '13', imgsrc: '/images/service01.jpg', name: '范仲会', physician: '主任医师', hospital: '重庆市第三人民医院', department: '小儿内科', goodat: '儿科专家，专业三十年。' },
      {expertid: '14', imgsrc: '/images/service03.jpg', name: '范仲会', physician: '教授', hospital: '重庆市第三人民医院', department: '内科', goodat: '内科专家，专业三十年。' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.localhost + '/api/Health/Products',
      data: { userId: app.globalData.userId },
      success: function (res) {
        if (res.data.status == 200) {
          console.log(res)
          that.setData({
            teamDesc: res.data.show_data.title,
            experts: res.data.show_data.Products
          })
        }else{
          util.showToast(res.data.message)
        }
      },
      fail: function (res) { 
        util.showToast(res.data.message)
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  }

})