
Page({
  data: {
    imageList: [],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isShowImage: false,
    hasCodeResult: false,
    result: ''
  },
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
  },
  //选择图片
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  //事件处理函数
  bindTwoCode: function () {
    var that = this
    wx.scanCode({
      success: (res) => {
        console.log(res)
        that.setData({
          result: res.result,
          isShowImage: true
        })
      },
      fail: (res) => {
        console.log('fail')

      },
      complete: (res) => {
        console.log('complete')
      }
    })
  },

  upLoadImg: function () {
    if (!this.data.isShowImage) {
      wx.showToast({
        title: '请先扫码',
      })
      return false
    }
    var that = this
    wx.showLoading({
      title: '上传中',
    })
    for (var i = 0; i < that.data.imageList.length; i++) {
      if (i == 0) {
        wx.uploadFile({
          //仅为示例，非真实的接口地址
          url: 'https://www.ys9958.com/back.php/Adm/login/test',
          filePath: that.data.imageList[i],
          name: 'file',
          formData: {
            'code': that.data.result,
          },
          success: function (res) {
            var data = res.data
            // console.log(res)
            //do something
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
            console.log(that.data.imageList.length)
            if (i == (that.data.imageList.length)) {
              wx.hideLoading()
              wx.showToast({
                title: '上传图片成功',
              })
            }
          }
        })
        console.log('i=0执行流程')
      } else {
        wx.uploadFile({
          //仅为示例，非真实的接口地址
          url: 'https://www.ys9958.com/back.php/Adm/login/test',
          filePath: that.data.imageList[i],
          name: 'file',
          success: function (res) {
            var data = res.data
            // console.log(res)
            //do something
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
            console.log(res)
            if (i == (that.data.imageList.length)) {
              wx.hideLoading()
              wx.showToast({
                title: '上传成功',
              })
            }
          }
        })
        console.log('i=1执行流程')
      }
    }
  },
  onLoad: function () {
    //console.log('onLoad')
  },
  onUnload: function () {
  }
})
