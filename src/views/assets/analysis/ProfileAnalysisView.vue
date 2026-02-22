<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Layers, ArrowLeftRight, ArrowUpDown } from 'lucide-vue-next'


const profileType = ref<'cross' | 'longitudinal'>('longitudinal')

// ===================== 纵断面 =====================
const longChartRef = ref<HTMLElement>()
let longChart: echarts.ECharts | null = null
const longData = {
    distance: [0, 50, 120, 200, 310, 400, 520, 640, 750, 880, 1000],
    ground: [45.2, 44.8, 44.1, 43.5, 42.8, 42.3, 41.6, 41.0, 40.5, 39.8, 39.2],
    pipe: [42.8, 42.4, 41.8, 41.2, 40.6, 40.1, 39.5, 38.9, 38.4, 37.8, 37.2],
    wells: ['MH-001', 'MH-002', 'MH-003', 'MH-004', 'MH-005', 'MH-006', 'MH-007', 'MH-008', 'MH-009', 'MH-010', 'MH-011'],
}

// ===================== 横断面 =====================
const crossChartRef = ref<HTMLElement>()
let crossChart: echarts.ECharts | null = null

function initLongChart() {
    if (!longChartRef.value) return
    longChart = echarts.init(longChartRef.value)
    longChart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: { data: ['地面高程', '管底高程'], textStyle: { color: 'var(--text-dim)', fontSize: 10 }, top: 0 },
        grid: { top: 35, right: 20, bottom: 40, left: 55 },
        xAxis: { type: 'category', name: '距离(m)', data: longData.distance, axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, nameTextStyle: { color: 'var(--text-dim)', fontSize: 10 } },
        yAxis: { type: 'value', name: '高程(m)', axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, nameTextStyle: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { lineStyle: { color: 'var(--border-themed)', type: 'dashed' } } },
        series: [
            { name: '地面高程', type: 'line', data: longData.ground, smooth: true, lineStyle: { width: 2, color: '#FFB020' }, areaStyle: { color: 'rgba(255,176,32,0.1)' }, symbol: 'circle', symbolSize: 4, itemStyle: { color: '#FFB020' } },
            { name: '管底高程', type: 'line', data: longData.pipe, smooth: true, lineStyle: { width: 2, color: '#3B82F6' }, symbol: 'circle', symbolSize: 4, itemStyle: { color: '#3B82F6' } },
        ],
    })
}

function initCrossChart() {
    if (!crossChartRef.value) return
    crossChart = echarts.init(crossChartRef.value)
    crossChart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { top: 30, right: 20, bottom: 30, left: 55 },
        xAxis: { type: 'category', data: ['-3m', '-2m', '-1m', '管道左', '管道中', '管道右', '+1m', '+2m', '+3m'], axisLabel: { color: 'var(--text-dim)', fontSize: 10 } },
        yAxis: { type: 'value', name: '深度(m)', inverse: true, axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { lineStyle: { color: 'var(--border-themed)', type: 'dashed' } } },
        series: [
            { name: '地层', type: 'line', data: [0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.4, 0.3, 0.2], smooth: true, areaStyle: { color: 'rgba(139,92,246,0.15)' }, lineStyle: { color: '#8B5CF6', width: 2 }, itemStyle: { color: '#8B5CF6' } },
            { name: '管道', type: 'line', data: [null, null, null, 2.0, 2.3, 2.0, null, null, null], lineStyle: { color: '#3B82F6', width: 3 }, symbol: 'circle', symbolSize: 6, itemStyle: { color: '#3B82F6' } },
        ],
    })
}

// ===================== 管段信息 =====================
const pipeInfo = ref([
    { label: '管段编号', value: 'PS-001234' },
    { label: '起点井', value: 'MH-001' },
    { label: '终点井', value: 'MH-011' },
    { label: '管径', value: 'DN600' },
    { label: '材质', value: 'HDPE' },
    { label: '管长', value: '1,000 m' },
    { label: '起点高程', value: '42.8 m' },
    { label: '终点高程', value: '37.2 m' },
    { label: '平均坡度', value: '5.6‰' },
    { label: '平均埋深', value: '2.8 m' },
])

onMounted(() => { initLongChart(); initCrossChart(); window.addEventListener('resize', () => { longChart?.resize(); crossChart?.resize() }) })
onUnmounted(() => { longChart?.dispose(); crossChart?.dispose(); longChart = null; crossChart = null })
</script>

<template>
    <div class="space-y-4">
        <!-- 切换 -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
                <button @click="profileType = 'longitudinal'"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
                    :class="profileType === 'longitudinal' ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <ArrowLeftRight class="w-3.5 h-3.5" />纵断面分析
                </button>
                <button @click="profileType = 'cross'"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
                    :class="profileType === 'cross' ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <ArrowUpDown class="w-3.5 h-3.5" />横断面分析
                </button>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <!-- 图表区域 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
                    <Layers class="w-4 h-4 text-primary" />
                    {{ profileType === 'longitudinal' ? '管道纵断面' : '管道横断面' }}
                </h3>
                <div v-show="profileType === 'longitudinal'" ref="longChartRef" class="h-72"></div>
                <div v-show="profileType === 'cross'" ref="crossChartRef" class="h-72"></div>
            </div>

            <!-- 管段信息 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-3 py-2.5 border-b border-themed">
                    <h4 class="text-xs font-semibold text-default">管段详情</h4>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="info in pipeInfo" :key="info.label"
                        class="flex items-center justify-between py-1.5 text-xs border-b border-themed/30 last:border-0">
                        <span class="text-dim">{{ info.label }}</span>
                        <span class="text-default font-medium">{{ info.value }}</span>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
