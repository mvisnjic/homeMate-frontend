<template>
  <div class="text-lg flex flex-col place-items-end max-w-[85%]">
    <label for="homemate">you:</label>
    <div class="bg-[#aec6cf] break-all p-2 w-5/6 overflow-hidden" v-html="compiledMarkdown"></div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { marked } from 'marked';

export default {
  props: {
  input: {
    type: String,
    },
  },
  setup(props) {
    const message = ref(props.message)
    const compiledMarkdown = computed(() => {
    return marked.parse(props.input, { sanitize: true });
    });

    watch(() => props.input, (newValue) => {
    message.value = newValue;
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
