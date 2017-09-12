import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from './modules/app'
import auth from './modules/auth'
import meetup from './modules/meetup'

// Plugins
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    app,
    auth,
    meetup
  },
  strict: debug,
  plugins: debug ? [/* createLogger */] : []
})
