// pages/studio/studio.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    studio: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var url = app.globalData.url + "/follow.php/Famous";
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
          _this.setData({
            studio: datas,
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
  //医生点击
  expertBind: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    util.navigateTo("/pages/doctor/doctor?id=" + id);
  },
})