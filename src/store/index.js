import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      isLoggedIn: false,
      username: ''
    }
  },
  mutations: {
    setLogin(state, { username, isLoggedIn }) {
      state.username = username
      state.isLoggedIn = isLoggedIn
    },
    logout(state) {
      state.username = ''
      state.isLoggedIn = false
    }
  },
  actions: {
    login({ commit }, username) {
      commit('setLogin', { username, isLoggedIn: true })
    },
    logout({ commit }) {
      commit('logout')
    }
  }
})