// components/recordPanel/recordPanel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    idx: {
      type: String,
      value: ''
    },
    data: {
      type: Object
    },
    notLast: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready(){
    console.log(this.data.data)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e){
      console.log(e)
      let id = e.currentTarget.dataset.idx
      wx.navigateTo({
        url: '/pages/detail/detail?id='+id
      })
    }
  }
})
