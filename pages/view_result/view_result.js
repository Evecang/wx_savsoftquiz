// pages/view_result/view_result.js
const app = getApp()
const URL = app.globalData.url;

//TODO：后台排名函数未验证

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:null,
    percentile:null,
    startTime:null,
    attempt:null
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
        result = wx.getStorageSync('quizResultDetail');

    if(result){

      this.setData({
        result:result,
        percentile: that.calcPercentile(result.percentile),
        startTime: that.getMyDate(result.result.start_time),
        attempt: that.ordinal(result.attempt)
      })
    }else{
      console.log('没有 quizResultDetail 数据缓存')
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
            data: data.result
          })

          that.setData({
            result: data.result,
            percentile: that.calcPercentile(data.result.percentile),
            startTime: that.getMyDate(data.result.result.start_time),
            attempt: that.ordinal(data.result.attempt)
          })

          wx.showToast({
            title: '成功加载最新数据！',
          })

          console.log(data.message)

        }else{

          wx.setStorage({
            key: 'quizResultDetail',
            data: null
          })
          wx.showModal({
            title: '用户未登陆',
            content: '请先登陆！',
            complete:()=>{
              wx.navigateTo({
                url: '../index/index',
              })
            }
          })
          console.log(`请登录！`)
          console.log(JSON.stringify(res))
        }
        
      },
      fail: res => {
        wx.showToast({
          title: '数据加载失败，请重试！',
        })
        console.log('get quid result detail failed')
      }
    })
  },

  calcPercentile(arr){

    arr = Array.isArray(arr)?arr:[arr];
    let str = (((arr[1] + 1) / arr[0]) * 100).toString();
    return str.substr(0,5);

  },

  //补零操作
  addZero(num) {
    if (parseInt(num) < 10) {
      num = '0' + num;
    }
    return num;
  },
  getMyDate(str) {
    while (str.length < 13) {
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
      oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' + this.addZero(oMin) + ':' +       this.addZero(oSen);
        return oTime;
  },

  ordinal(number) {	//number为no_attempt参与测试试卷的次数，判断要添加的英文数字后缀
    const ends = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
    if(((number % 100) >= 11) && ((number % 100) <= 13))
      return number + 'th';
    else
        return number +'' + ends[number % 10];
  },

  viewAnswer(){

    const result = wx.getStorageSync('quizResultDetail')

    if(result){

      wx.navigateTo({
        url: '../result_answerSheet/answer_sheet',
      })
    }else{

      wx.showToast({
        title: '数据错误,请刷新页面！',
      })
    }

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