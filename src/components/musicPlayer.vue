<template>
    <div class="p-4 bg-gray-200 overflow-y-auto overflow-x-auto w-full h-full">
        <audio class="w-full" ref="player" controls @ended="playNextTrack">
            <source :src="currentTrackUrl" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>

        <div class="mt-4 mb-2">
            <button
                @click="showTrackList = !showTrackList"
                class="bg-[#aec6cf] text-white px-3 py-1 rounded hover:bg-[#9db4bd]"
            >
                {{ showTrackList ? 'Hide Track List' : 'Show Track List' }}
            </button>
        </div>

        <ul class="space-y-1">
            <template v-if="showTrackList">
                <li
                    v-for="(track, i) in shuffledTracks"
                    :key="track"
                    class="flex items-center justify-between bg-white px-3 py-2 rounded shadow-sm hover:bg-gray-100 gap-2"
                    :class="{ 'border border-[#9db4bd]': i === currentIndex }"
                >
                    <button
                        class="bg-[#aec6cf] text-white px-2 rounded hover:bg-[#9db4bd]"
                        @click="setTrack(i)"
                    >
                        {{ i === currentIndex && player ? '▶' : 'Play' }}
                    </button>
                    <span class="truncate w-4/5" :title="track">
                        {{ track }}
                    </span>
                </li>
            </template>

            <template v-else>
                <li
                    class="bg-white px-3 py-2 rounded shadow-sm flex justify-between"
                >
                    <span
                        class="truncate"
                        :title="shuffledTracks[currentIndex]"
                    >
                        🎵 {{ shuffledTracks[currentIndex] || 'No track' }}
                    </span>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { Chat } from '../services'
const player = ref(null)
const trackList = ref([])
const shuffledTracks = ref([])
const currentTrackUrl = ref('')
const currentIndex = ref(0)
const repeatMode = ref(false)
const currentTitle = ref('')
const showTrackList = ref(true)
const backend_url = Chat.getBackendUrl()

const fetchTracks = async () => {
    const res = await Chat.getMusicList()
    trackList.value = await res
    shuffledTracks.value = trackList.value

    const savedIndex = parseInt(localStorage.getItem('lastTrackIndex'), 10)
    if (!isNaN(savedIndex) || savedIndex < shuffleArray.value.length) {
        currentIndex.value = savedIndex
        setTrack(savedIndex)
    } else {
        setTrack(0)
    }
}

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5)

const setTrack = async (index) => {
    currentIndex.value = index
    localStorage.setItem('lastTrackIndex', index)
    currentTrackUrl.value = await Chat.getSongUrl(shuffledTracks.value[index])
    nextTick(() => {
        if (player.value) {
            player.value.load()
            currentTitle.value =
                shuffledTracks.value[currentIndex.value] || 'None'
            player.value.play().catch(console.warn)
        }
    })
}

const nextTrack = () => {
    if (currentIndex.value + 1 < shuffledTracks.value.length) {
        setTrack(currentIndex.value + 1)
    } else if (repeatMode.value) {
        setTrack(0)
    }
}

const playNextTrack = () => {
    nextTrack()
}

const props = defineProps({
    refreshTrigger: Boolean,
})

watch(
    () => props.refreshTrigger,
    () => {
        fetchTracks()
    }
)

onMounted(() => {
    fetchTracks()
})
</script>
