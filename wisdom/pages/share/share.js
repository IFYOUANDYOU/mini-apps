// pages/share/share.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: ['一次就诊只能参加一次', '抵用券仅限二郎医院使用', '本活动最终解释权归二郎医院所有']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //领取电子券
  getcard: function (e) {
    var _this = this;
    var userid = app.globalData.userId;
    var url = app.globalData.url + "/follow.php/Coupon/" + userid + "/" + 0;
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
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showModal({
            title: '分享成功',
            content: '一张电子券已经放入您的卡包中！',
            success: function (res) {
              if (res.confirm) {
                util.redirectTo("/pages/cardbag/cardbag");
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          return
        }
        if (res.data.code == 502) {
          util.showToast(res.data.msg);
          setTimeout(function(){
            util.redirectTo("/pages/cardbag/cardbag");
          },2000)
        }
        return false
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
        
      }
    )
  },
  //分享
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync('nickName') + "觉得二郎医院环境好、装修好、服务态度好",
      imageUrl: "http://www.ys9958.com/public/upload/lou/share.png",
      path: "/pages/getcard/getcard?userId=" + app.globalData.userId,
      success: function (res) {
        console.log(res)
        // 转发成功
        if (res.shareTickets){
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
        _this.getcard();
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  }
})