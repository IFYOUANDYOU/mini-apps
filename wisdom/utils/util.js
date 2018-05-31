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
  mask: true,
  icon: "none"
})
// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success',
  mask: true
})

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  mask: true
})

// 页面跳转1
var navigateTo = dataUrl => wx.navigateTo({
  url: dataUrl
})

// 页面跳转2
var redirectTo = dataUrl => wx.redirectTo({
  url: dataUrl
})

//身份证验证
var IdentityCodeValid = code => {
  var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
  var tip = "";
  var pass = true;

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  }
  else if (!city[code.substr(0, 2)]) {
    tip = "身份证号码地址编码错误";
    pass = false;
  }
  else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "身份证号码校验位错误";
        pass = false;
      }
    }
  }
  if (!pass) {
    console.log(tip)
  };
  return pass;
}

//接口请求
var requestUrl = (url, datas, header, method, dataType, successfn, errorfn, completefn) =>
  wx.request({
    url: url,
    data: datas,
    header: {
      'content-type': 'application/json'
    },
    method: method,
    dataType: dataType,
    success: function (res) {
      successfn(res)
    },
    fail: function (res) {
      errorfn(res)
    },
    complete: function (res) {
      completefn(res)
    }
  })

//加载中
var showLoading = text => wx.showLoading({
  title: text,
})
//采用正则表达式获取地址栏参数
var GetQueryString = (url, paramName) => {
  var paramValue = "", isFound = !1;
  if (url.indexOf("?") != 0 && url.indexOf("=") > 1) {
    var arrSource = unescape(url).substring(1, url.length).split("&"), i = 0;
    while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
  }
  return paramValue == "" && (paramValue = null), paramValue
}

var bindStart = (e) => {
  if (e.touches.length == 1) return
  console.log('双手指触发开始')
  let xMove = e.touches[1].clientX - e.touches[0].clientX;
  let yMove = e.touches[1].clientY - e.touches[0].clientY;
  let distance = Math.sqrt(xMove * xMove + yMove * yMove);
  return distance;
}

var bindMove = (e, touch) => {
  var moveTarget = {};
  if (e.touches.length == 1) return 
  console.log('双手指运动')
  let xMove = e.touches[1].clientX - e.touches[0].clientX;
  let yMove = e.touches[1].clientY - e.touches[0].clientY;
  // 新的 ditance
  let distance = Math.sqrt(xMove * xMove + yMove * yMove);
  let distanceDiff = distance - touch.distance;
  let newScale = touch.scale + 0.005 * distanceDiff

  // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
  if (newScale >= 2) {
    newScale = 2
  }
  if (newScale <= 0.1) {
    newScale = 0.1
  }
  let scaleWidth = newScale * touch.baseWidth;
  let scaleHeight = newScale * touch.baseHeight;
  moveTarget = { "distance": distance, "newScale": newScale, "scaleWidth": scaleWidth, "scaleHeight": scaleHeight, "distanceDiff": distanceDiff }
  return moveTarget
}

module.exports = {
  formatTime: formatTime,
  showToast: showToast,
  showBusy: showBusy,
  showSuccess: showSuccess,
  navigateTo: navigateTo,
  redirectTo: redirectTo,
  IdentityCodeValid: IdentityCodeValid,
  requestUrl: requestUrl,
  showLoading: showLoading,
  GetQueryString: GetQueryString,
  bindStart: bindStart,
  bindMove: bindMove
}
