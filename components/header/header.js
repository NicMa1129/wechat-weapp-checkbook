Component({
  properties: {
    name: {
      type: String,
      value: 'nic'
    }
  },
  methods: {
    goCalender(){
      wx.navigateTo({
        url: '/pages/calender/calender'
      })
    }
  }
})