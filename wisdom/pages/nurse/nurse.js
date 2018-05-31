// pages/nurse/nurse.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    newnurse: [],
    count: 5,
    nurses: {},
    moreIcon: "/img/down.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var url = app.globalData.url + "/follow.php/Nursing";
    util.showLoading("加载中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          var datas = res.data.data;
          _this.setData({
            nurses: datas,
            statu: true
          })
          _this.getNurse();
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
  //
  getNurse: function(e){
    var _this = this;
    var newdata = [];
    var newnurse = _this.data.newnurse;
    var nurses = _this.data.nurses.nurse;
    for (var i in nurses) {
      var item = nurses[i];
      if (i < 5) {
        newdata.push(item);
      }
    }
    _this.data.newnurse = newdata;
    _this.setData({
      newnurse: newdata,
      count: nurses.length
    })
  },
  getArrow: function(e){
    var _this = this, moreIcon;
    var length = _this.data.newnurse.length;
    var lengths = _this.data.nurses.nurse.length;
    moreIcon = (length < lengths) ? "/img/down.png" :"/img/up.png"
    _this.setData({
      moreIcon: moreIcon
    })
  },
  nursesBind: function(e){
    var _this = this;
    var nurses = _this.data.nurses.nurse;
    var count = _this.data.count;
    var newnurse = _this.data.newnurse;
    if (newnurse.length==5){
      _this.setData({
        newnurse: nurses
      })
    }else{
      _this.getNurse();
    }
    _this.getArrow();
  },

  //健康小贴士点击
  graphicBind: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    if (id != ""){
      util.navigateTo("/pages/tip/tip?id=" + id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  }
})