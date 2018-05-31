// pages/doctor/doctor.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    doctorid: "",
    doctor: {},
    comment: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var doctorid = options.id;
    _this.setData({
      doctorid: doctorid
    })
    _this.getData(doctorid);
  },
  getData: function(id){
    var _this = this;
    var url = app.globalData.url + "/follow.php/Doctor/" + id;
    util.showLoading("加载中")
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        if (res.statusCode == 200) {
          var datas = res.data.data;
          var comments = (datas.comment ? datas.comment:'');
          _this.setData({
            doctor: datas.doctor,
            comment: comments,
            statu: true
          })
          console.log(datas)
        }
      },
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast(res.data.msg);
      },
      function (res) {
        wx.hideLoading();
      }
    );
  },
  onShareAppMessage: function () {
    return {
      title: '智慧创泰医疗',
      path: 'pages/doctor/doctor?id=' + this.data.doctorid,
      success: function (res) {
        console.log("转发成功", res);
        if (res.shareTickets) {
          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function (res) {
              console.log(res)
              var encryptedData = res.encryptedData;
              var iv = res.iv;
            }
          })
        }
      },
      fail: function (res) {
        console.log("转发失败", res);
      }
    }
  }
})