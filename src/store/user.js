import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  // 用户数据
  user: {}
}

const actions = {
  //
}

const mutations = {
  user_Mutations (state, payload) {
    state.user = payload
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
