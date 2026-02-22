<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Database, ClipboardCheck, Wrench, Settings } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'ledger', label: '设备台账', icon: Database, path: '/pump-station/equipment' },
    { key: 'inspection', label: '设备巡检', icon: ClipboardCheck, path: '/pump-station/equipment/inspection' },
    { key: 'maintain', label: '设备保养', icon: Wrench, path: '/pump-station/equipment/maintain' },
    { key: 'comprehensive', label: '综合管理', icon: Settings, path: '/pump-station/equipment/comprehensive' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('comprehensive')) return 'comprehensive'
    if (p.includes('maintain')) return 'maintain'
    if (p.includes('inspection')) return 'inspection'
    return 'ledger'
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
