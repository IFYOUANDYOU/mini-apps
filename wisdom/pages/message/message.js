// pages/message/message.js
//病例填写
const app = getApp()
var util = require('../../utils/util.js');
var date = new Date()
Page({

  /**
   * 页面的初始数据
   * 1男2女
   */
  data: {
    statu: null,
    isMsg: false,
    name: "",
    items: [
      { name: 'male', value: '男', checked: 'true' },
      { name: 'formale', value: '女' }
    ],
    checkedVal: "male",
    age: "",
    bahNo: "",
    bedno: "",
    departs: [],
    departIndex: null,
    departId: "",
    depart: "",
    doctorPoupe: false,
    doctors: [],
    doctorIndex: null,
    doctorId: "",
    doctor: "",
    dis: "",
    startDate: "1600-01-01",
    centerDate: "",
    sDate: "",
    endDate: "",

    sex: "",
    depart: "",
    itemId: ""
  },
  //姓名
  bindNameInput: function (e) {
    var val = e.detail.value;
    this.setData({
      name: val
    })
  },
  //年龄
  bindAgeInput: function (e) {
    var val = e.detail.value;
    this.setData({
      age: val
    })
  },
  //病案号
  bindNumInput: function (e) {
    var val = e.detail.value;
    this.setData({
      bahNo: val
    })
  },
  //床号
  bindBednoInput: function (e) {
    var val = e.detail.value;
    this.setData({
      bedno: val
    })
  },
  //诊断疾病
  bindDisInput: function (e) {
    var val = e.detail.value;
    this.setData({
      dis: val
    })
  },
  //性别选择
  sexChange: function (e) {
    var _this = this;
    var items = _this.data.items;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].name == e.detail.value
    }
    _this.setData({
      items: items,
      checkedVal: e.detail.value
    });
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
  //经治医生
  bindDoctorPoupe: function(e){
    var _this = this;
    var departIndex = _this.data.departIndex;
    var doctors = _this.data.doctors;
    if (departIndex == "") {
      util.showToast("请先选择就诊科室！");
      return false;
    }
    if (doctors.length == 0) {
      util.showToast("暂无医生数据");
      return false;
    }
    _this.setData({
      doctorPoupe: true
    })
  },
  doctorClose: function(e){
    this.setData({
      doctorPoupe: false
    })
  },
  doctorConfirm: function(){
    var _this = this;
    var doctorId = _this.data.doctorId;
    if (doctorId == "" || doctorId == "000") {
      util.showToast("请选择经治医师");
      return false;
    }
    _this.doctorClose();
  },
  bindDoctorChange: function (e) {
    var _this = this;
    var val = e.detail.value - 1;
    var doctors = _this.data.doctors;
    if (doctors[val].id == undefined) return false
    var doctorid = doctors[val].id;
    _this.setData({
      doctorIndex: val,
      doctorId: doctorid,
      doctor: doctors[val].doctor_name
    })
  },
  //开始日期选择
  bindStartChange: function (e) {
    this.setData({
      sDate: e.detail.value,
      centerDate: e.detail.value
    })
  },
  //提交病人信息
  goSubmit: function (e) {
    var _this = this,tip = "";
    var userid = app.globalData.userId;
    var name = _this.data.name;
    var sex = _this.data.checkedVal;
    var age = _this.data.age;
    var bahNo = _this.data.bahNo;
    var bedno = _this.data.bedno;
    var departId = _this.data.departId;
    var doctorId = _this.data.doctorId;
    var dis = _this.data.dis;
    var sDate = _this.data.sDate;
   
    if (sDate == "") tip = "请选择入院时间！";
    if (dis == "") tip = "请填写出院诊断！";
    if (doctorId == "" || doctorId == "000") tip = "请选择您的经治医师！";
    if (departId == "") tip = "请选择您的就诊科室！";
    // if (bedno == "") tip = "请填写您的床号！";
    // if (bahNo == "") tip = "请填写您的病案号！";
    if (age == "") tip = "请填写您的年龄！";
    if (sex == "") tip = "请选择您的性别！";
    if (name == "") tip = "请填写您的姓名！";
    console.log(sex)
    if (tip != ""){
      util.showToast(tip)
      return false
    }
    
    sex = (sex == 'male')?'1':'2'
    console.log('姓名：' + name)
    console.log('性别：' + sex)
    console.log('年龄：' + age)
    console.log('病案号：' + bahNo)
    console.log('床号：' + bedno)
    console.log('科室ID：' + departId)
    console.log('医生ID：' + doctorId)
    console.log('诊断：' + dis)
    console.log('开始日期：' + sDate)
    var url = app.globalData.sfUrl + "Medical/index";
    util.showLoading("提交中");
    util.requestUrl(
      url,
      {
        userId: userid,
        name: name,
        sex: sex,
        age: age,
        // record_number: bahNo,
        // bed_num: bedno,
        enums: departId,
        doctor_id: doctorId,
        disease: dis,
        star_time: sDate
      },
      null,
      null,
      null,
      function (res) {
        console.log(res.data)
        if (res.data.status != 200) {
          if (res.data.status == 500) {
            wx.showModal({
              title: '',
              content: res.data.message+"是否跳转至随访列表？",
              success: function (res) {
                if (res.confirm) {
                  util.redirectTo("/pages/record/record");
                } else if (res.cancel) {
                  util.redirectTo("/pages/index/index");
                }
              }
            })
          }
          util.showToast(res.data.message)
          return false;
        }
        util.showToast(res.data.message)
        util.redirectTo("/pages/survey/survey?depart=" + _this.data.depart + "&doctor=" + _this.data.doctor + "&username=" + _this.data.name);
      },
      function (res) {
        util.showToast("提交失败")
      },
      function (res) {
        wx.hideLoading();
      }
    );
  },

  //获取科室列表
  getDeparts: function (e) {
    var _this = this;
    var url = app.globalData.sfUrl + "Department/index";
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
          _this.setData({
            departs: res.data.show_data,
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
        util.showToast('请求失败，请检查网络')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },
  //获取医生列表
  getDoctors: function (e) {
    var _this = this;
    var departId = _this.data.departId;
    if (departId!=""){
      var url = app.globalData.sfUrl + "Department/info";
      util.showLoading("提交中");
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
  //获取页面数据
  getPageData: function (e) {
    var _this = this;
    var userid = app.globalData.userId;
    var itemid = _this.data.itemId;
    var url = app.globalData.sfUrl + "Medical/medicalProducts";
    util.showLoading("提交中");
    util.requestUrl(
      url,
      {
        dataId: userid,
        departmentId: itemid
      },
      null,
      null,
      null,
      //成功
      function (res) {
        if (res.data.status == 200) {
          var data = res.data.show_data;
          console.log(data)
          _this.setData({
            name: res.data.show_data.name,
            age: res.data.show_data.age,
            sex: res.data.show_data.sex,
            bahNo: res.data.show_data.record_number,
            bedno: res.data.show_data.bed_num,
            depart: res.data.show_data.enum,
            doctor: (res.data.show_data.doctor_id == null) ? '' : res.data.show_data.doctor_id,
            dis: res.data.show_data.disease,
            sDate: res.data.show_data.star_time,
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
        util.showToast('请求失败，请重试')
      },
      //完成
      function (res) {
        wx.hideLoading();
      }
    );
  },
  //获取当前时间
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var userId = app.globalData.userId;
    var dates = _this.getNowFormatDate();
    _this.setData({
      endDate: dates,
      eDate: dates
    })
    //非空就代表从列表点进来
    if (options.orderid) {
      var orderid = options.orderid;
      _this.setData({
        isMsg: true,
        itemId: orderid
      })
      _this.getPageData();
    } else {
      _this.getDeparts();
    }
  },
})