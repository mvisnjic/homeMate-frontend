<template>
  <div class="text-lg flex flex-col place-items-start overflow-hidden max-w-[85%]">
    <label for="homemate">homeMate:</label>
    <div class="bg-gray-200 break-all w-5/6 p-2 overflow-hidden" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { marked } from 'marked';
import router from "../router/index.js";

export default {
  props: {
  message: {
    type: String,
    },
  },
  setup(props) {
    const message = ref(props.message)
    const compiledMarkdown = computed(() => {
      return marked.parse(props.message, { sanitize: true });
    });

    watch(() => props.message, (newMessage) => {
      message.value = newMessage;
    });
    
    return {
    compiledMarkdown,
    };
  },
};
</script>

<style scoped>
div {
  font-family: Arial, sans-serif;
  white-space: pre-wrap;
}
</style>
