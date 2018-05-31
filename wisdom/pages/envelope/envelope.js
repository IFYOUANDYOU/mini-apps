// pages/envelope/envelope.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    helpUserId: null,
    peoples: [
      { id: 5, portrait: "/img/default.png", name: "老李"},
      { id: 6, portrait: "/img/default.png", name: "老李" },
      { id: 7, portrait: "/img/default.png", name: "老李" },
      { id: 32, portrait: "/img/default.png", name: "老李" },
      { id: 12, portrait: "/img/default.png", name: "老李" }
    ],
    poupleStatu: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var userid = options.userId ? options.userId : "";
    console.log("帮助祈福的userid="+userid)
    _this.setData({
      helpUserId: userid
    })
  },
  //拆开红包弹出提示
  poupleBind: function(){
    this.setData({
      poupleStatu: !this.data.poupleStatu
    })
  },
  //帮他祈福
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: "/pages/envelope?userId=" + _this.data.helpUserId,
      success: function (res) {
        _this.poupleBind()
        console.log(res)
        // 转发成功
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
        // 转发失败
      }
    }
  }
})