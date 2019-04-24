// pages/result_answerSheet/answer_sheet.js

const app = getApp();
const URL = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saved_ans: null,
    options_qid : null,
    result:null,
    matchColumnAns:[],
    adc:['A','B','C','D','E','F','G','H','I','J','K'],
    ind_score:null,
    answerBoxColor: ['#fff','#71ba5d', '#ff5e5e', '#fdfbcf', '#9fcdf4'], //白、绿、红、黄、蓝
    answerFontColor:['#000','#fff','#fff','#000','#fff'],
    rightOrWrong: ['icon-dagou', 'icon-cuowu', '']
    // match_option:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const result = wx.getStorageSync('quizResultDetail');

    if(!result){

      wx.showToast({
        title: '数据加载出错！',
      })

      return;
    }

    var ind_score = result.result.score_individual.split(',');
    //解析遇到4- 的情况
    for(var i=0; i<ind_score.length; i++){
      if(ind_score[i][0]=='4'){ ind_score[i]=4}
    }

    this.setData({
      result,
      ind_score
    },()=>{

      this.mySavedAns();

      this.myOptions();

      setTimeout(()=>{
        this.getAllAnswer(this.data.options_qid, this.data.saved_ans,this.data.result.questions)
      },0)

      console.log('>>>>>saved_ans>>>>>:', this.data.saved_ans)

      console.log('>>>>>options_qid>>>>>:', this.data.options_qid)
    })

  },

  mySavedAns: function () {
    //sved_ans对应每道题的作答情况
    var saved_ans = [];
    var result = this.data.result;
    var questions = result.questions
    var saved_answers = result.saved_answers
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      switch (question.question_type) {
        case 'Multiple Choice Single Answer':
        case 'Multiple Choice Multiple Answer':
        case 'Match the Column':
        case 'Cloze Test':
          saved_answers.forEach(function (saved_answer, svk, array) {
            if (question.qid == saved_answer.qid) {
              if (!saved_ans[question.qid]) { saved_ans[question.qid] = [] }
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

    // const saved_ans_result = saved_ans.filter(item=>item != undefined)

    this.setData({
      saved_ans
    })
  },

  myOptions: function () {
    var options_qid = []
    var result = this.data.result
    var options = result.options
    var questions = result.questions
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i]
      for (var j = 0; j < options.length; j++) {
        var option = options[j]
        if (question.qid == option.qid) {
          if (!options_qid[question.qid]) {
            options_qid[question.qid] = []
          }
          options_qid[question.qid].push(option)

        }
      }
    }

    // const options_qid_result = options_qid.filter(item => item != undefined)

    this.setData({
      options_qid
    })
  },
  //匹配题专用，返回一个对象数组，每一个对象包括包含了匹配左项、用户选择项、匹配右项
  getAllAnswer:function (options_qid, saved_ans,questions) {

    let result = [],
        qids = [],
        that = this


    questions.forEach(question=>{
      if (question.question_type == 'Match the Column'){
          qids.push(question.qid)
      }
    })
    for(let i =0;i<qids.length;i++){
      let allMatchAnswers = {}
      allMatchAnswers.qid = qids[i]

      for (let j = 0; j < options_qid[qids[i]].length;j++){

        let option = options_qid[qids[i]][j]

        allMatchAnswers.q_option = option.q_option;
        allMatchAnswers.q_option_match = option.q_option_match;

        for (let z = 0; z < saved_ans[qids[i]].length;z++){

          let saveans = saved_ans[qids[i]][z],
              saveansArr = saveans.split('___'),
            optionLeft = saveansArr[0],
            optionRight = saveansArr[1];

          if (optionLeft == option.q_option) {
            
            allMatchAnswers.ansChoice = optionRight
            console.log('___', allMatchAnswers)
            let result = this.data.matchColumnAns;
            result.push(allMatchAnswers);
            (function(result){
              that.setData({
                matchColumnAns: result
              })
            })(result)
          }
        }
      }
    }


    console.log('____________________', this.data.matchColumnAns)
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