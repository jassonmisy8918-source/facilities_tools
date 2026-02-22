<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ClipboardList, Clock, MapPin, Users, FileText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'info', label: '计划管理', icon: ClipboardList, path: '/patrol/plan' },
    { key: 'frequency', label: '频率与优先级', icon: Clock, path: '/patrol/plan/frequency' },
    { key: 'route', label: '路线与检查点', icon: MapPin, path: '/patrol/plan/route' },
    { key: 'personnel', label: '人员排班', icon: Users, path: '/patrol/plan/personnel' },
    { key: 'content', label: '巡查内容', icon: FileText, path: '/patrol/plan/content' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('content')) return 'content'
    if (path.includes('personnel')) return 'personnel'
    if (path.includes('route')) return 'route'
    if (path.includes('frequency')) return 'frequency'
    return 'info'
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
