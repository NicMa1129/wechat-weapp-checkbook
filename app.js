//app.js
import store from './redux/store/index.js'
import WeAppRedux from './libs/wechat-weapp-redux.min.js'
const { Provider, connect } = WeAppRedux;

App(Provider(store)({
  onLaunch: function () {
    let that = this
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.globalData.width = res.windowWidth
        // console.log(that.width)   375
        that.globalData.height = res.windowHeight
        // console.log(that.height)  625
        // 这里的单位是PX，实际的手机屏幕有一个Dpr，这里选择iphone，默认Dpr是2
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.doGetUserInfo()
        } else {
          var _this = this
          wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
              if (res.errMsg === 'authorize:ok') {
                _this.doGetUserInfo()
              }
            }
          })
        }
      }
    })
  },
  doGetUserInfo() {
    var _this = this
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        _this.globalData.userInfo = res.userInfo

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (_this.userInfoReadyCallback) {
          _this.userInfoReadyCallback(res)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    connect: connect,
    width: 0,
    height: 0
  }
}))