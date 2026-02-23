<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { GitCompareArrows } from 'lucide-vue-next'

const activeFunc = ref('points')
const funcTabs = [
    { key: 'points', label: '不同点位对比' },
    { key: 'yoy', label: '同比分析' },
    { key: 'mom', label: '环比分析' },
    { key: 'custom', label: '自定义对比' },
]

const selectedMetric = ref('flow')
const selectedPoints = ref(['韶山路DN600', '圭塘河泵站进水'])
const allPoints = ['韶山路DN600', '圭塘河泵站进水', '左家塘路DN500', '劳动路DN400', '万家丽路DN300', '洞井路DN400']

// 自定义对比参数
const customDate1 = ref('2024-03-15')
const customDate2 = ref('2024-02-15')

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
    if (!chartRef.value) return
    chart?.dispose()
    chart = echarts.init(chartRef.value)

    if (activeFunc.value === 'points') {
        const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: selectedPoints.value.map((p, i) => ({
                name: p, type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 2 },
                data: hours.map(() => +(200 + i * 150 + Math.random() * 80).toFixed(0)),
            })),
        })
    } else if (activeFunc.value === 'yoy') {
        const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: months, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [
                { name: '2024年', type: 'bar', data: [280, 290, 340, 320, 350, 380, 420, 450, 410, 380, 350, 310], itemStyle: { color: '#3B82F6' } },
                { name: '2023年', type: 'bar', data: [260, 270, 310, 300, 330, 360, 400, 430, 390, 360, 330, 300], itemStyle: { color: 'rgba(59,130,246,0.3)' } },
            ],
        })
    } else if (activeFunc.value === 'mom') {
        const days = Array.from({ length: 15 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}日`)
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [
                { name: '本月', type: 'line', smooth: true, data: days.map(() => +(300 + Math.random() * 60).toFixed(0)), lineStyle: { width: 2, color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, symbol: 'none' },
                { name: '上月', type: 'line', smooth: true, data: days.map(() => +(280 + Math.random() * 60).toFixed(0)), lineStyle: { width: 2, type: 'dashed', color: '#8899AA' }, itemStyle: { color: '#8899AA' }, symbol: 'none' },
            ],
        })
    } else {
        const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [
                { name: customDate1.value, type: 'line', smooth: true, data: hours.map(() => +(300 + Math.random() * 80).toFixed(0)), lineStyle: { width: 2 }, symbol: 'none' },
                { name: customDate2.value, type: 'line', smooth: true, data: hours.map(() => +(280 + Math.random() * 80).toFixed(0)), lineStyle: { width: 2, type: 'dashed' }, symbol: 'none' },
            ],
        })
    }
    window.addEventListener('resize', handleResize)
}
function handleResize() { chart?.resize() }
function switchFunc(key: string) { activeFunc.value = key; setTimeout(renderChart, 50) }

onMounted(() => setTimeout(renderChart, 50))
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })
</script>

<template>
    <div class="space-y-4">
        <!-- 功能Tab -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <GitCompareArrows class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-semibold text-default">数据对比分析</h3>
            </div>
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="switchFunc(ft.key)"
                    class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
            </div>
        </div>

        <!-- 条件面板 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center gap-3 flex-wrap">
                <select v-model="selectedMetric"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="flow">流量</option>
                    <option value="level">水位</option>
                    <option value="rainfall">雨量</option>
                    <option value="quality">水质</option>
                </select>
                <template v-if="activeFunc === 'points'">
                    <div class="flex items-center gap-1.5">
                        <label v-for="p in allPoints" :key="p"
                            class="flex items-center gap-1 text-[11px] cursor-pointer">
                            <input type="checkbox" v-model="selectedPoints" :value="p"
                                class="accent-primary w-3 h-3" /><span class="text-default">{{ p }}</span>
                        </label>
                    </div>
                </template>
                <template v-if="activeFunc === 'custom'">
                    <div class="flex items-center gap-1.5 text-xs">
                        <span class="text-dim">期间A:</span><input v-model="customDate1" type="date"
                            class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                        <span class="text-dim">期间B:</span><input v-model="customDate2" type="date"
                            class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                </template>
                <button @click="renderChart"
                    class="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">刷新对比</button>
            </div>
        </div>

        <!-- 图表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">
                {{ activeFunc === 'points' ? '多点位对比' : activeFunc === 'yoy' ? '同比分析' : activeFunc === 'mom' ? '环比分析' :
                '自定义对比'
                }}
            </h4>
            <div ref="chartRef" class="h-72"></div>
        </div>
    </div>
</template>
