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
      'quid': '20',
      'quiz_name': 'long answer test 3',
      'description': '<p>测试longanswer成绩、显示、作答功能。</p>',
      'start_date': '1554399143',
      'end_date': '1585935143',
      'gids': '1',
      'qids': '22,24,28',
      'noq': '3',
      'correct_score': '15,10,25',
      'incorrect_score': '0,0,0',
      'ip_address': '',
      'duration': '3000',
      'maximum_attempts': '100',
      'pass_percentage': '60',
      'view_answer': '1',
      'camera_req': '0',
      'question_selection': '0',
      'gen_certificate': '0',
      'certificate_text': {},
      'with_login': '1',
      'quiz_template': 'Default', 
      },{
        'quid': '19',
        'quiz_name': 'cloze1',
        'description': '',
        'start_date': '1554102399',
        'end_date': '1585638399',
        'gids': '1',
        'qids': '26,27',
        'noq': '2',
        'correct_score': '10,15',
        'incorrect_score': '0,0',
        'ip_address': '',
        'duration': '99999',
        'maximum_attempts': '100',
        'pass_percentage': '50',
        'view_answer': '1',
        'camera_req': '0',
        'question_selection': '0',
        'gen_certificate': '0',
        'certificate_text': {},
        'with_login': '1',
        'quiz_template': 'Default',
      },{
        'quid': '18',
        'quiz_name': 'chengji',
        'description': '',
        'start_date': '1554083931',
        'end_date': '1585619931',
        'gids': '1',
        'qids': '7,17,18,19',
        'noq': '4',
        'correct_score': '1,2,3,4',
        'incorrect_score': '0,0,0,0',
        'ip_address': '',
        'duration': '10',
        'maximum_attempts': '10',
        'pass_percentage': '50',
        'view_answer': '1',
        'camera_req': '0',
        'question_selection': '0',
        'gen_certificate': '0',
        'certificate_text': {},
        'with_login': '1',
        'quiz_template': 'Default',
      },{
        'quid' : '17',
        'quiz_name' : 'long answer test 2',
        'description' : '',
        'start_date' : '1554082520',
        'end_date' : '1585618520',
        'gids' : '1',
        'qids' : '20,16,18,19,24',
        'noq' : '5',
        'correct_score' : '5,5,1,1,5',
        'incorrect_score' : '0,0,0,0,0',
        'ip_address' : '',
        'duration' : '10',
        'maximum_attempts' : '10',
        'pass_percentage' : '50',
        'view_answer' : '1',
        'camera_req' : '0',
        'question_selection' : '0',
        'gen_certificate' : '0',
        'certificate_text' : {},
        'with_login' : '1',
        'quiz_template' : 'Default',
      }],
    bgColor: ['#dff0d8', '#fcf8e3', '#d9edf7','#f2dcf2'],
    fontColor: ['#3c763d', '#8a6d3b', '#31708f','#a94442'],
    userData: app.globalData.userData
  },
  search(e){
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
        search: e.detail.value.search
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
        console.log('获取考试列表失败')
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
        wx.setStorage({
          key: 'quizDetail',
          data: res.data
        })
        //跳转至详情页面
        wx.navigateTo({
          url: '../quiz_detail/quiz_detail'
        })
      },
      fail:res =>{
        console.log('get quid detail failed')
      }
    })

  },
  editQuiz(e){
    console.log('edit')
  },
  removeQuiz(e){
    console.log('remove')
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