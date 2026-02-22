<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ClipboardList, MapPin, BarChart3 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'info', label: '工单管理', icon: ClipboardList, path: '/patrol/work-order' },
    { key: 'track', label: '跟踪监控', icon: MapPin, path: '/patrol/work-order/track' },
    { key: 'stats', label: '模板与统计', icon: BarChart3, path: '/patrol/work-order/stats' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('stats')) return 'stats'
    if (path.includes('track')) return 'track'
    return 'info'
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
