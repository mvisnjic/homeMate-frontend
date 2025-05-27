<template>
    <div
        class="music-player p-2 bg-gray-200 overflow-y-auto overflow-x-auto w-full h-full"
    >
        <h2 class="inline">🎧 {{ currentTitle }}</h2>

        <audio
            class="w-full"
            ref="player"
            controls
            @ended="playNextTrack"
            @volumechange="updateVolumeState"
        >
            <source :src="currentTrackUrl" type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>

        <div class="controls"></div>

        <ul class="track-list">
            <li
                v-for="(track, i) in shuffledTracks"
                :key="track"
                :class="{ active: i === currentIndex }"
                @click="setTrack(i)"
            >
                {{ track }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const player = ref(null)
const trackList = ref([])
const shuffledTracks = ref([])
const currentTrackUrl = ref('')
const currentIndex = ref(0)
const repeatMode = ref(false)
const volume = ref(1)
const isMuted = ref(false)
const currentTitle = ref('')

const fetchTracks = async () => {
    const res = await fetch('http://192.168.1.12:5000/chat/music/list')
    trackList.value = await res.json()
    shuffledTracks.value = shuffleArray(trackList.value)

    const savedIndex = parseInt(localStorage.getItem('lastTrackIndex'), 10)
    if (!isNaN(savedIndex) && savedIndex < shuffledTracks.value.length) {
        setTrack(savedIndex)
    } else {
        setTrack(0)
    }
}

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5)

const setTrack = (index) => {
    currentIndex.value = index
    localStorage.setItem('lastTrackIndex', index)
    currentTrackUrl.value = `http://192.168.1.12:5000/chat/music/${shuffledTracks.value[index]}`
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

const prevTrack = () => {
    const prev =
        (currentIndex.value - 1 + shuffledTracks.value.length) %
        shuffledTracks.value.length
    setTrack(prev)
}

const playNextTrack = () => {
    nextTrack()
}

const props = defineProps({
    refreshTrigger: Boolean,
})

watch(
    () => props.refreshTrigger,
    (val) => {
        fetchTracks() // or whatever method you want to re-run
    }
)

onMounted(async () => {
    fetchTracks()
})
</script>

<style scoped>
.music-player {
    max-width: 600px;
    margin: auto;
    text-align: center;
}
.controls {
    margin: 10px 0;
}
.track-list {
    list-style: none;
    padding: 0;
}
.track-list li {
    cursor: pointer;
    padding: 5px;
}
.track-list li.active {
    font-weight: bold;
    color: #2196f3;
}
</style>
