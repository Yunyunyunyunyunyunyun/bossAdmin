import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import menus from './menus'
import common from './common'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    menus,
    common
  }
})
export default store
