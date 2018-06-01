// pages/detection/detection.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    height: '',
    weight: '',
    age: '',
    sexChange: false,
    sex: ['保密','男', '女'],
    sexId: 0,
    order_id: ''
  },

  /*姓名*/
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  /*性别*/
  bindSexChange: function(e){
    var _this = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        _this.setData({
          sexId: res.tapIndex+1,
          sexChange: true
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  /*身高*/
  bindHeightInput: function (e) {
    this.setData({
      height: e.detail.value
    })
  },

  /*体重*/
  bindWeightInput: function (e) {
    this.setData({
      weight: e.detail.value
    })
  },

  /*年龄*/
  bindAgeInput: function (e) {
    this.setData({
      age: e.detail.value
    })
  },

  //表单提交
  formSubmit: function (e) {
    var that = this;
    var detail = e.detail.value;
    var name = that.data.name;
    var sex = that.data.sexId;
    var height = that.data.height;
    var weight = that.data.weight;
    var age = that.data.age;
    if (name.length == 0 || that.data.sexChange == false || height.length == 0 || weight.length == 0 || age.length == 0){
      util.showModel('温馨提示','请完善宝宝的个人信息');
      return false
    }
    console.log(sex)
    wx.request({
      url: app.globalData.localhost + '/api/Login/information',
      data: {
        userId: app.globalData.userId,
        order_id: that.data.order_id,
        type: 2,
        name: name,
        sex: sex,
        height: height,
        weight: weight,
        age: age
      },
      success: function (res) {
        if (res.data.status == 200){
          if (res.data.show_data != 1){
            util.showBusy(res.data.message);
            return false
          }
          util.navigateTo('/pages/verify/verify')
        }else{
          util.showToast(res.data.message);
        }
      },
      fail: function(res){
        util.showToast(res.data.message);
      },
      complete: function(res){
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.order_id;
    this.setData({
      order_id: orderId
    })
  }
})