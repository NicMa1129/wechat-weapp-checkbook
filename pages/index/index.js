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
    accountList: {},
    showBgWall: false,
    bgUrl: '../../image/bg.jpg',
    bgList: [],
    showPicClip: false,
    picW: 0,
    picH: 0
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
    this.getLocalImg()
    this.ctx = wx.createCanvasContext('picClip')
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
  getLocalImg(){
    let _this = this
    wx.getSavedFileList({
      success: res => {
        // console.log(res)
        let path
        if (res.fileList.length === 0){
          path = '../../image/bg.jpg'
        }else{
          let picList = res.fileList.sort((a, b) => a.createTime < b.createTime)
          // console.log(picList)
          let idx = wx.getStorageSync('__bg_index__') || 0
          path = picList[idx].filePath
        }
        _this.setData({
          bgUrl: path,
          bgList: res.fileList
        })
      }
    })
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
  goStatis(){
    wx.navigateTo({
      url: '/pages/statis/statis'
    })
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
          case 1:
            wx.showToast({
              title: '敬请期待！',
              icon: 'none'
            })
            break
          case 2:
            this.setData({
              showBgWall: true
            })
            break
          case 3:
            wx.showToast({
              title: '敬请期待！',
              icon: 'none'
            })
            break
          default:
            break
        }
      }
    })
  },
  onPageScroll(){},
  initPicClip(){
    let _this = this
    wx.getImageInfo({
      src: _this.tmpPic,
      success: res => {
        // console.log(res)
        _this.setData({
          picW: res.width,
          picH: res.height
        })
        _this.drewPic(0, _this.distanceY)
        _this.setData({
          // bgUrl: tempFilePaths[0],
          showPicClip: true
        })
        // setTimeout(() => {
        //   setInterval(() => {
        //     _this.drewPic(0, _this.distanceY)
        //   }, 1000 / 60)
        // }, 1000)
        // requestAnimationFrame(_this.drewPic())
      }
    })
  },
  drewPic(dx = 0, dy = this.distanceY){
    this.erase()
    let dWidth = app.globalData.width
    let sWidth = this.data.picW, sHeight = this.data.picH
    let r = dWidth / sWidth
    let dHeight = parseInt(r * sHeight)

    this.ctx.setFillStyle('#4f4f4f')
    this.ctx.fillRect(0, 0, dWidth, app.globalData.height)

    this.ctx.drawImage(this.tmpPic, dx, dy, dWidth, dHeight)

    this.ctx.setFillStyle('rgba(0, 0, 0, .7)')
    this.ctx.fillRect(0, 0, dWidth, 150)

    this.ctx.fillRect(0, 0.75 * dWidth + 150, dWidth, app.globalData.height - 0.75 * dWidth - 150)

    this.ctx.setFontSize('16')
    this.ctx.setFillStyle('#ffffff')
    this.ctx.fillText('取消', 30, app.globalData.height - 30)
    this.ctx.fillText('选取', app.globalData.width - 60, app.globalData.height - 30)
    this.ctx.draw()
    // requestAnimationFrame(this.drewPic())
  },
  commitPicClip(){
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: () => {
        let _this = this
        let dWidth = app.globalData.width
        let sWidth = this.data.picW, sHeight = this.data.picH
        let r = dWidth / sWidth
        let dHeight = parseInt(r * sHeight)

        this.lastDisX = this.lastDisX || 0
        this.lastDisY = this.lastDisY || 150

        this.ctx.setFillStyle('#4f4f4f')
        this.ctx.fillRect(0, 0, dWidth, app.globalData.height)

        this.ctx.drawImage(this.tmpPic, 0, this.lastDisY, dWidth, dHeight)

        this.ctx.setFillStyle('rgba(0, 0, 0, .7)')
        this.ctx.fillRect(0, 0, dWidth, 150)

        this.ctx.fillRect(0, 0.75 * dWidth + 150, dWidth, app.globalData.height - 0.75 * dWidth - 150)

        this.ctx.setFontSize('16')
        this.ctx.setFillStyle('#ffffff')
        this.ctx.fillText('取消', 30, app.globalData.height - 30)
        this.ctx.fillText('选取', app.globalData.width - 60, app.globalData.height - 30)

        this.ctx.draw(false, _this.savePicFromCanvas)
      }
    })
  },
  savePicFromCanvas(){
    let _this = this
    wx.canvasToTempFilePath({
      canvasId: 'picClip',
      x: 0,
      y: 150,
      height: 0.75 * app.globalData.width,
      success: res => {
        // console.log(res)
        let tmpPath = res.tempFilePath

        wx.saveFile({
          tempFilePath: tmpPath,
          success: r => {
            // console.log(r)
            let filePath = r.savedFilePath
            wx.hideLoading()
            _this.setData({
              bgUrl: filePath,
              showBgWall: false,
              showPicClip: false
            })
            // _this.getLocalImg()
          }
        })
      }
    })
  },
  cancelPicClip(){
    this.setData({
      showPicClip: false
    })
  },
  erase(){
    this.ctx.rect(0, 0, app.globalData.width, app.globalData.height)
  },
  touchStartPicClip(e){
    // console.log(e)
    let x = e.touches[0].x, y = e.touches[0].y

    if (x > 30 && x < 70 && y > (app.globalData.height - 60) && y < (app.globalData.height - 30)){//取消
      // this.cancelPicClip()
    } else if (x > (app.globalData.width - 60) && x < (app.globalData.width - 30) && y > (app.globalData.height - 60) && y < (app.globalData.height - 30)){//选取
      // this.commitPicClip()
    }else{
      this.lastDisX = this.lastDisX || 0
      this.lastDisY = this.lastDisY || 150
      this.sPointX = x - this.lastDisX
      this.sPointY = y - this.lastDisY
    }
  },
  touchMovePicClip(e){
    // console.log(e)
    let x = e.touches[0].x, y = e.touches[0].y
    let distanceX = x - this.sPointX, distanceY = y - this.sPointY
    // this.distanceY = y - this.sPointY
    // console.log(this.distanceY)
    this.drewPic(0, distanceY)
  },
  touchEndPicClip(e){
    // console.log(e)
    let x = e.changedTouches[0].x, y = e.changedTouches[0].y

    if (x > 30 && x < 70 && y > (app.globalData.height - 60) && y < (app.globalData.height - 30)) {//取消
      this.cancelPicClip()
    } else if (x > (app.globalData.width - 60) && x < (app.globalData.width - 30) && y > (app.globalData.height - 60) && y < (app.globalData.height - 30)) {//选取
      this.commitPicClip()
    } else {
      this.lastDisX = x - this.sPointX
      this.lastDisY = y - this.sPointY
    }

    // console.log("lastDisX = " + this.lastDisX)
    // console.log("lastDisY = " + this.lastDisY)
  },
  closeBgWall(){
    this.setData({
      showBgWall: false
    })
  },
  chooseImg(){
    let _this = this
    this.distanceY = 150
    wx.chooseImage({
      count: 1,
      success: res => {
        // console.log(res)
        let tempFilePaths = res.tempFilePaths
        _this.tmpPic = tempFilePaths[0]
        _this.initPicClip()
      }
    })
  },
  changeImg(e){
    let src = e.currentTarget.dataset.src
    let idx = parseInt(e.currentTarget.dataset.idx)
    this.setData({
      bgUrl: src,
      showBgWall: false
    })
    wx.setStorage({
      key: '__bg_index__',
      data: idx
    })
  },
  getUserInfo(){
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }else{
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
    
    this.store.dispatch(fetchList())
    // console.log(this.data.accountList)
    let list = this.data.accountList.list.slice()
    list.forEach(block => {
      block.header.date = dateFormat(block.header.date)
    })
    let accountList = Object.assign({}, this.data.accountList, list)
    this.setData({
      accountList: accountList
    })
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