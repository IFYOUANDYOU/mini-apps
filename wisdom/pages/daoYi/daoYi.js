// pages/daoYi/daoYi.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    minheight: "",
    reswidth: "",

    imgsrc: "",
    viewHeight: 0,
    viewWidth: 0,

    floorGuide: [],
    floorId: 0,
    stepId: 0,
    project: [],
    route: [],
    curNumber: "",
    routeData: {}
  },

  projectBind: function(e){
    var _this = this;
    var code = e.currentTarget.dataset.code;
    var curNumber = _this.data.curNumber;
    _this.setData({
      'routeData.startCode': curNumber,
      'routeData.endCode': code
    })
    _this.getRouteMsg();
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (options) {
    var _this = this;
    var Medical = options.type;
    var guidea = options.startCode;
    var guideb = options.endCode;
    console.log(options)
    if (options != {}){
      _this.setData({
        routeData: options
      })
      _this.getRouteMsg();
    }
  },
  //根据导医所有信息
  getRouteMsg: function (e) {
    var _this = this;
    var routeData = _this.data.routeData;
    console.log(routeData)
    if (routeData != {}) {
      var url = app.globalData.url + "/follow.php/Medical/" + routeData.type + "/" + routeData.routeDepartId + "/" + routeData.startCode + "/" + routeData.endCode;
      util.showLoading("加载中")
      util.requestUrl(
        url,
        null,
        null,
        null,
        null,
        function (res) {
          if (res.statusCode == 200) {
            var datas = res.data.data;
            _this.setData({
              project: datas.type,
              floorGuide: datas.map,
              curNumber: datas.number,
              stepId: 0
            })
            console.log(datas)
          }
        },
        function (res) {
          util.showToast(res.data.msg);
        },
        function (res) {
          _this.getFloorMsg();
          wx.hideLoading();
        }
      )
    }
  },
  //导医路线图片等信息
  getFloorMsg: function (e) {
    var _this = this;
    var floorGuide = _this.data.floorGuide;
    var stepId = _this.data.stepId;
    console.log(floorGuide[stepId].map_route)
    if (floorGuide.length != 0) {
      _this.setData({
        route: floorGuide[stepId].map_route ? floorGuide[stepId].map_route : [],
        imgsrc: floorGuide[stepId].map_img,
        floorId: floorGuide[stepId].floor ? floorGuide[stepId].floor : ""
      })
      _this.getImageInfo();
    }
  },
  //获取图片信息
  getImageInfo: function (e) {
    var _this = this;
    var imgsrc = _this.data.imgsrc;
    wx.getImageInfo({
      src: imgsrc,
      success: function (res) {
        var imgHeight = res.height;
        var imgWidth = res.width;
        wx.getSystemInfo({
          success: function (res) {
            var height = res.windowHeight - res.windowWidth / 750 * 392;
            _this.setData({
              viewHeight: height,
              viewWidth: height,
              reswidth: res.windowWidth,
              statu: true
            })
          }
        })
      }
    })
  },
  //到达电梯
  getElevator: function (e) {
    var _this = this;
    var step = e.currentTarget.dataset.step;
    var stepId = _this.data.stepId;
    stepId = (step == 0) ? (stepId += 1) : (stepId -= 1)
    _this.setData({
      stepId: stepId
    })
    _this.getFloorMsg()
  }
})