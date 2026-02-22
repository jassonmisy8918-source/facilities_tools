<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Clock } from 'lucide-vue-next'

const selectedMetric = ref('flow')
const timeRange = ref('1y')
const timeRanges = [{ key: '6m', label: '半年' }, { key: '1y', label: '1年' }, { key: '3y', label: '3年' }, { key: '5y', label: '5年' }]

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
    if (!chartRef.value) return
    chart?.dispose()
    chart = echarts.init(chartRef.value)
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    chart.setOption({
        backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
        legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
        grid: { top: 35, right: 15, bottom: 25, left: 50 },
        xAxis: { type: 'category', data: months, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [
            { name: '2024年', type: 'line', smooth: true, data: [280, 290, 340, 320, 350, 380, 420, 450, 410, 380, 350, 0], lineStyle: { width: 2, color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, symbol: 'none' },
            { name: '2023年', type: 'line', smooth: true, data: [260, 270, 310, 300, 330, 360, 400, 430, 390, 360, 330, 300], lineStyle: { width: 2, color: '#00D4AA' }, itemStyle: { color: '#00D4AA' }, symbol: 'none' },
            { name: '2022年', type: 'line', smooth: true, data: [240, 250, 290, 280, 310, 340, 380, 410, 370, 340, 310, 280], lineStyle: { width: 2, type: 'dashed', color: '#8899AA' }, itemStyle: { color: '#8899AA' }, symbol: 'none' },
        ],
    })
    window.addEventListener('resize', handleResize)
}
function handleResize() { chart?.resize() }
onMounted(() => setTimeout(renderChart, 50))
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })

// 规律总结
const patterns = ref([
    { title: '季节性规律', desc: '流量呈明显季节性波动，6-9月汛期流量较旱季高30-50%' },
    { title: '年度增长趋势', desc: '近3年平均流量逐年增长约5%，与城市化进程和管网扩建一致' },
    { title: '极端天气影响', desc: '暴雨事件期间峰值流量可达日常的2-3倍，水位超警概率显著增加' },
    { title: '水质改善趋势', desc: 'COD年均值逐年下降约8%，污水处理效果持续改善' },
])
</script>

<template>
    <div class="space-y-4">
        <!-- 条件 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-4">
            <Clock class="w-4 h-4 text-primary" />
            <span class="text-sm font-semibold text-default">历史数据分析</span>
            <select v-model="selectedMetric" @change="renderChart()"
                class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                <option value="flow">流量</option>
                <option value="level">水位</option>
                <option value="rainfall">雨量</option>
                <option value="quality">水质</option>
            </select>
            <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
                <button v-for="t in timeRanges" :key="t.key" @click="timeRange = t.key; renderChart()"
                    class="px-2 py-1 rounded text-[10px] transition-colors cursor-pointer"
                    :class="timeRange === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">{{ t.label
                    }}</button>
            </div>
        </div>

        <!-- 图表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">多年度数据对比</h4>
            <div ref="chartRef" class="h-72"></div>
        </div>

        <!-- 规律总结 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">运行规律总结</h4>
            <div class="grid grid-cols-2 gap-3">
                <div v-for="p in patterns" :key="p.title" class="p-3 rounded-lg bg-surface">
                    <p class="text-xs font-bold text-default mb-1">{{ p.title }}</p>
                    <p class="text-[11px] text-dim">{{ p.desc }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
