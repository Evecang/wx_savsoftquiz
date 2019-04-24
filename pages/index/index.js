//index.js
const app = getApp();
const URL = app.globalData.url;
var md5 = require('../../utils/md5.js') //md5

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loading:false,
    showLogin:true,
    userData: null, 
    bgImgAbosoluteUrl:  ''
  },
  //事件处理函数
  formSubmit(e){
    if(e.detail.value.email.length==0 || e.detail.value.password.length==0){
      wx.showToast({
        title:'账号与密码不能为空',
        icon:'none',
        duration:1000
      })
    }else{
      var that = this
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          that.setData({
            loading:true
          })
          wx.request({
            url: URL +'login/wx_verifylogin',
            data: {
              code:res.code,
              email: e.detail.value.email,
              password: md5.hexMD5(e.detail.value.password)
            },
            header:{
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: res => {
              console.log('login success return :>>>>')
              if (res && res.header && res.header['Set-Cookie']) {
                wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
              }
              console.log(res)
              if(res.data['status']){ //login error
                wx.showModal({
                  title:'',
                  content:res.data['message'],
                  showCancel:false
                })
              }else{
                wx.showToast({  //login success
                  title:'login success',
                  duration:1000,
                  success(d){
                    //TODO:存储用户信息,目前在后台$this->session中存储了
                    app.globalData.userData = res.data
                    that.setData({
                      userData : res.data
                    })
                  }
                })
                that.setData({ showLogin: false })
              }
              that.setData({ loading: false})
            },
            fail:res =>{
              wx.showModal({
                title: '错误',
                content: '请求失败，请查看网络',
                showCancel: false
              })
            }
          })
        }
      })
    }
  },
  formReset(e){
    console.log('clear login form')
  },
  editUser(e){
    var that = this
    var form = e.detail.value
    if(form.password != ''){
      form.password = md5.hexMD5(form.password)
    }
    // console.log(that.data.userData.uid)  
    let cookie = wx.getStorageSync('cookieKey');//取出Cookie
    let header = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (cookie) {
      header.Cookie = cookie;
    }
    this.setData({
      loading:true
    })
    wx.request({
      url: URL +'user/wx_update_user/'+that.data.userData.uid,
      method: 'POST',
      data:{
        email:form.email,
        password: form.password,
        first_name:form.first_name,
        last_name:form.last_name,
        contact_no:form.contact_no
      },
      header: header,
      success: res =>{
        console.log(res)
        if(res.data[0]){
          that.setData({
            loading:false
          })
          wx.showModal({
            title: '提示',
            content: res.data[1],
            showCancel: false
          })
        }else{
          that.setData({
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: res.data[1],
            showCancel: false
          })
        }
      }

    })
  },
  onLoad: function () {
    var that = this
    
    if (app.globalData.userInfo) {

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        bgImgAbosoluteUrl: app.globalData.userInfo.avatarUrl
      })
    } else if (this.data.canIUse){

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          bgImgAbosoluteUrl: app.globalData.userInfo.avatarUrl
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.login({  //自动登录
      success:res=>{
        wx.request({
          url: URL + 'login/wx_autologin',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: res1 => {
            console.log('微信自动登录返回的数据：')
            console.log(res1)
            if(res1.data['status']=='0'){
              that.setData({
                showLogin:true
              })
            } else {
              if (res1 && res1.header && res1.header['Set-Cookie']) {
                wx.setStorageSync('cookieKey', res1.header['Set-Cookie']);   //保存Cookie到Storage
              }
              // console.log(res1.header['Set-Cookie'])
              //已经绑定
              that.setData({ 
                showLogin: false, 
                userData: res1.data['user']
              })
              app.globalData.userData = res1.data['user']
              console.log(app.globalData.userData)
            }
          }
        })
      }
    })

  },
  getUserInfo: function(e) {
    console.log("userInfo:"+e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
