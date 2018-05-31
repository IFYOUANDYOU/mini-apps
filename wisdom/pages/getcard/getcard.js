// pages/getcard/getcard.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    portrait: '',
    coupontype: '',
    helpUserId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var helpUserId = options.userId ? options.userId : '';
    if (helpUserId == app.globalData.userId) {
      console.log("helpUserId:" + helpUserId + "\nuserid:" + app.globalData.userId)
      util.redirectTo("/pages/cardbag/cardbag");
      return false;
    }
    _this.setData({
      helpUserId: helpUserId
    })
    _this.getData();
    console.log("helpUserId:" + _this.data.helpUserId)
  },
  getData: function(){
    var _this = this;
    var helpUserId = _this.data.helpUserId;
    if (helpUserId != ''){
      var url = app.globalData.url + "/follow.php/Couponpor/" + app.globalData.userId + "/" + helpUserId;
      console.log(url)
      util.showLoading("加载中");
      util.requestUrl(
        url,
        null,
        null,
        null,
        null,
        //成功
        function (res) {
          console.log(res)
          if (res.data.code != 200) {
            util.showToast(res.data.msg)
            return false
          }
          if (res.data.data.status == 1){
            util.redirectTo("/pages/cardbag/cardbag");
            return false;
          }
          _this.setData({
            statu: true,
            portrait: res.data.data.user_img,
            coupontype: res.data.data.type
          })
        },
        //失败
        function (res) {
          _this.setData({
            statu: false
          })
          util.showToast('请求失败，请检查网络')
        },
        //完成
        function (res) {
          wx.hideLoading();
        }
      )
    }else{
      _this.setData({
        statu: false
      })
    }
  },

  //领取电子券
  getcard: function(e){
    var _this = this;
    var userid = app.globalData.userId;
    var helpUserId = _this.data.helpUserId;
    var url = app.globalData.url + "/follow.php/Coupon/" + userid + "/" + helpUserId;
    util.showLoading("提交中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.code != 200) {
          util.showToast(res.data.msg)
          return false
        }
        wx.showModal({
          title: '领取成功',
          content: '一张电子券已经放入您的卡包中！',
          success: function (res) {
            if (res.confirm) {
              util.redirectTo("/pages/cardbag/cardbag");
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      //失败
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})