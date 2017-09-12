const state = {
  loading: true,
  error: null
}

// getters
const getters = {
  loading (state) {
    return state.loading
  },

  error (state) {
    return state.error
  }
}

// actions
const actions = {
  clearError ({commit}) {
    commit('clearError')
  }
}

// mutations
const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },

  setError (state, payload) {
    state.error = payload
  },

  clearError (state) {
    state.error = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
