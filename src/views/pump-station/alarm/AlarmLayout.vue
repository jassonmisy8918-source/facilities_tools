<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Shield, Bell, Send, CheckCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'rules', label: '报警规则', icon: Shield, path: '/pump-station/alarm' },
    { key: 'events', label: '报警事件', icon: Bell, path: '/pump-station/alarm/events' },
    { key: 'notify', label: '通知管理', icon: Send, path: '/pump-station/alarm/notify' },
    { key: 'dispose', label: '处置闭环', icon: CheckCircle, path: '/pump-station/alarm/dispose' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('dispose')) return 'dispose'
    if (p.includes('notify')) return 'notify'
    if (p.includes('events')) return 'events'
    return 'rules'
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
