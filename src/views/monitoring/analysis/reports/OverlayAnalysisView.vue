<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Layers } from 'lucide-vue-next'

const layer1 = ref('rainfall')
const layer2 = ref('flow')
const layers = [{ key: 'rainfall', label: '雨量' }, { key: 'flow', label: '流量' }, { key: 'level', label: '水位' }, { key: 'quality', label: '水质' }, { key: 'alarm', label: '预警' }]

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
    if (!chartRef.value) return
    chart?.dispose()
    chart = echarts.init(chartRef.value)
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
    chart.setOption({
        backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
        legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
        grid: { top: 35, right: 50, bottom: 25, left: 50 },
        xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: [
            { type: 'value', name: layer1.value === 'rainfall' ? 'mm/h' : layer1.value === 'flow' ? 'm³/h' : layer1.value === 'level' ? 'm' : 'mg/L', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            { type: 'value', name: layer2.value === 'rainfall' ? 'mm/h' : layer2.value === 'flow' ? 'm³/h' : layer2.value === 'level' ? 'm' : 'mg/L', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
        ],
        series: [
            { name: layers.find(l => l.key === layer1.value)?.label, type: layer1.value === 'rainfall' ? 'bar' : 'line', smooth: true, data: hours.map(() => +(Math.random() * 10).toFixed(1)), yAxisIndex: 0, itemStyle: { color: 'rgba(59,130,246,0.5)' }, lineStyle: { color: '#3B82F6', width: 2 }, symbol: 'none' },
            { name: layers.find(l => l.key === layer2.value)?.label, type: 'line', smooth: true, data: hours.map(() => +(200 + Math.random() * 200).toFixed(0)), yAxisIndex: 1, lineStyle: { color: '#00D4AA', width: 2 }, itemStyle: { color: '#00D4AA' }, symbol: 'none' },
        ],
    })
    window.addEventListener('resize', handleResize)
}
function handleResize() { chart?.resize() }
onMounted(() => setTimeout(renderChart, 50))
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })

// 分析结论
const conclusions = ref([
    { title: '雨量-流量正相关', desc: '雨量增大时流量同步上升，时滞约30-60分钟，相关系数 r=0.85' },
    { title: '降雨高峰期水位超限', desc: '日降雨量>50mm时，3个测点水位超警戒值概率>60%' },
    { title: '水质季节性波动', desc: '雨季COD均值较旱季升高约35%，SS指标波动更为显著' },
])
</script>

<template>
    <div class="space-y-4">
        <!-- 叠加配置 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center gap-4 flex-wrap">
                <div class="flex items-center gap-2">
                    <Layers class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">信息叠加配置</span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-dim">图层A:</span>
                    <select v-model="layer1" @change="renderChart()"
                        class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                        <option v-for="l in layers" :key="l.key" :value="l.key">{{ l.label }}</option>
                    </select>
                </div>
                <div class="flex items-center gap-2 text-xs">
                    <span class="text-dim">图层B:</span>
                    <select v-model="layer2" @change="renderChart()"
                        class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                        <option v-for="l in layers" :key="l.key" :value="l.key">{{ l.label }}</option>
                    </select>
                </div>
                <button @click="renderChart"
                    class="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">叠加分析</button>
            </div>
        </div>

        <!-- 叠加图表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">叠加分析图表</h4>
            <div ref="chartRef" class="h-72"></div>
        </div>

        <!-- 分析结论 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">叠加分析结论</h4>
            <div class="space-y-2">
                <div v-for="c in conclusions" :key="c.title" class="p-3 rounded-lg bg-surface">
                    <p class="text-xs font-bold text-default">{{ c.title }}</p>
                    <p class="text-[11px] text-dim mt-1">{{ c.desc }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
