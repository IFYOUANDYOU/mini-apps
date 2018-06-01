// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    hasNoOrder: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.localhost + '/api/Order/medicalHistoryList',
      data: { userId: app.globalData.userId},
      success: function(res) {
        console.log(res)
        if (res.data.show_data){
          that.setData({
            hasNoOrder: false,
            orders: res.data.show_data
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  detail: function(e){
    var order_id = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '/pages/orderDt/orderDt?orderId=' + order_id,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  }
})