<script setup>
import TopBar from './components/TopBar.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <div id="app">
    <TopBar />

    <header class="pt-16">
      <TheNavbar />
    </header>

    <main class="min-h-screen">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
