// components/headTab/headTab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isExpense: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    income: false,
    expense: true
  },
  ready(){
    this.setData({
      income: !this.data.isExpense,
      expense: this.data.isExpense
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onIncome(e){
      if(this.data.income === false){
        this.triggerEvent('tapIncome', e.detail)
        this.setData({
          income: true,
          expense: false
        })
      }
    },
    onExpense(e){
      if(this.data.expense === false){
        this.triggerEvent('tapExpense', e.detail)
        this.setData({
          income: false,
          expense: true
        })
      }
    }
  }
})
