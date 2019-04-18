// pages/view_result/view_result.js
const app = getApp()
const URL = app.globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`view_result=> onLoad的options.rid：${options.rid}`)
    let cookie = wx.getStorageSync('cookieKey'),
        header = {},
        rid = options.rid,
        that = this,
        result = wx.getStorageSync('quizResultDetail')
    if(result){
      this.setData({
        result:result
      })
    }

    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: URL + 'result/wx_view_result/' + rid,
      header: header,
      method: 'GET',
      success: res => {
        const data = res.data
        console.log(`跳转到view_result页面 onLoad取得是数据是: `)
        console.log(res)

        if (data.status == 1){
          wx.setStorage({
            key: 'quizResultDetail',
            data: data
          })
          that.setData({
            result: data.result
          })
          console.log(data.message)
        }else{
          console.log(`请登录！`)
          console.log(JSON.stringify(res))
        }
        
      },
      fail: res => {
        console.log('get quid result detail failed')
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