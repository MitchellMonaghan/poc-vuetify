<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
                <h4>Create a new Meetup</h4>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12>
                <form @submit.prevent="onCreateMeetup">
                    <!-- Title -->
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="title"
                                label="Title"
                                id="title"
                                v-model="title"
                                required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <!-- End Title -->

                    <!-- Location -->
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="location"
                                label="Location"
                                id="location"
                                v-model="location"
                                required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <!-- End Location -->

                    <!-- Image Url -->
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn raised @click="onPickFile">Upload Image</v-btn>
                            <input 
                                type="file" 
                                style="display:none" 
                                ref="fileInput" 
                                accept="image/*"
                                @change="onFilePicked">
                        </v-flex>
                    </v-layout>
                    <!-- End Image Url -->

                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <img :src="imageUrl" height="150">
                        </v-flex>
                    </v-layout>

                    <!-- Description -->
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                                name="description"
                                label="Description"
                                id="description"
                                v-model="description"
                                multi-line
                                required
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <!-- End Description -->

                    <!-- Start and End Dates -->
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <h4>Choose a Date & Time</h4>
                        </v-flex>
                    </v-layout>

                    <v-layout row class="mb-2">
                        <v-flex xs12 sm6 offset-sm3>
                            <v-date-picker v-model="date"></v-date-picker>
                        </v-flex>
                    </v-layout>

                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-time-picker v-model="time" format="24hr"></v-time-picker>
                        </v-flex>
                    </v-layout>
                    <!-- End Start and End Dates -->

                    <!-- Create Meetup Button -->
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn class="primary" :disabled="!formIsValid" type="submit">
                                Create Meetup
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <!-- End Create Meetup Button -->
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      location: '',
      imageUrl: '',
      description: '',
      date: new Date(),
      time: new Date(),
      image: null
    }
  },

  computed: {
    formIsValid () {
      return this.title !== '' &&
             this.location !== '' &&
             this.imageUrl !== '' &&
             this.description !== ''
    },

    submittableDateTime () {
      // Because the date string does not have a time zone attached to it
      // js date parses the string as UTC, even though the client side picked the time. This is why the date is incorrect
      // We then add the time zone offset to construct the proper date-time value
      const date = new Date(this.date)
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

      if (typeof this.time === 'string') {
        const hours = this.time.match(/^(\d+)/)[1]
        const minutes = this.time.match(/:(\d+)/)[1]

        date.setHours(hours)
        date.setMinutes(minutes)
      } else {
        date.setHours(this.time.getHours())
        date.setMinutes(this.time.getMinutes())
      }

      return date
    }
  },

  methods: {
    onCreateMeetup () {
      if (!this.formIsValid) {
        return
      }

      if (!this.image) {
        return
      }

      const meetupData = {
        title: this.title,
        location: this.location,
        image: this.image,
        description: this.description,
        date: this.submittableDateTime,
        user: this.$store.getters.user
      }

      this.$store.dispatch('createMeetup', meetupData)
      this.$router.push('/meetups')
    },

    onPickFile () {
      this.$refs.fileInput.click()
    },

    onFilePicked (event) {
      const files = event.target.files

      if (files.length <= 0) {
        this.image = null
        this.imageUrl = ''
        return
      }

      let fileName = files[0].name

      if (fileName.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }

      const fileReader = new FileReader()

      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })

      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  }
}
</script>
