import {
  fetchList,
  delAccount,
  delSearchRes
} from '../../redux/action/index.js'
import { dateFormat, dateTimeFormat } from '../../common/base.js'

const app = getApp()
const pageConfig = {
  data: {
    accountList: {},
    blockIndex: null,
    itemIndex: null,
    currentBlock: null
  },
  onLoad(options){
    wx.setNavigationBarTitle({
      title: '明细'
    })

    let id = options.id
    let blockIndex = parseInt(id.split('_')[0])
    let itemIndex = parseInt(id.split('_')[1])
    let list = this.data.accountList.list.slice()
    list.forEach(block => {
      block.header.date = dateTimeFormat(block.header.date)
    })
    let accountList = Object.assign({}, this.data.accountList, list)

    let block = itemIndex !== null ? accountList.list[blockIndex] : null

    this.setData({
      accountList: accountList,
      blockIndex: blockIndex,
      itemIndex: itemIndex,
      currentBlock: block
      // detailItem: accountList.list[blockIndex].payList[itemIndex]
    })
  },
  onTapEdit(){
    wx.navigateTo({
      url: '/pages/typeIn/typeIn?blockIndex=' + this.data.blockIndex + '&itemIndex=' + this.data.itemIndex
    })
  },
  onTapDel(){
    wx.showModal({
      title: '确定要删除吗？',
      content: '辛苦记得账就找不回来啦！',
      success: res => {
        if (res.confirm){
          this.store.dispatch(delAccount({
            blockIndex: this.data.blockIndex,
            itemIndex: this.data.itemIndex
          }))
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    })
  }
}
const mapStateToData = state => ({
  accountList: state.accountList
});

const mapDispatchToPage = dispatch => ({
  fetchList: () => dispatch(fetchList()),
  delAccount: data => dispatch(delAccount(data)),
  delSearchRes: data => dispatch(delSearchRes(data))
});

const nextPageConfig = app.globalData.connect(mapStateToData, mapDispatchToPage)(pageConfig);
Page(nextPageConfig);