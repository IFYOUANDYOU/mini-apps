// pages/hospital/hospital.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    hospital: {}
  },

  //专家团队点击
  expertBind: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    util.navigateTo("/pages/doctor/doctor?id=" + id);
  },

  //图片点击事件
  previewImage: function (event) {
    var _this = this;
    var types = event.currentTarget.dataset.type;
    var src = event.currentTarget.dataset.src;
    var environments = _this.data.hospital.ad_img;
    var equipments = _this.data.hospital.ad_imgs;
    var imgList = [];
    console.log(types)
    if (types == "environment"){
      for (var i in environments) {
        var item = environments[i];
        imgList.push(item["Adver_img"])
      }
    }else{
      for (var i in equipments) {
        var item = equipments[i];
        imgList.push(item["Adver_img"])
      }
    }
    if (imgList.length != 0) {
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
    wx.showShareMenu({
      withShareTicket: true
    })
    var url = app.globalData.url + "/follow.php/Hospital";
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
            hospital: datas,
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
      path: 'pages/hospital/hospital',
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