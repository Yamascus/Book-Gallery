<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <v-btn
            color="primary"
            x-large
            :to="{ name: 'main' }"
        >
          <v-icon>mdi-book</v-icon>
          <span>Book</span>
          <span class="font-weight-light">Gallery</span>
        </v-btn>

      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class App extends Vue {
  }
</script>

<style lang="stylus">
  html,
  body {
    font-size: 10px;
  }

  .theme--light.v-application {
    background: url("assets/bg-light.jpg") repeat fixed !important;
  }
</style>
