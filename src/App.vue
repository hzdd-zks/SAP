<script setup lang="ts">
import { useRoute } from 'vue-router'
import MainLayout from './components/MainLayout.vue'

const route = useRoute()
</script>

<template>
  <template v-if="route.path === '/login' || route.path === '/register'">
    <router-view />
  </template>
  <template v-else>
    <MainLayout />
  </template>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}
</style>
