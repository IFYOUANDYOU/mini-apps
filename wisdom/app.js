//app.js
var util = require('utils/util.js');
App({
  globalData: {
    usercode: "",
    userInfo: null,
    url: "https://www.ys9958.com",
    sfUrl: "https://www.ys9958.com/api.php/api/",
    openId: '',
    userId: "",
    getUserInfoSuccess: false,
    querys: {}
  },
  onLaunch: function (options) {
    var _this = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    var option = options.query;
    var getUserInfoSuccess = _this.globalData.getUserInfoSuccess;
    _this.globalData.querys = option;
    wx.showLoading({ title: '加载中' })
    try {
      var userId = wx.getStorageSync('userid');
      if (userId != null && userId != "") {
        _this.globalData.userId = userId;
      }
    } catch (e) {
    }
    _this.wxlogin()
  },
  //微信登录
  wxlogin: function (e) {
    var _this = this;
    wx.login({
      success: res => {
        //登录成功设置res.code
        _this.globalData.usercode = res.code
        _this.authLogin();
      }
    })
  },
  authLogin: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        res.authSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true,
          "scope.address": true,
          "scope.invoiceTitle": true,
          "scope.werun": true,
          "scope.record": true,
          "scope.writePhotosAlbum": true,
          "scope.camera": true
        }
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              /*向服务器传递数据code、rawData、signature、encryptedData、iv*/
              wx.request({
                url: _this.globalData.url + "/follow.php/Login",
                method: "GET",
                data: {
                  code: _this.globalData.usercode,
                  rawData: res.rawData,
                  signature: res.signature,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                success: function (res) {
                  console.log(res)
                  var datas = res.data;
                  if (datas.code == 200) {
                    wx.showToast({
                      title: datas.msg ? datas.msg : '请求出错',
                      icon: 'success',
                      duration: 2000
                    })
                    _this.globalData.openId = datas.data.openId;
                    _this.globalData.userId = datas.data.user_id;
                    wx.setStorageSync('userid', datas.data.user_id);
                  } else {
                    wx.showToast({
                      title: datas.msg ? datas.msg : '请求出错',
                      duration: 2000
                    })
                  }
                },
                fail: function (res) {
                  wx.showToast({
                    title: res.data.msg,
                    duration: 2000
                  })
                },
                complete: function (res) {
                  wx.hideLoading();
                  if (_this.globalData.userId != "") {
                    var option = _this.globalData.querys;
                    console.log(option)
                  }
                }
              })
              /*设置全局变量userInfo*/
              _this.globalData.userInfo = res.userInfo
              /*个人信息本地存储*/
              try {
                wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
                wx.setStorageSync('city', res.userInfo.city)
                wx.setStorageSync('gender', res.userInfo.gender)
                wx.setStorageSync('country', res.userInfo.country)
                wx.setStorageSync('nickName', res.userInfo.nickName)
                wx.setStorageSync('province', res.userInfo.province)
              } catch (e) { }
            },
            fail: function (res) {
              console.log(res.errMsg)
              _this.showModalNotice()
            },
            complete: function (res) {
              wx.hideLoading()
            }
          })
        } else {
          console.log("未授权")
        }
      }
    })
  },
  //跳转设置页面授权
  openSetting: function () {
    var _this = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          _this.wxlogin()
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) { }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 拒绝授权可能会影响部分功能使用，请删除小程序或设置授权'
      })
    }
  },
  //
  showModalNotice: function (e) {
    var _this = this
    wx.showModal({
      title: '授权提示',
      content: '小程序需要您的微信授权才能使用哦~ 拒绝授权可能会影响部分功能使用，请删除小程序或设置授权',
      confirmText: '去设置',
      success: function (res) {
        if (res.confirm) {
          _this.openSetting()
        } else if (res.cancel) {
          console.log('用户点击取消')
          _this.showModalNotice()
        }
      }
    })
  }
})