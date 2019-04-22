// pages/result/result_list.js
const app = getApp()
const URL = app.globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:null,
    quiz_list:null,
    userData: app.globalData.userData,
    bgColor: ['#dff0d8', '#fcf8e3', '#d9edf7', '#f2dcf2']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cookie = wx.getStorageSync('cookieKey')
    let header = { 'Content-type': 'application/json'}
    if (cookie) {
      header.Cookie = cookie;
    }
    let that = this
    wx.request({
      url: URL + 'result/wx_index/',
      method: 'POST',
      header: header,
      success(res) {
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        that.setData({
          result: res.data.result,
          quiz_list: res.data.quiz_list
        })

      },
      fail(res) {
        console.log('初始化考试结果列表失败')
      }
    })
  },
  //不发送请求，直接定向到 view_result 界面
  quizResultDetail(e) {
    var dataset = e.currentTarget.dataset
    var rid = dataset.rid
    //跳转至详情页面
    wx.navigateTo({
      url: '../view_result/view_result?rid='+rid
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