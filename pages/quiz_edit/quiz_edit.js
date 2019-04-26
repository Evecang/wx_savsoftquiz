// pages/quiz_edit/quiz_edit.js
const app = getApp()
const URL = app.globalData.url

Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_list:[],
    quiz:[],
    loading:false
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
  update(e){
    //'quiz/update_quiz/'.$quiz['quid']
    let form = e.detail.value
    console.log('表单信息')
    console.log(form)
    if(form.quiz_name.trim()==''){
      wx.showModal({
        title: '提示',
        content: 'Quiz Name Empty!',
        showCancel: true
      })
    } else {
      let cookie = wx.getStorageSync('cookieKey')
      let header = { 'Content-type': 'application/x-www-form-urlencoded' }
      if (cookie) {
        header.Cookie = cookie;
      }
      var that = this
      wx.request({
        url: URL + 'quiz/wx_update_quiz/' + that.data.quiz.quid,
        header: header,
        method: 'POST',
        data: {
          quiz_name: form.quiz_name,
          start_date: form.start_date,
          end_date: form.end_date,
          duration: form.duration,
          maximum_attempts: form.maximum_attempts,
          pass_percentage: form.pass_percentage,
          gids: form.gids
        },
        success(res) {
          console.log(res)
          let data = res.data
          switch(data.code){
            case 0:
              wx.showModal({
                title: '提示',
                content: 'Login Failed',
                success(r){
                  if(r.confirm){
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }
                }
              })
              break;
            case 1:
              wx.showToast({
                title: 'Edit Success',
              })
              break;
            case 2:
              wx.showModal({
                title: 'Error',
                content: data.message
              })
            break;
          }
        },
        fail(res) {

        }
      })

    }

  },
  back(e){
    wx.switchTab({
      url: '../quiz/quiz_list',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var quizEdit = wx.getStorageSync('quizEdit');
    console.log(quizEdit)
    quizEdit.quiz.start_date = this.getMyDate(quizEdit.quiz.start_date)
    quizEdit.quiz.end_date = this.getMyDate(quizEdit.quiz.end_date)
    if(quizEdit){
      this.setData({
        group_list: quizEdit.group_list,
        quiz: quizEdit.quiz
      })
    }

    // console.log(options)
    var quid = options.quid
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
      success: res => {
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
            let data = res.data.data
            data.quiz.start_date = this.getMyDate(data.quiz.start_date)
            data.quiz.end_date = this.getMyDate(data.quiz.end_date)

            wx.setStorage({
              key: 'quizEdit',
              data: res.data.data
            })

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