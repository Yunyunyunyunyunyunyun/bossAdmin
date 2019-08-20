import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import common from './common'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common
  }
})
export default store
