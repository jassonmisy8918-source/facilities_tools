<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, Droplets, Activity, Waves, FlaskConical, Layers } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const filterType = ref('all')
const types = [
    { key: 'all', label: '全部', icon: Map },
    { key: 'rainfall', label: '雨量', icon: Droplets },
    { key: 'flow', label: '流量', icon: Activity },
    { key: 'level', label: '水位', icon: Waves },
    { key: 'quality', label: '水质', icon: FlaskConical },
]

// 统计
const stats = ref({
    total: 42, rainfall: 8, flow: 15, level: 12, quality: 7,
})

// 点位列表
const points = ref([
    { id: 1, name: '芙蓉路雨量站', type: 'rainfall', region: '侯家塘街道', coords: '113.02°E, 28.14°N', status: 'online' },
    { id: 2, name: '韶山路DN600', type: 'flow', region: '圭塘街道', coords: '113.05°E, 28.15°N', status: 'online' },
    { id: 3, name: '劳动路DN400', type: 'level', region: '洞井街道', coords: '113.01°E, 28.17°N', status: 'warning' },
    { id: 4, name: '香樟路DN800', type: 'quality', region: '雨花亭街道', coords: '113.04°E, 28.13°N', status: 'online' },
    { id: 5, name: '左家塘街道雨量站', type: 'rainfall', region: '左家塘街道', coords: '113.00°E, 28.10°N', status: 'online' },
    { id: 6, name: '黎托街道雨量站', type: 'rainfall', region: '黎托街道', coords: '113.08°E, 28.13°N', status: 'alarm' },
    { id: 7, name: '万家丽路DN300', type: 'level', region: '左家塘街道', coords: '113.01°E, 28.09°N', status: 'alarm' },
    { id: 8, name: '圭塘河泵站进水', type: 'flow', region: '雨花亭街道', coords: '113.04°E, 28.15°N', status: 'online' },
])

function getTypeIcon(t: string) { return t === 'rainfall' ? Droplets : t === 'flow' ? Activity : t === 'level' ? Waves : FlaskConical }
function getTypeLabel(t: string) { return t === 'rainfall' ? '雨量' : t === 'flow' ? '流量' : t === 'level' ? '水位' : '水质' }
function getStatusColor(s: string) { return s === 'online' ? 'text-success' : s === 'warning' ? 'text-warning' : 'text-danger' }
function getStatusText(s: string) { return s === 'online' ? '正常' : s === 'warning' ? '预警' : '报警' }

const filteredPoints = computed(() => {
    if (filterType.value === 'all') return points.value
    return points.value.filter(p => p.type === filterType.value)
})

// 地图标记点
const mapMarkers = computed(() => {
    const coordMap: Record<string, { lng: number; lat: number }> = {
        '芙蓉路雨量站': { lng: 113.02, lat: 28.14 },
        '韶山路DN600': { lng: 113.05, lat: 28.15 },
        '劳动路DN400': { lng: 113.01, lat: 28.17 },
        '香樟路DN800': { lng: 113.04, lat: 28.13 },
        '左家塘街道雨量站': { lng: 113.00, lat: 28.10 },
        '黎托街道雨量站': { lng: 113.08, lat: 28.13 },
        '万家丽路DN300': { lng: 113.01, lat: 28.09 },
        '圭塘河泵站进水': { lng: 113.04, lat: 28.15 },
    }
    return filteredPoints.value.map(p => ({
        lng: coordMap[p.name]?.lng ?? 113.03,
        lat: coordMap[p.name]?.lat ?? 28.14,
        title: p.name,
        label: `${getTypeLabel(p.type)} · ${p.region} · ${getStatusText(p.status)}`,
        color: p.status === 'alarm' ? 'red' : undefined,
    }))
})
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
            <!-- 地图区域 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Map class="w-4 h-4 text-primary" /> 监测点位空间分布
                    </h4>
                    <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
                        <button v-for="t in types" :key="t.key" @click="filterType = t.key"
                            class="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer"
                            :class="filterType === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">
                            <component :is="t.icon" class="w-3 h-3" />{{ t.label }}
                        </button>
                    </div>
                </div>
                <div class="h-[440px]">
                    <AMapView :markers="mapMarkers" height="100%" />
                </div>
                <div class="px-4 py-2 border-t border-themed flex items-center gap-4 text-[10px]">
                    <span class="text-dim">图例:</span>
                    <span class="flex items-center gap-1">
                        <Droplets class="w-3 h-3 text-info" />雨量({{ stats.rainfall }})
                    </span>
                    <span class="flex items-center gap-1">
                        <Activity class="w-3 h-3 text-primary" />流量({{ stats.flow }})
                    </span>
                    <span class="flex items-center gap-1">
                        <Waves class="w-3 h-3 text-warning" />水位({{ stats.level }})
                    </span>
                    <span class="flex items-center gap-1">
                        <FlaskConical class="w-3 h-3 text-success" />水质({{ stats.quality }})
                    </span>
                    <span class="ml-auto text-dim">共 {{ stats.total }} 个点位</span>
                </div>
            </div>

            <!-- 点位列表 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden flex flex-col">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Layers class="w-4 h-4 text-info" /> 点位列表
                    </h4>
                </div>
                <div class="flex-1 overflow-y-auto p-2 space-y-1" style="max-height: 480px">
                    <div v-for="p in filteredPoints" :key="p.id"
                        class="p-2.5 rounded-lg bg-surface hover:bg-hover-themed transition-colors cursor-pointer">
                        <div class="flex items-center justify-between mb-1">
                            <div class="flex items-center gap-1.5">
                                <component :is="getTypeIcon(p.type)" class="w-3.5 h-3.5 text-primary" />
                                <span class="text-xs font-medium text-default">{{ p.name }}</span>
                            </div>
                            <span class="text-[10px] font-medium" :class="getStatusColor(p.status)">{{
                                getStatusText(p.status) }}</span>
                        </div>
                        <div class="ml-5 text-[10px] text-muted-themed space-y-0.5">
                            <p>{{ getTypeLabel(p.type) }} · {{ p.region }}</p>
                            <p>{{ p.coords }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
