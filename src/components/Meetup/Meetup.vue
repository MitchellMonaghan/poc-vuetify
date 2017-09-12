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
                        <div>{{ meetup.description }}</div>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary">Register</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import EditMeetupDetailsDialog from './Edit/EditMeetupDetailsDialog'

export default {
  components: {
    'edit-meetup-details-dialog': EditMeetupDetailsDialog
  },

  props: ['id'],

  computed: {
    meetup () {
      return this.$store.getters.loadedMeetup(this.id)
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

    loading () {
      return this.$store.getters.loading
    }
  }
}
</script>