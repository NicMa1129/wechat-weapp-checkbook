import { callApi } from '../../common/base.js'
import * as actionTypes from './actionTypes'

export const fetchList = () => {
    // let { list } = await callApi('../../static/data.json')
    // console.log(list)
    let list = []
    let localData = wx.getStorageSync("data")
    let data = null
    if (localData){
      data = JSON.parse(localData)
    }
    
    // console.log(data)
    if(data !== null){
        list = data.list
    }
    // dispatch(fetchListSuccess(list))
    return {
      type: actionTypes.FETCH_LIST_SUCCESS,
      data: list
    }
}

export const addAccount = ({ value, date, bak, tag, isExpense }) => ({
  type: actionTypes.ADD_ACCOUNT,
  value,
  date,
  bak,
  tag,
  isExpense
})

export const fetchListSuccess = (data) => {
    return {
        type: actionTypes.FETCH_LIST_SUCCESS,
        data
    }
}

export const delAccount = ({blockIndex, itemIndex}) => {
    return {
        type: actionTypes.DEL_ACCOUNT,
        blockIndex,
        itemIndex
    }
}

export const editAccount = ({blockIndex, itemIndex, value, date, bak, tag, isExpense}) => {
    return {
        type: actionTypes.EDIT_ACCOUNT,
        blockIndex,
        itemIndex,
        value,
        date,
        bak,
        tag,
        isExpense
    }
}