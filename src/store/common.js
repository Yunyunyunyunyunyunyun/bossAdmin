import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  // 是否登录
  login: false
}

const getters = {
  //
}

const mutations = {
  login_Mutations (state, payload) {
    state.login = payload
  }
}

const actions = {
  //
}

export default {
  // 开启命令空间
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
