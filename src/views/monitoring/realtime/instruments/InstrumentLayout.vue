<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Droplets, Activity, Waves, FlaskConical } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'rain-gauge', label: '雨量计', icon: Droplets, path: '/monitoring/realtime/instruments' },
    { key: 'flowmeter', label: '流量计', icon: Activity, path: '/monitoring/realtime/instruments/flowmeter' },
    { key: 'level-gauge', label: '液位计', icon: Waves, path: '/monitoring/realtime/instruments/level-gauge' },
    { key: 'water-quality', label: '水质计', icon: FlaskConical, path: '/monitoring/realtime/instruments/water-quality' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('water-quality')) return 'water-quality'
    if (path.includes('level-gauge')) return 'level-gauge'
    if (path.includes('flowmeter')) return 'flowmeter'
    return 'rain-gauge'
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
