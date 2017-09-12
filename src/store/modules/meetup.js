import firebase from 'firebase'
import _ from 'underscore'

const state = {
  loadedMeetups: []
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
      const loadedMeetup = _.findWhere(state.loadedMeetups, { id: meetupId })
      return loadedMeetup === undefined ? {} : loadedMeetup
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
      creatorId: payload.user.id
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
  },

  updateMeetupData ({commit}, payload) {
    commit('setLoading', true)

    const updateObj = {}

    if (payload.title) {
      updateObj.title = payload.title
    }

    if (payload.description) {
      updateObj.description = payload.description
    }

    if (payload.date) {
      updateObj.date = payload.date
    }

    firebase.database().ref('meetups').child(payload.id).update(updateObj)
      .then(() => {
        commit('setLoading', false)
        commit('updateMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
  },

  registerUserForMeetup ({commit, getters}, payload) {
    commit('setLoading', true)

    const user = payload.user

    firebase.database().ref(`/users/${user.id}`).child('/registrations').push(payload.meetupId)
      .then(data => {
        commit('setLoading', false)
        commit('registerUserForMeetup', {meetupId: payload.meetupId, fbKey: data.key, user: user})
      })
      .catch(error => {
        commit('setLoading', false)
        console.log(error)
      })
  },

  unregisterUserFromMeetup ({commit}, payload) {
    commit('setLoading', true)

    const user = payload.user

    if (!user.fbKeys) {
      return
    }

    const fbKey = user.fbKeys[payload.meetupId]

    firebase.database().ref(`/users/${user.id}/registrations/`).child(fbKey)
      .remove()
      .then(() => {
        commit('setLoading', false)
        commit('unregisterUserFromMeetup', {meetupId: payload.meetupId, user: user})
      })
      .catch(error => {
        commit('setLoading', false)
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
  },

  updateMeetup (state, payload) {
    const meetup = _.findWhere(state.loadedMeetups, { id: payload.id })

    if (payload.title) {
      meetup.title = payload.title
    }

    if (payload.description) {
      meetup.description = payload.description
    }

    if (payload.date) {
      meetup.date = payload.date
    }
  },

  registerUserForMeetup (state, payload) {
    const meetupId = payload.meetupId

    payload.user.registeredMeetups.push(meetupId)
    payload.user.fbKeys[meetupId] = payload.fbKey
  },

  unregisterUserFromMeetup (state, payload) {
    const registeredMeetups = payload.user.registeredMeetups
    registeredMeetups.splice(_.findWhere(registeredMeetups, payload.meetupId))

    Reflect.deleteProperty(payload.user.fbKeys, payload.meetupId)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
