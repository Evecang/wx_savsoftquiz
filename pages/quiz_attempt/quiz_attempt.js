// pages/quiz_attempt/quiz_attempt.js
const app = getApp();
const URL = app.globalData.url;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rid:'',
    exam:null,
    abc:['A','B','C','D','E','F','G','H','I','J','K'],
    quiz:[],
    saved_answers:[],  //已作答的答案
    seconds:0,
    questions:[],
    options:[],

    saved_ans:[],
    options_qid:[],
    match_option:[],  //右边的匹配项 [qid][A,B,C,D]

    noq:0,  //quiz中
    qn:0, //当前
    lqn:0,  //last qn
    back:false,
    next:true,

    ind_time: [],    //记录每道题用时
    ctime:0,  //记录每道题用时的辅助变量，每秒+1，调用setIndTime时重置为0
    incTime:null, //循环标记1
    setIndTime:null, //循环标记2
    autoSubmit:null,//自动提交的函数

    timer: '', //定时器的名称
    timeStr:'', //剩余时间 字符串形式 

  },
  leadingZero:function(time) {
    return(time < 10) ?"0" + time : + time;
  },
  updateTimer:function(seconds){
    var Seconds = seconds;
    if (seconds == undefined || seconds == null) { Seconds = parseInt(this.data.seconds); }
    var Days = Math.floor(Seconds / 86400);
    Seconds -= Days * 86400;
    var Hours = Math.floor(Seconds / 3600);
    Seconds -= Hours * (3600);
    var Minutes = Math.floor(Seconds / 60);
    Seconds -= Minutes * (60);
    var TimeStr = ((Days > 0) ? Days + " days " : "") + this.leadingZero(Hours) + ":" + this.leadingZero(Minutes) + ":" + this.leadingZero(Seconds)
    // this.setData({ timeStr:TimeStr })
    return TimeStr;
  },
  submitform() {  //在onload setTimeOut到点自动执行
    wx.showModal({
      title: '提示',
      content: 'Time Over',
      showCancel: false,
      success: r => {
        //quiz/submit_quiz
        // this.submit_quiz()

        this.setIndividual_time(this.data.qn);
        //submit_quiz
        let cookie = wx.getStorageSync('cookieKey')
        let header = {}
        if (cookie) {
          header.Cookie = cookie;
        }
        wx.request({
          url: URL + 'quiz/wx_submit_quiz',
          header: header,
          success: res => {
            console.log('发送提交试卷请求成功')
            console.log(res)
            if (res && res.header && res.header['Set-Cookie']) {
              wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
            }
            //result/view_result/ $rid
            // wx.switchTab({
            //   url: '../result/result_list',
            // })
          },
          fail: res => {}
        })
        if (r.confirm) {
          wx.switchTab({
            url: '../result/result_list',
          })
        }
      }
    })
  },

  show_question:function(vqn){
    this.setData({ qn:vqn, lqn:vqn })
    // hide show next back btn     vqn从0开始
    if (vqn >= 1) {	//第一题之后 显示‘返回’
      this.setData({ back:true })
    }
    if (vqn < this.data.noq) {	//不是最后一题的话 显示‘下一题’
      this.setData({ next:true })
    }
    if ((parseInt(vqn) + 1) == this.data.noq) {	//最后一题 隐藏‘下一题’
      this.setData({ next:false })
    }
    if (vqn == 0) {	//第一题 隐藏‘返回’
      this.setData({ back:false })
    }
    this.setIndividual_time(vqn);
    // save_answer(vqn);
  },
  show_next_question: function(){
    var qn = this.data.qn;
    if ((parseInt(qn) + 1) < this.data.noq) {	//不为最后一题
      qn = parseInt(qn) + 1 
      this.setData({ qn:qn })
    }
    // hide show next back btn
    if (qn >= 1) {
      this.setData({ back: true })
    }
    if ((parseInt(qn) + 1) == this.data.noq) {
      this.setData({ next: false })
    }
    this.setIndividual_time(this.data.lqn);
    // save_answer(this.data.lqn);
    // last qn
    this.setData({ lqn : qn});
  },
  show_back_question: function(){
    var qn = this.data.qn
    if ((parseInt(qn) - 1) >= 0) {	//不为第一题
      qn = (parseInt(qn) - 1);	//返回上一题
      this.setData({ qn:qn })
    }
    // hide show next back btn
    if (qn < this.data.noq) {
      this.setData({ next:true })
    }
    if (qn == 0) {
      this.setData({ back:false })
    }
    this.setIndividual_time(this.data.lqn);
    // save_answer(this.data.lqn);	//保存答案，并自动计算某一些值

    // last qn
    this.setData({ lqn : qn})
  },
  save_answer: function (e) {
    console.log('执行了save_answer函数')
    //index.php/quiz/save_answer/
    let cookie = wx.getStorageSync('cookieKey')
    let header = { 'Content-type': 'application/x-www-form-urlencoded' }
    if (cookie) {
      header.Cookie = cookie;
    }
    let that = this
    let form = e.detail.value
    console.log('form表单的数据--------------------------------')
    console.log(form)
    wx.request({
      url: URL + 'quiz/wx_save_answer',
      method: 'POST',
      header: header,
      data: form,
      success: res => {
        console.log('save_answer 执行成功')
        console.log(res)
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
        }
        var res = res.data
        if (res.code == 0) {
          wx.showModal({
            title: 'Error',
            content: 'Login is expired',
            showCancel: false,
            success() {
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        } else {
          //提交成功 或者 上、下一题成功

        }
      },
      fail: res => {
        wx.showModal({
          title: '错误',
          content: '请求失败，请查看网络',
        })
      }
    })
  }, 
  increasectime: function(){
    this.setData({ ctime: this.data.ctime+1 })
  },

  setIndividual_time: function(cqn){
    console.log('执行了setIndividual函数————————————————————————————')
    console.log(`传进来的参数是：${cqn}`)
    console.log(`当前题号qn：${this.data.qn}`)
    console.log(`ctime：${this.data.ctime}`)
    console.log(`(前)this.data.ind_time：${this.data.ind_time}`)
    let ind_time = this.data.ind_time //数组
    let qn = this.data.qn
    if (cqn == undefined || cqn == null) {
      var cqn = '-1'
    }
    if (cqn == '-1') {  //题目本身
      ind_time[qn] = parseInt(ind_time[qn]) + parseInt(this.data.ctime);
      // this.setData({ ind_time: ind_time })
    } else {  //cqn有值说明 是返回的前一题
      ind_time[cqn] = parseInt(ind_time[cqn]) + parseInt(this.data.ctime);
      // this.setData({ ind_time: ind_time })
    }
    let quiz = this.data.quiz
    quiz.individual_time = ind_time.toString()
    console.log(`(后)this.data.ind_time：${quiz.individual_time}`)
    this.setData({ ctime : 0, quiz : quiz, ind_time : ind_time },function(){
      //maybe can put this code outside
      let cookie = wx.getStorageSync('cookieKey')
      let header = { 'Content-type': 'application/x-www-form-urlencoded' }
      if (cookie) {
        header.Cookie = cookie;
      }
      let that = this
      wx.request({
        url: URL + 'quiz/set_ind_time',
        method: 'POST',
        header: header,
        data: { individual_time: ind_time.toString() },
        success: res => {
          if (res && res.header && res.header['Set-Cookie']) {
            wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
          }
          console.log('setIndividual_time 执行成功-------------------------------------------')
        },
        fail: res => {
          wx.showModal({
            title: '错误',
            content: '请求失败，请查看网络',
          })
        }
      })

    })
  },
  submit_quiz: function(){
    wx.showModal({
      title: '提示',
      content: 'Do you really want to submit this quiz? ',
      success:r =>{
        if(r.confirm){
          this.setIndividual_time(this.data.qn);
          //submit_quiz
          let cookie = wx.getStorageSync('cookieKey')
          let header = {}
          if (cookie) {
            header.Cookie = cookie;
          }
          wx.request({
            url: URL+ 'quiz/wx_submit_quiz',
            header: header,
            success:res =>{
              console.log('发送提交试卷请求成功')
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
                    duration:700,
                    success: r =>{
                      //result/view_result/ $rid
                      wx.switchTab({
                        url: '../result/result_list',
                      })
                    }
                  })
                  break;
                case 2:
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1500
                  })
              }
            },
            fail: res => {
              wx.showModal({
                title: '错误',
                content: '请求失败，请查看网络',
              })
              }
          })
        }
      }
    })
  },
  
  shuffle: function(arr){
    var length = arr.length,
      randomIndex,
      temp;
    while (length) {
        randomIndex = Math.floor(Math.random() * (length--));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr;
  },
  mySavedAns: function(){
    //saved_ans对应每道题的作答情况
    var saved_ans = [];
    var questions = this.data.questions
    var saved_answers = this.data.saved_answers
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      switch (question.question_type) {
        case 'Multiple Choice Single Answer':
        case 'Multiple Choice Multiple Answer':
        case 'Match the Column':
        case 'Cloze Test':
          saved_answers.forEach(function (saved_answer, svk, array) {
            if (question.qid == saved_answer.qid) {
              if (!saved_ans[question.qid]) { saved_ans[question.qid] = []}
              saved_ans[question.qid].push(saved_answer.q_option);
            }
          });
          break;

        case 'Short Answer':
        case 'Long Answer':
          saved_answers.forEach(function (saved_answer, svk, array) {
            if (question.qid == saved_answer.qid) {
              // saved_ans = saved_answer.q_option;
              saved_ans[question.qid] = saved_answer.q_option;
              // break;
            }
          });
          break;
      }
    }
    this.setData({
      saved_ans: saved_ans
    })
    console.log('my保存的答案')
    console.log(saved_ans)
  },
  myOptions: function(){
    var options_qid = []
    var options = this.data.options
    var questions = this.data.questions
    for(var i=0;i<questions.length;i++){
      var question = questions[i]
      for(var j=0; j<options.length; j++){
        var option = options[j]
        if(question.qid == option.qid){
          if(!options_qid[question.qid]){
            options_qid[question.qid] = []
          }
          options_qid[question.qid].push(option)

          if (question.question_type =='Match the Column'){
            //match_option 右匹配项
            var match_option = this.data.match_option
            if (!match_option[question.qid]) { match_option[question.qid]=[] }
            match_option[question.qid].push(option.q_option_match)
            for(var n=0;n<match_option.length;n++){
              if(match_option[n]){
                match_option[n] = this.shuffle(match_option[n])
              }
            }
            this.setData({ match_option: match_option }, function () { 
            //   console.log(`match_option：`) 
            // console.log(this.data.match_option)
            })
          }
          
        }
      }
    }
    this.setData({
      options_qid: options_qid
    })
    console.log('测试。。。my options:')
    console.log(options_qid)
  },
  myMatchValue:function(){
    //返回index
    var res = false
    var r = ''
    for (var i = 0; i < sav; i++) {
      if (sav[i].indexOf(str) != -1) {
        res = true
        r = sav[i]
        break;
      }
    }
    if (res) {  //在已保存的答案里，找出在match_option中的索引
      for (var j = 0; j < mop.length; j++) {
        if (r.indexOf(mop[j]) != -1) { return j }
      }
    } else {
      return 0;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`这里是onLoad函数`)
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
        // console.log(res) 
        if (res && res.header && res.header['Set-Cookie']) {
          wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
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
            let data = result.data

            var ind_time = data.quiz.individual_time.split(',')
            for (var ct = 0; ct < data.quiz.noq; ct++) {
              if (!ind_time[ct]) {
                ind_time[ct] = 0
              } else {
                ind_time[ct] = ind_time[ct]
              }
            }

            that.setData({
              exam:data,
              quiz:data.quiz,
              saved_answers: data.saved_answers,
              seconds:data.seconds,
              questions:data.questions,
              options:data.options,
              noq:data.quiz.noq,
              ind_time: ind_time
            },function(){
              that.show_question('0') //
              var incTime = setInterval(that.increasectime, 1000);
              var setIndTime = setInterval(that.setIndividual_time, 30000);
              var autoSubmit = setTimeout(that.submitform, data.seconds*1000);
              that.setData({ incTime: incTime, setIndTime: setIndTime, autoSubmit: autoSubmit })

              let seconds = data.seconds
              that.setData({
                timer:setInterval(function(){
                  seconds--
                  that.setData({ seconds : seconds, timeStr:that.updateTimer(seconds) })
                  if(seconds <= 0){
                    clearInterval(that.data.timer)
                    wx.showToast({
                      title: "Time's up!",
                      icon:'none'
                    })

                  }

                },1000)
              })

              that.mySavedAns()
              that.myOptions()
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
                  url: '../result/result_list'
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
    console.log(`这里是onShow函数`)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.incTime)
    clearInterval(this.data.setIndTime)
    clearTimeout(this.data.autoSubmit)
    this.setIndividual_time()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.incTime)
    clearInterval(this.data.setIndTime)
    clearTimeout(this.data.autoSubmit)
    this.setIndividual_time()
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