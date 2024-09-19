<template>
    <div class="h-screen max-h-[80%] md:max-w-[85%] w-full p-6 lg:p-12 flex flex-col self-center gap-6 text-lg md:text-2xl">
      <h1 class="text-xl md:text-3xl">hello, {{auth['username']}}.</h1>
      
      <div class="flex h-full w-full overflow-y-auto">
      <chatListBox class="md:w-1/4 hidden md:flex" :chats="chatList" :error="chatError" :isLoading="chatsIsLoading" @deleteChat="deleteChat" />
      <div
      class="relative bg-white h-full text-md md:text-2xl flex flex-col self-end overflow-auto w-full"
      >
      <div class="sticky bg-white top-0 flex flex-col md:hidden md:flex-row border-b border-black p-4" :class="isChatMenuOpen ? 'opacity-100' : 'opacity-70'">
        <button
        @click="toggleChatMenu()">
          <img
          src="../assets/chats-icon.svg"
          alt="select-chats"
          class="w-6 h-6 self-end"
          />
        </button>
        <div v-if="isChatMenuOpen">
            <chatListBox class="md:hidden" :chats="chatList" :error="chatError" :isLoading="chatsIsLoading" @deleteChat="deleteChat" />
        </div>
      </div>
        <div class="p-6 lg:px-16 lg:pb-6 lg:pt-4 text-center text-sm text-red-600" v-if="messagesError">{{messagesError}}</div>
        <div class="self-center h-full p-6 lg:px-16 lg:pb-6 lg:pt-4 content-center" v-if="!route.params.chat_id && !isSendingMessage">
          <p class="text-center pb-6">Ask me something.</p>
          <div class="flex flex-col">
            <button class="text-sm" @click="sendIntoInput('Can you show me python basics?')">Can you show me python basics? </button>
            <button class="text-sm" @click="sendIntoInput('Can you show me python basics?')">Write me 5 best movies? </button>
            <button class="text-sm" @click="sendIntoInput('Can you solve x2 + x4 = x5. Where x = 101')">Can you solve x2 + x4 = x5. Where x = 101 </button>
            <button class="text-sm" @click="sendIntoInput('Capital of Croatia?')">Capital of Croatia? </button>
          </div>
        </div>

        <div class="p-6 w-full" v-for="(message, i) of messagesList" :key="i">
            <assistantChat :message="message.content" v-if="message.sender_username === 'homemate'"/>
            <userChatBox :input="message.content" v-else/>
          </div>
            <div class="p-6 w-full" v-if="isSendingMessage">
           <userChatBox :input="inputValueBackup" v-if="isSendingMessage"/>
           <assistantChat :message="fullResponse" v-if="isSendingMessage"/>
          </div>
        <div v-if="!isChatMenuOpen" class="sticky bg-white flex flex-row items-center gap-x-2 md:gap-6 justify-center text-lg bottom-0 p-4 lg:px-16 lg:pb-16 lg:pt-2 w-full opacity-80">
          <textarea :disabled="isSendingMessage" @keypress.enter.prevent="sendMessage()" v-model="input" class="border-b border-black resize-none w-3/4 max-h-10" rows="2" cols="80"></textarea>
          <button :disabled="isSendingMessage" @click.prevent="sendMessage()" :hidden="input.length < 2">
            <img
            src="../assets/send-icon.svg"
            alt="delete-chats"
            class="w-6 h-6"
            />
          </button>
          <button :disabled="true" :hidden="input.length > 1">
            <img
            src="../assets/sent-icon.svg"
            alt="delete-chats"
            class="w-6 h-6"
            />
          </button>
        </div>
          <div ref="bottom"></div>
      </div>
      </div>
    </div>
</template>

