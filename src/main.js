// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 兼容ie
import 'babel-polyfill'
import Vuex from 'vuex'
import store from './store'
import './plugins/axios'
import './plugins/element'
import 'element-ui/lib/theme-chalk/reset.css'
// 全局样式引入
import './assets/style/global.less'
// 全局组件引入
import './components/global'
import 'default-passive-events'
// 地址联动引入
import { pcaa } from 'area-data-vue'
import VueAreaLinkage from 'area-linkage-vue'

// 引入font-awesome
import 'font-awesome/css/font-awesome.css'
// localstore
import localstore from './utils/store'

import basePath from '@/config/basePath'

Vue.prototype.$basePath = basePath

Vue.prototype.$pcaa = pcaa
Vue.prototype.$localstore = localstore

// 改变table header的背景色
Vue.prototype.$tableHeaderColor = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 0) {
    return 'background-color: #f3f8ff; height: 52px; color: #333; font-weight: bolder; font-size: 14px;'
  }
}

Vue.use(Vuex)
Vue.use(VueAreaLinkage)

Vue.config.productionTip = false

const menus = localstore.get('new_bossadmin_menus') || []
const btnList = []
for (let i = 0; i < menus.length; i++) {
  if (menus[i].mType === 2) {
    btnList.push(menus[i])
  }
}

// 权限指令
Vue.directive('has', {
  inserted: function (el, binding) {
    if (!_has(binding.value)) {
      el.parentNode.removeChild(el)
    }

    function _has (value) {
      let isExist = false
      for (let i = 0; i < btnList.length; i++) {
        if (btnList[i].identifier && btnList[i].identifier === value) {
          isExist = true
        }
      }
      return isExist
    }
  }
})

router.beforeEach((to, from, next) => {
  if (!to.matched.some(r => r.meta.requireAuth)) {
    if (localstore.get('bossadmin_login')) {
      next()
    } else {
      const path = to.path
      next({
        path: '/login',
        query: { redirect: path }
      })
    }
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
