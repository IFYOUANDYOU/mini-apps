//index.js
//首页
const app = getApp()
var util = require('../../utils/util.js');
var interval = null; //倒计时函数
Page({
  data: {
    statu: false,
    userInfo: {},
    hasUserInfo: false,
    telNumber: "",
    code: "",
    time: "获取验证码",
    codeDis: false,
    currentTime: 60
  },
  //手机号码填写
  bindTelInput: function (e) {
    var val = e.detail.value;
    this.setData({
      telNumber: val
    })
  },
  //验证码填写
  bindCodeInput: function (e) {
    var val = e.detail.value;
    this.setData({
      code: val
    })
  },
  //获取验证码
  getCode: function (e) {
    var _this = this;
    var tel = _this.data.telNumber;
    var url = app.globalData.sfUrl + "Login/validates";
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
      util.showToast("电话号码输入有误！")
      return false;
    }
    util.showLoading("获取中");
    //调用获取验证码接口
    util.requestUrl(
      url,
      {
        phone: _this.data.telNumber,
      },
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.status == 200) {
          //调用成功后进行提示并开始验证码倒计时
          wx.showToast({
            icon: 'success',
            title: res.data.message,
          })
          _this.settime()
        } else {
          console.log('手机号' + _this.data.telNumber)
          util.showToast(res.data.message)
        }
      },
      //失败
      function (res) {
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        wx.hideToast();
        wx.hideLoading();
      }
    );
  },
  //倒计时
  settime: function (options) {
    var _this = this;
    var currentTime = _this.data.currentTime;
    interval = setInterval(function () {
      currentTime--;
      _this.setData({
        time: "重发(" + currentTime + ")秒",
        codeDis: "true"
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          time: "获取验证码",
          currentTime: 60,
          codeDis: false
        })
      }
    }, 1000)
  },
  //登录下一步
  goNext: function (e) {
    var _this = this;
    var tel = _this.data.telNumber;
    var code = _this.data.code;
    var url = app.globalData.sfUrl + "Login/login";
    if (code.length != 6 || !(/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
      util.showToast("您输入的信息有误！");
      return false;
    }
    //提交手机号码与验证码进行登录
    util.showLoading("登录中");
    util.requestUrl(
      url,
      {
        phone: _this.data.telNumber,
        code: _this.data.code
      },
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.status == 200) {
          wx.setStorageSync('user_id', res.data.show_data.user_id)
          app.globalData.userId = res.data.show_data.user_id
          if (res.data.show_data.user_id != null) {
            util.navigateTo("/pages/message/message");
          }
        } else {
          util.showToast(res.data.message);
        }
      },
      //失败
      function (res) {
        util.showToast('登录失败,请重试')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },

  

  //页面加载时
  onLoad: function () {
    var _this = this;
    _this.setData({
      statu: true
    })
  }
})
