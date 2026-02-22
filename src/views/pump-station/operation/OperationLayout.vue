<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Cpu, FileEdit, ClipboardCheck, Wrench, Archive } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'predict', label: '预测维护', icon: Cpu, path: '/pump-station/operation' },
    { key: 'repair', label: '报修管理', icon: FileEdit, path: '/pump-station/operation/repair' },
    { key: 'review', label: '审核派发', icon: ClipboardCheck, path: '/pump-station/operation/review' },
    { key: 'process', label: '工单处理', icon: Wrench, path: '/pump-station/operation/process' },
    { key: 'records', label: '维修记录', icon: Archive, path: '/pump-station/operation/records' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('records')) return 'records'
    if (p.includes('process')) return 'process'
    if (p.includes('review')) return 'review'
    if (p.includes('repair')) return 'repair'
    return 'predict'
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
