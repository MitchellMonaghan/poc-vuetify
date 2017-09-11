<template>
    <v-container>
        <!-- Error Alerts -->
        <v-layout row v-if="error">
            <v-flex xs12 sm6 offset-sm3>
                <app-alert @dismissed="clearError" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <!-- End Error Alerts -->

        <!-- Sign Up Form -->
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <form @submit.prevent="signUserIn({ 'email': email, 'password': password })">
                                <!-- Email -->
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                            name="email"
                                            label="Email"
                                            id="email"
                                            v-model="email"
                                            type="email"
                                            required
                                        >
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <!-- End Email -->

                                <!-- Password -->
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                            name="password"
                                            label="Password"
                                            id="password"
                                            v-model="password"
                                            type="password"
                                            required
                                        >
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <!-- End Password -->

                                <!-- Submit Button -->
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-btn type="submit" :disabled="loading" :loading="loading">
                                            Sign in
                                            <span slot="loader" class="custom-loader">
                                                <v-icon>cached</v-icon>
                                            </span>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                                <!-- End Submit Button -->

                            </form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- End Sign Up Form -->
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },

  computed: {
    ...mapGetters([
      'user',
      'error',
      'loading'
    ])
  },

  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  },

  methods: {
    ...mapActions([
      'signUserIn',
      'clearError'
    ])
  }
}
</script>
