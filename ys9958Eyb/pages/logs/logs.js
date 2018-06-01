//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    swiperData: [
      {
        "postId": 3,
        "imgSrc": "/images/service01.jpg"
      },
      {
        "postId": 4,
        "imgSrc": "/imgs/service02.jpg"
      },
      {
        "postId": 5,
        "imgSrc": "/imgs/service03.jpg"
      }
    ]
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  onPostTap: function (event) {
    // 通过传递而来的 postId 确定具体的详情页是哪一个
    var postId = event.target.dataset.postId;
    console.log(postId);
    // 跳转到详情页时，携带 postId 参数
    wx.navigateTo({
      url: 'post-detail/post-detail?postId=' + postId
    })
  }
})
