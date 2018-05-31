// pages/tip/tip.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipurl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var url= "";
    var tipid = options.id;
    var type = options.type ? options.type : '';
    if (type == "activity"){
      console.log(tipid + "," + type)
      url = app.globalData.url + "/follow.php/Information/" + tipid
    }else{
      url = app.globalData.url + "/follow.php/Tips/" + tipid
    }
    _this.setData({
      tipurl: url
    })
    console.log(_this.data.tipurl)
  }
})