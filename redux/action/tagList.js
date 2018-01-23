import { callApi } from '../../common/base.js'
import * as actionTypes from './actionTypes'

export const fetchTagList = (accountType = true) => (dispatch) => {
    // let { list } = await callApi('../../static/data.json')
    // console.log(list)
    let list = []
    let data
    if(accountType){
        data = JSON.parse(localStorage.getItem("expenseTagList"))
    }else{
        data = JSON.parse(localStorage.getItem("incomeTagList"))
    }
    // console.log(data)
    if(data !== null){
        list = data.list
    }
    dispatch(fetchTagListSuccess(list))
}

export const fetchTagListSuccess = list => {
    return {
        type: actionTypes.FETCH_TAGLIST_SUCCESS,
        list
    }
}