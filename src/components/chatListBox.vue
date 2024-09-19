<template>
  <div class="bg-gray-200 overflow-y-auto overflow-x-auto md:max-w-[25%]">
    <div class="flex flex-col gap-4 w-full">
      <button class="self-end p-2">
        <router-link to="/chat">
        <img
        src="../assets/modify-icon.svg"
        alt="select-chats"
        class="w-6 h-6"
        title='new chat'
        />
        </router-link>
      </button>
      <div v-if="isLoading" class="text-center text-sm">Loading...</div>
      <div class="relative" v-if="chats.length > 0">
        <div class="relative text-lg flex flex-row justify-between w-full p-4" :class="route.params.chat_id == chat.id ? 'bg-[#aec6cf]' : ''" :title=chat.name v-for="chat in chats" v-bind:key="chat.id">  
            <router-link class="hover:underline truncate w-5/6"  :to="{ name: 'dynamic-chat', params: { chat_id: chat.id } }">
              {{ chat.name }}
            </router-link>
            
            <div class="">
              <button >
                <img
              src="../assets/three-dots.svg"
              alt="options"
              class="w-6 h-6 rotate-90"
              title='options'
              @click="toggleMenu(chat.id)"
              />
            </button>
            <div class="bg-white flex flex-col absolute overflow-visible right-1 mt-2 p-2 shadow-lg border rounded z-50" v-if="menuOpenId === chat.id">
                <button title="delete chat" @click="$emit('deleteChat', chat.id)" class="flex flex-row">
                  <p title="delete chat" class="text-red-600">Delete</p>
                </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="pt-2 text-sm text-red-600">
          {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed} from 'vue';
import { useRoute } from 'vue-router'


export default {
  props: {
    chats: Array,
    error: String,
    isLoading: Boolean,
  },
  setup(props) {
    const chats = computed(() => props.chats);
    const error = computed(() => props.error)
    const isLoading = computed(() => props.isLoading)
    const route = useRoute();
    const isOpened = ref(false)
    const menuOpenId = ref(null)

    const toggleMenu = (chatId) => {
      if(menuOpenId.value === chatId) {
        menuOpenId.value = null; 
      } else {
        menuOpenId.value = chatId;
      }
    }

    return {
      chats,
      error,
      isLoading,
      route,
      toggleMenu,
      isOpened,
      menuOpenId,
    };
  },
};
</script>