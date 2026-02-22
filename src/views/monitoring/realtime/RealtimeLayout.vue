<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Droplets, Video, MapPin, Settings } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'rainfall', label: '降雨监测', icon: Droplets, path: '/monitoring/realtime' },
    { key: 'video', label: '视频监控', icon: Video, path: '/monitoring/realtime/video' },
    { key: 'points', label: '监测点位分布', icon: MapPin, path: '/monitoring/realtime/points' },
    { key: 'instruments', label: '监测仪器状态', icon: Settings, path: '/monitoring/realtime/instruments' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('/instruments')) return 'instruments'
    if (path.includes('/points')) return 'points'
    if (path.includes('/video')) return 'video'
    return 'rainfall'
})

function navigate(path: string) { router.push(path) }
</script>

<template>
    <div class="space-y-4">
        <div class="bg-card border border-themed rounded-xl shadow-themed p-1.5">
            <div class="flex items-center gap-0.5 overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.key" @click="navigate(tab.path)"
                    class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                    :class="activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="tab.icon" class="w-3.5 h-3.5" />
                    {{ tab.label }}
                </button>
            </div>
        </div>
        <router-view />
    </div>
</template>
