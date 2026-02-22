<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FileText, BarChart3, Award, Lightbulb } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'report', label: '运行报表', icon: FileText, path: '/pump-station/reports' },
    { key: 'analysis', label: '数据分析', icon: BarChart3, path: '/pump-station/reports/analysis' },
    { key: 'quality', label: '质量评估', icon: Award, path: '/pump-station/reports/quality' },
    { key: 'decision', label: '决策支持', icon: Lightbulb, path: '/pump-station/reports/decision' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('decision')) return 'decision'
    if (p.includes('quality')) return 'quality'
    if (p.includes('analysis')) return 'analysis'
    return 'report'
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
