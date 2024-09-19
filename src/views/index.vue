<template>
  <div class="flex flex-col gap-0">
  <div
    class="bg-[#aec6cf] p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
  >
    <h1 class="text-2xl md:text-4xl">Welcome to homeMate!</h1>
    <p>homeMate is an assistant to help users to maintain their households. Easy to use via chat.</p>
  </div>
  <div
    class="bg-white p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
  >
    <p>This project for a <a href="https://fipu.unipu.hr/fipu/predmet/rir" class="hover:underline" target="_blank">course IT solution</a> made by Matej Visnjic at University of Jurja Dobrile in Pula.</p>
    <p>Menthor: <a target="_blank" href="https://fipu.unipu.hr/fipu/nikola.tankovic">Nikola Tanković.</a></p>
  </div>
  
  <div
    class="bg-[#aec6cf] p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
    >
    <p>Application are using a private data. For using this application you'll need an account.</p>
    <router-link to="/login" class="border-b border-black w-12 md:w-16 hover:bg-[#9db4bd]">Login</router-link>
  </div>
  </div>
</template>

<script>
import { Auth } from "../services";

export default {
  name: "index",
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
