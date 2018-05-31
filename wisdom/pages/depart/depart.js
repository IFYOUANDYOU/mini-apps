// pages/depart/depart.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    departid: "",
    menuindex: 1,
    flexmenu: false,
    departInfo:{}
  },
//菜单切换
  menuBind: function(e){
    var _this = this;
    var typeindex = e.currentTarget.dataset.typeindex;
    _this.setData({
      menuindex: typeindex
    })
  },
  //医生风采点击
  expertBind: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    util.navigateTo("/pages/doctor/doctor?id=" + id);
  },
  //经典案例点击
  caseBind: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    util.navigateTo("/pages/caseDetail/caseDetail?caseid=" + id);
  },
  //导医路线
  routeBind: function (e) {
    var _this = this;
    var serial_number = e.currentTarget.dataset.number;
    if (serial_number) {
      util.navigateTo("/pages/reRoute/reRoute?serial_number=" + serial_number)
    }else{
      util.showToast("暂无导医路线");
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var departid = options.departid;
    _this.setData({
      departid: departid
    })
    var url = app.globalData.url + "/follow.php/Department/" + departid;
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
            departInfo: datas,
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

  //滚动事件
  onPageScroll: function(options){
    var _this = this;
    var scrollTop = options.scrollTop;
    var query = wx.createSelectorQuery();
    var flex;
    query.select('#graphic').boundingClientRect();
    query.exec(function (res) {
      var height = res[0].height;
      if (scrollTop > height){
        flex = true
      }else{
        flex = false
      }
      _this.setData({
        flexmenu: flex
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: '智慧创泰医疗',
      path: 'pages/depart/depart?departid=' + this.data.departid,
      success: function (res) {
        console.log("转发成功", res);
      },
      fail: function (res) {
        console.log("转发失败", res);
      }
    }
  }
})