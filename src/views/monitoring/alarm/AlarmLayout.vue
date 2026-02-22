<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, Search as SearchIcon, Clock, ClipboardList, MapPin, Cpu, FlaskConical, BarChart3 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'realtime', label: '实时报警', icon: Bell, path: '/monitoring/alarm' },
    { key: 'assessment', label: '报警研判', icon: SearchIcon, path: '/monitoring/alarm/assessment' },
    { key: 'history', label: '历史报警', icon: Clock, path: '/monitoring/alarm/history' },
    { key: 'handling', label: '报警处置', icon: ClipboardList, path: '/monitoring/alarm/handling' },
    { key: 'point-mgmt', label: '监测点管理', icon: MapPin, path: '/monitoring/alarm/point-mgmt' },
    { key: 'device-mgmt', label: '监测设备管理', icon: Cpu, path: '/monitoring/alarm/device-mgmt' },
    { key: 'factor-mgmt', label: '监测因子管理', icon: FlaskConical, path: '/monitoring/alarm/factor-mgmt' },
    { key: 'metric-mgmt', label: '监测指标管理', icon: BarChart3, path: '/monitoring/alarm/metric-mgmt' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path.includes('metric-mgmt')) return 'metric-mgmt'
    if (path.includes('factor-mgmt')) return 'factor-mgmt'
    if (path.includes('device-mgmt')) return 'device-mgmt'
    if (path.includes('point-mgmt')) return 'point-mgmt'
    if (path.includes('handling')) return 'handling'
    if (path.includes('history')) return 'history'
    if (path.includes('assessment')) return 'assessment'
    return 'realtime'
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
