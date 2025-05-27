<template>
    <div class="flex flex-col gap-0">
        <div
            class="bg-[#aec6cf] p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
        >
            <h1 class="text-2xl md:text-4xl">Welcome to homeMate!</h1>
            <p>
                homeMate is an assistant that can solve math, write articles,
                recognize varius languages and be used for help in general. It
                can also interact with IOT devices, download and play
                music(.mp3) from a youtube and getting current weather data.
                Easy to use via chat.
            </p>
        </div>
        <div
            class="bg-white p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
        >
            <p>
                This is master's degree final project made by Matej Visnjic at
                University of Jurja Dobrile in Pula.
            </p>
            <p>
                Menthor:
                <a
                    target="_blank"
                    href="https://fipu.unipu.hr/fipu/nikola.tankovic"
                    >Nikola Tanković.</a
                >
            </p>
        </div>

        <div
            class="bg-[#aec6cf] p-12 lg:p-24 w-full h-3/6 self-center flex flex-col gap-6 m-auto text-lg md:text-2xl"
        >
            <p>
                Application are using a private data. For using this application
                you'll need an account.
            </p>
            <router-link
                to="/login"
                class="border-b border-black w-12 md:w-16 hover:bg-[#9db4bd]"
                >Login</router-link
            >
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {}
    },
    methods: {},
}
</script>
