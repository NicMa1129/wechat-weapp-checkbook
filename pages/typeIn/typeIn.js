import {
  addAccount,
  fetchTagList,
  fetchList,
  editAccount,
  delSearchRes
} from '../../redux/action/index.js'

const app = getApp()

const pageConfig = {
  data: {
    unshowKb: false,
    curTags: [],
    tagsRow: [],
    isExpense: true,
    selectedTag: {},
    selectedTagIndex: 0,
    defaultValue: '0.00',
    idEdit: false,
    curValue: '0.00',
    defaultDate: '',
    defaultBak: '',
    blockIndex: null,
    itemIndex: null
  },
  onLoad(options){
    let { blockIndex, itemIndex } = options
    let { accountList, tagList, curTags, selectedTagIndex } = this.data
    let tags

    if (typeof blockIndex !== 'undefined' && typeof itemIndex !== 'undefined'){
      let defaultItem = accountList.list[parseInt(blockIndex)].payList[parseInt(itemIndex)]
      console.log(defaultItem)

      if (defaultItem.isExpense) {
        tags = tagList.expense
      } else {
        tags = tagList.income
      }
      tags.forEach((tag, index) => {
        if (tag.tagName === defaultItem.tag.tagName) {
          tag.selected = true
          selectedTagIndex = index
        } else {
          tag.selected = false
        }
      })
      this.setData({
        curValue: defaultItem.payNum,
        defaultDate: accountList.list[blockIndex].header.date,
        defaultBak: defaultItem.bak,
        isExpense: defaultItem.isExpense,
        selectedTagIndex: selectedTagIndex,
        blockIndex: blockIndex,
        itemIndex: itemIndex
      })
    }else{
      tags = this.data.isExpense ? this.data.tagList.expense : this.data.tagList.income
    }

    this.getTagsRows(tags)
  },
  onTapIncome(){
    this.setData({
      isExpense: false
    })
    this.getTagsRows(this.data.tagList.income)
  },
  onTapExpense(){
    this.setData({
      isExpense: true
    })
    this.getTagsRows(this.data.tagList.expense)
  },
  onTapTag(e){
    let idx = e.currentTarget.dataset.idx.split('-')
    let index = parseInt(idx[0]) * 5 + parseInt(idx[1])
    let newTags = []
    this.data.curTags.forEach((tag, i) => {
      if(i == index){
        tag.selected = true
      }else{
        tag.selected = false
      }
      newTags.push(tag)
    })
    this.setData({
      curTags: newTags,
      selectedTagIndex: index
    })
    this.getTagsRows(this.data.curTags)
  },
  getKbValue(e){
    // console.log(e)
    let value = e.detail.value.length === 0 ? '0.00' : e.detail.value

    this.setData({
      curValue: value
    })
    // console.log(value)
  },
  kbSubmit(e){
    let kbValue = e.detail
    let tag = null
    let result = {
      isExpense: this.data.isExpense,
      selectedTagIndex: this.data.selectedTagIndex,
      blockIndex: this.data.blockIndex,
      itemIndex: this.data.itemIndex,
      ...kbValue
    }
    console.log(result)
    if (result.isExpense){
      tag = this.data.tagList.expense[result.selectedTagIndex]
    }else{
      tag = this.data.tagList.income[result.selectedTagIndex]
    }

    if (!result.isEdit){
      if (parseFloat(result.value) > 0){
        let _this = this
        wx.showLoading({
          title: '加载中...',
          mast: true,
          success: () => {
            _this.store.dispatch(addAccount({
              value: result.value,
              date: result.date,
              bak: result.bak,
              tag: {
                tagName: tag.tagName,
                icon: tag.icon,
                color: tag.color
              },
              isExpense: result.isExpense
            }))
          }
        })
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/index/index'
        })
      }
    }else{
      if (parseFloat(result.value) > 0) {
        this.store.dispatch(editAccount({
          blockIndex: result.blockIndex,
          itemIndex: result.itemIndex,
          value: result.value,
          date: result.date,
          bak: result.bak,
          tag: {
            tagName: tag.tagName,
            icon: tag.icon,
            color: tag.color
          },
          isExpense: result.isExpense
        }))
        wx.navigateTo({
          url: '/pages/index/index'
        })
      }
    }
  },
  getTagsRows(tags){
    let rows = Math.ceil(tags.length / 5)
    let lis = []
    for (let i = 0; i < rows; i++){
      let cels = []
      tags.forEach((item, j) => {
        if ((j < (i + 1) * 5) && (j >= i * 5)) {
          cels.push(item)
        }
      })
      lis.push(cels)
    }
    this.setData({
      tagsRow: lis,
      curTags: tags
    })
    this.updateSelectedTag(this.data.curTags)
  },
  updateSelectedTag(curTags){
    let tag = curTags.filter(tag => tag.selected === true)
    this.setData({
      selectedTag: tag[0]
    })
  },
  touchstart(e){
    this.startP = e.touches[0]
    // console.log("start = " + this.startP.clientY)
  },
  touchmove(e) {
    let moveP = e.touches[0]
    // console.log("move = " + moveP.clientY)
    if ((moveP.clientY < this.startP.clientY) && !this.data.unshowKb){
      this.setData({
        unshowKb: true
      })
    }

    if ((moveP.clientY > this.startP.clientY) && this.data.unshowKb) {
      this.setData({
        unshowKb: false
      })
    }
  },
  touchend(e) {
    let endP = e.touches[0]    
  }
}

const mapStateToData = state => ({
  accountList: state.accountList,
  tagList: state.tagList
});

const mapDispatchToPage = dispatch => ({
  addAccount: data => dispatch(addAccount(data)),
  fetchTagList: () => dispatch(fetchTagList()),
  fetchList: () => dispatch(fetchList()),
  editAccount: data => dispatch(editAccount(data)),
  delSearchRes: () => dispatch(delSearchRes())
});

const nextPageConfig = app.globalData.connect(mapStateToData, mapDispatchToPage)(pageConfig);
Page(nextPageConfig);