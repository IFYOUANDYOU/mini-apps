// pages/followup/followup.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  followup: function (e) {
    var _this = this;
    var url = app.globalData.sfUrl + "Login/is_login";
    var userid = app.globalData.userId;
    if (userid != ""){
      util.showLoading("加载中");
      util.requestUrl(
        url,
        {
          user_id: app.globalData.userId
        },
        null,
        null,
        null,
        //成功
        function (res) {
          console.log(res)
          if (res.data.status == 200) {
            if (res.data.show_data == 0) {
              _this.jumpPage();
            } else if (res.data.show_data == 1) {
              util.navigateTo("/pages/login/login")
            }
          } else {
            util.showToast(res.data.message)
          }
        },
        //失败
        function (res) {
          util.showToast('请求失败，请重试')
        },
        //完成
        function (res) {
          wx.hideLoading();
        }
      )
    }
  },

  authLogin: function (e) {
    var _this = this;
    console.log(app.globalData.usercode)
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
                url: app.globalData.url + "/follow.php/Login",
                method: "GET",
                data: {
                  code: app.globalData.usercode,
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
                    app.globalData.openId = datas.data.openId;
                    app.globalData.userId = datas.data.user_id;
                    wx.setStorageSync('userid', datas.data.user_id)
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
                  wx.hideLoading()
                }
              })

              /*设置全局变量userInfo*/
              app.globalData.userInfo = res.userInfo
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
            complete: function (res) {
              wx.hideLoading()
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.startRecord()
            }
          })
        }
      }
    })
  },

  //本地有缓存则跳转对应列表
  jumpPage: function () {
    var _this = this;
    var userId = app.globalData.userId;
    var url = app.globalData.sfUrl + "Medical/disease";
    util.showLoading("加载中");
    util.requestUrl(
      url,
      {
        userId: userId,
        enums: '1'
      },
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.status == 200) {
          //为1跳转列表页
          //否则跳转病例填写
          if (res.data.show_data.id_data == 1) {
            util.navigateTo("/pages/record/record");
          } else {
            util.navigateTo("/pages/message/message");
          }
        } else {
          util.showToast(res.data.message)
        }
      },
      //失败
      function (res) {
        util.showToast('请求失败，请重试')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
  
  },
  onShareAppMessage: function () {
    return {
      title: '智慧创泰医疗',
      path: 'pages/followup/followup',
      success: function (res) {
        console.log("转发成功", res);
      },
      fail: function (res) {
        console.log("转发失败", res);
      }
    }
  }
})