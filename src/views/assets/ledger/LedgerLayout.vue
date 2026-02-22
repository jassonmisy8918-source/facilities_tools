<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Database, Crosshair, BarChart3, Ruler } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'data', label: '台账数据', icon: Database, path: '/assets/ledger' },
    { key: 'location-query', label: '定位查询', icon: Crosshair, path: '/assets/ledger/location-query' },
    { key: 'chart-stats', label: '图表统计', icon: BarChart3, path: '/assets/ledger/chart-stats' },
    { key: 'measure-annotate', label: '测量标注', icon: Ruler, path: '/assets/ledger/measure-annotate' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path === '/assets/ledger' || path === '/assets/ledger/') return 'data'
    const found = tabs.find(t => t.key !== 'data' && path.includes(t.key))
    return found?.key || 'data'
})

function navigate(path: string) {
    router.push(path)
}
</script>

<template>
    <div class="space-y-4">
        <!-- 子导航 Tab -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-1.5">
            <div class="flex items-center gap-0.5">
                <button v-for="tab in tabs" :key="tab.key" @click="navigate(tab.path)"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    :class="activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="tab.icon" class="w-3.5 h-3.5" />
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <!-- 子路由内容 -->
        <router-view />
    </div>
</template>
