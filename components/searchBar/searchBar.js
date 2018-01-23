// components/searchBar/searchBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vaule: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false
  },
  ready(){

  },
  /**
   * 组件的方法列表
   */
  methods: {
    onFocus(){
      if(!this.data.isFocus){
        this.setData({
          isFocus: true
        })
      }
    },
    onBlur(){
      if (this.data.isFocus) {
        this.setData({
          isFocus: false
        })
      }
    },
    onInput(e){
      // console.log(e.detail.value)
      let value = e.detail.value
      this.triggerEvent('onChange', { value: value })
    }
  }
})
