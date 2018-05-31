// pages/question/question.js
var rightNum = 0;
var errorNum = 0;
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    question: [],
    qid: 1,
    timeout: 10,
    currentQus: {},
    poupleStatu: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.getData()
  },
  //设置当前题干
  setQus: function(){
    var _this = this;
    var question = _this.data.question;
    var qid = Number(_this.data.qid);
    _this.setData({
      currentQus: question[qid-1],
      timeout: 10
    })
    _this.timeOut()
  },
  //题干选项点击
  optionBind: function(e){
    var _this = this;
    var qid = _this.data.qid;
    var time = _this.data.timeout;
    var question = _this.data.question;
    var currentQus = _this.data.currentQus;
    var rightId = currentQus.answer_right_id;
    var id = e.currentTarget.dataset.id;
    var options = currentQus.answer;
    for (var i in options){
      var item = options[i];
      if ('judge' in item) return
      if (item.answer_id == rightId) {
        item.judge = 'success'
      }
      if (item.answer_id == id) {
        if (id == rightId) {
          rightNum = rightNum + 1
          item.judge = 'success'
        } else {
          errorNum = errorNum + 1
          item.judge = 'error'
        }
      }  
    }
    _this.setData({
      currentQus: currentQus,
      timeout: 0
    })
  },
  //倒计时
  timeOut: function(){
    var _this = this;
    var qid = _this.data.qid;
    var currentQus = _this.data.currentQus;
    var question = _this.data.question;
    if (JSON.stringify(currentQus) == '{}') return
    var interval = setInterval(function () {
      var time = _this.data.timeout;
      time--
      if (time < 0) {
        clearInterval(interval)
        _this.getRight()
        return
      }
      _this.setData({
        timeout: time
      })
    }, 1000)
  },
  getRight: function(e){
    var _this = this;
    var currentQus = _this.data.currentQus;
    for (var i in currentQus.answer) {
      var item = currentQus.answer[i];
      if (currentQus.answer_right_id == item.answer_id) {
        item.judge = 'success'
      }
    }
    _this.setData({
      currentQus: currentQus
    })
  },
  goBind: function(e){
    var _this = this;
    var qid = _this.data.qid;
    var question = _this.data.question;
    if (rightNum + errorNum < qid) {
      errorNum = errorNum + 1
    }
    if (qid == question.length){
      console.log("完成答题")
      _this.setData({
        poupleStatu: !_this.data.poupleStatu
      })
      _this.submitQus()
    }else{
      console.log("下一题")
      _this.setData({
        qid: qid + 1
      })
      _this.setQus()
    }
    console.log(rightNum)
    console.log(errorNum)
  },
  getData: function(e){
    var _this = this;
    var url = app.globalData.url + "/follow.php/Problem";
    util.showLoading("正在加载");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        console.log(res.data.data)
        if (res.data.code == 200) {
          _this.setData({
            question: res.data.data,
            statu: true
          })
        }
      },
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast("网络出错，请稍后重试")
      },
      function (res) {
        wx.hideLoading();
        _this.setQus()
      }
    )
  },
  //提交数据
  submitQus: function (e) {
    var _this = this;
    var url = app.globalData.url + "/follow.php/Answer/" + app.globalData.userId + "/" + rightNum;
    console.log(url)
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
        if (res.data.status == 200) {
          util.showToast(res.data.message)
        }
      },
      //失败
      function (res) {
        util.showToast('数据提交失败，请重试')
      },
      //完成
      function (res) {
        wx.hideLoading();
        rightNum = 0;
        errorNum = 0;
      }
    )
  }
})