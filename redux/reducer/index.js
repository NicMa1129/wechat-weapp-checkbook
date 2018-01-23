import { accountList } from './accountBook'
import { tagList } from './tagList'
import { combineReducers } from '../../libs/redux.js'
// const combineReducers = require('../../libs/redux.js')

const reduce = combineReducers({
    accountList,
    tagList
})

export default reduce