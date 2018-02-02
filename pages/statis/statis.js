// pages/statis/statis.js
import {
  fetchList
} from '../../redux/action/index.js'
import { dateFormat, unique } from '../../common/base.js'
const app = getApp()

const pageConfig = {
  data: {
    isExpense: true,
    year: "",
    month: "",
    totalCost: 0,
    chartData: [],
    chartDataItem: [],
    isEmpty: false
  },
  onLoad(){
    let { accountList } = this.data
    let year, month
    if (accountList.list.length === 0){
      year = new Date().getFullYear()
      month = new Date().getMonth()
    }else{
      year = new Date(accountList.list[0].header.date).getFullYear()
      month = new Date(accountList.list[0].header.date).getMonth()
    }
    this.initData(accountList, year, month)
    this.setData({
      year: year,
      month: month,
      monthShow: parseInt(month) + 1
    })
  },
  initData(accountList, year, month, isExpense = true){
    let total = this.getStatis(accountList.list, year, month, isExpense)
    // console.log(total)
    let chartData = []
    let totalCostArr = Object.values(total)
    let chartDataItem = Object.entries(total)
    let totalCost = 0
    let percent

    totalCostArr.forEach(v => {
      totalCost = totalCost + parseFloat(v.cost)
    })

    chartDataItem.forEach(item => {
      percent = (parseFloat(item[1].cost) / totalCost) * 100
      item.push(parseFloat(percent).toFixed(2))
      chartData.push({
        name: item[0],
        y: item[2],
        color: '#' + item[1].tag.color
      })
    })

    if (Object.keys(total).length === 0) {
      this.setData({
        isEmpty: true,
        totalCost: parseFloat(totalCost).toFixed(2),
        chartData: chartData,
        chartDataItem: chartDataItem
      })
    } else {
      this.setData({
        isEmpty: false,
        totalCost: parseFloat(totalCost).toFixed(2),
        chartData: chartData,
        chartDataItem: chartDataItem
      })
    }
    this.drew(chartData)
  },
  drew(chartData){
    let ctx = wx.createCanvasContext('chart')
    let x = 0.8 * app.globalData.width / 2, y = 0.8 * app.globalData.width / 2
    let r = 0.65 * 0.8 * app.globalData.width / 2

    let sAngle = 0, eAngle = 0, tmpAngle = 0

    ctx.setLineWidth(70)

    if (chartData.length === 0){
      eAngle = 2 * Math.PI
      ctx.beginPath()
      ctx.arc(x, y, r, sAngle, eAngle)
      ctx.setStrokeStyle('#f6c87a')
      ctx.stroke()
    }else{
      chartData.forEach((item, index) => {
        let percent = parseFloat(item.y) / 100
        eAngle = percent * 2 * Math.PI
        eAngle += sAngle
        ctx.beginPath()
        ctx.arc(x, y, r, sAngle, eAngle)
        ctx.setStrokeStyle(item.color)
        ctx.stroke()
        sAngle = eAngle
      })
    }
    ctx.draw()
  },
  getStatis(list, year, month, isExpense){
    let allCost = []
    let allTagName = []

    for (let i = 0; i < list.length; i++) {
      let curYear = new Date(list[i].header.date).getFullYear()
      let curMonth = new Date(list[i].header.date).getMonth()
      if (curYear === year && curMonth === month) {
        list[i].payList.forEach(item => {
          if (isExpense && item.isExpense) {
            allTagName.push(item.tag.tagName)
            allCost.push(item)
          }
          if (!isExpense && !item.isExpense) {
            allTagName.push(item.tag.tagName)
            allCost.push(item)
          }
        })
      }
    }

    let tagNameArr = unique(allTagName)
    let total = {}
    tagNameArr.forEach(name => {
      allCost.forEach(item => {
        if (name === item.tag.tagName) {
          total[name] = {
            cost: parseFloat(total[name] ? total[name].cost : 0) + parseFloat(item.payNum),
            tag: item.tag
          }
        }
      })
    })
    return total
  },
  onTapIncome(){
    let { accountList, year, month } = this.data
    this.setData({
      isExpense: false
    })
    this.initData(accountList, year, month, false)
  },
  onTapExpense(){
    let { accountList, year, month } = this.data
      this.setData({
        isExpense: true
      })
    this.initData(accountList, year, month, true)
  },
  preMonth(){
    let { accountList, year, month, isExpense } = this.data
    if(month === 0){
      year -= 1
      month = 11
    }else{
      month -= 1
    }
    this.setData({
      year: year,
      month: month,
      monthShow: parseInt(month) + 1
    })
    this.initData(accountList, year, month, isExpense)
  },
  lastMonth(){
    let { accountList, year, month, isExpense } = this.data
    if (month === 11) {
      year += 1
      month = 0
    } else {
      month += 1
    }
    this.setData({
      year: year,
      month: month,
      monthShow: parseInt(month) + 1
    })
    this.initData(accountList, year, month, isExpense)
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