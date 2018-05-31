// pages/reRoute/reRoute.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    routeDepartId: null,
    routes: []
  },

  //获取路线
  getRoute: function(e){
    var _this = this;
    var routeDepartId = _this.data.routeDepartId;
    var userid = app.globalData.userId;
    var url = app.globalData.url + "/follow.php/Route/" + routeDepartId + "/" + userid;
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
            routes: datas,
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
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    util.showLoading("加载中")
    var serial_number = options.serial_number;
    _this.setData({
      routeDepartId: serial_number
    })
    if (app.globalData.userId != "") {
      _this.getRoute();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  routeBind: function (e) {
    var _this = this;
    var type = e.currentTarget.dataset.type;
    var start = e.currentTarget.dataset.start;
    var end = e.currentTarget.dataset.end;
    var routeDepartId = _this.data.routeDepartId;
    util.navigateTo("/pages/daoYi/daoYi?type=" + type + "&routeDepartId=" + routeDepartId + "&startCode=" + start + "&endCode=" + end)
  }
})