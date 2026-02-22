<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Factory } from 'lucide-vue-next'

const activeFunc = ref('daily')
const funcTabs = [
    { key: 'daily', label: '日处理量' },
    { key: 'bod-load', label: 'BOD负荷' },
    { key: 'bod-reduction', label: 'BOD削减量' },
    { key: 'bod-rate', label: 'BOD削减率' },
]

const plants = ref([
    { name: '第一污水处理厂', daily: 12.5, bodIn: 180, bodOut: 18, bodReduction: 162, bodRate: 90.0 },
    { name: '第二污水处理厂', daily: 8.2, bodIn: 165, bodOut: 15, bodReduction: 150, bodRate: 90.9 },
    { name: '第三污水处理厂', daily: 15.8, bodIn: 200, bodOut: 22, bodReduction: 178, bodRate: 89.0 },
    { name: '开发区处理厂', daily: 6.5, bodIn: 150, bodOut: 12, bodReduction: 138, bodRate: 92.0 },
])

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
    if (!chartRef.value) return
    chart?.dispose()
    chart = echarts.init(chartRef.value)
    const days = Array.from({ length: 15 }, (_, i) => `03-${(i + 1).toString().padStart(2, '0')}`)
    const names = plants.value.map(p => p.name)

    if (activeFunc.value === 'daily') {
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: '万m³/日', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: names.map(n => ({ name: n, type: 'line', smooth: true, data: days.map(() => +(8 + Math.random() * 10).toFixed(1)), lineStyle: { width: 2 }, symbol: 'none' })),
        })
    } else if (activeFunc.value === 'bod-rate') {
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis', formatter: '{b}<br/>{a}: {c}%' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: '%', min: 80, max: 100, nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: names.map(n => ({ name: n, type: 'line', smooth: true, data: days.map(() => +(86 + Math.random() * 8).toFixed(1)), lineStyle: { width: 2 }, symbol: 'none' })),
        })
    } else {
        chart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: 'mg/L', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: names.map(n => ({ name: n, type: 'bar', stack: 'total', data: days.map(() => +(100 + Math.random() * 100).toFixed(0)) })),
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
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Factory class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-semibold text-default">污水处理分析</h3>
            </div>
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="switchFunc(ft.key)"
                    class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
            </div>
        </div>

        <!-- 汇总表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">处理厂</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">日处理量(万m³)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">进水BOD(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">出水BOD(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">BOD削减量(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">削减率(%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in plants" :key="p.name"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ p.name }}</td>
                        <td class="text-center px-4 py-2.5 text-default font-bold">{{ p.daily }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ p.bodIn }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ p.bodOut }}</td>
                        <td class="text-center px-4 py-2.5 text-success font-bold">{{ p.bodReduction }}</td>
                        <td class="text-center px-4 py-2.5"><span class="font-bold"
                                :class="p.bodRate >= 90 ? 'text-success' : 'text-warning'">{{ p.bodRate }}%</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 图表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">{{funcTabs.find(f => f.key === activeFunc)?.label}}趋势
            </h4>
            <div ref="chartRef" class="h-64"></div>
        </div>
    </div>
</template>
