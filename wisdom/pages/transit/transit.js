// pages/transit/transit.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departId: "",
    guideCode: "",
    daoyiId: "",
    departName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options)
    var departId = options.departid ? options.departid : "";
    var guideCode = options.codeNumber ? options.codeNumber : "";
    var daoyiId = options.serial_number ? options.serial_number : "";
    _this.setData({
      departId: departId,
      guideCode: guideCode,
      daoyiId: daoyiId
    })
    _this.getName();
  },
  getName: function(){
    var _this = this;
    var departId = _this.data.departId;
    if (departId != ""){
      var url = app.globalData.url + "/follow.php/dep/" + departId;
      util.showLoading("提交中");
      util.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          console.log(res)
          if (res.data.code == 200) {
            _this.setData({
              departName: res.data.data.name
            })
          }
        },
        function (res) {
          _this.setData({
            statu: false
          })
          util.showToast("网络出错，请稍后重试")
        },
        function (res) {
          wx.hideLoading();
        }
      )
    }
  },
  detailBind: function (e) {
    var departId = e.currentTarget.dataset.departid;
    if (departId == 23) {
      util.navigateTo("/pages/bone/bone?departid=" + departId)
    } else {
      util.navigateTo("/pages/depart/depart?departid=" + departId)
    }
  },
  guideBind: function (e) {
    var guideCode = e.currentTarget.dataset.codenumber;
    var daoyiId = e.currentTarget.dataset.daoyiid;
    util.navigateTo("/pages/advertising/advertising?codeNumber=" + guideCode + "&serial_number=" + daoyiId)
  }
})