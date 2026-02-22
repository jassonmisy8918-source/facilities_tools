<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Radio, MapPin, Shield } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'detect', label: '入侵检测', icon: Radio, path: '/quality/intrusion' },
    { key: 'source', label: '来源分析', icon: MapPin, path: '/quality/intrusion/source' },
    { key: 'action', label: '应对措施', icon: Shield, path: '/quality/intrusion/action' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('action')) return 'action'
    if (p.includes('source')) return 'source'
    return 'detect'
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
