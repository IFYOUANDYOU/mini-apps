// pages/scan/scan.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {
    var _this = this;
    util.showLoading("加载中");
    if (app.globalData.userId != ""){
      wx.scanCode({
        success: (res) => {
          console.log(res)
          var resultUrl = res.path;
          var departId = util.GetQueryString(resultUrl, "departId");
          departId = departId == null ? "" : departId;
          var guideCode = util.GetQueryString(resultUrl, "guideCode");
          guideCode = guideCode == null ? "" : guideCode;
          var daoyiId = util.GetQueryString(resultUrl, "daoyiId");
          daoyiId = daoyiId == null ? "" : daoyiId;
          var daoyi = util.GetQueryString(resultUrl, "daoyi");
          daoyi = daoyi == null ? "" : daoyi;
          _this.getParameter(departId, guideCode, daoyiId, daoyi);
        },
        fail: function(res){
          wx.navigateBack({ delta: 10 })
        }
      })
    }else{
      wx.navigateBack({ delta: 10 })
    }
  },
  getParameter: function (departId, guideCode, daoyiId, daoyi, scan) {
    console.log("departId:" + departId + ";长度：" + departId.length)
    console.log("guideCode:" + guideCode + ";长度：" + guideCode.length)
    console.log("daoyiId:" + daoyiId + ";长度：" + daoyiId.length)
    console.log("daoyi:" + daoyi + ";长度：" + daoyi.length)
    wx.hideLoading();
    if (guideCode.length != 0) {
      if (departId.length != 0) {
        console.log("院内导航+科室详情")
        util.redirectTo("/pages/transit/transit?codeNumber=" + guideCode + "&serial_number=" + daoyiId + "&departid=" + departId)
      } else {
        console.log("院内导航")
        util.redirectTo("/pages/advertising/advertising?codeNumber=" + guideCode + "&serial_number=" + daoyiId)
      }
    } else if (daoyiId.length != 0) {
      if (app.globalData.userId != "") {
        console.log("快捷导医")
        util.redirectTo("/pages/reRoute/reRoute?serial_number=" + daoyiId)
      }
    } else {
      util.showToast("系统无法识别")
      wx.navigateBack({delta: 10})
    }
  }
})