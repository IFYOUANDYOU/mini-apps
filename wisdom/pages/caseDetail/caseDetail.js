// pages/caseDetail/caseDetail.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: false,
    caseurl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var caseid = options.caseid;
    _this.setData({
      caseurl: app.globalData.url+"/follow.php/Cases/"+caseid
    })
  }
})