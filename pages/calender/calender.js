// pages/calender/calender.js
import {
  fetchList
} from '../../redux/action/index.js'
import { dateFormat } from '../../common/base.js'
const app = getApp()

const pageConfig = {
  data: {
    list: [],
    currentList: []
  },
  onLoad(){
    let { accountList } = this.data
    this.setData({
      list: accountList.list,
      currentList: accountList.list
    })
  },
  handSelectEventDay(e) {
    let date = e.detail.date
    if (date){
      let year = parseInt(date.split('/')[0])
      let month = parseInt(date.split('/')[1])
      let day = parseInt(date.split('/')[2])

      let tmp = this.data.list.filter(block => {
        let y = parseInt(block.header.date.split('-')[0])
        let m = parseInt(block.header.date.split('-')[1])
        let d = parseInt(block.header.date.split('-')[2])
        return year === y && month === m && day === d
      })
      this.setData({
        currentList: tmp
      })
    }else{
      this.setData({
        currentList: this.data.list
      })
    }
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