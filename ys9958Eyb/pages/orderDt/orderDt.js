// pages/orderDt/orderDt.js
var app = getApp();
var count = 0;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true, //是否显示弹出层
    evalSate: 0,//是否评价 状态
    stars: [0, 1, 2, 3, 4], //弹出层评价星星数量
    normalStar: '/images/no-star.png',
    selectedStar: '/images/full-star.png',
    key: 0,
    evalText: '',
    show_data: {
      order_id: '',
      order_sn: '',
      addtime: '',
      package_type: '',
      type: '',
      price_h: '',
      er_uselog: []
    },
    eval_logId: '',
    eval_modal: {
      score: 1,
      content: ''
    }
  },

  /*自定义弹出层 显示*/
  ModalShow: function (e) {
    this.setData({ flag: false })
  },
  /*自定义弹出层 隐藏*/
  ModalHidden: function(e){
    this.setData({ flag: true })
  },

  /*评分 星星*/
  selectStar: function (e) {
    var key = e.currentTarget.dataset.key
    count = key
    this.setData({
      key: key
    })
  },

  /*弹出评价窗口 显示*/
  evaluation: function(e){
    var that = this;
    var state = e.currentTarget.dataset.state;
    var logId = e.currentTarget.dataset.log_id;
    that.setData({
      evalSate: state,
      flag: false,
      eval_logId: logId
    })
    if (state == 1) {
      wx.request({
        url: app.globalData.localhost + '/api/Order/commentInfo',
        data: {
          userId: app.globalData.userId,
          log_id: logId
        },
        success: function(res){
          if (res.data.status == 200) {
            that.setData({
              eval_modal: res.data.show_data
            })
          } else {
            util.showToast(res.data.message);
          }
        },
        fail: function(res){
          util.showToast(res.data.message);
        },
        complete: function (res){

        }
      })
      
    }
    
  },

  /*评价内容*/
  bindTextArea: function(e){
    var that = this;
    var value = e.detail.value;
    that.setData({
      evalText: value
    })
  },

  /*立即评价 提交*/
  evalSubmit: function(e){
    var that = this;
    var content = that.data.evalText;
    var score = that.data.key;
    var log_id = that.data.eval_logId;
    if (content.length == 0 || score == 0){
      util.showModel('温馨提示','请完善您的评价内容');
      return false
    }
    wx.request({
      url: app.globalData.localhost + '/api/Order/comment',
      data: {
        userId: app.globalData.userId,
        log_id: log_id,
        score: score,
        content: content
      },
      success: function(res){
        if (res.data.status == 200){
          console.log(res.data)
          util.showSuccess(res.data.message);
        }else{
          util.showToast(res.data.message);
        }
      },
      fail: function(res){
        util.showToast(res.data.message);
      },
      complete: function(res){
        wx.hideLoading();
        that.ModalHidden();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderId = options.orderId;
    var userId = app.globalData.userId;
    wx.request({
      url: app.globalData.localhost + '/api/Order/medicalHistoryInfo',
      data: {
        userId: userId,
        order_id: orderId
      },
      success: function(res){
        if (res.data.status == 200){
          console.log(res.data.show_data)
          that.setData({
            show_data: res.data.show_data
          })
        }else{
          util.showToast(res.data.message)
        }
      },
      fail: function(res){
        util.showToast(res.data.message)
      },
      complete: function(res){
        wx.hideLoading()
      }
    })
  }
})