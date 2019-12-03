// 时间格式化
export function dateFormat (date, formatStr) {
  var moment = require('moment')
  var formatDate = new Date(parseInt(date))
  if (date === undefined) {
    return ''
  }
  return moment(formatDate).format(formatStr)
}

/**
 * 获取第一个月
 * @returns {string}
 */
export function getFirstMonth () {
  const Year = new Date().getFullYear()
  return Year + '-01-01'
}

/**
 * 获取最后一月
 * @returns {string}
 */
export function getDecember () {
  const Year = new Date().getFullYear()
  return Year + '-12-31'
}

/**
 *  获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
 * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
 * 返回精度为：秒，分，小时，天
 */
export function GetDateDiff (startTime, endTime, diffType) {
  // 将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase()
  var sTime = new Date(startTime) // 开始时间
  var eTime = new Date(endTime) // 结束时间
  // 作为除数的数字
  var divNum = 1
  switch (diffType) {
    case 'second':
      divNum = 1000
      break
    case 'minute':
      divNum = 1000 * 60
      break
    case 'hour':
      divNum = 1000 * 3600
      break
    case 'day':
      divNum = 1000 * 3600 * 24
      break
    default:
      break
  }
  return (parseFloat((eTime.getTime() - sTime.getTime()) / parseFloat(divNum))).toFixed(2)
}
