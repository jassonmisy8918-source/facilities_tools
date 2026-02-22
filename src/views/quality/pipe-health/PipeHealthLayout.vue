<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Heart, Wrench, Target } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'defect', label: '管道缺陷', icon: Search, path: '/quality/pipe-health' },
    { key: 'health', label: '健康度评价', icon: Heart, path: '/quality/pipe-health/health' },
    { key: 'repair', label: '管道修复', icon: Wrench, path: '/quality/pipe-health/repair' },
    { key: 'effect', label: '效果跟踪', icon: Target, path: '/quality/pipe-health/effect' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('effect')) return 'effect'
    if (p.includes('repair')) return 'repair'
    if (p.includes('health')) return 'health'
    return 'defect'
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
