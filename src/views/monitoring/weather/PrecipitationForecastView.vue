<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { CloudRain, Clock, MapPin, TrendingUp } from 'lucide-vue-next'

// ===================== 降水量分布 =====================
const areas = ref([
    { name: '朝阳区', current: 2.4, predicted: 8.6, level: '中雨', risk: 'medium' },
    { name: '海淀区', current: 1.8, predicted: 5.2, level: '小雨', risk: 'low' },
    { name: '东城区', current: 3.1, predicted: 12.4, level: '大雨', risk: 'high' },
    { name: '西城区', current: 2.0, predicted: 6.8, level: '中雨', risk: 'medium' },
    { name: '丰台区', current: 1.2, predicted: 4.5, level: '小雨', risk: 'low' },
    { name: '通州区', current: 4.5, predicted: 15.2, level: '大雨', risk: 'high' },
])

const riskColor: Record<string, string> = {
    low: 'text-success', medium: 'text-warning', high: 'text-danger',
}
const riskLabel: Record<string, string> = {
    low: '低风险', medium: '中风险', high: '高风险',
}

// ===================== 24h 降水趋势图 =====================
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
const hourlyRain = hours.map((_, i) => +(Math.max(0, 3 * Math.sin((i - 8) * Math.PI / 10) + Math.random() * 1.5)).toFixed(1))
const cumulativeRain = hourlyRain.reduce<number[]>((acc, v) => { acc.push(+(acc.length ? (acc[acc.length - 1] ?? 0) + v : v).toFixed(1)); return acc }, [])

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 50, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 2 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: [
                { type: 'value', name: '小时雨量(mm)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
                { type: 'value', name: '累计(mm)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
            ],
            series: [
                { name: '预测雨量', type: 'bar', data: hourlyRain, itemStyle: { color: 'rgba(59,130,246,0.7)', borderRadius: [3, 3, 0, 0] } },
                { name: '累计雨量', type: 'line', yAxisIndex: 1, data: cumulativeRain, lineStyle: { color: '#00D4AA', width: 2 }, itemStyle: { color: '#00D4AA' }, symbol: 'none', smooth: true },
            ],
        })
        window.addEventListener('resize', handleResize)
    }
})

function handleResize() { chart?.resize() }
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })

// ===================== 统计指标 =====================
const stats = ref({
    maxHourly: 4.8, totalPredicted: cumulativeRain[cumulativeRain.length - 1],
    peakHour: '14:00 - 16:00', alertLevel: '蓝色预警',
})
</script>

<template>
    <div class="space-y-4">
        <!-- 统计概览 -->
        <div class="grid grid-cols-4 gap-3">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <CloudRain class="w-5 h-5 text-primary shrink-0" />
                <div>
                    <p class="text-xs text-dim">预测总降水量</p>
                    <p class="text-lg font-bold text-default">{{ stats.totalPredicted }} <span
                            class="text-xs font-normal text-dim">mm</span></p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <TrendingUp class="w-5 h-5 text-warning shrink-0" />
                <div>
                    <p class="text-xs text-dim">最大小时雨量</p>
                    <p class="text-lg font-bold text-default">{{ stats.maxHourly }} <span
                            class="text-xs font-normal text-dim">mm/h</span></p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <Clock class="w-5 h-5 text-info shrink-0" />
                <div>
                    <p class="text-xs text-dim">降水峰值时段</p>
                    <p class="text-sm font-bold text-default">{{ stats.peakHour }}</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-info/20 flex items-center justify-center">
                    <span class="text-[10px] font-bold text-info">!</span>
                </div>
                <div>
                    <p class="text-xs text-dim">预警等级</p>
                    <p class="text-sm font-bold text-info">{{ stats.alertLevel }}</p>
                </div>
            </div>
        </div>

        <!-- 24h 降水趋势 -->
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
            <h4 class="text-sm font-semibold text-default mb-2">未来24小时降水量预测</h4>
            <div ref="chartRef" class="h-56"></div>
        </div>

        <!-- 区域降水分布 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed">
                <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                    <MapPin class="w-4 h-4 text-primary" /> 管理区域降水量分布预测
                </h4>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">当前降水(mm)</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">预测24h降水(mm)</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">降水等级</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">风险等级</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in areas" :key="a.name"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ a.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ a.current }}</td>
                            <td class="text-center px-4 py-2.5 font-bold"
                                :class="a.predicted > 10 ? 'text-danger' : a.predicted > 5 ? 'text-warning' : 'text-default'">
                                {{ a.predicted }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ a.level }}</td>
                            <td class="text-center px-4 py-2.5 font-medium" :class="riskColor[a.risk]">{{
                                riskLabel[a.risk] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
