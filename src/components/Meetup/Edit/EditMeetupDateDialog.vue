<template>
  <v-dialog width="350px" lazy v-model="editDialog">
      <v-btn accent slot="activator">
          Edit Date
      </v-btn>

      <v-card>
          <v-container>
              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-title>Edit Meetup Date</v-card-title>
                  </v-flex>
              </v-layout>

              <v-divider></v-divider>

              <v-layout row wrap>
                  <v-flex xs12>
                      <v-date-picker v-model="editableDate" style="widht:100%" actions></v-date-picker>
                  </v-flex>
              </v-layout>

              <v-divider></v-divider>

              <v-layout row wrap>
                  <v-flex xs12>
                      <v-card-actions>
                          <v-btn flat class="blue--text darken-1" @click.native="onCloseEditDialog">Close</v-btn>
                          <v-btn flat class="blue--text darken-1" @click.native="onSaveChanges">Save</v-btn>
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
      editableDate: new Date(this.meetup.date)
    }
  },

  methods: {
    onCloseEditDialog () {
      this.editDialog = false
      this.editableDate = new Date(this.meetup.date)
    },

    onSaveChanges () {
      const newDate = new Date(this.meetup.date)
      const editableDate = new Date(this.editableDate)
      editableDate.setMinutes(editableDate.getMinutes() + editableDate.getTimezoneOffset())

      const newDay = editableDate.getDate()
      const newMonth = editableDate.getMonth()
      const newYear = editableDate.getFullYear()

      newDate.setDate(newDay)
      newDate.setMonth(newMonth)
      newDate.setFullYear(newYear)

      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
    }
  }
}
</script>
