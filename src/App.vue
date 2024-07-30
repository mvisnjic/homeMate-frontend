<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="flex flex-col justify-between h-screen" id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap");

#app {
  font-family: "Share Tech Mono", monospace;
  font-weight: 400;
  font-style: normal;
  line-height: 1.25;

  background-color: #aec6cf;
}
</style>
