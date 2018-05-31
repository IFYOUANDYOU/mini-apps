const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: true,
    departs: [],
    departIndex: null,
    departId: "",
    doctors: [],
    doctorIndex: null,
    doctorId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDeparts()
  },

  //获取科室列表
  getDeparts: function (e) {
    var _this = this;
    var url = app.globalData.url + "/follow.php/Mun";
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
            departs: res.data.data,
            statu: true
          })
        } else {
          util.showToast(res.data.msg)
        }
      },
      //失败
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },
  //科室选择
  bindDepartChange: function (e) {
    var _this = this;
    var val = e.detail.value;
    var departs = _this.data.departs;
    var departid = departs[val].id;
    _this.setData({
      departIndex: val,
      departId: departid,
      depart: departs[val].name,
      doctorIndex: null,
      doctorId: "",
      doctors: []
    })
    _this.getDoctors();
  },
  //获取医生列表
  getDoctors: function (e) {
    var _this = this;
    var departId = _this.data.departId;
    if (departId != "") {
      var url = app.globalData.sfUrl + "Department/info";
      util.showLoading("加载中");
      util.requestUrl(
        url,
        {
          partId: departId
        },
        null,
        null,
        null,
        //成功
        function (res) {
          console.log(res)
          if (res.data.status != 200) {
            util.showToast(res.data.message)
            return false
          }
          _this.setData({
            doctors: res.data.show_data
          })
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
    }
  },
  //暂无医生提示
  bindDoctorChangeBefore: function(e){
    var doctors = this.data.doctors;
    if (doctors.length == 0) {
      util.showToast("请先选择科室");
      return
    }
  },
  //选择医生
  bindDoctorChanges: function(e){
    var _this = this;
    var val = e.detail.value;
    var doctors = _this.data.doctors;
    var doctorid = doctors[val].id;
    if (doctors.length == 0){
      return
    }
    _this.setData({
      doctorIndex: val,
      doctorId: doctorid,
      doctor: doctors[val].doctor_name,
    })
  },
  //表单提交
  formSubmit: function(e){
    var _this = this,tip = "";
    var numbers = e.detail.value.number;
    var departId = _this.data.departId;
    var doctorId = _this.data.doctorId;
    var doctor = _this.data.doctors;
    if (numbers.length != 10) tip = "请输入正确的门诊号"
    if (departId == "") tip = "请选择科室"
    if (doctor.length != 0 && doctorId == "") tip = "请选择医生"
    if (tip != ""){
      util.showToast(tip)
      return
    }
    wx.setStorageSync('departId',departId)
    wx.setStorageSync('doctorId',doctorId)
    wx.setStorageSync('numbers',numbers)
    _this.judgeNumber(numbers, departId, doctorId);
    
  },
  //判断门诊号是否存在
  judgeNumber: function (numbers, departId, doctorId){
    var _this = this;
    var url = app.globalData.url + "/follow.php/CommentCoupon/" + numbers;
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
          wx.hideLoading();
          if (res.data.data == 1){
            util.showToast("您已经参与过评论！");
            return false;
          }
          util.redirectTo("/pages/evaluation/evaluation?departId=" + departId + "&doctorId=" + doctorId + "&numbers=" + numbers);
        }
      },
      //失败
      function (res) {
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        
      }
    )
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})