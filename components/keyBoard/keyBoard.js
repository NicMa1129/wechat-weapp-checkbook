// components/keyBoard/keyBoard.js
import { formatDate } from '../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    baks: {
      type: Array,
      value: []
    },
    unshow: {
      type: Boolean,
      value: false
    },
    defaultDate: {
      type: String,
      value: ''
    },
    defaultBak: {
      type: String,
      value: ''
    },
    defaultValue: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: "",
    lastValue: "",
    isPoint: false,
    isPlus: false,
    isDec: false,
    curSelectDate: new Date(),
    dateShow: formatDate(new Date()),
    bak: "",
    isEdit: false,
    bakShow: "备注",
    payMode: 0,
    payModeList: ['现金', '储蓄卡', '信用卡', '支付宝', '微信零钱']
  },
  ready(){
    let { defaultDate, defaultBak, defaultValue } = this.data
    let bShow
    if(defaultDate){
      if (defaultBak.length > 5) {
        bShow = defaultBak.substr(0, 5) + "..."
      } else if (defaultBak.length === 0) {
        bShow = "备注"
      } else {
        bShow = defaultBak
      }

      this.setData({
        curSelectDate: defaultDate,
        dateShow: formatDate(defaultDate),
        bak: defaultBak,
        bakShow: bShow,
        value: defaultValue,
        isEdit: true
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelectPayMode(e){
      let payMode = e.detail.value
      this.setData({
        payMode: payMode
      })
    },
    onSelectDate(e){
      let date = e.detail.value
      let dateShow = formatDate(date)
      this.setData({
        curSelectDate: date,
        dateShow: dateShow
      })
    },
    setValue(val) {
      let data = {}
      if (this.data.isPlus || this.data.isDec) {
        data = {
          value: val
        }

      } else {
        data = {
          value: val,
          lastValue: val
        }
      }
      this.setData(data)
      // this.props.getValue(this.data.value)
      this.triggerEvent('getValue', {value: this.data.value})
    },
    onTapNum(e){
      let value = e.currentTarget.dataset.value
      let res = this.data.value + ""

      if (res.length === 0 && value === ".") {
        res = "0"
      }
      if (value !== null && !(res.includes(".") && res.split(".")[1].length >= 2)) {
        if (value !== ".") {
          res += value
        } else {
          if (!this.data.isPoint) {
            res += value
            this.setData({
              isPoint: true
            })
          }
        }
      }
      this.setValue(res)
    },
    del(e) {
      let res = this.data.value + ""
      let r
      if (res.length > 0) {
        if (res.substr(-2, 1) !== ".") {
          r = res.slice(0, -1)
        } else {
          r = res.slice(0, -2)
          this.setData({
            isPoint: false
          })
        }
        this.setValue(r)
      }
    },
    dec() {
      if (!this.data.isDec && !this.data.isPlus && this.data.value !== "") {
        this.setData({
          isDec: true,
          isPlus: false,
          lastValue: this.data.value,
          value: "",
          isPoint: false
        })
      }
    },
    plus() {
      if (!this.data.isPlus && !this.data.isDec && this.data.value !== "") {
        this.setData({
          isPlus: true,
          isDec: false,
          lastValue: this.data.value,
          value: "",
          isPoint: false
        })
      }
    },
    commit() {
      let curValue = (this.data.value.length !== 0 && this.data.value !== ".") ? this.data.value : 0
      let lastValue = (this.data.lastValue.length !== 0 && this.data.lastValue !== ".") ? this.data.lastValue : 0
      let res
      if (this.data.isPlus) {
        this.setData({
          isPlus: false,
        })
        res = parseFloat(parseFloat(curValue) + parseFloat(lastValue)).toFixed(2)
        this.setValue(res)
        let s = res + ""
        let ret = s.includes(".") ? true : false
        this.setData({
          isPoint: ret
        })
      } else if (this.data.isDec) {
        this.setData({
          isDec: false,
        })
        res = parseFloat(parseFloat(lastValue) - parseFloat(curValue)).toFixed(2)
        this.setValue(res)
        let s = res + ""
        let ret = s.includes(".") ? true : false
        this.setData({
          isPoint: ret
        })
      } else {
        let result = {
          value: this.data.value,
          date: this.data.curSelectDate,
          bak: this.data.bak,
          isEdit: this.data.isEdit,
          payMode: this.data.payModeList[this.data.payMode]
        }
        // this.props.submit(result)
        this.triggerEvent('submit', result)
      }
    },
    addBak(e) {
      let bak = e.currentTarget.dataset.text
      let bShow = ''
      // console.log(e)
      // let target = e.target || e.srcElement
      // let bak = target.innerText
      // let bakBtn = this.refs.bak
      // let vTag = document.createElement('div')
      // let tagPanel = document.querySelector('.tag-panel')

      // vTag.className = 'v-tag'
      // vTag.style.top = target.offsetTop + 'px'
      // vTag.style.left = target.offsetLeft + 'px'
      // vTag.innerText = bak
      // tagPanel.appendChild(vTag)

      // let moveLeft = bakBtn.offsetLeft + bakBtn.offsetWidth / 2 - vTag.offsetWidth / 2
      // let moveTop = bakBtn.offsetTop
      // TweenMove(vTag, { left: moveLeft, top: moveTop, opacity: 0 }, 500, 'Back-easeIn', () => {
      //   tagPanel.removeChild(tagPanel.childNodes[2])
      // })

      if (!this.data.bak.includes(bak)) {
        if (this.data.bak !== "") {
          bak = this.data.bak + " " + bak
        }
        
        if (bak.length > 5){
          bShow = bak.substr(0, 5) + "..."
        } else if (bak.length === 0){
          bShow = "备注"
        }else{
          bShow = bak
        }

        this.setData({
          bak: bak,
          bakShow: bShow
        })
      }
    }
  }
})
