<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Waves, Search, RefreshCw } from 'lucide-vue-next'

const activeFunc = ref('realtime')
const funcTabs = [{ key: 'realtime', label: '实时数据' }, { key: 'history', label: '历史数据' }, { key: 'chart', label: '图表展示' }]
const selectedStation = ref('all')
const stations = ['全部站点', '民生路DN400', '建设大道DN300', '朝阳路DN600', '通州区主干', '海淀路DN600']
const startDate = ref('2024-03-01')
const endDate = ref('2024-03-15')

const realtimeData = ref([
    { station: '民生路DN400', value: 1.85, warning: 2.0, status: 'warning', time: '14:30:05' },
    { station: '建设大道DN300', value: 2.35, warning: 2.0, status: 'danger', time: '14:30:02' },
    { station: '朝阳路DN600', value: 1.52, warning: 2.5, status: 'normal', time: '14:29:58' },
    { station: '通州区主干', value: 2.10, warning: 2.5, status: 'normal', time: '14:30:01' },
    { station: '海淀路DN600', value: 1.35, warning: 2.5, status: 'normal', time: '14:30:03' },
])

const historyData = ref([
    { date: '2024-03-15 14:00', station: '民生路DN400', value: 1.85, max: 2.10, min: 1.20, avg: 1.65 },
    { date: '2024-03-15 13:00', station: '建设大道DN300', value: 2.35, max: 2.40, min: 1.50, avg: 1.95 },
    { date: '2024-03-14 20:00', station: '朝阳路DN600', value: 1.52, max: 1.80, min: 1.10, avg: 1.40 },
    { date: '2024-03-13 22:00', station: '通州区主干', value: 2.10, max: 2.30, min: 1.40, avg: 1.85 },
])

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function initChart() {
    if (!chartRef.value || chart) return
    chart = echarts.init(chartRef.value)
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
    chart.setOption({
        backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
        legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
        grid: { top: 35, right: 15, bottom: 25, left: 50 },
        xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: [
            { type: 'value', name: '水位(m)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        ],
        series: [
            { name: '民生路', type: 'line', smooth: true, data: hours.map(() => +(1.5 + Math.random() * 0.8).toFixed(2)), lineStyle: { width: 2 }, symbol: 'none' },
            { name: '建设大道', type: 'line', smooth: true, data: hours.map(() => +(1.8 + Math.random() * 0.8).toFixed(2)), lineStyle: { width: 2, color: '#EF4444' }, itemStyle: { color: '#EF4444' }, symbol: 'none' },
            { name: '警戒线', type: 'line', data: hours.map(() => 2.0), lineStyle: { width: 1, type: 'dashed', color: '#F59E0B' }, itemStyle: { color: '#F59E0B' }, symbol: 'none' },
        ],
    })
    window.addEventListener('resize', handleResize)
}
function handleResize() { chart?.resize() }
onMounted(() => { if (activeFunc.value === 'chart') initChart() })
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })
function switchFunc(key: string) { activeFunc.value = key; if (key === 'chart') setTimeout(initChart, 50) }
</script>

<template>
    <div class="space-y-4">
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <Waves class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">水位数据查询</span>
                </div>
                <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
                    <button v-for="ft in funcTabs" :key="ft.key" @click="switchFunc(ft.key)"
                        class="px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">{{
                        ft.label }}</button>
                </div>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
                <select v-model="selectedStation"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option v-for="s in stations" :key="s" :value="s">{{ s }}</option>
                </select>
                <div class="flex items-center gap-1.5 text-xs"><input v-model="startDate" type="date"
                        class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" /><span
                        class="text-dim">至</span><input v-model="endDate" type="date"
                        class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <button
                    class="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Search class="w-3.5 h-3.5" /> 查询
                </button>
                <button class="p-1.5 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                    <RefreshCw class="w-3.5 h-3.5 text-dim" />
                </button>
            </div>
        </div>

        <div v-if="activeFunc === 'realtime'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">监测点位</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">水位(m)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">警戒值(m)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">更新时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in realtimeData" :key="d.station"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
                        <td class="text-center px-4 py-2.5 font-bold"
                            :class="d.value >= d.warning ? 'text-danger' : 'text-default'">{{ d.value }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ d.warning }}</td>
                        <td class="text-center px-4 py-2.5"><span
                                :class="d.status === 'normal' ? 'text-success' : d.status === 'warning' ? 'text-warning' : 'text-danger'">{{
                                    d.status === 'normal' ? '正常' : d.status === 'warning' ? '预警' : '超限' }}</span></td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ d.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="activeFunc === 'history'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">时间</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">点位</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">水位(m)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">最高</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">最低</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">平均</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in historyData" :key="d.date + d.station"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-dim">{{ d.date }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
                        <td class="text-center px-4 py-2.5 text-default font-bold">{{ d.value }}</td>
                        <td class="text-center px-4 py-2.5 text-danger">{{ d.max }}</td>
                        <td class="text-center px-4 py-2.5 text-success">{{ d.min }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.avg }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="activeFunc === 'chart'" class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">水位数据图表</h4>
            <div ref="chartRef" class="h-72"></div>
        </div>
    </div>
</template>
