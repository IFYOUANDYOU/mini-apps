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

    imgSrc: "",
    viewHeight: 0,
    viewWidth: 0,

    floors: [],
    floorid: 1,
    daoyiId: "",
    startid: 0,
    start: "",
    startCode: "",
    endid: 0,
    end: "",
    endCode: "",
    poupleStatu: false,
    lmtype: 0,
    landmark: []
  },

  onLoad: function (options) {
    var _this = this;
    if (options) {
      console.log(options)
      var codeNumber = options.codeNumber;
      var daoyiId = options.serial_number;
      if (codeNumber) {
        _this.setData({
          startCode: codeNumber ? codeNumber : "",
          daoyiId: daoyiId ? daoyiId : "",
          startid: daoyiId ? daoyiId : 0
        })
      }
    }
    _this.getFloor();
    _this.getlandmark();
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
            var height = res.windowHeight - res.windowWidth / 750 * 240;
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
  //获取楼层
  getFloor: function (e) {
    var _this = this;
    var url = app.globalData.url + "/follow.php/Guides";
    util.showLoading("加载中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        if (res.statusCode == 200) {
          var datas = res.data.data;
          console.log(datas)
          _this.setData({
            floors: datas,
            imgsrc: datas[0].img
          })
        }
      },
      function (res) {
        util.showToast(res.data.msg);
      },
      function (res) {
        _this.getImageInfo();
        wx.hideLoading();
      }
    )
  },
  //选择楼层
  floorBind: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.floor;
    var floors = _this.data.floors;
    _this.setData({
      floorid: id,
      imgsrc: floors[id - 1].img
    })
  },
  //开始导航
  startGuide: function (e) {
    var _this = this;
    var startCode = _this.data.startCode;
    var endCode = _this.data.endCode;
    if (startCode == "" || endCode == "") {
      util.showToast("请选择起始位置！");
      return false
    }
    util.navigateTo("/pages/guide/guide?startCode=" + startCode + "&endCode=" + endCode)
    _this.setData({
      startid: 0,
      start: "",
      startCode: "",
      endid: 0,
      end: "",
      endCode: ""
    })
  },
  //选择起始点
  startBind: function (e) {
    var _this = this;
    var etype = e.currentTarget.dataset.type;
    var landmark = _this.data.landmark;
    _this.setData({
      lmtype: etype
    })
    _this.getlandmark();
    _this.poupleBind();
  },
  //获取所有地标
  getlandmark: function () {
    var _this = this;
    var lmtype = _this.data.lmtype;
    var lmid = (lmtype == 1) ? _this.data.startid : _this.data.endid;
    var url = app.globalData.url + "/follow.php/Guide/" + lmid;
    util.showLoading("加载中");
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
            landmark: datas
          })
          console.log(datas)
        }
      },
      function (res) {
        util.showToast(res.data.msg);
      },
      function (res) {
        wx.hideLoading();
        _this.getCodeName();
      }
    )
  },
  //地标点击
  landmarkBind: function (e) {
    var _this = this;
    var lm;
    var lmtype = _this.data.lmtype;
    var code = e.currentTarget.dataset.code;
    var name = e.currentTarget.dataset.name;
    var lmid = e.currentTarget.dataset.id;
    if (lmtype == 0) {
      _this.setData({
        start: name,
        startCode: code,
        startid: lmid
      })
    } else {
      _this.setData({
        end: name,
        endCode: code,
        endid: lmid
      })
    }
    _this.setData({
      landmark: []
    })

    _this.poupleBind()
  },
  chooseRes: function (e) {
    var _this = this;
    var code = e.currentTarget.dataset.code;
    var id = e.currentTarget.dataset.id;
    var resName = e.currentTarget.dataset.res;
    _this.setData({
      endCode: code,
      end: resName
    })
  },
  //通过扫码的codeNumber获取科室名称
  getCodeName: function (e) {
    var _this = this;
    var startCode = _this.data.startCode;
    var daoyiId = _this.data.daoyiId;
    if (startCode != "") {
      var landmark = _this.data.landmark;
      for (var i = 0; i < landmark.length; i++) {
        var items = landmark[i].items;
        for (var j = 0; j < items.length; j++) {
          var item = landmark[i].items[j];
          var code = item.number;
          var id = item.id;
          var name = item.name;
          if (daoyiId == id) {
            _this.setData({
              start: name,
              startid: daoyiId
            })
            return false
          }
        }
      }
    }
  },
  poupleBind: function (e) {
    this.setData({
      poupleStatu: !this.data.poupleStatu
    })
  },
})