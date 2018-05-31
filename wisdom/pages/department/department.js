// pages/department/department.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    department: []
  },

  //科室点击
  departBind: function(e){
    var _this = this;
    var departid = e.currentTarget.dataset.departid;
    var special = e.currentTarget.dataset.special;
    if (special == "hushizhan"){
      util.navigateTo("/pages/nurse/nurse?departid=" + departid)
      return false
    }
    if (special == "fuke") {
      util.navigateTo("/pages/gynaecology/gynaecology?departid=" + departid)
      return false
    }
    if (special == "shoushu") {
      util.navigateTo("/pages/bone/bone?departid=" + departid)
      return false
    }
    if (special == "yingxiang") {
      util.navigateTo("/pages/vedio/vedio?departid=" + departid)
      return false
    } 
    util.navigateTo("/pages/depart/depart?departid=" + departid)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var url = app.globalData.url + "/follow.php/Category";
    util.showLoading("加载中")
    util.requestUrl(
      url, 
      null, 
      null, 
      null, 
      null,
      function(res){
        if (res.statusCode == 200){
          var datas = res.data.data;
          _this.setData({
            department: datas,
            statu: true
          })
          console.log(datas)
        }
      },
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast("加载出错");
      },
      function (res) {
        wx.hideLoading();
      }
    );
  }
})