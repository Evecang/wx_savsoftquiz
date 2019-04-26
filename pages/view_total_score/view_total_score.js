// pages/view_total_score/view_total_score.js
const app = getApp()
const URL = app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_name:'',
    per:100,
    grades_average:[],  //二维
  },

  search(e){
    console.log(e)
    let cookie = wx.getStorageSync('cookieKey')
    let header = { 'Content-type': 'application/x-www-form-urlencoded' }
    if (cookie) {
      header.Cookie = cookie;
    }
    const that = this
    wx.request({
      url: URL + 'result/wx_view_total_score',
      method: 'POST',
      data: { per : e.detail.value.per },
      header: header,
      success(res) {
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        switch (res.data.code) {
          case 0:
            wx.showModal({
              title: '提示',
              content: 'Login Failed',
              showCancel: false,
              success: r => {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
            break;
          case 1:
            wx.setStorage({
              key: 'groupsScore',
              data: res.data.data
            })
            var groupsScore = res.data.data
            that.setData({
              group_name: groupsScore.group_name,
              per: groupsScore.per,
              grades_average: groupsScore.grades_average
            })
            break;

        }

      },
      fail(res) {
        wx.showToast({
          title: '请求失败，请查看网络',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let groupsScore = wx.getStorageSync('groupsScore')
    console.log(groupsScore);
    if (groupsScore){
      this.setData({
        group_name: groupsScore.group_name,
        per: groupsScore.per,
        grades_average: groupsScore.grades_average
      })
    }

    let cookie = wx.getStorageSync('cookieKey')
    let header = { 'Content-type': 'application/json' }
    if (cookie) {
      header.Cookie = cookie;
    }
    const that = this
    wx.request({
      url: URL + 'result/wx_view_total_score',
      method: 'POST',
      data:{},
      header: header,
      success(res) {
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        switch(res.data.code){
          case 0:
            wx.showModal({
              title: '提示',
              content: 'Login Failed',
              showCancel: false,
              success: r => {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
            break;
          case 1:
            wx.setStorage({
              key: 'groupsScore',
              data: res.data.data
            })
            var groupsScore = res.data.data
            that.setData({
              group_name: groupsScore.group_name,
              per: groupsScore.per,
              grades_average: groupsScore.grades_average
            })
            break;

        }
        
      },
      fail(res) {
        wx.showToast({
          title: '请求失败，请查看网络',
          icon: 'none'
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
    wx.request({
      url: URL + 'result/wx_view_total_score',
      method: 'POST',
      data: {},
      header: header,
      success(res) {
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        switch (res.data.code) {
          case 0:
            wx.showModal({
              title: '提示',
              content: 'Login Failed',
              showCancel: false,
              success: r => {
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
            break;
          case 1:
            wx.setStorage({
              key: 'groupsScore',
              data: res.data
            })
            var groupsScore = res.data
            this.setData({
              group_name: groupsScore.group_name,
              per: groupsScore.per,
              grades_average: groupsScore.grades_average
            })
            break;

        }

      },
      fail(res) {
        wx.showToast({
          title: '请求失败，请查看网络',
          icon: 'none'
        })
      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})