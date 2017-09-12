<template>
  <v-dialog width="350px" lazy v-model="editDialog">
      <v-btn accent slot="activator">
          Edit Time
      </v-btn>

      <v-card>
          <v-container>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-title>Edit Meetup Time</v-card-title>
                  </v-flex>
              </v-layout>

              <v-divider></v-divider>

              <v-layout row wrap>
                  <v-flex xs12>
                      <v-time-picker v-model="editableTime" style="widht:100%" actions format="24hr"></v-time-picker>
                  </v-flex>
              </v-layout>

              <v-divider></v-divider>

              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-actions>
                          <v-btn flat class="blue--text darken-1" @click="onCloseEditDialog">Close</v-btn>
                          <v-btn flat class="blue--text darken-1" @click="onSaveChanges">Save</v-btn>
                      </v-card-actions>
                  </v-flex>
              </v-layout>

          </v-container>
      </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editableTime: new Date(this.meetup.date).toTimeString()
    }
  },

  methods: {
    onCloseEditDialog () {
      this.editDialog = false
      this.editableTime = new Date(this.meetup.date).toTimeString()
    },

    onSaveChanges () {
      const newTime = new Date(this.meetup.date)

      const hours = this.editableTime.match(/^(\d+)/)[1]
      const minutes = this.editableTime.match(/:(\d+)/)[1]

      newTime.setHours(hours)
      newTime.setMinutes(minutes)

      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newTime
      })
    }
  }
}
</script>
