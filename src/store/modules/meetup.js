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
  createMeetup ({commit}, payload) {
    const meetup = {
      title: payload.title,
      location: payload.location,
      imageUrl: payload.imageUrl,
      description: payload.description,
      date: payload.date,
      id: '3'
    }

    // Create new meetup call to server
    commit('createMeetup', meetup)
  }
}

// mutations
const mutations = {
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
