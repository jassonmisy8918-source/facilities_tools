<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CloudSun, CloudRain, Radar, Cloud, AlertTriangle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'realtime', label: '实时天气预报', icon: CloudSun, path: '/monitoring/weather' },
    { key: 'precipitation', label: '24小时降水预报', icon: CloudRain, path: '/monitoring/weather/precipitation' },
    { key: 'radar', label: '气象雷达信息', icon: Radar, path: '/monitoring/weather/radar' },
    { key: 'satellite', label: '卫星云图信息', icon: Cloud, path: '/monitoring/weather/satellite' },
    { key: 'typhoon', label: '台风信息', icon: AlertTriangle, path: '/monitoring/weather/typhoon' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path === '/monitoring/weather' || path === '/monitoring/weather/') return 'realtime'
    const found = tabs.find(t => t.key !== 'realtime' && path.includes(t.key))
    return found?.key || 'realtime'
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
