<script setup lang="ts">
import { ref } from 'vue'
import { Map, Layers, RefreshCw } from 'lucide-vue-next'

const mapLayer = ref('treatment')
const mapLayers = [
    { key: 'treatment', label: '处理能力' },
    { key: 'quality', label: '出水水质' },
    { key: 'load', label: '负荷率' },
]

const plants = ref([
    { name: '第一污水处理厂', capacity: 12.5, actualLoad: 10.8, loadRate: 86, codOut: 18, region: '朝阳区', level: 'A' },
    { name: '第二污水处理厂', capacity: 10.0, actualLoad: 8.2, loadRate: 82, codOut: 15, region: '海淀区', level: 'A' },
    { name: '第三污水处理厂', capacity: 20.0, actualLoad: 15.8, loadRate: 79, codOut: 22, region: '丰台区', level: 'B' },
    { name: '开发区处理厂', capacity: 8.0, actualLoad: 6.5, loadRate: 81, codOut: 12, region: '通州区', level: 'A' },
    { name: '城南处理厂', capacity: 15.0, actualLoad: 14.2, loadRate: 95, codOut: 20, region: '大兴区', level: 'B' },
])

function getLoadColor(rate: number) { return rate >= 90 ? 'text-danger' : rate >= 80 ? 'text-warning' : 'text-success' }
function getLoadBg(rate: number) { return rate >= 90 ? 'bg-danger' : rate >= 80 ? 'bg-warning' : 'bg-success' }
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
            <!-- 地图 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2"><Map
                            class="w-4 h-4 text-primary" /> 污水处理专题图</h4>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
                            <button v-for="l in mapLayers" :key="l.key" @click="mapLayer = l.key"
                                class="px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer"
                                :class="mapLayer === l.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">{{
                                l.label }}</button>
                        </div>
                        <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                            <RefreshCw class="w-3.5 h-3.5 text-dim" />
                        </button>
                    </div>
                </div>
                <div class="aspect-16/10 bg-[#0a1929] flex items-center justify-center">
                    <div class="text-center text-muted-themed">
                        <Map class="w-16 h-16 mx-auto opacity-20 mb-3" />
                        <p class="text-sm">污水处理{{ mapLayer === 'treatment' ? '能力分布' : mapLayer === 'quality' ? '出水水质' :
                            '负荷率分布' }}专题图</p>
                        <p class="text-[10px] mt-1">GIS 地图 · 数据叠加展示</p>
                    </div>
                </div>
                <div class="px-4 py-2 border-t border-themed flex items-center gap-4 text-[10px]">
                    <span class="text-dim">图例:</span>
                    <span class="flex items-center gap-1"><span
                            class="w-3 h-3 rounded bg-success"></span>正常(&lt;80%)</span>
                    <span class="flex items-center gap-1"><span
                            class="w-3 h-3 rounded bg-warning"></span>较高(80-90%)</span>
                    <span class="flex items-center gap-1"><span
                            class="w-3 h-3 rounded bg-danger"></span>超负荷(&gt;90%)</span>
                </div>
            </div>

            <!-- 处理厂列表 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden flex flex-col">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Layers class="w-4 h-4 text-info" /> 处理厂概况
                    </h4>
                </div>
                <div class="flex-1 overflow-y-auto p-2 space-y-2" style="max-height: 400px">
                    <div v-for="p in plants" :key="p.name" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="text-xs font-medium text-default">{{ p.name }}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{{
                                p.level }}级</span>
                        </div>
                        <div class="grid grid-cols-2 gap-y-1 text-[10px] mb-2">
                            <div><span class="text-dim">设计能力: </span><span class="text-default">{{ p.capacity
                                    }}万m³/日</span></div>
                            <div><span class="text-dim">实际负荷: </span><span class="text-default">{{ p.actualLoad
                                    }}万m³/日</span></div>
                            <div><span class="text-dim">出水COD: </span><span class="text-default">{{ p.codOut
                                    }}mg/L</span></div>
                            <div><span class="text-dim">区域: </span><span class="text-default">{{ p.region }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="flex-1 h-1.5 bg-[#1E3348] rounded-full overflow-hidden">
                                <div class="h-full rounded-full" :class="getLoadBg(p.loadRate)"
                                    :style="{ width: p.loadRate + '%' }"></div>
                            </div>
                            <span class="text-[10px] font-bold" :class="getLoadColor(p.loadRate)">{{ p.loadRate
                                }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
