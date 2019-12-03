'use strict'

import Vue from 'vue'
import axios from 'axios'
import router from '../router'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/json'

const env = process.env.NODE_ENV || 'development'
const api = process.env.VUE_APP_FLAG || 'test'
let baseURL = 'http://10.168.1.158/bossApi'

if (env === 'production') {
  // 正式环境配置
  if (api === 'pro') {
    // 生产环境地址
    baseURL = 'http://boss.mymrmao.com/bossApi'
  }
  if (api === 'test158') {
    // 158测试环境
    baseURL = 'http://10.168.1.158/bossApi'
  }
  if (api === 'test') {
    // 203测试环境
    baseURL = 'http://10.168.2.203:9093/bossApi'
  }
} else {
  // 开发环境地址
  baseURL = 'http://10.168.1.158/bossApi'
}

const config = {
  baseURL: baseURL,
  timeout: 1000 * 60 // Timeout
}

const _axios = axios.create(config)
const WhiteUrl = ['/dict/findByParentId', '/estate/getStreetByArea', '/estate/getEstateByStreet']

// 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const pending = []
const CancelToken = axios.CancelToken
const removePending = ever => {
  for (const p in pending) {
    // 当当前请求在数组中存在时执行函数体
    if (!WhiteUrl.includes(pending[p].u)) {
      if (pending[p].u === `${ever.url}&${ever.method}`) {
        // 执行取消操作
        pending[p].f()
        // 把这条记录从数组中移除
        pending.splice(p, 1)
      }
    }
  }
}

// 请求前拦截
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers['token'] = localStorage.bossadmin_user
      ? JSON.parse(localStorage.bossadmin_user).token || ''
      : ''
    // 在一个ajax发送前执行一下取消操作
    removePending(config)
    config.cancelToken = new CancelToken(c => {
      pending.push({ u: `${config.url}&${config.method}`, f: c })
    })
    return config
  },
  function (error) {
    //  Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    //  Do something with response data

    // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    removePending(response.config)

    const { code } = response.data
    if (code === 0) {
      return Promise.resolve(response)
    } else if (code === 20000 || code === 20001 || code === 20002) {
      // 20000：用户token为空 20001：用户信息为空 20002：登录失效，请重新登录
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      return Promise.reject(response.data.msg)
    } else {
      if (response.data.msg) {
        return Promise.reject(response.data.msg)
      }
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
