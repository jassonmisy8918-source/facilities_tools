<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { FlaskConical, Search, RefreshCw } from 'lucide-vue-next'

const activeFunc = ref('realtime')
const funcTabs = [{ key: 'realtime', label: '实时数据' }, { key: 'history', label: '历史数据' }, { key: 'chart', label: '图表展示' }]
const selectedStation = ref('all')
const stations = ['全部站点', '香樟路DN800', '侯家塘街道进水口', '圭塘街道排口', '左家塘街道污水厂', '黎托街道河道']
const selectedMetric = ref('cod')
const metrics = [{ key: 'cod', label: 'COD' }, { key: 'ph', label: 'pH' }, { key: 'ss', label: 'SS' }, { key: 'nh3', label: '氨氮' }]
const startDate = ref('2024-03-01')
const endDate = ref('2024-03-15')

const realtimeData = ref([
    { station: '香樟路DN800', cod: 28, ph: 7.2, ss: 35, nh3: 5.8, status: 'normal', time: '14:30' },
    { station: '侯家塘街道进水口', cod: 45, ph: 6.8, ss: 58, nh3: 12.5, status: 'warning', time: '14:30' },
    { station: '圭塘街道排口', cod: 22, ph: 7.1, ss: 30, nh3: 4.2, status: 'normal', time: '14:29' },
    { station: '左家塘街道污水厂', cod: 18, ph: 7.0, ss: 25, nh3: 3.5, status: 'normal', time: '14:30' },
    { station: '黎托街道河道', cod: 0, ph: 0, ss: 0, nh3: 0, status: 'offline', time: '—' },
])

const historyData = ref([
    { date: '2024-03-15', station: '香樟路DN800', cod: 28, ph: 7.2, ss: 35, nh3: 5.8 },
    { date: '2024-03-14', station: '侯家塘街道进水口', cod: 42, ph: 6.9, ss: 55, nh3: 11.8 },
    { date: '2024-03-13', station: '圭塘街道排口', cod: 25, ph: 7.0, ss: 32, nh3: 4.8 },
    { date: '2024-03-12', station: '左家塘街道污水厂', cod: 20, ph: 7.1, ss: 28, nh3: 3.9 },
])

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function initChart() {
    if (!chartRef.value || chart) return
    chart = echarts.init(chartRef.value)
    const days = Array.from({ length: 15 }, (_, i) => `03-${(i + 1).toString().padStart(2, '0')}`)
    chart.setOption({
        backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
        legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
        grid: { top: 35, right: 15, bottom: 25, left: 50 },
        xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: { type: 'value', name: 'mg/L', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [
            { name: 'COD', type: 'line', smooth: true, data: days.map(() => +(20 + Math.random() * 30).toFixed(1)), lineStyle: { width: 2 }, symbol: 'none' },
            { name: 'SS', type: 'line', smooth: true, data: days.map(() => +(25 + Math.random() * 35).toFixed(1)), lineStyle: { width: 2 }, symbol: 'none' },
            { name: '标准限值', type: 'line', data: days.map(() => 40), lineStyle: { width: 1, type: 'dashed', color: '#EF4444' }, itemStyle: { color: '#EF4444' }, symbol: 'none' },
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
                    <FlaskConical class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">水质数据查询</span>
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
                <select v-model="selectedMetric"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option v-for="m in metrics" :key="m.key" :value="m.key">{{ m.label }}</option>
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
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">COD(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">pH</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">SS(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">氨氮(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in realtimeData" :key="d.station"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
                        <td class="text-center px-4 py-2.5 font-bold"
                            :class="d.cod > 40 ? 'text-danger' : 'text-default'">{{ d.cod }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.ph }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.ss }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.nh3 }}</td>
                        <td class="text-center px-4 py-2.5"><span
                                :class="d.status === 'normal' ? 'text-success' : d.status === 'warning' ? 'text-warning' : d.status === 'offline' ? 'text-dim' : 'text-danger'">{{
                                    d.status === 'normal' ? '正常' : d.status === 'warning' ? '预警' : d.status === 'offline' ?
                                '离线' : '超标' }}</span></td>
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
                        <th class="text-left px-4 py-2.5 text-dim font-medium">日期</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">COD</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">pH</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">SS</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">氨氮</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in historyData" :key="d.date + d.station"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-dim">{{ d.date }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
                        <td class="text-center px-4 py-2.5 font-bold"
                            :class="d.cod > 40 ? 'text-danger' : 'text-default'">{{ d.cod }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.ph }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.ss }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.nh3 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="activeFunc === 'chart'" class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">水质指标趋势</h4>
            <div ref="chartRef" class="h-72"></div>
        </div>
    </div>
</template>
