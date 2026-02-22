<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Droplets, Activity, Waves, FlaskConical, Bookmark } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'rainfall', label: '雨量查询', icon: Droplets, path: '/monitoring/analysis' },
    { key: 'flow', label: '流量查询', icon: Activity, path: '/monitoring/analysis/query/flow' },
    { key: 'level', label: '水位查询', icon: Waves, path: '/monitoring/analysis/query/level' },
    { key: 'quality', label: '水质查询', icon: FlaskConical, path: '/monitoring/analysis/query/quality' },
    { key: 'templates', label: '查询模板', icon: Bookmark, path: '/monitoring/analysis/query/templates' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('templates')) return 'templates'
    if (path.includes('quality')) return 'quality'
    if (path.includes('level')) return 'level'
    if (path.includes('flow')) return 'flow'
    return 'rainfall'
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
