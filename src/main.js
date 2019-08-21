// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 兼容ie
import 'babel-polyfill'
import Vuex from 'vuex'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/reset.css'
import './assets/style/element-variables.scss'
// 全局样式引入
import './assets/style/global.less'
// 全局组件引入
import './components/global'

// 改变table header的背景色
Vue.prototype.$tableHeaderColor = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 0) {
    return 'background-color: #f5f5f5; height: 40px;'
  }
}

Vue.use(Vuex)
Vue.use(ElementUI)

Vue.config.productionTip = false

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
