var PI = Math.PI;
var EARTH_RADIUS = 6378137.0; 
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示提示
var showToast = text => wx.showToast({
  title: text,
  mask: true
})

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  mask: true
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success',
  mask: true
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false,
    mask: true
  })
}

// 页面跳转
var navigateTo = dataUrl => wx.navigateTo({
  url: dataUrl
})

//接口请求
var requestTask = (dataUrl, datas) => wx.request({
  url: dataUrl,
  data: datas,
  header: {
    'content-type': 'application/json'
  },
  method: GET,
  dataType: json,
  responseType: text,
  success: function (res) { },
  fail: function (res) { },
  complete: function (res) { },
})

function getRad(d) {
  return d * PI / 180.0;
}

var getFlatternDistance = (lat1, lng1, lat2, lng2) => {
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;

  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

module.exports = { formatTime, showToast, showBusy, showSuccess, showModel, navigateTo, getFlatternDistance }

