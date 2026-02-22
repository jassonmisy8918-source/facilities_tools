<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { BarChart3, GitCompare } from 'lucide-vue-next'

const subView = ref<'compare' | 'stats'>('compare')

// ===================== 多分区指标对比 =====================
const compareChartRef = ref<HTMLElement>()
let compareChart: echarts.ECharts | null = null

const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区']
const compareMetrics = {
    density: { label: '管网密度(km/km²)', data: [38.9, 33.4, 37.2, 41.3, 25.4] },
    wells: { label: '检查井密度(个/km²)', data: [124.8, 102.5, 120.3, 132.3, 88.6] },
    coverage: { label: '管网覆盖率(%)', data: [95, 92, 88, 91, 85] },
    defect: { label: '管网缺陷率(%)', data: [3.2, 4.1, 5.8, 4.5, 6.2] },
}

// ===================== 分区关联设施统计 =====================
const statsChartRef = ref<HTMLElement>()
let statsChart: echarts.ECharts | null = null

const facilityStats = ref([
    { district: '朝阳区', pipes: 12560, wells: 8340, rainInlets: 4560, pumps: 12, outlets: 23, monitors: 45 },
    { district: '海淀区', pipes: 11200, wells: 7450, rainInlets: 3890, pumps: 10, outlets: 18, monitors: 38 },
    { district: '西城区', pipes: 4560, wells: 3040, rainInlets: 1650, pumps: 5, outlets: 8, monitors: 22 },
    { district: '东城区', pipes: 3890, wells: 2590, rainInlets: 1380, pumps: 4, outlets: 6, monitors: 18 },
    { district: '丰台区', pipes: 9800, wells: 6530, rainInlets: 3450, pumps: 8, outlets: 15, monitors: 32 },
])

function initCompareChart() {
    if (!compareChartRef.value) return
    compareChart = echarts.init(compareChartRef.value)
    compareChart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: { data: Object.values(compareMetrics).map(m => m.label), textStyle: { color: 'var(--text-dim)', fontSize: 10 }, top: 0, type: 'scroll' },
        grid: { top: 40, right: 20, bottom: 30, left: 50 },
        xAxis: { type: 'category', data: districts, axisLabel: { color: 'var(--text-dim)', fontSize: 10 } },
        yAxis: { type: 'value', axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { lineStyle: { color: 'var(--border-themed)', type: 'dashed' } } },
        series: [
            { name: compareMetrics.density.label, type: 'bar', data: compareMetrics.density.data, itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
            { name: compareMetrics.coverage.label, type: 'line', data: compareMetrics.coverage.data, lineStyle: { width: 2, color: '#00D4AA' }, symbol: 'circle', symbolSize: 6, itemStyle: { color: '#00D4AA' } },
            { name: compareMetrics.defect.label, type: 'line', data: compareMetrics.defect.data, lineStyle: { width: 2, color: '#FF4757', type: 'dashed' }, symbol: 'diamond', symbolSize: 6, itemStyle: { color: '#FF4757' } },
        ],
    })
}

function initStatsChart() {
    if (!statsChartRef.value) return
    statsChart = echarts.init(statsChartRef.value)
    statsChart.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['管道', '检查井', '雨水口', '泵站', '排放口'], textStyle: { color: 'var(--text-dim)', fontSize: 10 }, top: 0 },
        grid: { top: 35, right: 20, bottom: 30, left: 50 },
        xAxis: { type: 'category', data: districts, axisLabel: { color: 'var(--text-dim)', fontSize: 10 } },
        yAxis: { type: 'value', axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { lineStyle: { color: 'var(--border-themed)', type: 'dashed' } } },
        series: [
            { name: '管道', type: 'bar', stack: 'total', data: facilityStats.value.map(s => s.pipes), itemStyle: { color: '#3B82F6' } },
            { name: '检查井', type: 'bar', stack: 'total', data: facilityStats.value.map(s => s.wells), itemStyle: { color: '#00D4AA' } },
            { name: '雨水口', type: 'bar', stack: 'total', data: facilityStats.value.map(s => s.rainInlets), itemStyle: { color: '#FFB020' } },
            { name: '泵站', type: 'bar', stack: 'total', data: facilityStats.value.map(s => s.pumps), itemStyle: { color: '#8B5CF6' } },
            { name: '排放口', type: 'bar', stack: 'total', data: facilityStats.value.map(s => s.outlets), itemStyle: { color: '#FF4757' } },
        ],
    })
}

onMounted(() => { initCompareChart(); initStatsChart(); window.addEventListener('resize', () => { compareChart?.resize(); statsChart?.resize() }) })
onUnmounted(() => { compareChart?.dispose(); statsChart?.dispose(); compareChart = null; statsChart = null })
</script>

<template>
    <div class="space-y-4">
        <!-- 子功能切换 -->
        <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5 w-fit">
            <button @click="subView = 'compare'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
                :class="subView === 'compare' ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                <GitCompare class="w-3.5 h-3.5" />多分区指标对比
            </button>
            <button @click="subView = 'stats'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
                :class="subView === 'stats' ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                <BarChart3 class="w-3.5 h-3.5" />分区关联设施统计
            </button>
        </div>

        <!-- 多分区指标对比 -->
        <template v-if="subView === 'compare'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-3">分区指标横向对比</h3>
                <div ref="compareChartRef" class="h-72"></div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">分区</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管网密度</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">检查井密度</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">覆盖率</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">缺陷率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(d, i) in districts" :key="d"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-xs font-medium text-default">{{ d }}</td>
                            <td class="px-4 py-2.5 text-xs text-primary font-medium">{{ compareMetrics.density.data[i]
                                }} km/km²</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ compareMetrics.wells.data[i] }} 个/km²</td>
                            <td class="px-4 py-2.5 text-xs font-medium"
                                :class="(compareMetrics.coverage.data[i] ?? 0) >= 90 ? 'text-success' : 'text-warning'">
                                {{
                                    compareMetrics.coverage.data[i] }}%</td>
                            <td class="px-4 py-2.5 text-xs font-medium"
                                :class="(compareMetrics.defect.data[i] ?? 0) <= 4 ? 'text-success' : 'text-danger'">{{
                                    compareMetrics.defect.data[i] }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 分区关联设施统计 -->
        <template v-if="subView === 'stats'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-3">各分区设施构成</h3>
                <div ref="statsChartRef" class="h-72"></div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">分区</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管道</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">检查井</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">雨水口</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">排放口</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">监测点</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in facilityStats" :key="s.district"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-xs font-medium text-default">{{ s.district }}</td>
                            <td class="px-4 py-2.5 text-xs text-primary font-medium">{{ s.pipes.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ s.wells.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ s.rainInlets.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ s.pumps }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ s.outlets }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ s.monitors }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

    </div>
</template>
