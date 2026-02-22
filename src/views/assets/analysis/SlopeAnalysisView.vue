<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { TrendingDown, Palette, PlayCircle } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 坡度分析 =====================
const slopeChartRef = ref<HTMLElement>()
let slopeChart: echarts.ECharts | null = null

const slopeData = [3.2, 2.8, 4.1, 1.5, 3.8, 2.2, 5.0, 0.8, 3.5, 4.2, 2.1, 3.7, 1.2, 4.5, 2.9, 3.3, 0.5, 4.8, 2.6, 3.1]
const pipLabels = slopeData.map((_, i) => `P${i + 1}`)

// ===================== 坡度分级 =====================
const slopeGrades = ref([
    { grade: '极缓坡', range: '< 1‰', color: '#FF4757', count: 2, pipes: ['P8', 'P17'], desc: '坡度极低，排水能力不足' },
    { grade: '缓坡', range: '1‰ - 2‰', color: '#FFB020', count: 3, pipes: ['P4', 'P13', 'P5'], desc: '坡度偏低，需关注' },
    { grade: '标准坡', range: '2‰ - 4‰', color: '#3B82F6', count: 10, pipes: ['P1', 'P2', 'P6', 'P9', '...'], desc: '坡度合理' },
    { grade: '陡坡', range: '> 4‰', color: '#00D4AA', count: 5, pipes: ['P3', 'P7', 'P10', 'P14', 'P18'], desc: '坡度较大，排水顺畅' },
])

function runSlopeAnalysis() {
    toast.value?.show('坡度分析执行中...', 'info')
}

onMounted(() => {
    if (slopeChartRef.value) {
        slopeChart = echarts.init(slopeChartRef.value)
        slopeChart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', formatter: '{b}: {c}‰' },
            grid: { top: 30, right: 20, bottom: 30, left: 50 },
            xAxis: { type: 'category', data: pipLabels, axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, axisLine: { lineStyle: { color: 'var(--border-themed)' } } },
            yAxis: { type: 'value', name: '坡度(‰)', nameTextStyle: { color: 'var(--text-dim)', fontSize: 10 }, axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { lineStyle: { color: 'var(--border-themed)', type: 'dashed' } } },
            series: [
                {
                    type: 'bar', data: slopeData,
                    itemStyle: {
                        borderRadius: [3, 3, 0, 0],
                        color: (params: any) => params.data < 1 ? '#FF4757' : params.data < 2 ? '#FFB020' : params.data < 4 ? '#3B82F6' : '#00D4AA'
                    }
                },
                { type: 'line', data: Array(20).fill(1), lineStyle: { color: '#FF4757', type: 'dashed', width: 1 }, symbol: 'none', name: '最小坡度' },
            ],
        })
        window.addEventListener('resize', () => slopeChart?.resize())
    }
})
onUnmounted(() => { slopeChart?.dispose(); slopeChart = null })
</script>

<template>
    <div class="space-y-4">
        <!-- 坡度分析图 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                    <TrendingDown class="w-4 h-4 text-primary" />管段坡度分布
                </h3>
                <button @click="runSlopeAnalysis"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <PlayCircle class="w-3.5 h-3.5" />重新分析
                </button>
            </div>
            <div ref="slopeChartRef" class="h-64"></div>
            <p class="text-[10px] text-muted-themed mt-2">红色虚线为最小坡度标准线（1‰），低于标准的管段需重点关注</p>
        </div>

        <!-- 坡度分级渲染 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed">
                <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                    <Palette class="w-4 h-4 text-primary" />坡度分级渲染
                </h3>
            </div>
            <div class="p-3 grid grid-cols-4 gap-3">
                <div v-for="g in slopeGrades" :key="g.grade" class="p-3 rounded-lg bg-surface border border-themed/50">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: g.color }"></span>
                        <span class="text-xs font-medium text-default">{{ g.grade }}</span>
                    </div>
                    <p class="text-xs text-primary font-bold mb-1">{{ g.range }}</p>
                    <p class="text-[10px] text-muted-themed mb-2">{{ g.desc }}</p>
                    <div class="flex items-center justify-between text-[10px]">
                        <span class="text-dim">{{ g.count }} 个管段</span>
                        <div class="flex gap-0.5">
                            <span v-for="p in g.pipes.slice(0, 3)" :key="p"
                                class="px-1 py-0.5 bg-primary/10 text-primary rounded font-mono">{{ p }}</span>
                            <span v-if="g.pipes.length > 3" class="text-dim">...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
