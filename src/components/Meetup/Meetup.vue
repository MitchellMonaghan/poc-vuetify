<template>
    <v-container>
        <!-- Loader -->
        <v-layout row wrap v-if="loading">
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular
                indeterminate
                class="primary--text"
                :width="7"
                :size="70"></v-progress-circular>
            </v-flex>
        </v-layout>
        <!-- End Loader -->

        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <v-card>
                    <v-card-title>
                        <h6 class="primary--text">{{ meetup.title }}</h6>
                        
                        <!-- Meetup Edit Button -->
                        <template v-if="userIsCreator">
                            <v-spacer></v-spacer>
                            <edit-meetup-details-dialog :meetup="meetup"></edit-meetup-details-dialog>
                        </template>
                        <!-- End Meeup Edit Button -->
                    </v-card-title>

                    <v-card-media
                    :src="meetup.imageUrl"
                    height="400px">
                    </v-card-media>

                    <v-card-text>
                        <div class="info--text"> {{ meetup.date | date }} - {{ meetup.location }}</div>
                        <div v-if="userIsCreator">
                            <edit-meetup-date-dialog :meetup="meetup"></edit-meetup-date-dialog>
                            <edit-meetup-time-dialog :meetup="meetup"></edit-meetup-time-dialog>
                        </div>
                        <div>{{ meetup.description }}</div>
                    </v-card-text>

                    <v-card-actions v-if="!userIsCreator">
                        <v-spacer></v-spacer>
                        <v-btn class="primary" v-if="!userIsRegistered" @click="onRegister">Register</v-btn>
                        <v-btn class="primary" v-if="userIsRegistered" @click="onUnregister">Unregister</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import _ from 'underscore'

import EditMeetupDetailsDialog from './Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './Edit/EditMeetupDateDialog'
import EditMeetupTimeDialog from './Edit/EditMeetupTimeDialog'

export default {
  components: {
    'edit-meetup-details-dialog': EditMeetupDetailsDialog,
    'edit-meetup-date-dialog': EditMeetupDateDialog,
    'edit-meetup-time-dialog': EditMeetupTimeDialog
  },

  props: ['meetupId'],

  computed: {
    meetup () {
      return this.$store.getters.loadedMeetup(this.meetupId)
    },

    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },

    userIsCreator () {
      if (!this.userIsAuthenticated) {
        return false
      }

      return this.$store.getters.user.id === this.meetup.creatorId
    },

    userIsRegistered () {
      return _.contains(this.$store.getters.user.registeredMeetups, this.meetupId)
    },

    loading () {
      return this.$store.getters.loading
    }
  },

  methods: {
    onRegister () {
      const user = this.$store.getters.user
      this.$store.dispatch('registerUserForMeetup', {meetupId: this.meetupId, user: user})
    },

    onUnregister () {
      const user = this.$store.getters.user
      this.$store.dispatch('unregisterUserFromMeetup', {meetupId: this.meetupId, user: user})
    }
  }
}
</script>