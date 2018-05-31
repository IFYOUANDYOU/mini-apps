// pages/guide/guide.js
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
    route: [],
    stepId: 0,
    floorId: 0
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
  },
  /**
   * 结束引导
   */
  endGuide: function (e) {
    wx.showModal({
      title: '',
      content: '确认退出本次导航',
      success: function (res) {
        if (res.confirm) {
          util.redirectTo("/pages/index/index")
        } else if (res.cancel) {
          console.log("取消")
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (options) {
    var _this = this;
    var startCode = options.startCode;
    var endCode = options.endCode;
    // var url = app.globalData.url + "/follow.php/Navigation/A02709/A02705";
    var url = app.globalData.url + "/follow.php/Navigation/" + startCode + "/" + endCode;
    util.showLoading("加载中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        if (res.statusCode == 200) {
          console.log(res.data.data)
          var datas = res.data.data;
          _this.setData({
            floorGuide: datas
          })
        }else{
          util.showToast("暂无此路线，请重新选择");
          util.redirectTo("/pages/advertising/advertising");
        }
      },
      function (res) {
        util.showToast(res.data.msg);
      },
      function (res) {
        _this.getFloorMsg();
      }
    )
  },
  getFloorMsg: function (e) {
    var _this = this;
    var floorGuide = _this.data.floorGuide;
    var stepId = _this.data.stepId;
    if (floorGuide.length != 0){
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
            console.log(height)
            _this.setData({
              viewHeight: height,
              viewWidth: height,
              reswidth: res.windowWidth,
              statu: true
            })
            wx.hideLoading();
          }
        })
      }
    })
  }
})