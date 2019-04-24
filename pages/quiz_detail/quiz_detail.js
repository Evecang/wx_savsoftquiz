// pages/quiz_detail/quiz_detail.js
const app = getApp();
const URL = app.globalData.url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    quizDetail: {},
    loading:false
  },
  startQuiz(e){
    this.setData({loading:true})
    wx.showLoading({
      title: '正在初始化试卷',
      mask:true
    })
    let cookie = wx.getStorageSync('cookieKey');//取出Cookie
    console.log(cookie)
    let header = {};
    if (cookie) {
      header.Cookie = cookie;
    }
    var that = this
    wx.request({
      url: URL + 'quiz/wx_validate_quiz/' + this.data.quizDetail.quid,
      method:'GET',
      header:header,
      success:res =>{
        console.log(`quiz_detail.js中 startQuiz返回的数据：：：`)
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        wx.hideLoading()
        let result = res.data
        switch(result.code){  //0-login 1-attempt 2-resume 3-detail
          case 0:
            wx.showModal({
              title: '提示',
              content: '请登录',
              showCancel: false,
              success:r=>{
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
            break;
          case 1:
            this.setData({ loading: false })
            wx.navigateTo({
              url: '../' + result.url,
            })
            break;
          case 2:
            this.setData({ loading: false })
            wx.showModal({
              title: '提示',
              content: result.message,
              success: r=>{
                if(r.confirm){
                  wx.navigateTo({
                    url: '../' + result.url
                  })
                }else if(r.cancel){
                  
                }
              }
            })
            break;
          case 3:
            wx.showModal({
              title: '错误',
              content: result.message,
              showCancel: false
            })
            break;
        }
      },
      fail:res =>{
        wx.showModal({
          title: '错误',
          content: '请求失败，请查看网络',
          showCancel: false
        })
      }
    })
  },
  back(e){
    // wx.navigateBack({})
    wx.switchTab({
      url: '../quiz/quiz_list',
    })
  }, 
  //补零操作
  addZero(num){
    if(parseInt(num) < 10){
       num = '0' + num;
    }
    return num;
  },
  getMyDate(str) {
    while(str.length<13){
      str += '0';
    }
    str = +str;
    console.log(str)
    var oDate = new Date(str),
    oYear = oDate.getFullYear(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' + this.addZero(oMin) + ':' + this.addZero(oSen);
    return oTime;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detail = wx.getStorageSync('quizDetail')
    detail.start_date = this.getMyDate(detail.start_date);
    detail.end_date = this.getMyDate(detail.end_date);
    this.setData({
      quizDetail: detail
    })
    var quid = options.quid
    let cookie = wx.getStorageSync('cookieKey')
    let header = {}
    if (cookie) {
      header.Cookie = cookie;
    }
    let that = this
    wx.request({
      url: URL + 'quiz/wx_quiz_detail/' + quid,
      header: header,
      method: 'GET',
      success: res => {
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        res.data.start_date = this.getMyDate(res.data.start_date);
        res.data.end_date = this.getMyDate(res.data.end_date);
        wx.setStorage({
          key: 'quizDetail',
          data: res.data
        })
        that.setData({
          quizDetail:res.data
        })
      },
      fail: res => {
        wx.showModal({
          title: '错误',
          content: '请求失败，请查看网络',
          showCancel: false,
          success(r) {
            wx.navigateTo({
              url: '../quiz_detail/quiz_detail'
            })
          }
        })
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})