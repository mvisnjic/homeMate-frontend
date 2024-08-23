<template>
  <div class="flex flex-col gap-0">

  
  <div
    class="bg-[#aec6cf] p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
  >
    <h1 class="text-2xl md:text-4xl">About this project</h1>
    <p>homeMate is an assistant to help users to maintain their households. Easy to use via chat.</p>
  </div>
  <div
    class="bg-white p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
  >
    <p>The main idea of a project is to implement solutions to user interact with AI assistant via chat.</p>
  </div>
  <div
    class="bg-[#aec6cf] p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
    >
    <p>Application are using a private data. For using this application you'll need an account.</p>
  </div>
  </div>
</template>

<script>
import { Auth } from "../services";

export default {
  name: "about",
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
