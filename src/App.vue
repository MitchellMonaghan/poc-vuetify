<template>
  <v-app>

    <!-- Mobile Navigation -->
    <v-navigation-drawer temporary v-model="sideNav">
      <v-list>
        <v-list-tile v-for="menuItem in menuItems" :key="menuItem.title" :to="menuItem.link">
          <v-list-tile-action>
            <v-icon>{{ menuItem.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ menuItem.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- End Mobile Navigation -->

    <!-- Desktop Navigation -->
    <v-toolbar>
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/">DevMeetup</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="menuItem in menuItems" :key="menuItem.title" :to="menuItem.link">
          <v-icon left>{{ menuItem.icon }}</v-icon>
          {{ menuItem.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- End Desktop Navigation -->

    <!--Content -->
    <main>
      <v-container fluid>
        <!--v-router-->
        <router-view></router-view>
      </v-container>
    </main>
    <!-- End Content-->
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },

    computed: {
      menuItems () {
        let menuItems = [
          { icon: 'face', title: 'Sign up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign in', link: '/signin' }
        ]

        if (this.userIsAuthenticated) {
          menuItems = [
            { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
            { icon: 'room', title: 'Organize Meetup', link: '/meetup/new' },
            { icon: 'person', title: 'Profile', link: '/profile' }
          ]
        }

        return menuItems
      },

      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    }
  }
</script>
