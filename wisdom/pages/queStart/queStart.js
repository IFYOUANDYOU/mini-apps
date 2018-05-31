// pages/queStart/queStart.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: ['每个微信号只能领取一次红包,可重复答题', '活动时间:5月18日-6月18日24时', '每道题限时10秒钟','答题结束关注二郎医院公众号领取红包'],
    hasShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //点击开始答题
  answerBegin: function(){
    var _this = this;
    var hasShare = _this.data.hasShare;
    //util.navigateTo("/pages/question/question");
    if(hasShare){
      util.navigateTo("/pages/question/question");
    }else{
      util.showToast("您需要先分享才能参与答题领红包！")
    }
  },
  //分享
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      success: function (res) {
        console.log(res)
        // 转发成功获取群标识
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
        _this.setData({
          hasShare: !_this.data.hasShare
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})