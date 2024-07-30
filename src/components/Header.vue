<script setup>
// loadRouteLocation
</script>
<template>
  <div class="fixed top-0 px-12 py-8 w-full bg-white">
    <div class="flex flex-row items-center justify-between">
      <img
        src="../assets/logo-no-background.svg"
        alt="logo."
        class="w-3/6 lg:w-1/6"
      />
      <button @click="toggle()">
        <img
          src="../assets/hamburger-icon.png"
          alt="hamburger-icon"
          width="40px"
        />
      </button>
    </div>
    <div
      v-if="isOpen"
      class="relative z-50 flex flex-col lg:flex-row justify-end m-12 text-lg md:text-3xl"
    >
      <div v-if="authenticated" class="w-2/3 md:w-1/3 h-screen">
        <router-link to="/">
          <p class="border-b border-black hover:bg-[#9db4bd]">index</p>
        </router-link>
        <router-link to="/home">
          <p class="border-b border-black hover:bg-[#9db4bd]">home</p>
        </router-link>
        <router-link to="/chat">
          <p class="border-b border-black hover:bg-[#9db4bd]">chat</p>
        </router-link>
        <router-link to="/my-profile">
          <p class="border-b border-black hover:bg-[#9db4bd]">my-profile</p>
        </router-link>
        <router-link to="/settings">
          <p class="border-b border-black hover:bg-[#9db4bd]">settings</p>
        </router-link>
        <router-link to="/settings">
          <p class="border-b border-black hover:bg-[#9db4bd]">about</p>
        </router-link>
        <div class="mt-2">
          <Button class="hover:bg-red-400" @click="logout()">LOGOUT</Button>
        </div>
      </div>
      <div v-else class="flex flex-col h-screen">
        <router-link to="/">
          <div class="border-b border-black hover:bg-[#9db4bd]">index</div>
        </router-link>
        <router-link to="/home">
          <div class="border-b border-black hover:bg-[#9db4bd]">test-home</div>
        </router-link>
        <router-link to="/login">
          <div class="border-b border-black hover:bg-[#9db4bd]">login</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "../services/index";

import { ref } from "vue";

export default {
  name: "home",
  data() {
    return {
      auth: Auth.state,
      checkTest: false,
      isOpen: ref(false),
      userValid: false,
      authenticated: ref(false),
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    async logout() {
      try {
        let success = await Auth.logout();
        if (success == true) {
          this.$router.push({ name: "login" });
        }
      } catch (e) {
        alert(e);
        throw new Error("Cannot logout right now. Try again later!");
      }
    },
  },
  watch: {
    async $route(to, from) {
      this.isOpen = false;

      const user = this.auth.token;

      if (user) this.authenticated = true;
      else {
        this.authenticated = false;
      }
    },
  },
};
</script>
