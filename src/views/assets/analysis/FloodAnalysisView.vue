<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Droplets, SlidersHorizontal, PlayCircle, DollarSign } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 淹没分析参数 =====================
const waterLevel = ref(3.0)
const duration = ref(24)

// ===================== 淹没结果 =====================
const floodAreas = ref([
    { zone: '朝阳区低洼区', area: '2.4 km²', depth: '1.2m', population: 15600, buildings: 342 },
    { zone: '东城区河道沿线', area: '1.8 km²', depth: '0.8m', population: 8900, buildings: 186 },
    { zone: '丰台区泵站周边', area: '0.6 km²', depth: '0.5m', population: 3200, buildings: 78 },
])

// ===================== 经济损失估算 =====================
const losses = ref([
    { category: '住宅建筑', value: 4560, unit: '万元', ratio: 38 },
    { category: '商业设施', value: 3280, unit: '万元', ratio: 27 },
    { category: '道路交通', value: 1890, unit: '万元', ratio: 16 },
    { category: '市政设施', value: 1240, unit: '万元', ratio: 10 },
    { category: '其他损失', value: 1030, unit: '万元', ratio: 9 },
])
const totalLoss = ref('12,000')

// ===================== 图表 =====================
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'item', formatter: '{b}: {c}万元 ({d}%)' },
            series: [{
                type: 'pie', radius: ['40%', '70%'], center: ['50%', '50%'],
                label: { show: false },
                emphasis: { label: { show: true, fontSize: 12 } },
                data: [
                    { value: 4560, name: '住宅建筑', itemStyle: { color: '#3B82F6' } },
                    { value: 3280, name: '商业设施', itemStyle: { color: '#00D4AA' } },
                    { value: 1890, name: '道路交通', itemStyle: { color: '#FFB020' } },
                    { value: 1240, name: '市政设施', itemStyle: { color: '#8B5CF6' } },
                    { value: 1030, name: '其他', itemStyle: { color: '#6B7280' } },
                ]
            }]
        })
        window.addEventListener('resize', () => chart?.resize())
    }
})
onUnmounted(() => { chart?.dispose(); chart = null })

function runFloodAnalysis() { toast.value?.show(`淹没分析：水位 ${waterLevel.value}m，持续 ${duration.value}h`, 'info') }
</script>

<template>
    <div class="space-y-4">
        <!-- 参数 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <SlidersHorizontal class="w-4 h-4 text-primary" />
                        <span class="text-xs text-dim">模拟水位:</span>
                        <input v-model="waterLevel" type="range" min="0.5" max="5" step="0.5"
                            class="w-24 accent-primary" />
                        <span class="text-xs text-primary font-bold">{{ waterLevel }}m</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-dim">持续时间:</span>
                        <select v-model="duration"
                            class="bg-input border border-themed rounded-lg px-2 py-1 text-xs text-default focus:outline-none focus:border-primary">
                            <option :value="6">6小时</option>
                            <option :value="12">12小时</option>
                            <option :value="24">24小时</option>
                            <option :value="48">48小时</option>
                        </select>
                    </div>
                </div>
                <button @click="runFloodAnalysis"
                    class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <PlayCircle class="w-3.5 h-3.5" />开始模拟
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- 淹没区域 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Droplets class="w-4 h-4 text-primary" />淹没区域分析
                    </h3>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="fa in floodAreas" :key="fa.zone" class="p-3 rounded-lg bg-surface">
                        <p class="text-xs font-medium text-default mb-2">{{ fa.zone }}</p>
                        <div class="grid grid-cols-4 gap-2 text-[10px]">
                            <div><span class="text-dim block">面积</span><span class="text-primary font-bold">{{ fa.area
                            }}</span></div>
                            <div><span class="text-dim block">水深</span><span class="text-danger font-bold">{{ fa.depth
                            }}</span></div>
                            <div><span class="text-dim block">影响人口</span><span class="text-default font-bold">{{
                                fa.population.toLocaleString() }}</span></div>
                            <div><span class="text-dim block">建筑</span><span class="text-default font-bold">{{
                                fa.buildings }}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 经济损失估算 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                        <DollarSign class="w-4 h-4 text-warning" />经济损失估算
                    </h3>
                    <span class="text-sm font-bold text-danger">总计 {{ totalLoss }} 万元</span>
                </div>
                <div class="p-4 flex items-center gap-4">
                    <div ref="chartRef" class="w-48 h-48 shrink-0"></div>
                    <div class="flex-1 space-y-2">
                        <div v-for="l in losses" :key="l.category"
                            class="flex items-center justify-between text-xs py-1.5 border-b border-themed/30 last:border-0">
                            <span class="text-default">{{ l.category }}</span>
                            <div class="flex items-center gap-2">
                                <div class="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                                    <div class="h-full bg-primary rounded-full" :style="{ width: l.ratio + '%' }"></div>
                                </div>
                                <span class="text-default font-medium w-16 text-right">{{ l.value.toLocaleString() }}{{
                                    l.unit }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
