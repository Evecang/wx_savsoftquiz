// pages/quiz/quiz_list.js
const app = getApp()
const URL = app.globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    search:'long answer test',
    result:[{
      'quid': '0',
      'quiz_name': 'LOADING',
      'description': 'loading',
      'noq': '0',
      'duration': '0',
      'maximum_attempts': '1'
      }],
    bgColor: ['#dff0d8', '#fcf8e3', '#d9edf7','#f2dcf2'],
    fontColor: ['#3c763d', '#8a6d3b', '#31708f','#a94442'],
    userData: app.globalData.userData
  },
  search(e){
    var searchInfo = e ? e.detail.value.search : ''
    let cookie = wx.getStorageSync('cookieKey')
    let header = { 'Content-type': 'application/x-www-form-urlencoded' }
    if (cookie) {
      header.Cookie = cookie;
    }
    let that = this
    wx.request({
      url: URL + 'quiz/wx_index/',
      method: 'POST',
      header: header,
      data: {
        search: searchInfo
      },
      success(res) {
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        that.setData({
          result: res.data.result,
          userData: res.data.user
        })
      },
      fail(res) {
        wx.showModal({
          title: '错误',
          content: '获取考试列表失败，请查看网络',
          showCancel: false
        })
      }
    })
  },
  quizDetail(e){
    var dataset = e.currentTarget.dataset
    var quid = dataset.quid
    let cookie = wx.getStorageSync('cookieKey')
    let header = {}
    if (cookie) {
      header.Cookie = cookie;
    }
    wx.request({
      url: URL + 'quiz/wx_quiz_detail/' + quid,
      header:header,
      method:'GET',
      success:res =>{
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        wx.setStorage({
          key: 'quizDetail',
          data: res.data
        })
        //跳转至详情页面
        wx.navigateTo({
          url: '../quiz_detail/quiz_detail' +'?quid='+quid
        })
      },
      fail:res =>{
        wx.showModal({
          title: '错误',
          content: '请求失败，请查看网络',
          showCancel: false,
          success(r){
            wx.navigateTo({
              url: '../quiz_detail/quiz_detail'
            })
          }
        })
      }
    })

  },
  editQuiz(e){
    console.log('edit') //quiz/wx_edit_quiz/ $quiz
    var dataset = e.currentTarget.dataset
    var quid = dataset.quid
    let cookie = wx.getStorageSync('cookieKey')
    let header = {}
    if (cookie) {
      header.Cookie = cookie;
    }
    var that = this
    wx.request({
      url: URL + 'quiz/wx_edit_quiz/' + quid,
      header: header,
      method: 'GET',
      success: res =>{
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        switch (res.data.code) {
          case 0:
            wx.switchTab({
              url: '../index/index',
            })
            break;
          case 1:
            wx.setStorage({
              key: 'quizEdit',
              data: res.data.data
            })
            // console.log(res.data.data) //实际上仅 需要 data.group_list 和 data.quiz
            //跳转页面
            // wx.navigateTo({
            //   url: '../quiz_edit/quiz_edit?quid=' + quid,
            // })
            
            break;
          case 2:
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 1500
            })
            break;
        }

      },
      fail: res => {
        wx.showModal({
          title: '错误',
          content: '请求失败，请查看网络',
          showCancel: false
        })
      }

    })

  },
  removeQuiz(e){
    console.log('remove')
    var dataset = e.currentTarget.dataset
    var quid = dataset.quid
    let cookie = wx.getStorageSync('cookieKey')
    let header = {}
    if (cookie) {
      header.Cookie = cookie;
    }
    var that = this
    wx.showModal({
      title: '提示',
      content: 'Do you really want to remove entry?',
      success:r =>{
        if(r.confirm){

          wx.request({
            url: URL + 'quiz/wx_remove_quiz/' + quid,
            header: header,
            method: 'GET',
            success: res => {
              console.log(res)
              if (res && res.header && res.header['Set-Cookie']) {
                wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
              }
              switch(res.data.code){
                case 0:
                  wx.switchTab({
                    url: '../index/index',
                  })
                  break;
                case 1:
                  wx.showToast({
                    title: res.data.message,
                    duration:1500
                  })
                  //刷新页面
                  that.search()
                  break;
                case 2:
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1500
                  })
                  break;
              }

            },
            fail: res => {
              wx.showModal({
                title: '错误',
                content: '请求失败，请查看网络',
                showCancel: false
              })
            }
          })

        }
      }
    })
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
      url: URL + 'quiz/wx_index/',
      method: 'POST',
      header: header,
      success(res){
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        that.setData({
          result:res.data.result,
          userData:res.data.user
        })

      },
      fail(res){
        wx.showModal({
          title: '错误',
          content: '初始化考试列表失败，请查看网络',
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