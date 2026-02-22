<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { BarChart3, Droplets, TrendingDown, TrendingUp } from 'lucide-vue-next'

// ===================== 等级定义 =====================
const levels = [
    { name: '小雨', range: '0.1~3.9 mm/h', color: '#22C55E', count: 8, ratio: 40 },
    { name: '中雨', range: '4.0~7.9 mm/h', color: '#3B82F6', count: 5, ratio: 25 },
    { name: '大雨', range: '8.0~15.9 mm/h', color: '#F59E0B', count: 4, ratio: 20 },
    { name: '暴雨', range: '≥16.0 mm/h', color: '#EF4444', count: 2, ratio: 10 },
    { name: '无雨', range: '0 mm/h', color: '#6B7280', count: 1, ratio: 5 },
]

// ===================== 各站点降雨强度 =====================
const stations = ref([
    { name: '和平路雨量站', value: 3.2, level: '小雨', trend: 'up' },
    { name: '丰台区雨量站', value: 8.5, level: '大雨', trend: 'up' },
    { name: '朝阳区雨量站', value: 1.8, level: '小雨', trend: 'down' },
    { name: '海淀区雨量站', value: 0.4, level: '小雨', trend: 'stable' },
    { name: '通州区雨量站', value: 12.6, level: '大雨', trend: 'up' },
    { name: '大兴区雨量站', value: 5.3, level: '中雨', trend: 'down' },
])

function getLevelColor(level: string) {
    return level === '暴雨' ? 'text-danger' : level === '大雨' ? 'text-warning' : level === '中雨' ? 'text-info' : level === '小雨' ? 'text-success' : 'text-dim'
}

// ===================== 等级分布饼图 =====================
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'item', formatter: '{b}: {c}个 ({d}%)' },
            series: [{
                type: 'pie', radius: ['45%', '75%'], center: ['50%', '50%'],
                label: { show: true, color: '#8899AA', fontSize: 11, formatter: '{b}\n{d}%' },
                data: levels.map(l => ({ value: l.count, name: l.name, itemStyle: { color: l.color } })),
            }],
        })
        window.addEventListener('resize', handleResize)
    }
})
function handleResize() { chart?.resize() }
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })
</script>

<template>
    <div class="space-y-4">
        <!-- 等级定义 -->
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
            <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
                <BarChart3 class="w-4 h-4 text-primary" /> 降雨强度等级标准
            </h4>
            <div class="grid grid-cols-5 gap-3">
                <div v-for="l in levels" :key="l.name" class="p-3 rounded-lg bg-surface text-center">
                    <div class="w-3 h-3 rounded-full mx-auto mb-2" :style="{ backgroundColor: l.color }"></div>
                    <p class="text-xs font-bold text-default">{{ l.name }}</p>
                    <p class="text-[10px] text-dim mt-0.5">{{ l.range }}</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- 等级分布 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h4 class="text-sm font-semibold text-default mb-2">当前降雨强度分布</h4>
                <div ref="chartRef" class="h-56"></div>
                <div class="space-y-1.5 mt-3">
                    <div v-for="l in levels" :key="l.name" class="flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2">
                            <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: l.color }"></div>
                            <span class="text-default">{{ l.name }}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-dim">{{ l.count }}个站点</span>
                            <div class="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full"
                                    :style="{ width: l.ratio + '%', backgroundColor: l.color }"></div>
                            </div>
                            <span class="text-default font-medium w-8 text-right">{{ l.ratio }}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 各站点分析 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Droplets class="w-4 h-4 text-primary" /> 各站点降雨强度判定
                    </h4>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="s in stations" :key="s.name"
                        class="p-3 rounded-lg bg-surface flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-default">{{ s.name }}</p>
                            <div class="flex items-baseline gap-1 mt-1">
                                <span class="text-lg font-bold text-default">{{ s.value }}</span>
                                <span class="text-[10px] text-dim">mm/h</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-bold px-2 py-0.5 rounded" :class="getLevelColor(s.level)">{{
                                s.level }}</span>
                            <div class="flex items-center justify-end gap-1 mt-1.5">
                                <component :is="s.trend === 'up' ? TrendingUp : TrendingDown" class="w-3 h-3"
                                    :class="s.trend === 'up' ? 'text-danger' : s.trend === 'down' ? 'text-success' : 'text-dim'" />
                                <span class="text-[10px]"
                                    :class="s.trend === 'up' ? 'text-danger' : s.trend === 'down' ? 'text-success' : 'text-dim'">
                                    {{ s.trend === 'up' ? '增强' : s.trend === 'down' ? '减弱' : '稳定' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
