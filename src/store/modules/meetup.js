import firebase from 'firebase'
import _ from 'underscore'

const state = {
  loadedMeetups: [
    {
      imageUrl: 'http://www.avenuecalgary.com/CalgaryWinter.jpg',
      id: '1',
      title: 'Meetup in Calgary',
      date: new Date(),
      location: 'Calgary',
      description: 'COW TOWN MOo'
    },
    {
      imageUrl: 'http://fargocityguide.com/wp-content/uploads/2013/03/fargo-night-life.jpg',
      id: '2',
      title: 'Meetup in Fargo',
      date: new Date(),
      location: 'Fargo',
      description: 'Cold winters'
    }
  ]
}

// getters
const getters = {
  loadedMeetups (state) {
    return _.sortBy(state.loadedMeetups, (meetup) => { return meetup.date })
  },

  featuredMeetups (state, getters) {
    return getters.loadedMeetups.slice(0, 5)
  },

  loadedMeetup (state) {
    return (meetupId) => {
      return _.findWhere(state.loadedMeetups, { id: meetupId })
    }
  }
}

// actions
const actions = {
  loadMeetups ({commit}) {
    commit('setLoading', true)

    firebase.database().ref('meetups').once('value')
      .then((data) => {
        const meetups = []
        const obj = data.val()

        for (let key in obj) {
          meetups.push({
            id: key,
            title: obj[key].title,
            description: obj[key].description,
            imageUrl: obj[key].imageUrl,
            location: obj[key].location,
            date: obj[key].date
          })
        }

        commit('setLoadedMeetups', meetups)
        commit('setLoading', false)
      })
      .catch((error) => {
        console.log(error)
        commit('setLoading', false)
      })
  },

  createMeetup ({commit}, payload) {
    const meetup = {
      title: payload.title,
      location: payload.location,
      imageUrl: payload.imageUrl,
      description: payload.description,
      date: payload.date.toISOString()
    }

    // Create new meetup call to server
    firebase.database().ref('meetups').push(meetup)
      .then((data) => {
        const key = data.key
        meetup.id = key

        commit('createMeetup', meetup)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

// mutations
const mutations = {
  setLoadedMeetups (state, payload) {
    state.loadedMeetups = payload
  },

  createMeetup (state, payload) {
    state.loadedMeetups.push(payload)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
