<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { BarChart3, AlertTriangle } from 'lucide-vue-next'

const activeFunc = ref('extremes')
const funcTabs = [
    { key: 'extremes', label: '极值统计' },
    { key: 'average', label: '平均值' },
    { key: 'median', label: '中位数' },
    { key: 'trend', label: '趋势分析' },
    { key: 'correlation', label: '相关性分析' },
    { key: 'anomaly', label: '异常识别' },
]

const selectedMetric = ref('flow')
const timeRange = ref('30d')

// 极值统计
const extremes = ref([
    { station: '韶山路DN600', metric: '流量', max: 380, maxTime: '2024-03-12 15:30', min: 210, minTime: '2024-03-03 04:00', range: 170 },
    { station: '圭塘河泵站进水', metric: '流量', max: 560, maxTime: '2024-03-10 14:00', min: 420, minTime: '2024-03-07 03:00', range: 140 },
    { station: '劳动路DN400', metric: '水位', max: 2.15, maxTime: '2024-03-12 16:00', min: 0.85, minTime: '2024-03-01 05:00', range: 1.30 },
    { station: '万家丽路DN300', metric: '水位', max: 2.45, maxTime: '2024-03-15 12:45', min: 1.10, minTime: '2024-03-02 06:00', range: 1.35 },
])

// 统计结果
const statsResults = ref([
    { station: '韶山路DN600', avg: 335.2, median: 338.0, stdDev: 28.5, samples: 720 },
    { station: '圭塘河泵站进水', avg: 510.8, median: 515.0, stdDev: 22.3, samples: 720 },
    { station: '劳动路DN400', avg: 1.62, median: 1.65, stdDev: 0.25, samples: 720 },
    { station: '万家丽路DN300', avg: 1.95, median: 1.90, stdDev: 0.35, samples: 720 },
])

// 异常数据
const anomalies = ref([
    { id: 'AN001', station: '圭塘河泵站进水', metric: '流量', value: 560, threshold: '500m³/h', time: '2024-03-10 14:00', type: '突增异常', confidence: 95, severity: 'high' },
    { id: 'AN002', station: '万家丽路DN300', metric: '水位', value: 2.45, threshold: '2.0m', time: '2024-03-15 12:45', type: '超阈值', confidence: 100, severity: 'high' },
    { id: 'AN003', station: '侯家塘街道进水口', metric: 'COD', value: 52, threshold: '40mg/L', time: '2024-03-14 22:00', type: '超标', confidence: 100, severity: 'medium' },
    { id: 'AN004', station: '韶山路DN600', metric: '流量', value: 210, threshold: '均值±2σ', time: '2024-03-03 04:00', type: '偏低异常', confidence: 88, severity: 'low' },
])

function getSeverityColor(s: string) { return s === 'high' ? 'text-danger' : s === 'medium' ? 'text-warning' : 'text-info' }
function getSeverityBg(s: string) { return s === 'high' ? 'bg-danger/10' : s === 'medium' ? 'bg-warning/10' : 'bg-info/10' }
function getSeverityText(s: string) { return s === 'high' ? '高' : s === 'medium' ? '中' : '低' }

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
    if (!chartRef.value) return
    chart?.dispose()
    chart = echarts.init(chartRef.value)
    if (activeFunc.value === 'trend') {
        const days = Array.from({ length: 30 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}日`)
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [
                { name: '实际值', type: 'line', smooth: true, data: days.map((_, i) => +(300 + i * 1.5 + Math.random() * 40).toFixed(0)), lineStyle: { width: 2 }, symbol: 'none' },
                { name: '趋势线', type: 'line', data: days.map((_, i) => +(310 + i * 1.5).toFixed(0)), lineStyle: { width: 1, type: 'dashed', color: '#F59E0B' }, itemStyle: { color: '#F59E0B' }, symbol: 'none' },
            ],
        })
    } else if (activeFunc.value === 'correlation') {
        const data = Array.from({ length: 50 }, () => [+(Math.random() * 10).toFixed(1), +(200 + Math.random() * 300).toFixed(0)])
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'item', formatter: '雨量: {c0} mm/h<br/>流量: {c1} m³/h' },
            grid: { top: 15, right: 15, bottom: 30, left: 50 },
            xAxis: { type: 'value', name: '雨量(mm/h)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            yAxis: { type: 'value', name: '流量(m³/h)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [{ type: 'scatter', data, itemStyle: { color: 'rgba(59,130,246,0.6)' }, symbolSize: 8 }],
        })
    }
    window.addEventListener('resize', handleResize)
}
function handleResize() { chart?.resize() }
function switchFunc(key: string) {
    activeFunc.value = key
    if (key === 'trend' || key === 'correlation') setTimeout(renderChart, 50)
}

onMounted(() => { if (activeFunc.value === 'trend' || activeFunc.value === 'correlation') setTimeout(renderChart, 50) })
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <BarChart3 class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-semibold text-default">数据深度分析</h3>
            </div>
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="switchFunc(ft.key)"
                    class="px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                        ft.label }}</button>
            </div>
        </div>

        <!-- 条件 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-3 flex items-center gap-3">
            <select v-model="selectedMetric"
                class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                <option value="flow">流量</option>
                <option value="level">水位</option>
                <option value="rainfall">雨量</option>
                <option value="quality">水质</option>
            </select>
            <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
                <button
                    v-for="t in [{ key: '7d', label: '7天' }, { key: '30d', label: '30天' }, { key: '90d', label: '90天' }]"
                    :key="t.key" @click="timeRange = t.key"
                    class="px-2 py-1 rounded text-[10px] transition-colors cursor-pointer"
                    :class="timeRange === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">{{ t.label
                    }}</button>
            </div>
        </div>

        <!-- 极值 -->
        <div v-if="activeFunc === 'extremes'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">最大值</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">出现时间</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">最小值</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">出现时间</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">极差</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="e in extremes" :key="e.station"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ e.station }}</td>
                        <td class="text-center px-4 py-2.5 text-danger font-bold">{{ e.max }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ e.maxTime }}</td>
                        <td class="text-center px-4 py-2.5 text-success font-bold">{{ e.min }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ e.minTime }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ e.range }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 均值/中位数 -->
        <div v-if="activeFunc === 'average' || activeFunc === 'median'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">平均值</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">中位数</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">标准差</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">样本数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="s in statsResults" :key="s.station"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ s.station }}</td>
                        <td class="text-center px-4 py-2.5 text-default font-bold">{{ s.avg }}</td>
                        <td class="text-center px-4 py-2.5 text-default font-bold">{{ s.median }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ s.stdDev }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ s.samples }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 趋势/相关性图表 -->
        <div v-if="activeFunc === 'trend' || activeFunc === 'correlation'"
            class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">{{ activeFunc === 'trend' ? '数据趋势分析' : '数据相关性分析（散点图）' }}
            </h4>
            <div ref="chartRef" class="h-72"></div>
        </div>

        <!-- 异常识别 -->
        <div v-if="activeFunc === 'anomaly'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                <AlertTriangle class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">异常数据识别结果</span>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">指标</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">异常值</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">阈值</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">置信度</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">严重度</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in anomalies" :key="a.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ a.station }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ a.metric }}</td>
                        <td class="text-center px-4 py-2.5 text-danger font-bold">{{ a.value }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ a.threshold }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ a.type }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ a.confidence }}%</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="[getSeverityColor(a.severity), getSeverityBg(a.severity)]">{{
                                    getSeverityText(a.severity) }}</span></td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ a.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
