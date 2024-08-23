<template>
  <div
    class="bg-white p-12 lg:p-24 w-1/2 h-3/6 self-center rounded-md flex flex-col gap-6 m-auto text-lg md:text-2xl"
  >
    <div class="flex flex-col lg:flex-row gap-2">
      <label>username:</label>
      <input
        type="text"
        class="w-full lg:w-4/6 border-b border-black"
        v-model="username"
      />
    </div>
    <div class="flex flex-col lg:flex-row gap-2">
      <label>password:</label>
      <input
        type="password"
        class="lg:w-4/6 border-b border-black"
        v-model="password"
      />
    </div>
    <div class="flex flex-col lg:flex-row gap-2">
      <div class="text-red-400 font-bold" v-if="wrongPassword">
        Wrong email or password!
      </div>
    </div>
      <button
      @click="login()"
      class="bg-[#aec6cf] p-4 lg:w-2/4 self-center rounded-md hover:bg-[#9db4bd]"
      >
      Login
    </button>
  </div>
</template>

<script>
import { Auth } from "../services";

export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      auth: Auth.state,
      wrongPassword: false,
    };
  },
  methods: {
    async login() {
      try {
        let success = await Auth.login(this.username, this.password);
        if (success == true) {
          this.$router.push({ name: "home" });
        } else {
          this.wrongPassword = true;
          this.password = "";
        }
      } catch (e) {
        this.wrongPassword = true;
        this.password = "";
        throw new Error("Wrong email or password.");
      }
    },
  },
};
</script>
