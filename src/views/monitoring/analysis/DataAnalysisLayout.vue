<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, GitCompareArrows, BarChart3, FileText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'query', label: '数据查询', icon: Search, path: '/monitoring/analysis' },
    { key: 'compare', label: '数据对比', icon: GitCompareArrows, path: '/monitoring/analysis/compare' },
    { key: 'deep', label: '数据分析', icon: BarChart3, path: '/monitoring/analysis/deep-analysis' },
    { key: 'reports', label: '报表管理', icon: FileText, path: '/monitoring/analysis/reports' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('/reports')) return 'reports'
    if (path.includes('/deep-analysis')) return 'deep'
    if (path.includes('/compare')) return 'compare'
    return 'query'
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
