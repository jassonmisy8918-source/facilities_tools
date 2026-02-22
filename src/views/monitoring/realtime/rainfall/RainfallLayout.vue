<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Radio, BarChart3, Map, Clock, Download } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'realtime', label: '实时降雨数据', icon: Radio, path: '/monitoring/realtime' },
    { key: 'intensity', label: '强度等级分析', icon: BarChart3, path: '/monitoring/realtime/rainfall/intensity' },
    { key: 'distribution', label: '可视化分布', icon: Map, path: '/monitoring/realtime/rainfall/distribution' },
    { key: 'history', label: '历史数据查询', icon: Clock, path: '/monitoring/realtime/rainfall/history' },
    { key: 'export', label: '数据导出', icon: Download, path: '/monitoring/realtime/rainfall/export' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('export')) return 'export'
    if (path.includes('history')) return 'history'
    if (path.includes('distribution')) return 'distribution'
    if (path.includes('intensity')) return 'intensity'
    return 'realtime'
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
