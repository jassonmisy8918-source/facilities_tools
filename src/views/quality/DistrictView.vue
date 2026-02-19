<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { MapPin, Layers, BarChart3 } from 'lucide-vue-next'

// 排水分区
const districts = ref([
    { id: 'D-001', name: '朝阳分区', area: 12.5, population: 85000, pipeLength: 45.2, pipeType: '合流制', stormDensity: 3.6, outlets: 8, pumpStations: 1, loadRate: 78 },
    { id: 'D-002', name: '海淀分区', area: 18.3, population: 120000, pipeLength: 62.8, pipeType: '分流制', stormDensity: 3.4, outlets: 12, pumpStations: 2, loadRate: 65 },
    { id: 'D-003', name: '西城分区', area: 8.2, population: 56000, pipeLength: 28.5, pipeType: '合流制', stormDensity: 3.5, outlets: 5, pumpStations: 1, loadRate: 92 },
    { id: 'D-004', name: '东城分区', area: 6.8, population: 48000, pipeLength: 22.3, pipeType: '分流制', stormDensity: 3.3, outlets: 4, pumpStations: 0, loadRate: 55 },
    { id: 'D-005', name: '丰台分区', area: 22.1, population: 95000, pipeLength: 58.6, pipeType: '混合制', stormDensity: 2.7, outlets: 10, pumpStations: 1, loadRate: 70 },
])

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 30, left: 45 },
            xAxis: { type: 'category', data: districts.value.map(d => d.name), axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: [
                { type: 'value', name: 'km', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
                { type: 'value', name: '%', nameTextStyle: { color: '#5A6B7C' }, max: 100, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
            ],
            series: [
                { name: '管网长度(km)', type: 'bar', data: districts.value.map(d => d.pipeLength), itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
                { name: '负载率(%)', type: 'line', yAxisIndex: 1, data: districts.value.map(d => d.loadRate), lineStyle: { color: '#FFB020' }, itemStyle: { color: '#FFB020' } },
            ]
        })
        window.addEventListener('resize', () => chart?.resize())
    }
})

onUnmounted(() => { chart?.dispose() })
</script>

<template>
    <div class="space-y-4">
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-themed">
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">分区名称</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">面积(km²)</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">服务人口</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管网(km)</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">排水体制</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管网密度</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">排放口</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">负载率</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in districts" :key="d.id"
                        class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-xs font-medium text-primary">{{ d.name }}</td>
                        <td class="px-4 py-2.5 text-xs text-default">{{ d.area }}</td>
                        <td class="px-4 py-2.5 text-xs text-default">{{ d.population.toLocaleString() }}</td>
                        <td class="px-4 py-2.5 text-xs text-default">{{ d.pipeLength }}</td>
                        <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                                :class="d.pipeType === '分流制' ? 'bg-success/15 text-success' : d.pipeType === '合流制' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'">{{
                                d.pipeType }}</span></td>
                        <td class="px-4 py-2.5 text-xs text-dim">{{ d.stormDensity }} km/km²</td>
                        <td class="px-4 py-2.5 text-xs text-default">{{ d.outlets }}</td>
                        <td class="px-4 py-2.5 text-xs text-default">{{ d.pumpStations }}</td>
                        <td class="px-4 py-2.5">
                            <div class="flex items-center gap-2">
                                <div class="w-14 bg-surface rounded-full h-1.5">
                                    <div class="h-1.5 rounded-full"
                                        :class="d.loadRate > 85 ? 'bg-danger' : d.loadRate > 70 ? 'bg-warning' : 'bg-success'"
                                        :style="{ width: d.loadRate + '%' }"></div>
                                </div>
                                <span class="text-[10px]" :class="d.loadRate > 85 ? 'text-danger' : 'text-dim'">{{
                                    d.loadRate }}%</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
            <h4 class="text-sm font-semibold text-default mb-2">分区管网概况</h4>
            <div ref="chartRef" class="h-52"></div>
        </div>
    </div>
</template>
