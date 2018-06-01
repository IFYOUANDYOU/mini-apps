//app.js
App({
  onLaunch: function () {
    var that = this    
    wx.login({
      success: res => {
        //发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.usercode = res.code
      }
    })
    // 获取用户信息
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
          console.log('授权成功')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              /*向服务器传递数据code、rawData、signature、encryptedData、iv*/
              wx.request({
                url: 'https://www.ys9958.com/index.php/api/Login/wxLogin',
                data: {
                  code: that.globalData.usercode,
                  rawData: res.rawData,
                  signature: res.signature,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                success: function(res){
                  console.log(res.data.show_data)
                  that.globalData.unid = res.data.show_data.unionId
                  that.globalData.userId = res.data.show_data.user_id
                  that.globalData.openid = res.data.show_data.openId
                },
                fail: function(res){
                  console.log(res.data.message)
                }
              })
              /*设置全局变量userInfo*/
              that.globalData.userInfo = res.userInfo
              /*setStorageSync个人信息本地存储*/
              try {
                wx.setStorageSync('nickName', res.userInfo.nickName)
                wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
                wx.setStorageSync('country', res.userInfo.country)
                wx.setStorageSync('province', res.userInfo.province)
                wx.setStorageSync('city', res.userInfo.city)
              } catch (e) {}
            }
          })
        }
      }
    })
  },
  globalData: {
    localhost: 'https://www.ys9958.com/index.php',
    userInfo: null,
    usercode: '',
    unid: '',
    openid: '',
    userId: ''
  }
})