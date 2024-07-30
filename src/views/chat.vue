<template>
  <div
    class="bg-white p-12 lg:p-32 lg:w-3/6 lg:h-3/6 self-center rounded-md flex flex-col gap-6 m-auto text-lg md:text-2xl"
  >
    <div>chat.</div>
  </div>
</template>

<script>
import { Auth } from "../services";

export default {
  name: "signIn",
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
