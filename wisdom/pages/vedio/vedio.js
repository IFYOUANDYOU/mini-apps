// pages/vedio/vedio.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    menuindex: 1,
    flexmenu: false,
    department: {}
  },

  //菜单切换
  menuBind: function (e) {
    var _this = this;
    var typeindex = e.currentTarget.dataset.typeindex;
    _this.setData({
      menuindex: typeindex
    })
  },

  //图片点击事件
  previewImage: function (event) {
    var _this = this;
    var src = event.currentTarget.dataset.src;
    var equipments = _this.data.department.equipment;
    var imgList = [];
    for (var i in equipments) {
      var item = equipments[i];
      imgList.push(item["equipment_img"])
    }
    if (imgList.length != 0){
      //图片预览
      wx.previewImage({
        current: src,
        urls: imgList
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var departid = options.departid;
    var url = app.globalData.url + "/follow.php/Dlip/" + departid;
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
        util.showToast(res.data.msg);
      },
      function (res) {
        wx.hideLoading();
      }
    )
  },
  //导医路线
  routeBind: function(e){
    var _this = this;
    var serial_number = e.currentTarget.dataset.number;
    if (serial_number){
      util.navigateTo("/pages/reRoute/reRoute?serial_number=" + serial_number)
    }
  },
  //滚动事件
  onPageScroll: function (options) {
    var _this = this;
    var scrollTop = options.scrollTop;
    var query = wx.createSelectorQuery();
    var flex;
    query.select('#graphic').boundingClientRect();
    query.exec(function (res) {
      var height = res[0].height;
      if (scrollTop > height) {
        flex = true
      } else {
        flex = false
      }
      _this.setData({
        flexmenu: flex
      })
    })
  }
})
