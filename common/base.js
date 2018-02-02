// import { JSEncrypt } from 'jsencrypt'
// let config = require('../config/config')

export const dateFormat = date => {
    var d = new Date(date)
    var y = d.getFullYear()
    var m = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
    var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()

    return y + "-" + m + "-" + day
}

export const dateTimeFormat = date => {
    var d = new Date(date)
    var y = d.getFullYear()
    var m = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
    var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
    var h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours()
    var mm = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()

    return y + "-" + m + "-" + day + " " + h + ":" + mm
}

export const callApi = (url, option) => {
    return fetch(url, option).then(
        response => {
            // console.log(response)
            // console.log(response.json())
            return response.ok ? response.json() : Promise.reject(response.text())
        },
        error => Promise.reject(error)
    )
}

// export const encryptSave = (key, data) => {
//     let encrypt = new JSEncrypt()
//     encrypt.setPublicKey(config.pub)
//     let encryptData = encrypt.encrypt(JSON.stringify(data))
//     localStorage.setItem(key, encryptData)
// }

// export const encryptGet = key => {
//     let res = null
//     let data = localStorage.getItem(key)
//     if(data !== null){
//         let decrypt = new JSEncrypt()
//         decrypt.setPrivateKey(config.priv)
//         let uncrypted = decrypt.decrypt(data);
//         res = JSON.parse(uncrypted)
//     }
//     return res
// }

export const addEvent = (element,event_name,event_fn) => {
    if (element.addEventListener) {
        element.addEventListener(event_name, event_fn, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event_name, event_fn);
    } else {
        element['on' + event_name] = event_fn;
    }
}

export const scrollThrottler = (scrollTimeout, cb) => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(()=>{
            scrollTimeout = null;
            cb();
        }, 66);
    }
}

export const unique = (array) => {
    let r = [];
    for(let i = 0, l = array.length; i < l; i++) {
        for(let j = i + 1; j < l; j++)
            if (array[i] === array[j]) j = ++i;
        r.push(array[i]);
    }
    return r;
}

export function dateTimeFormatter(date, format) {
  // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
  if (!date || date == "") {
    return ""
  }

  if (typeof date === "string") {
    var mts = date.match(/(\/Date\((\d+)\)\/)/)
    if (mts && mts.length >= 3) {
      date = parseInt(mts[2])
    }
  }

  date = new Date(date)
  if (!date || date.toUTCString() == "Invalid Date") {
    return ""
  }

  var map = {
    "M": date.getMonth() + 1, //月份
    "d": date.getDate(), //日
    "h": date.getHours(), //小时
    "m": date.getMinutes(), //分
    "s": date.getSeconds(), //秒
    "q": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  }

  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    var v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    }
    else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })

  return format
}
export function isEqualDateStr(dateStr1, dateStr2) {
  let dateArr1 = dateStr1.split('-')
  let dateArr2 = dateStr2.split('/')
  if (parseInt(dateArr1[0], 10) !== parseInt(dateArr2[0], 10)) {
    return false
  }
  if (parseInt(dateArr1[1], 10) !== parseInt(dateArr2[1], 10)) {
    return false
  }
  if (parseInt(dateArr1[2], 10) !== parseInt(dateArr2[2], 10)) {
    return false
  }
  return true
}