<script>
import { Auth, Chat } from "../services";
import assistantChat from '../components/assistantChat.vue';
import userChatBox from '../components/userChatBox.vue';
import chatListBox from '../components/chatListBox.vue';
import { onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router'

export default {
  name: "chat",
  components: {
    assistantChat,
    userChatBox,
    chatListBox,
  },
  setup() {
    const input = ref('');
    const inputValueBackup = ref('');
    const chatList = ref([]);
    const auth = ref(Auth.getUserFromLocalStorage());
    const chatError = ref('');
    const messagesList = ref([]);
    const messagesError = ref('');
    const route = useRoute();
    const router = useRouter();
    const bottom = ref(null);
    const isOnBottom = ref(false);
    const chatContainer = ref(null);
    const isSendingMessage = ref(false);
    const fullResponse = ref('');
    const chat_id = ref(null);
    const chatsIsLoading = ref(false);
    const isChatMenuOpen = ref(false);
    onMounted(async () => {
      await getChats()
    });

    const getChats = async () => {
      try {
        chatsIsLoading.value = true;
        const res = await Chat.getChats();
        if (!res) {
          chatsIsLoading.value = false;
          chatList.value = []
          chatError.value = 'No chats found.'
        } else {
          chatList.value = res.data.chats
          chatsIsLoading.value = false
        }

        await Chat.loadModel('gemma2:2b')
        if (route.params.chat_id || (parseInt(route.params.chat_id) && parseInt(route.params.chat_id) > 0)) {
          await getMessages(route.params.chat_id)
        }
        
      } catch (error) {
        router.push({ path: '/chat' })
        chatsIsLoading.value = false;
        chatError.value = 'Failed to fetch chats.'
        messagesError.value = error
        console.error('Failed to fetch chats:', error);
      }
    }

    const sendMessage = async () => {
      if (input.value.length > 2) {
        isSendingMessage.value = true
        inputValueBackup.value = input.value
        input.value = ''
        messagesError.value = ''
        const updateResponse = (chunk) => {
          fullResponse.value = chunk;
          if (bottom.value) {
            scrollToBottom()
          }
        };

        try {
          scrollToBottom()

          if (inputValueBackup.value != '') {
            await Chat.generateResponse(inputValueBackup.value, route.params.chat_id, updateResponse, messagesList.value)
            chat_id.value = localStorage.getItem("chat_id")
            router.push({ path: `/chat/${chat_id.value}` })
            await getChats()
            
          }
          updateResponse('')
          isSendingMessage.value = false
          chat_id.value = localStorage.removeItem("chat_id")
        } catch (error) {
          input.value = inputValueBackup.value
          messagesError.value = error
          isSendingMessage.value = false
          console.error('Error:', error);
        }
      }
      else {
        messagesError.value = 'Message to large! Max is 1000 char.'
        input.value = inputValueBackup.value
        scrollToBottom()
        console.error('Error:', messagesError.value);
      }
    };

    const getMessages = async (chat_id) => {
      try {
        messagesError.value = ''
        const res = await Chat.getMessages(chat_id);
        if (res.data) {
          console.log(res.data);
          messagesList.value = res.data.messages;
        } else {
          router.push({ path: '/chat' })
          messagesError.value = 'No messages found for this chat.'
          messagesList.value = []
          localStorage.removeItem('chat_id')
        }
        scrollToBottom()
      } catch (e) {
        messagesError.value = "Error getMessage: " + e
        console.error("catch", e);
      }
    }

    const deleteChat = async (chat_id) => {
      try {
        const res = await Chat.deleteChat(chat_id);
        if (res.data) {
          if (res.data.deleted.chat_id == parseInt(route.params.chat_id)) {
            router.push({ path: '/chat' })
            await getChats()
          }
          else {
            await getChats()
          }
        }
      } catch (e) {
        messagesError.value = "Error deleting chat: " + e
        console.error("catch", e);
      }
    }

    const toggleChatMenu = () => {
      isChatMenuOpen.value = !isChatMenuOpen.value
    }

    const sendIntoInput = (message) => {
      input.value = message;
    }

    const scrollToBottom = () => {
      nextTick(() => {
        bottom.value.scrollIntoView({ behavior: 'smooth' });
        console.log(bottom.value);
      });
    };

    watch(() => route.params.chat_id,
      async () => {
        if (route.params.chat_id || (parseInt(route.params.chat_id) && parseInt(route.params.chat_id) > 0)) {
          isChatMenuOpen.value = false
          return await getMessages(route.params.chat_id);
        }
        isChatMenuOpen.value = false
        return messagesList.value = []

    })
    watch(() => fullResponse,
      async (newValue) => {
        fullResponse.value = newValue
    })

    watch(() => input.value.length > 0,
      async () => {
        messagesError.value = ''
    })

    return {
      input,
      inputValueBackup,
      chatList,
      chatError,
      auth,
      messagesList,
      messagesError,
      sendMessage,
      getMessages,
      scrollToBottom,
      route,
      isSendingMessage,
      fullResponse,
      chatsIsLoading,
      deleteChat,
      isChatMenuOpen,
      toggleChatMenu,
      sendIntoInput,
      bottom,
      isOnBottom,
      chatContainer,
    };
  },
  };
</script>
