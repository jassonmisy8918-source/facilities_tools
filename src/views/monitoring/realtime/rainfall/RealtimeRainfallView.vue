<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Droplets, Radio, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-vue-next'

// ===================== 雨量计监测点 =====================
const gauges = ref([
    { id: 1, name: '芙蓉路雨量站', value: 3.2, unit: 'mm/h', status: 'normal', updatedAt: '14:30:05' },
    { id: 2, name: '左家塘街道雨量站', value: 8.5, unit: 'mm/h', status: 'warning', updatedAt: '14:30:02' },
    { id: 3, name: '圭塘街道雨量站', value: 1.8, unit: 'mm/h', status: 'normal', updatedAt: '14:29:58' },
    { id: 4, name: '洞井街道雨量站', value: 0.4, unit: 'mm/h', status: 'normal', updatedAt: '14:30:01' },
    { id: 5, name: '黎托街道雨量站', value: 12.6, unit: 'mm/h', status: 'danger', updatedAt: '14:30:03' },
    { id: 6, name: '侯家塘区雨量站', value: 5.3, unit: 'mm/h', status: 'warning', updatedAt: '14:29:59' },
])

const selectedGauge = ref(gauges.value[0]!)

// ===================== 降雨等级 =====================
function getRainfallLevel(v: number) {
    if (v >= 16) return { text: '暴雨', cls: 'bg-danger text-white' }
    if (v >= 8) return { text: '大雨', cls: 'bg-warning text-white' }
    if (v >= 4) return { text: '中雨', cls: 'bg-info/20 text-info' }
    if (v > 0) return { text: '小雨', cls: 'bg-success/15 text-success' }
    return { text: '无雨', cls: 'bg-surface text-dim' }
}
function getStatusColor(s: string) { return s === 'normal' ? 'text-success' : s === 'warning' ? 'text-warning' : 'text-danger' }
function getStatusBg(s: string) { return s === 'normal' ? 'bg-success/15' : s === 'warning' ? 'bg-warning/15' : 'bg-danger/15' }
function getStatusText(s: string) { return s === 'normal' ? '正常' : s === 'warning' ? '预警' : '报警' }

// ===================== 统计指标 =====================
const stats = computed(() => {
    const vals = gauges.value.map(g => g.value)
    return {
        max: Math.max(...vals).toFixed(1),
        avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1),
        online: gauges.value.length,
        warning: gauges.value.filter(g => g.status !== 'normal').length,
    }
})

// ===================== 实时趋势图 =====================
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        const hours = Array.from({ length: 12 }, (_, i) => `${(i + 3).toString().padStart(2, '0')}:00`)
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 30, right: 15, bottom: 25, left: 50 },
            xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: 'mm/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [
                { name: '芙蓉路', type: 'line', smooth: true, data: [0, 0.2, 0.8, 1.5, 2.1, 2.8, 3.0, 3.2, 3.1, 2.9, 3.0, 3.2], lineStyle: { width: 2 }, symbol: 'none' },
                { name: '左家塘街道', type: 'line', smooth: true, data: [1, 2, 3, 4.5, 5.8, 7.0, 8.0, 8.5, 8.2, 7.8, 8.0, 8.5], lineStyle: { width: 2 }, symbol: 'none' },
                { name: '黎托街道', type: 'line', smooth: true, data: [3, 4, 5.5, 7, 9, 10.5, 11.5, 12.6, 12.0, 11.5, 12.0, 12.6], lineStyle: { width: 2, color: '#EF4444' }, itemStyle: { color: '#EF4444' }, symbol: 'none' },
            ],
        })
        window.addEventListener('resize', handleResize)
    }
})
function handleResize() { chart?.resize() }
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })
</script>

<template>
    <div class="space-y-4">
        <!-- 统计指标 -->
        <div class="grid grid-cols-4 gap-3">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <Droplets class="w-5 h-5 text-primary shrink-0" />
                <div>
                    <p class="text-xs text-dim">最大降雨量</p>
                    <p class="text-lg font-bold text-default">{{ stats.max }} <span
                            class="text-xs font-normal text-dim">mm/h</span></p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <TrendingUp class="w-5 h-5 text-info shrink-0" />
                <div>
                    <p class="text-xs text-dim">平均降雨量</p>
                    <p class="text-lg font-bold text-default">{{ stats.avg }} <span
                            class="text-xs font-normal text-dim">mm/h</span></p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <Radio class="w-5 h-5 text-success shrink-0" />
                <div>
                    <p class="text-xs text-dim">在线雨量计</p>
                    <p class="text-lg font-bold text-default">{{ stats.online }} <span
                            class="text-xs font-normal text-dim">台</span></p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <AlertTriangle class="w-5 h-5 text-warning shrink-0" />
                <div>
                    <p class="text-xs text-dim">预警站点</p>
                    <p class="text-lg font-bold" :class="stats.warning > 0 ? 'text-warning' : 'text-default'">{{
                        stats.warning }} <span class="text-xs font-normal text-dim">个</span></p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <!-- 雨量计列表 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed flex flex-col overflow-hidden">
                <div class="flex items-center justify-between px-4 py-3 border-b border-themed shrink-0">
                    <div class="flex items-center gap-1.5">
                        <Radio class="w-4 h-4 text-primary" />
                        <span class="text-sm font-semibold text-default">雨量计列表</span>
                        <span class="text-xs text-muted-themed ml-1">({{ gauges.length }})</span>
                    </div>
                    <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                        <RefreshCw class="w-3.5 h-3.5 text-dim" />
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-2 space-y-1" style="max-height: 400px">
                    <button v-for="g in gauges" :key="g.id" @click="selectedGauge = g"
                        class="w-full text-left p-3 rounded-lg transition-all cursor-pointer"
                        :class="selectedGauge.id === g.id ? 'bg-primary/15 border border-primary/30' : 'bg-surface hover:bg-hover-themed border border-transparent'">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-default">{{ g.name }}</span>
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="getRainfallLevel(g.value).cls">{{ getRainfallLevel(g.value).text }}</span>
                                <span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="[getStatusBg(g.status), getStatusColor(g.status)]">{{
                                        getStatusText(g.status) }}</span>
                            </div>
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span class="text-lg font-bold text-default">{{ g.value }}</span>
                            <span class="text-[10px] text-muted-themed">{{ g.unit }}</span>
                        </div>
                        <div class="text-[10px] text-muted-themed mt-0.5">更新: {{ g.updatedAt }}</div>
                    </button>
                </div>
            </div>

            <!-- 实时趋势图 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-semibold text-default">实时降雨趋势</h4>
                    <span class="text-[10px] text-muted-themed">数据实时更新</span>
                </div>
                <div ref="chartRef" class="h-72"></div>
            </div>
        </div>
    </div>
</template>
