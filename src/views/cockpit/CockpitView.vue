<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { LayoutDashboard, Droplets, Gauge, AlertTriangle, CheckCircle, Activity, TrendingUp } from 'lucide-vue-next'

// 驾驶舱 KPI
const coreKPIs = ref([
    { label: '管网总长', value: '217.4', unit: 'km', icon: Activity, color: '#3B82F6', sub: '新增 12.8km' },
    { label: '日处理量', value: '12.8', unit: '万m³', icon: Droplets, color: '#00D4AA', sub: '较昨日 +3.2%' },
    { label: '泵站运行率', value: '96.5', unit: '%', icon: Gauge, color: '#8B5CF6', sub: '4座运行中' },
    { label: '今日报警', value: '3', unit: '条', icon: AlertTriangle, color: '#FFB020', sub: '已处置 2条' },
    { label: '巡查完成率', value: '92', unit: '%', icon: CheckCircle, color: '#00D4AA', sub: '286/310 任务' },
    { label: '管网健康度', value: '78.5', unit: '分', icon: TrendingUp, color: '#3B82F6', sub: '较上月 -1.2' },
])

// 图表引用
const processChartRef = ref<HTMLElement>()
const alarmChartRef = ref<HTMLElement>()
const energyChartRef = ref<HTMLElement>()
const healthChartRef = ref<HTMLElement>()
let processChart: echarts.ECharts | null = null
let alarmChart: echarts.ECharts | null = null
let energyChart: echarts.ECharts | null = null
let healthChart: echarts.ECharts | null = null

// 待办事项
const todoItems = ref([
    { id: 1, title: '圭塘河泵站2号泵维修审批', priority: 'urgent', module: '运维管理', time: '14:25' },
    { id: 2, title: '韶山路巡查计划月度审核', priority: 'high', module: '巡查管理', time: '10:00' },
    { id: 3, title: '侯家塘街道排水户许可证续期', priority: 'normal', module: '排水户管理', time: '09:15' },
    { id: 4, title: '3月数据质检报告签发', priority: 'normal', module: '数据管理', time: '昨天' },
])

onMounted(() => {
    const months = ['10月', '11月', '12月', '1月', '2月', '3月']

    // 处理量趋势
    if (processChartRef.value) {
        processChart = echarts.init(processChartRef.value)
        processChart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            grid: { top: 15, right: 10, bottom: 25, left: 40 },
            xAxis: { type: 'category', data: months, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: '万m³', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [{ type: 'bar', data: [350, 380, 365, 342, 355, 395], itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3B82F6' }, { offset: 1, color: 'rgba(59,130,246,0.2)' }]), borderRadius: [3, 3, 0, 0] } }]
        })
    }
    // 报警趋势
    if (alarmChartRef.value) {
        alarmChart = echarts.init(alarmChartRef.value)
        alarmChart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
            grid: { top: 25, right: 10, bottom: 25, left: 35 },
            xAxis: { type: 'category', data: months, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [
                { name: '预警', type: 'line', data: [45, 38, 42, 35, 28, 22], lineStyle: { color: '#FFB020' }, itemStyle: { color: '#FFB020' } },
                { name: '报警', type: 'line', data: [12, 8, 15, 10, 6, 3], lineStyle: { color: '#FF4757' }, itemStyle: { color: '#FF4757' } },
            ]
        })
    }
    // 能耗趋势
    if (energyChartRef.value) {
        energyChart = echarts.init(energyChartRef.value)
        energyChart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
            grid: { top: 15, right: 10, bottom: 25, left: 40 },
            xAxis: { type: 'category', data: months, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
            yAxis: { type: 'value', name: '万kWh', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            series: [{ type: 'line', smooth: true, data: [8.5, 8.8, 8.2, 7.9, 8.1, 8.2], lineStyle: { color: '#8B5CF6', width: 2 }, itemStyle: { color: '#8B5CF6' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(139,92,246,0.2)' }, { offset: 1, color: 'rgba(139,92,246,0)' }]) } }]
        })
    }
    // 管网健康分布
    if (healthChartRef.value) {
        healthChart = echarts.init(healthChartRef.value)
        healthChart.setOption({
            backgroundColor: 'transparent', tooltip: { trigger: 'item' },
            color: ['#00D4AA', '#3B82F6', '#FFB020', '#FF4757'],
            series: [{
                type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 },
                data: [{ value: 35, name: 'A级' }, { value: 28, name: 'B级' }, { value: 22, name: 'C级' }, { value: 15, name: 'D级' }]
            }]
        })
    }

    window.addEventListener('resize', () => { processChart?.resize(); alarmChart?.resize(); energyChart?.resize(); healthChart?.resize() })
})

onUnmounted(() => { processChart?.dispose(); alarmChart?.dispose(); energyChart?.dispose(); healthChart?.dispose() })

function getPriorityDot(p: string) { return p === 'urgent' ? 'bg-danger' : p === 'high' ? 'bg-warning' : 'bg-info' }
</script>

<template>
    <div class="space-y-4">
        <!-- KPI 卡片 -->
        <div class="grid grid-cols-6 gap-3">
            <div v-for="kpi in coreKPIs" :key="kpi.label"
                class="bg-card border border-themed rounded-xl p-3.5 shadow-themed">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] text-dim uppercase tracking-wide">{{ kpi.label }}</span>
                    <component :is="kpi.icon" class="w-3.5 h-3.5" :style="{ color: kpi.color }" />
                </div>
                <p class="text-xl font-bold text-default">{{ kpi.value }}<span
                        class="text-xs font-normal text-dim ml-0.5">{{ kpi.unit }}</span></p>
                <p class="text-[10px] text-muted-themed mt-1">{{ kpi.sub }}</p>
            </div>
        </div>

        <!-- 图表行 -->
        <div class="grid grid-cols-4 gap-3">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
                <h4 class="text-xs font-semibold text-default mb-2">处理量趋势</h4>
                <div ref="processChartRef" class="h-36"></div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
                <h4 class="text-xs font-semibold text-default mb-2">预警/报警趋势</h4>
                <div ref="alarmChartRef" class="h-36"></div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
                <h4 class="text-xs font-semibold text-default mb-2">能耗趋势</h4>
                <div ref="energyChartRef" class="h-36"></div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
                <h4 class="text-xs font-semibold text-default mb-2">管网健康分布</h4>
                <div ref="healthChartRef" class="h-36"></div>
            </div>
        </div>

        <!-- 待办事项 -->
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
            <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
                <LayoutDashboard class="w-4 h-4 text-primary" /> 待办事项
            </h4>
            <div class="space-y-2">
                <div v-for="item in todoItems" :key="item.id"
                    class="flex items-center justify-between p-2.5 rounded-lg bg-surface hover:bg-hover-themed transition-colors cursor-pointer">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full" :class="getPriorityDot(item.priority)"></div>
                        <span class="text-xs font-medium text-default">{{ item.title }}</span>
                    </div>
                    <div class="flex items-center gap-3 text-xs text-dim">
                        <span class="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">{{ item.module
                        }}</span>
                        <span>{{ item.time }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
