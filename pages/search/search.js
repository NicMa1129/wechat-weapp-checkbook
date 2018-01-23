// pages/search/search.js
import {
  fetchList
} from '../../redux/action/index.js'
import { dateFormat } from '../../common/base.js'
const app = getApp()

const pageConfig = {
  data: {
    showRes: false,
    res: [],
    searchValue: "",
    totalExpense: 0,
    totalNum: 0
  },
  onLoad(){
    wx.setNavigationBarTitle({
      title: '搜索'
    })
  },
  onChange(e){
    let val = e.detail.value
    if (val !== "") {
      let res = this.search(val)
      let total = this.getTotal(res)
      let totalNum = 0
      res.forEach(block => {
        block.list.forEach(item => {
          totalNum += 1
        })
      })
      this.setData({
        showRes: true,
        res: res,
        searchValue: val,
        totalExpense: total,
        totalNum: totalNum
      })
    }

    if (val === "" && this.data.showRes === true) {
      this.setData({
        res: [],
        showRes: false,
        searchValue: val
      })
    }
    console.log(this.data.res)
  },
  tagSearch(e) {
    let val = e.currentTarget.dataset.value
    // let val = e.target.attributes[1].value
    // this.autoFocusInst.focus()
    this.onChange({detail: {value: val}})
    this.setData({
      searchValue: val
    })
  },
  getTotal(list){
    let res = 0
    list.forEach(block => {
      block.list.forEach(item => {
        res = res + parseFloat(item.item.payNum)
      })
    })
    return res.toFixed(2)
  },
  search(val) {
    let { accountList } = this.data
    let list = accountList.list.slice()
    let res = []
    list.forEach((block, i) => {
      block.payList.forEach((item, j) => {
        if (item.payNum === val || item.bak.includes(val) || item.tag.tagName === val) {
          let obj = {
            id: i + '_' + j,
            item: item
          }
          if (res.length === 0) {
            res.push({
              date: block.header.date,
              list: [obj]
            })
          } else {
            let r = res.filter(m => dateFormat(block.header.date) === dateFormat(m.date))
            if (r.length === 0) {
              res.push({
                date: block.header.date,
                list: [obj]
              })
            } else {
              for (let n = 0; n < res.length; n++) {
                if (dateFormat(res[n].date) === dateFormat(block.header.date)) {
                  res[n].list.push(obj)
                }
              }
            }
          }
        }
      })
    })
    res = res.sort((a, b) => a.date < b.date)
    // console.log(res)
    return res
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