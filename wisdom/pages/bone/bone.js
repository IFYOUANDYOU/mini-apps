// pages/bone/bone.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu: null,
    departid: "",
    departtype: 1,
    menuindex: 1,
    flexmenu: false,
    departInfo: {}
  },

  //菜单切换
  menuBind: function (e) {
    var _this = this;
    var typeindex = e.currentTarget.dataset.typeindex;
    var typeid = e.currentTarget.dataset.type;
    _this.setData({
      menuindex: typeindex,
      departtype: typeid
    })
    _this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      departid: options.departid
    })
    _this.getData()
  },
  //获取数据
  getData: function (){
    var _this = this;
    var departid = _this.data.departid;
    var departtype = _this.data.departtype;
    var url = app.globalData.url + "/follow.php/Item/" + departid + "/" + departtype;
    util.showLoading("加载中");
    util.requestUrl(
      url,
      null,
      null,
      null,
      null,
      function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          var datas = res.data.data;
          _this.setData({
            departInfo: datas,
            statu: true
          })
        }
      },
      function (res) {
        _this.setData({
          statu: false
        })
        util.showToast(res.data.msg);
      },
      function (res) {
        wx.hideLoading();
      }
    )
  }
})