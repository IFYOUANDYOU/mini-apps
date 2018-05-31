// pages/evaluation/evaluation.js
var count = 0, sels = [], evaluation = new Array;
var app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: true,
    curIndex: 1,
    curId: null,
    curTt: "",
    curDesc: "",
    curScore: "",
    curEval: [],
    curName: "",
    evals: [
      {
        id: 1,
        tt: "本次就诊",
        desc: "您愿意给我们多少分？",
        typename: "hospital_review"
      },
      {
        id: 2,
        tt: "本次就诊中",
        desc: "您愿意给您的医生多少分？",
        typename: "doctor_comment"
      },
      {
        id: 3,
        tt: "就诊检查时",
        desc: "您愿意给您的检查医师多少分？",
        typename: "inspect_comment"
      }
    ],
    selEval: [],
    scoreIndex: 5,
    scores: [0, 1, 2, 3, 4], //弹出层评价星星数量
    normalStar: '../../img/star-empty.png',
    selectedStar: '../../img/star-1.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var departId = options.departId;
    var doctorId = options.doctorId;
    var numbers = options.numbers;
    _this.setData({
      departId: departId,
      doctorId: doctorId,
      numbers: numbers
    })
    _this.getEval()
  },

  getEval: function(e){
    var _this = this;
    var curIndex = _this.data.curIndex;
    var evals = _this.data.evals;
    var cureval = evals[curIndex-1];
    _this.setData({
      curId: cureval.id,
      curTt: cureval.tt,
      curDesc: cureval.desc,
      curName: cureval.typename
    })
    _this.getLang();
  },

  /*评分 星星*/
  evalStar: function (e) {
    var key = e.currentTarget.dataset.key,
      count = key
    this.setData({
      scoreIndex: key
    })
    this.getLang();
  },

  //根据评分获取词
  getLang: function(e){
    var _this = this;
    var scoreIndex = _this.data.scoreIndex;
    var curName = _this.data.curName;
    var score = scoreIndex != 0 ? scoreIndex : 5
    var url = app.globalData.url + "/follow.php/star/" + score + "/" + curName;
    //console.log(url)
    util.showLoading("加载中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      //成功
      function (res) {
        console.log(res)
        if (res.data.code == 200) {
          _this.setData({
            curEval: res.data.data
          })
        } else {
          util.showToast(res.data.msg)
        }
      },
      //失败
      function (res) {
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },

  //selEval
  selEval: function(e){
    var _this = this;
    var selStatu = e.currentTarget.dataset.sel;
    var lang = e.currentTarget.dataset.lang;
    var id = e.currentTarget.dataset.id;
    var cureval = _this.data.curEval;
    for (var i in cureval){
      var item = cureval[i];
      if (item.value == lang){
        item.select = !item.select
      }
    }
    if (!selStatu){
      sels.push(id)
    }else{
      sels.splice(sels.indexOf(id),1);
    }
    _this.setData({
      curEval: cureval,
      selEval: sels
    })
  },

  //下一步
  gonext: function(e){
    var _this = this;
    var curId = _this.data.curId;
    var scoreIndex = _this.data.scoreIndex;
    var selEval = _this.data.selEval;
    if (scoreIndex == 0 || scoreIndex.length == 0){
      util.showToast('请为本次就诊打分！');
      return
    }
    if (selEval.length == 0) {
      util.showToast('选择一个文字评价吧！');
      return
    }
    evaluation.push({
      id: curId,
      score: scoreIndex,
      evals: selEval
    })
    
    _this.sendEval();
    console.log(evaluation)
  },

  //评价
  sendEval: function (e) {
    var _this = this,url = '';
    var curId = _this.data.curId;
    var scoreIndex = _this.data.scoreIndex;
    var selEval = _this.data.selEval;
    var doctorId = _this.data.doctorId ? _this.data.doctorId : wx.getStorageSync('doctorId');
    var departId = _this.data.departId ? _this.data.departId : wx.getStorageSync('departId');
    var numbers = _this.data.numbers ? _this.data.numbers : wx.getStorageSync('numbers');
    if (curId == 1) {
      url = app.globalData.url + "/follow.php/CommentHos/" + app.globalData.userId + "/" + scoreIndex + "/" + selEval;
    } else if (curId == 2) {
      url = app.globalData.url + "/follow.php/CommentDoc/" + app.globalData.userId + "/" + doctorId + "/" + scoreIndex + "/" + selEval;
    } else {
      url = app.globalData.url + "/follow.php/CommentDep/" + app.globalData.userId + "/" + scoreIndex + "/" + selEval + "/" + numbers;
    }
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
        util.showToast(res.data.msg)
      },
      //失败
      function (res) {
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        wx.hideLoading();
        if (curId == _this.data.evals.length) {
          util.showToast('评价完成！');
          setTimeout(function () {
            util.redirectTo("/pages/share/share");
          }, 1500)
        }else{
          sels = [], count = 0;
          _this.setData({
            curIndex: _this.data.curIndex + 1,
            scoreIndex: 5,
            selEval: []
          })
          _this.getEval();
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  }
})