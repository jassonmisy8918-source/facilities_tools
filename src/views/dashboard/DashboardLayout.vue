<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layers, Info, Building2, CloudRain, Radio, AlertTriangle, ClipboardList, Wrench, TrendingUp, Bell } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'overview', label: '概览', path: '/dashboard' },
    { key: 'layers', label: '专题图层', icon: Layers, path: '/dashboard/layers' },
    { key: 'intro', label: '情况介绍', icon: Info, path: '/dashboard/intro' },
    { key: 'facilities', label: '设施信息', icon: Building2, path: '/dashboard/facilities' },
    { key: 'weather', label: '降雨预报', icon: CloudRain, path: '/dashboard/weather' },
    { key: 'devices', label: '监测设备', icon: Radio, path: '/dashboard/devices' },
    { key: 'defects', label: '缺陷信息', icon: AlertTriangle, path: '/dashboard/defects' },
    { key: 'patrol', label: '巡查养护', icon: ClipboardList, path: '/dashboard/patrol' },
    { key: 'pump-ops', label: '泵站运维', icon: Wrench, path: '/dashboard/pump-ops' },
    { key: 'efficiency', label: '提质增效', icon: TrendingUp, path: '/dashboard/efficiency' },
    { key: 'alarms', label: '信息报警', icon: Bell, path: '/dashboard/alarms' },
]

const activeTab = computed(() => {
    const p = route.path
    if (p === '/dashboard') return 'overview'
    const seg = p.replace('/dashboard/', '').split('/')[0]
    return tabs.find(t => t.path.endsWith('/' + seg))?.key ?? 'overview'
})

function navigate(path: string) { router.push(path) }
</script>

<template>
    <div class="h-[calc(100vh-56px)] overflow-auto p-4 space-y-4">
        <div class="bg-card border border-themed rounded-xl shadow-themed p-1.5">
            <div class="flex items-center gap-0.5 overflow-x-auto">
                <button v-for="tab in tabs" :key="tab.key" @click="navigate(tab.path)"
                    class="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                    :class="activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component v-if="tab.icon" :is="tab.icon" class="w-3.5 h-3.5" />{{ tab.label }}
                </button>
            </div>
        </div>
        <router-view />
    </div>
</template>
