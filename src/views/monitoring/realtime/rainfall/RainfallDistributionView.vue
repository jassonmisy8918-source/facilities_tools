<script setup lang="ts">
import { ref } from 'vue'
import { Map, Layers, RefreshCw } from 'lucide-vue-next'

const mapMode = ref('heatmap')
const modes = [
    { key: 'heatmap', label: '热力图' },
    { key: 'contour', label: '等值线' },
    { key: 'grid', label: '网格图' },
]

// 区域分布数据
const regions = ref([
    { name: '朝阳区', intensity: 1.8, level: '小雨', color: '#22C55E', area: '46.2 km²' },
    { name: '海淀区', intensity: 0.4, level: '小雨', color: '#22C55E', area: '43.1 km²' },
    { name: '东城区', intensity: 5.3, level: '中雨', color: '#3B82F6', area: '25.4 km²' },
    { name: '西城区', intensity: 3.2, level: '小雨', color: '#22C55E', area: '31.6 km²' },
    { name: '丰台区', intensity: 8.5, level: '大雨', color: '#F59E0B', area: '30.6 km²' },
    { name: '通州区', intensity: 12.6, level: '大雨', color: '#EF4444', area: '90.6 km²' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
            <!-- 地图区域 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Map class="w-4 h-4 text-primary" /> 降雨强度空间分布
                    </h4>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
                            <button v-for="m in modes" :key="m.key" @click="mapMode = m.key"
                                class="px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                                :class="mapMode === m.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">
                                {{ m.label }}
                            </button>
                        </div>
                        <button class="p-1.5 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                            <RefreshCw class="w-3.5 h-3.5 text-dim" />
                        </button>
                    </div>
                </div>
                <div class="aspect-16/10 bg-[#0a1929] flex items-center justify-center">
                    <div class="text-center text-muted-themed">
                        <Map class="w-16 h-16 mx-auto opacity-20 mb-3" />
                        <p class="text-sm">降雨强度{{ mapMode === 'heatmap' ? '热力图' : mapMode === 'contour' ? '等值线图' : '网格图'
                        }}</p>
                        <p class="text-[10px] mt-1">GIS 地图 · 实时数据叠加</p>
                    </div>
                </div>
                <!-- 图例 -->
                <div class="px-4 py-2 border-t border-themed flex items-center gap-4 text-[10px]">
                    <span class="text-dim">强度图例:</span>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded bg-success"></div><span class="text-dim">小雨</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded bg-info"></div><span class="text-dim">中雨</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded bg-warning"></div><span class="text-dim">大雨</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <div class="w-3 h-3 rounded bg-danger"></div><span class="text-dim">暴雨</span>
                    </div>
                </div>
            </div>

            <!-- 区域分布表 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Layers class="w-4 h-4 text-info" /> 区域降雨概况
                    </h4>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="r in regions" :key="r.name" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="text-xs font-medium text-default">{{ r.name }}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :style="{ color: r.color, backgroundColor: r.color + '20' }">{{ r.level }}</span>
                        </div>
                        <div class="flex items-baseline gap-1 mb-1.5">
                            <span class="text-lg font-bold text-default">{{ r.intensity }}</span>
                            <span class="text-[10px] text-dim">mm/h</span>
                        </div>
                        <div class="w-full h-1.5 bg-[#1E3348] rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all"
                                :style="{ width: Math.min(r.intensity / 16 * 100, 100) + '%', backgroundColor: r.color }">
                            </div>
                        </div>
                        <p class="text-[10px] text-muted-themed mt-1">覆盖面积: {{ r.area }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
