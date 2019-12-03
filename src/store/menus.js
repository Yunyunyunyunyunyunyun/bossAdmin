import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  // 用户数据
  menus: {}
}

const actions = {
  //
}

const mutations = {
  menus_Mutations (state, payload) {
    state.menus = payload
  }
}

const getters = {
  //
}

export default {
  // 开启命令空间
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
