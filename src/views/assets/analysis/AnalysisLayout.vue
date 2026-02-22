<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    GitBranch, ArrowDownUp, TrendingDown, Layers, Circle,
    Zap, Droplets, RefreshCw, SquareStack
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'connectivity', label: '连通性分析', icon: GitBranch, path: '/assets/analysis' },
    { key: 'upstream', label: '上下游分析', icon: ArrowDownUp, path: '/assets/analysis/upstream' },
    { key: 'slope', label: '坡度分析', icon: TrendingDown, path: '/assets/analysis/slope' },
    { key: 'profile', label: '剖面分析', icon: Layers, path: '/assets/analysis/profile' },
    { key: 'buffer', label: '缓冲分析', icon: Circle, path: '/assets/analysis/buffer' },
    { key: 'collision', label: '管线碰撞', icon: Zap, path: '/assets/analysis/collision' },
    { key: 'flood', label: '淹没分析', icon: Droplets, path: '/assets/analysis/flood' },
    { key: 'loop', label: '环状诊断', icon: RefreshCw, path: '/assets/analysis/loop' },
    { key: 'service-area', label: '服务面积', icon: SquareStack, path: '/assets/analysis/service-area' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path === '/assets/analysis' || path === '/assets/analysis/') return 'connectivity'
    const found = tabs.find(t => t.key !== 'connectivity' && path.includes(t.key))
    return found?.key || 'connectivity'
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
