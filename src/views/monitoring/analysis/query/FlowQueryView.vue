<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Activity, Search, RefreshCw } from 'lucide-vue-next'

const activeFunc = ref('realtime')
const funcTabs = [{ key: 'realtime', label: '实时数据' }, { key: 'history', label: '历史数据' }, { key: 'chart', label: '图表展示' }]
const selectedStation = ref('all')
const stations = ['全部站点', '韶山路DN600', '圭塘河泵站进水', '左家塘路DN500', '洞井路DN400', '侯家塘街道DN300']
const startDate = ref('2024-03-01')
const endDate = ref('2024-03-15')

const realtimeData = ref([
    { station: '韶山路DN600', value: 342, unit: 'm³/h', velocity: 1.8, status: 'normal', time: '14:30:05' },
    { station: '圭塘河泵站进水', value: 518, unit: 'm³/h', velocity: 2.5, status: 'warning', time: '14:30:02' },
    { station: '左家塘路DN500', value: 267, unit: 'm³/h', velocity: 1.5, status: 'normal', time: '14:29:58' },
    { station: '洞井路DN400', value: 198, unit: 'm³/h', velocity: 1.2, status: 'normal', time: '14:30:01' },
    { station: '侯家塘街道DN300', value: 0, unit: 'm³/h', velocity: 0, status: 'danger', time: '14:30:03' },
])

const historyData = ref([
    { date: '2024-03-15 14:00', station: '韶山路DN600', value: 342, max: 380, min: 290, avg: 335 },
    { date: '2024-03-15 13:00', station: '圭塘河泵站进水', value: 518, max: 550, min: 480, avg: 510 },
    { date: '2024-03-14 20:00', station: '左家塘路DN500', value: 267, max: 300, min: 230, avg: 260 },
    { date: '2024-03-14 16:00', station: '洞井路DN400', value: 198, max: 220, min: 170, avg: 195 },
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
        yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [
            { name: '韶山路DN600', type: 'line', smooth: true, data: hours.map(() => +(300 + Math.random() * 80).toFixed(0)), lineStyle: { width: 2 }, symbol: 'none' },
            { name: '圭塘河泵站进水', type: 'line', smooth: true, data: hours.map(() => +(480 + Math.random() * 80).toFixed(0)), lineStyle: { width: 2 }, symbol: 'none' },
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
                    <Activity class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">流量数据查询</span>
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
                        <th class="text-center px-4 py-2.5 text-dim font-medium">流量(m³/h)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">流速(m/s)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">更新时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in realtimeData" :key="d.station"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
                        <td class="text-center px-4 py-2.5 text-default font-bold">{{ d.value }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.velocity }}</td>
                        <td class="text-center px-4 py-2.5"><span class="flex items-center justify-center gap-1"><span
                                    class="w-1.5 h-1.5 rounded-full"
                                    :class="d.status === 'normal' ? 'bg-success' : d.status === 'warning' ? 'bg-warning' : 'bg-danger'"></span><span
                                    :class="d.status === 'normal' ? 'text-success' : d.status === 'warning' ? 'text-warning' : 'text-danger'">{{
                                        d.status === 'normal' ? '正常' : d.status === 'warning' ? '预警' : '报警' }}</span></span>
                        </td>
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
                        <th class="text-center px-4 py-2.5 text-dim font-medium">当前(m³/h)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">最大</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">最小</th>
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
            <h4 class="text-sm font-semibold text-default mb-3">流量数据图表</h4>
            <div ref="chartRef" class="h-72"></div>
        </div>
    </div>
</template>
