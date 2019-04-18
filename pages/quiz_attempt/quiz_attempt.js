// pages/quiz_attempt/quiz_attempt.js
const app = getApp();
const URL = app.globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rid:'',
    exam:null
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)//{rid:47}
    this.setData({ rid:options.rid})
    let cookie = wx.getStorageSync('cookieKey');//取出Cookie
    let header = {};
    if (cookie) {
      header.Cookie = cookie;
    }
    let that = this
    wx.request({
      url: URL + 'quiz/wx_attempt/' + options.rid,
      header:header,
      method:'GET',
      success:res =>{
        console.log(res) 
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res1.header['Set-Cookie']);   //保存Cookie到Storage
        }
        let result = res.data;
        switch(result.code){
          case 0:
            wx.showModal({
              title: '提示',
              content: '请重新登录',
              showCancel: false,
              success(r){
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
            break;
          case 1:
            console.log('考试中的数据...')
            console.log(result.data)
            that.setData({
              exam:result.data
            })
            break;
          case 2:
            wx.showModal({
              title: '提示',
              content: result.message,
              showCancel: false,
              success(r){
                wx.switchTab({
                  url: '../quiz/quiz_list',
                })
              }
            })
            break;
          case 3:
            wx.showModal({
              title: '提示',
              content: result.message,
              showCancel: false,
              success(r) {
                wx.switchTab({
                  url: '../' + result.url
                })
              }
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