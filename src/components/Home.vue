<template>
    <v-container>
        <!--Top Content -->
        <v-layout row wrap class="mb-2">
            <v-flex xs12 sm6 class="text-xs-center text-sm-right">
                <v-btn to="/meetups">Explore Meetups</v-btn>
            </v-flex>

            <v-flex xs12 sm6 class="text-xs-center text-sm-left">
                <v-btn to="/meetup/new">Organize Meetup</v-btn>
            </v-flex>
        </v-layout>
        <!-- End Top Content -->

        <!-- Carousel Loader -->
        <v-layout>
            <v-flex xs12 class="text-xs-center">
                <v-progress-circular
                indeterminate
                class="primary--text"
                :width="7"
                :size="70"
                v-if="loading">
                </v-progress-circular>
            </v-flex>
        </v-layout>
        <!-- End Carousel Loader -->

        <!-- Carousel -->
        <v-layout row wrap class="mt-2" v-if="!loading">
            <v-flex xs12>
                <v-carousel style="cursor:pointer">
                    <v-carousel-item 
                    v-for="meetup in meetups"
                    :src="meetup.imageUrl"
                    :key="meetup.id"
                    @click="onLoadMeetup(meetup.id)">
                        <div class="title">{{ meetup.title }}</div>
                    </v-carousel-item>
                </v-carousel>
            </v-flex>
        </v-layout>
        <!--End Carousel -->

        <!-- Bottom Content -->
        <v-layout row wrap class="mt-2">
            <v-flex xs12 class="text-xs-center">
                <p>Join our awsome meetups!</p>
            </v-flex>
        </v-layout>
        <!--End Bottom Content -->

    </v-container>
</template>

<script>
    export default {
      computed: {
        meetups () {
          return this.$store.getters.featuredMeetups
        },

        loading () {
          return this.$store.getters.loading
        }
      },

      methods: {
        onLoadMeetup (meeupId) {
          this.$router.push('/meetups/' + meeupId)
        }
      }
    }
</script>

<style scoped>
    .title {
        position: absolute;
        bottom: 50px;
        background-color: rgba(0,0,0,0.5);
        color: white;
        font-size: 2em;
        padding: 20px;
    }
</style>