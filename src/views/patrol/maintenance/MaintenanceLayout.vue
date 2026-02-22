<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ClipboardList, FileText, Map, Wrench, Cpu } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'plan', label: '养护计划', icon: ClipboardList, path: '/patrol/maintenance' },
    { key: 'order', label: '养护工单', icon: FileText, path: '/patrol/maintenance/order' },
    { key: 'map', label: '养护地图', icon: Map, path: '/patrol/maintenance/map' },
    { key: 'instrument', label: '仪表维护', icon: Wrench, path: '/patrol/maintenance/instrument' },
    { key: 'equipment', label: '设备管理', icon: Cpu, path: '/patrol/maintenance/equipment' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('equipment')) return 'equipment'
    if (p.includes('instrument')) return 'instrument'
    if (p.includes('/map')) return 'map'
    if (p.includes('order')) return 'order'
    return 'plan'
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
                    <component :is="tab.icon" class="w-3.5 h-3.5" />{{ tab.label }}
                </button>
            </div>
        </div>
        <router-view />
    </div>
</template>
