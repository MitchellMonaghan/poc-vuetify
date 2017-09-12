import firebase from 'firebase'

const state = {
  user: null
}

// getters
const getters = {
  user: state => state.user
}

// actions
const actions = {
  signUserUp ({commit}, payload) {
    commit('setLoading', true)
    commit('clearError')

    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
      user => {
        commit('setLoading', false)

        const newUser = {
          id: user.uid,
          registeredMeetups: []
        }

        commit('setUser', newUser)
      }
    ).catch(
      error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      }
    )
  },

  signUserIn ({commit}, payload) {
    commit('setLoading', true)
    commit('clearError')

    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)

          const newUser = {
            id: user.uid,
            registeredMeetups: []
          }

          commit('setUser', newUser)
        }
    )
    .catch(
      error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      }
    )
  },

  autoSignIn ({commit}, payload) {
    commit('setUser', {id: payload.uid, registeredMeetups: []})
  },

  logout ({commit}) {
    firebase.auth().signOut()
    commit('setUser', null)
  }
}

// mutations
const mutations = {
  setUser (state, payload) {
    state.user = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
