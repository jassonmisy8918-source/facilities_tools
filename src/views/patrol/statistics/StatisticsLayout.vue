<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BarChart3, Wrench, Award } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'patrol', label: '巡查工作统计', icon: BarChart3, path: '/patrol/statistics' },
    { key: 'maint', label: '养护工作量统计', icon: Wrench, path: '/patrol/statistics/maint' },
    { key: 'performance', label: '绩效评估', icon: Award, path: '/patrol/statistics/performance' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('performance')) return 'performance'
    if (p.includes('maint')) return 'maint'
    return 'patrol'
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
