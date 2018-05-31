// pages/record/record.js
//就诊记录列表
const app = getApp()
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    orders: [],
    hasNoOrder: false
  },

  //跳转详情
  detail: function (e) {
    var orderid = e.currentTarget.dataset.order_id
    util.navigateTo("/pages/message/message?orderid=" + orderid);
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //获取数据
  getData: function (e) {
    var _this = this;
    var userId = app.globalData.userId;
    var url = app.globalData.sfUrl + "Medical/lists";
    util.showLoading("加载中");
    //获取用户随访列表
    util.requestUrl(
      url,
      {
        userId: userId
      },
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.status == 200) {
          if (res.data.show_data.length != 0) {
            _this.setData({
              orders: res.data.show_data,
              statu: true
            })
          } 
        } else {
          util.showToast(res.data.message);
        }
      },
      //失败
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast("获取失败，请重试")
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  }
})