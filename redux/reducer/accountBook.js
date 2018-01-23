import * as actionTypes from '../action/actionTypes'
import { dateFormat } from '../../common/base.js'

const TOTALBUDGET = 5000
const defaultState = {
    list: [],
    mainInfo: {
        headerName: "nic",
        totalBudget: TOTALBUDGET
    }
}

const getTotal = (list, isExpense) => {
    let res = 0
    if(isExpense){
        list.forEach(item => {
            if(item.isExpense){
                res = parseFloat(parseFloat(res) + parseFloat(item.payNum)).toFixed(2)
            }
        })
    }else{
        list.forEach(item => {
            if(!item.isExpense){
                res = parseFloat(parseFloat(res) + parseFloat(item.payNum)).toFixed(2)
            }
        })
    }

    return res
}

const getBudget = (list, expenses = false) => {
    let curYear = new Date().getFullYear()
    let curMonth = new Date().getMonth()
    let res = list.filter(block => (curYear === new Date(block.header.date).getFullYear() && curMonth === new Date(block.header.date).getMonth()))
    let budget = 0
    if(res.length > 0){
        res.forEach( block => {
            block.payList.forEach( item => {
                if(item.isExpense) budget += parseFloat(item.payNum)
            })
        })
    }
    if(expenses){
        if(res.length === 0){
            if(list.length !== 0){
                list[0].payList.forEach(item => {
                    if(item.isExpense) budget += parseFloat(item.payNum)
                })
            }
        }
        return budget.toFixed(2)
    }
    return parseFloat(TOTALBUDGET - budget).toFixed(2)
}

const getCurMonthIncome = list => {
    let curYear = new Date().getFullYear()
    let curMonth = new Date().getMonth()
    let res = list.filter(block => (curYear === new Date(block.header.date).getFullYear() && curMonth === new Date(block.header.date).getMonth()))
    let budget = 0

    if(res.length > 0){
        res.forEach( block => {
            block.payList.forEach( item => {
                if(!item.isExpense) budget += parseFloat(item.payNum)
            })
        })
    }else{
        if(list.length !== 0){
            list[0].payList.forEach(item => {
                if(!item.isExpense) budget += parseFloat(item.payNum)
            })
        }
    }

    return budget.toFixed(2)
}

const listSort = list => list.sort((a, b) => new Date(b.header.date).getTime() - new Date(a.header.date).getTime())

const delAccount = (state, blockIndex, itemIndex) => {
    let curBlock = state.list[blockIndex]
    let res
    if(curBlock.payList.length < 2){
        res = [...state.list.slice(0, blockIndex), ...state.list.slice(parseInt(blockIndex) + 1)]
    }else{
        let payListRes = [...curBlock.payList.slice(0, itemIndex), ...curBlock.payList.slice(parseInt(itemIndex) + 1)]
        let blockRes = Object.assign({}, curBlock, {
            payList: payListRes
        })
        blockRes.header.totalExpense = getTotal(blockRes.payList, true)
        blockRes.header.totalIncome = getTotal(blockRes.payList, false)
        res = [...state.list.slice(0, blockIndex), blockRes, ...state.list.slice(parseInt(blockIndex) + 1)]
    }
    return res
}

const insertAccount = (state, action, list) => {
    let todayStr = dateFormat(action.date)
    let curMonth = new Date(action.date).getMonth()
    let r = list.filter( block => todayStr === dateFormat(block.header.date))//查找是否有当前日期的block记录
    let data
    if(r.length === 0){//没有当前日期的记录
        let tList = [{
            header: {
                date: action.date,
                totalExpense: action.isExpense ? action.value : 0,
                totalIncome: action.isExpense ? 0 : action.value
            },
            payList: [{
                tag: action.tag,
                payNum: action.value,
                bak: action.bak,
                isExpense: action.isExpense
            }]
        }, ...list]
        data = {
            list: listSort(tList),
            mainInfo: {
                headerName: state.mainInfo.headerName,
                totalBudget: getBudget(tList),
                lastDate: curMonth + 1,
                expenses: getBudget(tList, true),
                income: getCurMonthIncome(tList)
            }
        }
    }else{//有当前日期的记录
        let blockList = list.map(block => {
            if(dateFormat(block.header.date) === todayStr){
                block.payList.unshift({
                    tag: action.tag,
                    payNum: action.value,
                    bak: action.bak,
                    isExpense: action.isExpense
                })
                block.header.totalExpense = getTotal(block.payList, true)
                block.header.totalIncome = getTotal(block.payList, false)
            }
            return block
        })
        data = {
            list: [...blockList],
            mainInfo: {
                headerName: state.mainInfo.headerName,
                totalBudget: getBudget(blockList),
                lastDate: curMonth + 1,
                expenses: getBudget(blockList, true),
                income: getCurMonthIncome(blockList)
            }
        }
    }
    return data
}

const accountList = (state = defaultState, action = {}) => {
    switch(action.type){
        case actionTypes.FETCH_LIST_SUCCESS: {
            let list = [...action.data]
            let lastMonth = list.length !== 0 ? new Date(list[0].header.date).getMonth() : 0
            return {
                list: list,
                mainInfo: {
                    headerName: state.mainInfo.headerName,
                    totalBudget: getBudget(list),
                    lastDate: lastMonth + 1,
                    expenses: getBudget(list, true),
                    income: getCurMonthIncome(list)
                }
            }
        }
        case actionTypes.ADD_ACCOUNT: {
            let data
            if(state.list.length !== 0){
                data = insertAccount(state, action, state.list)
            }else{
                let curMonth = new Date().getMonth()
                let list = [{
                    header: {
                        date: action.date,
                        totalExpense: action.isExpense ? action.value : 0,
                        totalIncome: action.isExpense ? 0 : action.value
                    },
                    payList: [{
                        tag: action.tag,
                        payNum: action.value,
                        bak: action.bak,
                        isExpense: action.isExpense
                    }]
                }]

                data = {
                    list: list,
                    mainInfo: {
                        headerName: "nic",
                        totalBudget: getBudget(list),
                        lastDate: curMonth + 1,
                        expenses: getBudget(list, true),
                        income: getCurMonthIncome(list),
                    }
                }
            }
            wx.setStorageSync("data", JSON.stringify(data))
            return data
        }
        case actionTypes.DEL_ACCOUNT: {
            let res, data
            res = delAccount(state, action.blockIndex, action.itemIndex)
            data = Object.assign({}, state, {
                list: res
            })
            wx.setStorageSync("data", JSON.stringify(data))
            return data
        }
        case actionTypes.EDIT_ACCOUNT: {
            let bId = parseInt(action.blockIndex)
            let iId = parseInt(action.itemIndex)
            let list = state.list.slice()
            let isChangeDate = state.list[bId].header.date !== action.date
            let data

            if(!isChangeDate){
                for(let i = 0; i < list.length; i++){
                    if(i === bId){
                        // console.log(list[i])
                        for(let j = 0; j < list[i].payList.length; j++){
                            if(j === iId){
                                // console.log(list[i].payList[j])
                                let item = list[i].payList[j]
                                item.payNum = action.value
                                item.bak = action.bak
                                item.tag = action.tag
                                item.isExpense = action.isExpense
                                break
                            }
                        }
                        break
                    }
                }
                data = Object.assign({}, state, {
                    list: list
                })
            }else{
                let delRes = delAccount(state, bId, iId)
                data = insertAccount(state, action, delRes)
            }
            wx.setStorageSync("data", JSON.stringify(data))
            return data

        }
        default:
            return state;
    }
}

export {
    accountList
}