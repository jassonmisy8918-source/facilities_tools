<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Users, Link, Droplets } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'info', label: '排水户信息管理', icon: Users, path: '/quality/drainage-users' },
    { key: 'connect', label: '接驳管网联动', icon: Link, path: '/quality/drainage-users/connect' },
    { key: 'monitor', label: '水质水量监测', icon: Droplets, path: '/quality/drainage-users/monitor' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p.includes('monitor')) return 'monitor'
    if (p.includes('connect')) return 'connect'
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
                    <component :is="tab.icon" class="w-3.5 h-3.5" />{{ tab.label }}
                </button>
            </div>
        </div>
        <router-view />
    </div>
</template>
