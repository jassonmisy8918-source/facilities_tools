<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Factory, FileText, Layers, Clock, Map } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'sewage', label: '污水处理分析', icon: Factory, path: '/monitoring/analysis/reports' },
    { key: 'generate', label: '报表生成', icon: FileText, path: '/monitoring/analysis/reports/generate' },
    { key: 'overlay', label: '信息叠加分析', icon: Layers, path: '/monitoring/analysis/reports/overlay' },
    { key: 'history', label: '历史数据分析', icon: Clock, path: '/monitoring/analysis/reports/history' },
    { key: 'thematic', label: '专题图', icon: Map, path: '/monitoring/analysis/reports/thematic-map' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('thematic')) return 'thematic'
    if (path.includes('history')) return 'history'
    if (path.includes('overlay')) return 'overlay'
    if (path.includes('generate')) return 'generate'
    return 'sewage'
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
