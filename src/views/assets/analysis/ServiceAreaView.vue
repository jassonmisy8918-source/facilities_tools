<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { SquareStack, PlayCircle, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 管段服务面积 =====================
const serviceResults = ref([
    { pipe: 'PS-001234', district: '圭塘街道', area: '12.5 ha', flowCapacity: '800 L/s', loadRatio: 78, status: '正常' },
    { pipe: 'PS-002567', district: '洞井街道', area: '18.3 ha', flowCapacity: '1200 L/s', loadRatio: 92, status: '接近饱和' },
    { pipe: 'PS-003891', district: '侯家塘街道', area: '8.7 ha', flowCapacity: '600 L/s', loadRatio: 65, status: '正常' },
    { pipe: 'PS-004123', district: '雨花亭街道', area: '22.1 ha', flowCapacity: '1500 L/s', loadRatio: 105, status: '超负荷' },
    { pipe: 'PS-005456', district: '左家塘街道', area: '15.6 ha', flowCapacity: '1000 L/s', loadRatio: 45, status: '正常' },
    { pipe: 'PS-006789', district: '圭塘街道', area: '9.2 ha', flowCapacity: '700 L/s', loadRatio: 88, status: '偏高' },
])

// ===================== 图表 =====================
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            grid: { top: 30, right: 20, bottom: 30, left: 60 },
            xAxis: { type: 'category', data: serviceResults.value.map(r => r.pipe), axisLabel: { color: 'var(--text-dim)', fontSize: 10, rotate: 15 } },
            yAxis: [
                { type: 'value', name: '面积(ha)', axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { lineStyle: { color: 'var(--border-themed)', type: 'dashed' } } },
                { type: 'value', name: '负荷比(%)', axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { show: false } },
            ],
            series: [
                { name: '服务面积', type: 'bar', data: [12.5, 18.3, 8.7, 22.1, 15.6, 9.2], itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] }, barWidth: '40%' },
                {
                    name: '负荷比', type: 'line', yAxisIndex: 1,
                    data: serviceResults.value.map(r => r.loadRatio),
                    lineStyle: { width: 2, color: '#FF4757' }, symbol: 'circle', symbolSize: 6,
                    itemStyle: { color: '#FF4757' },
                },
                { type: 'line', yAxisIndex: 1, data: Array(6).fill(100), lineStyle: { color: '#FFB020', type: 'dashed', width: 1 }, symbol: 'none', name: '负荷警戒线' },
            ],
        })
        window.addEventListener('resize', () => chart?.resize())
    }
})
onUnmounted(() => { chart?.dispose(); chart = null })

function runAnalysis() { toast.value?.show('管段服务面积计算中...', 'info') }
function exportData() { toast.value?.show('数据导出中...', 'info') }
</script>

<template>
    <div class="space-y-4">
        <!-- 操作栏 -->
        <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                <SquareStack class="w-4 h-4 text-primary" />管段服务面积分析
            </h3>
            <div class="flex items-center gap-2">
                <button @click="runAnalysis"
                    class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <PlayCircle class="w-3.5 h-3.5" />重新计算
                </button>
                <button @click="exportData"
                    class="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
        </div>

        <!-- 图表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div ref="chartRef" class="h-64"></div>
            <p class="text-[10px] text-muted-themed mt-2">黄色虚线为负荷警戒线（100%），超过表示管段排水能力不足</p>
        </div>

        <!-- 结果表格 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-themed">
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管段编号</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">区域</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">服务面积</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">排水能力</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">负荷比</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in serviceResults" :key="r.pipe"
                        class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ r.pipe }}</td>
                        <td class="px-4 py-2.5 text-xs text-dim">{{ r.district }}</td>
                        <td class="px-4 py-2.5 text-xs text-default font-medium">{{ r.area }}</td>
                        <td class="px-4 py-2.5 text-xs text-dim">{{ r.flowCapacity }}</td>
                        <td class="px-4 py-2.5">
                            <div class="flex items-center gap-2">
                                <div class="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                                    <div class="h-full rounded-full"
                                        :class="r.loadRatio > 100 ? 'bg-danger' : r.loadRatio > 85 ? 'bg-warning' : 'bg-success'"
                                        :style="{ width: Math.min(r.loadRatio, 100) + '%' }"></div>
                                </div>
                                <span class="text-xs font-medium"
                                    :class="r.loadRatio > 100 ? 'text-danger' : r.loadRatio > 85 ? 'text-warning' : 'text-success'">{{
                                    r.loadRatio }}%</span>
                            </div>
                        </td>
                        <td class="px-4 py-2.5">
                            <span class="text-[10px] px-2 py-0.5 rounded-md"
                                :class="r.status === '正常' ? 'bg-success/15 text-success' : r.status === '超负荷' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'">{{
                                r.status }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
