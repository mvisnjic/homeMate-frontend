<template>
  <div class="top-0 py-4 px-6 md:px-12 w-full bg-white border-b border-black">
    <div class="flex flex-row items-center justify-between">
      <img
        src="../assets/logo-no-background.svg"
        alt="logo."
        class="w-3/6 md:w-2/6 lg:w-1/6"
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
        <p class="flex flex-row mb-4">hello {{ loggedUsername }}</p>
        <router-link to="/">
          <p :class="$route.name == 'index' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">index</p>
        </router-link>
        <router-link to="/chat">
          <p :class="$route.name == 'chat' || $route.name == 'dynamic-chat' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">chat</p>
        </router-link>
        <!-- <router-link to="/my-profile">
          <p :class="$route.name == 'myprofile' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">my-profile</p>
        </router-link>
        <router-link to="/settings">
          <p :class="$route.name == 'settings' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">settings</p>
        </router-link> -->
        <router-link to="/about">
          <p :class="$route.name == 'about' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">about</p>
        </router-link>
        <div class="mt-2">
          <Button class="hover:bg-red-400" @click="logout()">LOGOUT</Button>
        </div>
      </div>
      <div v-else class="flex flex-col h-screen">
        <router-link to="/">
          <p :class="$route.name == 'index' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">index</p>
        </router-link>
        <router-link to="/login">
          <p :class="$route.name == 'login' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">login</p>
        </router-link>
        <router-link to="/about">
        <div :class="$route.name == 'about' ? 'bg-[#aec6cf]' : ''" class="border-b border-black hover:bg-[#9db4bd]">about</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "../services/index";

import { ref } from "vue";

export default {
  name: "header",
  data() {
    return {
      auth: Auth.state,
      checkTest: false,
      isOpen: ref(false),
      userValid: false,
      authenticated: ref(false),
      loggedUsername: ref('')
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    async logout() {
      try {
        let response = await Auth.logout();
        if (response == true) {
          this.showUsername = response['username']
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

      const user = this.auth.getUserFromLocalStorage;

      if (user) {
        this.authenticated = true;
        this.loggedUsername = user['username']
      }
      else {
        this.authenticated = false;
      }
    },
  },
};
</script>
