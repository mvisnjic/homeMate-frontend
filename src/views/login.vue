<template>
  <div
    class="bg-white p-12 md:p-24 md:w-1/2 h-3/6 self-center rounded-md flex flex-col gap-6 m-auto text-lg md:text-2xl"
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
        @keypress.enter="login()"
      />
    </div>
    <div class="flex flex-col lg:flex-row gap-2">
      <div class="text-red-400 font-bold text-sm" v-if="wrongPassword">
        Wrong email or password!
      </div>
    </div>
      <button
      @click="login()"
      :disabled="username.length < 3 || password.length < 3"
      class="bg-[#aec6cf] p-4 lg:w-2/4 self-center rounded-md hover:bg-[#9db4bd]"
      :class="username.length < 3 || password.length < 3 ? 'bg-gray-400 hover:bg-gray-400' : 'bg-[#aec6cf]'"
      >
      Login
    </button>
  </div>
</template>

<script>
import { Auth } from "../services";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "login",
  setup() {
    const username = ref('');
    const password = ref('');
    const wrongPassword = ref(false);
    const auth = ref(Auth.state);
    const router = useRouter();

    const login = async () => {
      if (username.value.length > 2 && password.value.length > 2) {
        try {
          let success = await Auth.login(username.value, password.value);
          if (success) {
            router.push({ name: 'chat' });
          } else {
            wrongPassword.value = true;
            password.value = '';
          }
        } catch (e) {
          wrongPassword.value = true;
          password.value = '';
          console.error('Wrong email or password.');
        }
      }
    };

    return {
      username,
      password,
      wrongPassword,
      auth,
      login,
    };
  },
};
</script>
