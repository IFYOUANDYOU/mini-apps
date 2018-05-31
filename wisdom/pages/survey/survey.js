// pages/survey/survey.js
//问卷调查填写
const app = getApp()
var count = 0;
var util = require('../../utils/util.js');
Page({

  /**
   * 
   * 页面的初始数据
   */
  data: {
    statu: null,
    username:"",
    greetings: '',
    question: [],
    service: "",
    stars: [0, 1, 2, 3, 4], //弹出层评价星星数量
    normalStar: '../../img/star-empty.png',
    selectedStar: '../../img/star.png',
    depart: "",
    departIndex: null,
    doctor: "",
    doctorIndex: null
  },

  /*科室评分 星星*/
  departStar: function (e) {
    var key = e.currentTarget.dataset.key,
    count = key
    this.setData({
      departIndex: key
    })
  },
  /*医师评分 星星*/
  doctorStar: function (e) {
    var key = e.currentTarget.dataset.key,
      count = key
    this.setData({
      doctorIndex: key
    })
  },
  //调查提交
  goSubmit: function (e) {
    var that = this;
    var service = that.data.service;
    var departIndex = that.data.departIndex;
    var doctorIndex = that.data.doctorIndex;
    var selectorCount = 0;
    var questions = that.data.question;
    var result = [];
    var url = app.globalData.sfUrl + "Inquire/resultS";
    for (var i = 0; i < questions.length; i++) {
      var items = questions[i].option_result;
      var contents = questions[i].option_content;
      if (items==""||items==undefined) {
        selectorCount = selectorCount + 1;
        return false
      }
      for (var j in contents){
        if (contents[j].judge){
          var itemid = contents[j].id;
          result.push(itemid)
        }
      }
    }
    if (selectorCount > 0) {
      util.showToast("请完善您的问题选择！");
      return false;
    }
    var optionsId = result.join(",");
    //提交问卷调查答案
    util.showLoading("提交中");
    util.requestUrl(
      url,
      {
        userId: app.globalData.userId,
        optionId: optionsId,
        department_score: departIndex,
        doctor_score: doctorIndex,
        service_quality: service
      },
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.status == 200) {
          util.showSuccess("提交成功！");
          util.redirectTo("/pages/record/record");
        } else {
          util.showToast(res.data.message)
        }
      },
      //失败
      function (res) {
        util.showToast("提交失败，请重试")
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },
  //获取医疗服务
  getService: function(e){
    console.log(e.detail.value)
    this.setData({
      service: e.detail.value
    })
  },
  //获取问卷调查内容问题以及答案
  getPageData: function (e) {
    var that = this;
    var url = app.globalData.sfUrl + "Inquire/index";
    util.showLoading("加载中");
    util.requestUrl(
      url,
      {
        userId: app.globalData.userId
      },
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.status == 200) {
          that.setData({
            question: res.data.show_data.question,
            greetings: res.data.show_data.greetings,
            statu: true
          })
        } else {
          util.showToast(res.data.message)
        }
      },
      //失败
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast("请求失败，请重试")
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },
  //选项选择
  itemChange: function (e) {
    var that = this;
    var optionName = e.currentTarget.dataset.option;
    var selected = e.currentTarget.dataset.select;
    var value = e.currentTarget.dataset.value;
    var fatherid = e.currentTarget.dataset.index;
    var questions = that.data.question;
    for (var i = 0, len = questions.length; i < len; ++i) {
      var id = questions[i].id;
      var selectValue = value;
      if (fatherid == id) {
        var index = i;
        var items = questions[i].option_content;
        for (var i = 0, len = items.length; i < len; ++i) {
          if (optionName == items[i].option_name) {
            items[i].judge = items[i].option_content == value
          }
        }
        questions[index].option_result = selectValue;
      }
    }
    that.data.question = questions
    that.setData({
      question: questions
    });
    //console.log(that.data.question)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
    var name = options.username;
    this.setData({
      username: name
    })
  }
})