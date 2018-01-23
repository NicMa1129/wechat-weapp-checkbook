const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  let d = new Date(date)
  let month = d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
  let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
  let res = month + "-" + day
  return res
}

export {
  formatTime,
  formatDate
}
