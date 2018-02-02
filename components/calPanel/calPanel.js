// components/calPanel/calPanel.js
import { dateTimeFormatter, isEqualDateStr } from '../../common/base.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curYear: new Date().getFullYear(),
    curMonth: new Date().getMonth(),
    curDate: new Date().getDate(),
    weekStartOn: 7,
    dayNames: ["日", "一", "二", "三", "四", "五", "六"],
    dayList: [],
    today: "",
    currentSelectDay: ""
  },
  ready(){
    let dayList = this.dayList()
    this.setData({
      dayList: dayList
    })
    this.getToday()
    // console.log(this.data.dayList)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectEventDay(e){
      // console.log(e)
      let idx = e.currentTarget.dataset.idx
      let date = this.data.dayList[idx].date
      if (this.data.currentSelectDay === date){
        this.setData({
          currentSelectDay: ""
        })
      }else{
        this.setData({
          currentSelectDay: date
        })
      }
      
      this.triggerEvent('selectEventDay', { date: this.data.currentSelectDay })
    },
    preMonth(){
      let { curYear, curMonth } = this.data
      if (curMonth > 0){
        curMonth--
      }else{
        curYear--
        curMonth = 11
      }
      this.setData({
        curYear: curYear,
        curMonth: curMonth
      })
      let dayList = this.dayList()
      this.setData({
        dayList: dayList
      })
    },
    lastMonth(){
      let { curYear, curMonth } = this.data
      if (curMonth < 11) {
        curMonth++
      } else {
        curYear++
        curMonth = 0
      }
      this.setData({
        curYear: curYear,
        curMonth: curMonth
      })
      let dayList = this.dayList()
      this.setData({
        dayList: dayList
      })
    },
    getToday() {
      let dateObj = new Date()
      this.setData({
        today: `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
      })
    },
    dayList() {
      let firstDay = new Date(this.data.curYear, this.data.curMonth, 1)
      let dayOfWeek = firstDay.getDay()
      // console.log("dayOfWeek = " + dayOfWeek)
      // 根据当前日期计算偏移量 // Calculate the offset based on the current date
      if (this.data.weekStartOn > dayOfWeek) {
        dayOfWeek = dayOfWeek - this.data.weekStartOn + 7
      } else if (this.data.weekStartOn <= dayOfWeek) {
        dayOfWeek = dayOfWeek - this.data.weekStartOn
      }
      let startDate = new Date(firstDay)

      startDate.setDate(firstDay.getDate() - dayOfWeek)

      let item, status, tempArr = [], tempItem
      for (let i = 0; i < 42; i++) {
        item = new Date(startDate);
        item.setDate(startDate.getDate() + i);

        if (this.data.curMonth === item.getMonth()) {
          status = 1
        } else {
          status = 0
        }
        tempItem = {
          date: `${item.getFullYear()}/${item.getMonth() + 1}/${item.getDate()}`,
          showDay: item.getDate(),
          status: status,
          customClass: ['bg-sel'],
          eventsArr: []
        }
        this.data.list.forEach((block) => {
          if (isEqualDateStr(block.header.date, tempItem.date)) {
            tempItem.eventsArr.push(block)
            // if (event.customClass) tempItem.customClass.push(event.customClass)
          }
        })
        tempArr.push(tempItem)
      }
      // console.log(tempArr)
      
      return tempArr
    }
  }
})
