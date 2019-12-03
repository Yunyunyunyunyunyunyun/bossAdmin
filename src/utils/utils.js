import router from '../router/index'

// 绑定事件 on(element, event, handler)
export function on () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
}

// 解绑事件 off(element, event, handler)
export function off () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
}

/**
 * 查找顶部面包屑数据
 * @param {*} path 路由路径
 */
export function findBreadcrumb (path) {
  const temp = []
  const routerdata = router.options.routes
  //
  for (let i = 0; i < routerdata.length; i++) {
    const objStep1 = {}
    objStep1.path = routerdata[i].path
    objStep1.name = routerdata[i].bname
    temp.push(objStep1)
    if (routerdata[i].children) {
      if (routerdata[i].children.length) {
        for (let j = 0; j < routerdata[i].children.length; j++) {
          // 判断bname是否含有‘/’
          if (routerdata[i].children[j].bname) {
            // 没有'/'--二级菜单
            if (!routerdata[i].children[j].bname.includes('/')) {
              const objStep2 = {}
              objStep2.path = routerdata[i].children[j].path
              objStep2.name = routerdata[i].children[j].bname
              temp.push(objStep2)
            } else {
              const pathdata = _.compact(routerdata[i].children[j].path.split('/'))
              const bnamedata = _.compact(routerdata[i].children[j].bname.split('/'))
              const objStep2 = {}
              objStep2.path = `/${pathdata[0]}/${pathdata[1]}`
              objStep2.name = bnamedata[0]
              temp.push(objStep2)
              const objStep3 = {}
              objStep3.path = routerdata[i].children[j].path
              objStep3.name = bnamedata[1]
              temp.push(objStep3)
            }
          } else {
            if (routerdata[i].children[j].meta) {
              const objStep2 = {}
              objStep2.path = routerdata[i].children[j].path
              objStep2.name = routerdata[i].children[j].meta.bname
              temp.push(objStep2)
            }
          }
        }
      }
    }
  }
  //
  const find = temp.find(item => {
    return item.path === path
  })
  //
  return find ? find.name : '未设置'
}
/**
 * elementUI日期时间组件选出来的中国标准时间转变成字符串
 * @param {*} time 中国标准时间
 */
export function timeStamp2String (time) {
  var datetime = new Date()
  datetime.setTime(time)
  var year = datetime.getFullYear()
  var month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  var date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  // var hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()
  // var minute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()
  // var second = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds()
  return year + '-' + month + '-' + date
}
export function utc2Str (time) {
  var datetime = new Date(time)
  var year = datetime.getFullYear()
  var month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  var date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  return year + '-' + month + '-' + date
}
export function dateToString (date) {
  var year = date.getFullYear()
  var month = (date.getMonth() + 1).toString()
  var day = (date.getDate()).toString()
  if (month.length === 1) {
    month = '0' + month
  }
  if (day.length === 1) {
    day = '0' + day
  }
  var dateTime = year + '-' + month + '-' + day
  return dateTime
}
export function dateToAllString (time) {
  var datetime = new Date(time)
  var year = datetime.getFullYear()
  var month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
  var date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
  var hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()
  var minute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()
  var second = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}
/**
 * 通过二级路由查找三级所有路由
 * @param {*} path 路由
 * @param {*} menu 菜单数据
 */
export function findThreeLevelMenu (path, menu) {
  // 通过二级路由查找对应的三级路由
  const array = []
  let key = 0
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length) {
      const obj = _.find(menu[i].children, item => {
        return item.value === path
      })
      if (obj && JSON.stringify(obj) !== '{}') {
        key = i
        break
      } else {
        return []
      }
    }
  }
  // push所有三级路由
  for (let i = 0; i < menu[key].children.length; i++) {
    if (
      menu[key].children[i].children &&
      menu[key].children[i].children.length
    ) {
      array.push(menu[key].children[i].value)
    }
  }
  return array
}

/**
 * 通过路径查找路由的对象数据
 * @param {*} path 路径
 * @param {*} menu 菜单数据
 */
export function findRouterData (path, menu) {
  // let obj = {
  //   label: '测试菜单数据',
  //   value: '/admin'
  // }
  const patharray = path.split('/')
  let obj = {}
  // 二级菜单
  if (patharray.length === 3) {
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].children.length) {
        obj = _.find(menu[i].children, item => {
          return item.value === path
        })
        if (obj && JSON.stringify(obj) !== '{}') {
          return obj
        }
      }
    }
  }
  // 三级菜单
  if (patharray.length === 4) {
    for (let i = 0; i < menu.length; i++) {
      for (let k = 0; k < menu[i].children.length; k++) {
        if (menu[i].children[k].children) {
          const obj = _.find(menu[i].children[k].children, item => {
            return item.value === path
          })
          if (obj && JSON.stringify(obj) !== '{}') {
            return obj
          }
        }
      }
    }
  }
}

// 时间格式化
/* eslint no-extend-native: ["error", { "exceptions": ["Date"] }] */
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

