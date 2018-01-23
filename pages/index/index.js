//index.js
//获取应用实例
import {
  fetchList
} from '../../redux/action/index.js'
import { dateFormat } from '../../common/base.js'
const app = getApp()

const pageConfig = {
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('open-type.getUserInfo'),
    hide: false,
    lastScrollTop: -1,
    accountList: {}
  },
  onScroll(e) {
    // console.log(e.detail.scrollTop)
    let { scrollTop } = e.detail
    // if (this.data.lastScrollTop < scrollTop) {
    //   this.setData({
    //     hide: true,
    //     lastScrollTop: scrollTop
    //   })
    // }
    // if (this.data.lastScrollTop > scrollTop) {
    //   this.setData({
    //     lastScrollTop: scrollTop
    //   })
    //   if (scrollTop < 200) {
    //     this.setData({
    //       hide: false
    //     })
    //   }
    // }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getUserInfo()
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  doRecord(){
    if (app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/typeIn/typeIn'
      })
    }else{
      // this.getUserInfo()
    }
  },
  onTapMore(){
    wx.showActionSheet({
      itemList: ['搜索账单', '共享此账本', '更换背景', '更多'],
      success: res => {
        let index = res.tapIndex
        switch (index){
          case 0:
            wx.navigateTo({
              url: '/pages/search/search'
            })
            break
          default:
            break
        }
      }
    })
  },
  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(app.globalData.userInfo)
        this.store.dispatch(fetchList())
        console.log(this.data.accountList)
        let list = this.data.accountList.list.slice()
        list.forEach(block => {
          block.header.date = dateFormat(block.header.date)
        })
        let accountList = Object.assign({}, this.data.accountList, list)
        this.setData({
          accountList: accountList
        })
      }
    })
  },
  globalData: {
    userInfo: {}
  }
}

const mapStateToData = state => ({
  accountList: state.accountList
});

const mapDispatchToPage = dispatch => ({
  fetchList: () => dispatch(fetchList())
});

const nextPageConfig = app.globalData.connect(mapStateToData, mapDispatchToPage)(pageConfig);
Page(nextPageConfig);