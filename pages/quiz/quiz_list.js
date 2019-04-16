// pages/quiz/quiz_list.js
const app = getApp()
const URL = app.globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit:'long answer test',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cookie = wx.getStorageSync('cookieKey')
    let header = { 'Content-type':'application/x-www-form-urlencoded'}
    if(cookie){
      header.Cookie = cookie;
    }
    let that = this
    wx.request({
      url: URL + 'quiz',
      method: 'GET',
      header: header,
      data:{
        limit:that.data.limit
      },
      success(res){

      },
      fail(res){
        console.log('初始化考试列表失败')
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