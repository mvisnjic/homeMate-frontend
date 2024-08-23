<template>
  <div
    class="bg-white p-12 lg:p-24 w-9/12 h-3/6 self-center rounded-md flex flex-col gap-6 m-auto text-lg md:text-2xl"
  >
    <h1>PAGE NOT FOUND!</h1>
    <p>Oops something went wrong</p>
    <router-link to="/home" class="hover:border-b border-b-black">Back to home.</router-link>
  </div>
</template>

<script>
import { Auth } from "../services";

export default {
  name: "404",
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
