//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    statu: null,
    navigator: "/pages/hospital/hospital",
    graphic: "/img/index.jpg",
    hospital: {},
    information:[
      {
        id: 4, img: "/img/index.jpg", brief: "您知道如何才能长命百岁而不会老么？", time: "05/17",visit: 4414}
    ]
  },
  onLoad: function (options) {
    var _this = this;
    var userid = app.globalData.userId;
    _this.setData({
      options: options
    })
    _this.getIndex();
  },
  //获取首页信息
  getIndex: function (){
    var _this = this;
    var options = _this.data.options;
    var url = app.globalData.url + "/follow.php/Home";
    util.showLoading("提交中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          _this.setData({
            hospital: res.data.data,
            statu: true
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
        if (app.globalData.userId != "" && JSON.stringify(options) != '{}') {
          console.log(options)
          util.showLoading("请稍后");
          var departId = options.departId ? options.departId : "";
          var guideCode = options.guideCode ? options.guideCode : "";
          var daoyiId = options.daoyiId ? options.daoyiId : "";
          var daoyi = options.daoyi ? options.daoyi : "";
          var scan = options.scan ? options.scan : "";
          setTimeout(function () {
            _this.getParameter(departId, guideCode, daoyiId, daoyi, scan);
          }, 1500);
        }
      }
    );
  },
  //扫码
  scanCode: function (e) {
    var _this = this;
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
        var scan = util.GetQueryString(resultUrl, "scan");
        scan = scan == null ? "" : scan;
        _this.getParameter(departId, guideCode, daoyiId, daoyi, scan);
      }
    })
  },
  //链接判断
  getParameter: function (departId, guideCode, daoyiId, daoyi, scan) {
    console.log("departId:" + departId + ";长度：" + departId.length)
    console.log("guideCode:" + guideCode + ";长度：" + guideCode.length)
    console.log("daoyiId:" + daoyiId + ";长度：" + daoyiId.length)
    console.log("daoyi:" + daoyi + ";长度：" + daoyi.length)
    wx.hideLoading();
    if (scan.length != 0) {
      console.log("扫码")
      util.navigateTo("/pages/scan/scan")
    } else {
      if (guideCode.length != 0) {
        if (departId.length != 0) {
          console.log("院内导航+科室详情")
          util.navigateTo("/pages/transit/transit?codeNumber=" + guideCode + "&serial_number=" + daoyiId + "&departid=" + departId)
        } else {
          console.log("院内导航")
          util.navigateTo("/pages/advertising/advertising?codeNumber=" + guideCode + "&serial_number=" + daoyiId)
        }
      } else if (daoyiId.length != 0) {
        console.log("快捷导医")
        util.navigateTo("/pages/reRoute/reRoute?serial_number=" + daoyiId)
        return false
      } else {
        util.showToast("系统无法识别")
      }
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '智慧创泰医疗',
      path: 'pages/index/index',
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
  },
  //活动资讯点击
  infoBind: function(e){
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var theme = e.currentTarget.dataset.theme;
    if (theme == 1){
      util.navigateTo("/pages/queStart/queStart")
      return
    }
    util.navigateTo("/pages/tip/tip?id=" + id + "&type=" + type)
  },
  //打开卡包
  openBag: function(e){
    var _this = this;
  }
})
