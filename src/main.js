import Vue from 'vue'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import Firebase from 'firebase'

import './stylus/main.styl'
import App from './App'
import router from './router'

// Global components
import Alertcmp from './components/Shared/alert'

Vue.component('app-alert', Alertcmp)

// Filters
import DateFilter from './filters/date'

Vue.filter('date', DateFilter)

// Data Stores
import { store } from './store'

Vue.use(Vuetify)
Vue.use(VueFire)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    Firebase.initializeApp({
      apiKey: 'AIzaSyA1XYOwCZ5S1Ro_1bhx-83zkKmqn4I3L_Y',
      authDomain: 'poc-vuetify.firebaseapp.com',
      databaseURL: 'https://poc-vuetify.firebaseio.com',
      projectId: 'poc-vuetify',
      storageBucket: 'poc-vuetify.appspot.com',
      messagingSenderId: '194500800551'
    })
  }
})
