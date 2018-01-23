import * as actionTypes from '../action/actionTypes'

const defaultState = {
    expense: [
        {
            tagName: "吃喝",
            icon: "chihe",
            color: "f6c87a",
            bakList: ["水果","午餐","早餐","晚餐"],
            selected: true
        },
        {
            tagName: "交通",
            icon: "jiaotong",
            color: "9ddd62",
            bakList: ["公交","打车","加油","停车费"],
            selected: false
        },
        {
            tagName: "服饰",
            icon: "fushi",
            color: "a587cf",
            bakList: ["衣服","鞋子","裤子","内衣"],
            selected: false
        },
        {
            tagName: "日用品",
            icon: "riyongpin",
            color: "a4e3ea",
            bakList: ["超时","纸巾","牙套","毛巾"],
            selected: false
        },
        {
            tagName: "其他",
            icon: "qita",
            color: "fd8563",
            bakList: ["快递","还款","电费","手机"],
            selected: false
        }
    ],
    income: [
        {
            tagName: "工资",
            icon: "gongzi",
            color: "41d1b0",
            bakList: ["月份","预支","员工","微信"],
            selected: true
        },
        {
            tagName: "兼职",
            icon: "jianzhi",
            color: "83b369",
            bakList: ["进货","成本","运费","快递"],
            selected: false
        },
        {
            tagName: "红包",
            icon: "icon--",
            color: "dd515a",
            bakList: ["生日","结婚","老公","礼物"],
            selected: false
        },
        {
            tagName: "投资",
            icon: "qutouzi",
            color: "717abb",
            bakList: ["彩票","定投","理财","保险"],
            selected: false
        },
        {
            tagName: "奖金",
            icon: "jiangzhang",
            color: "a97756",
            bakList: ["奖励","完成","垫付","晚餐"],
            selected: false
        }
    ]
}

const tagList = (state = defaultState, action = {}) => {
    switch(action.type){
        case actionTypes.FETCH_TAGLIST_SUCCESS: {
            return state
        }
        default:
            return state
    }
}

export {
    tagList
}