<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Settings, Video, RotateCcw, HardDrive } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'manage', label: '信息管理', icon: Settings, path: '/monitoring/realtime/video' },
    { key: 'live', label: '实时查看', icon: Video, path: '/monitoring/realtime/video/live' },
    { key: 'playback', label: '录像回放', icon: RotateCcw, path: '/monitoring/realtime/video/playback' },
    { key: 'storage', label: '存储管理', icon: HardDrive, path: '/monitoring/realtime/video/storage' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('storage')) return 'storage'
    if (path.includes('playback')) return 'playback'
    if (path.includes('live')) return 'live'
    return 'manage'
})

function navigate(path: string) { router.push(path) }
</script>

<template>
    <div class="space-y-3">
        <div class="bg-card border border-themed rounded-lg shadow-themed p-1">
            <div class="flex items-center gap-0.5 overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.key" @click="navigate(tab.path)"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                    :class="activeTab === tab.key ? 'bg-primary/15 text-primary' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="tab.icon" class="w-3 h-3" />
                    {{ tab.label }}
                </button>
            </div>
        </div>
        <router-view />
    </div>
</template>
