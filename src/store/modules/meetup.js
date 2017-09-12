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
            date: obj[key].date,
            creatorId: obj[key].creatorId
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

  createMeetup ({commit, getters}, payload) {
    const meetup = {
      title: payload.title,
      location: payload.location,
      description: payload.description,
      date: payload.date.toISOString(),
      creatorId: getters.user.id
    }

    let imageUrl
    let key

    // Create new meetup call to server
    // Save meetup to DB
    firebase.database().ref('meetups').push(meetup)
      .then((data) => {
        key = data.key

        const filename = payload.image.name
        const ext = filename.slice(filename.lastIndexOf('.'))

        // Save image to Firebase file storage
        return firebase.storage().ref(`meetups/${key}.${ext}`).put(payload.image)
      })
      .then(fileData => {
        // Get url to stored image on firebase, and update orginal meetup record with the image url
        imageUrl = fileData.metadata.downloadURLs[0]
        return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
      })
      .then(() => {
        // Update local storage
        meetup.id = key
        meetup.imageUrl = imageUrl

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
