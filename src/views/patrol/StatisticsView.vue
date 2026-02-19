<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { BarChart3, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
function handleExport() { toast.value?.show('统计报表导出中...', 'info') }

// 统计分析 Tab —— 需求 9.1.3.4.5
const statTabs = [
  { key: 'patrol', label: '巡查统计' },
  { key: 'maintenance', label: '养护工作量' },
  { key: 'performance', label: '绩效评估' },
]
const activeTab = ref('patrol')

// 巡查统计 KPI
const patrolKPIs = ref([
  { label: '本月巡查次数', value: '286', change: '+12%', icon: BarChart3, color: '#3B82F6' },
  { label: '发现问题', value: '34', change: '-8%', icon: AlertTriangle, color: '#FFB020' },
  { label: '问题闭环率', value: '91%', change: '+5%', icon: CheckCircle, color: '#00D4AA' },
  { label: '平均处理时长', value: '4.2h', change: '-15%', icon: Clock, color: '#8B5CF6' },
])

// 养护工作量统计
const maintenanceStats = ref([
  { label: '本月工时', value: '1,248', unit: '小时' },
  { label: '养护里程', value: '85.2', unit: 'km' },
  { label: '材料费用', value: '38,000', unit: '元' },
  { label: '人工费用', value: '42,000', unit: '元' },
  { label: '设备费用', value: '20,000', unit: '元' },
  { label: '总费用', value: '100,000', unit: '元' },
])

// 绩效排名
const performanceData = ref([
  { rank: 1, name: '张伟', team: '巡查一组', tasks: 68, completion: 100, avgTime: '2.8h', issues: 12, score: 96 },
  { rank: 2, name: '李明', team: '巡查一组', tasks: 62, completion: 98, avgTime: '3.1h', issues: 10, score: 93 },
  { rank: 3, name: '王强', team: '巡查二组', tasks: 55, completion: 96, avgTime: '3.5h', issues: 8, score: 89 },
  { rank: 4, name: '赵刚', team: '巡查三组', tasks: 48, completion: 95, avgTime: '3.8h', issues: 6, score: 85 },
  { rank: 5, name: '周磊', team: '检测组', tasks: 35, completion: 100, avgTime: '4.5h', issues: 15, score: 82 },
  { rank: 6, name: '陈静', team: '巡查三组', tasks: 42, completion: 93, avgTime: '4.0h', issues: 5, score: 80 },
])

// 图表
const trendRef = ref<HTMLElement>()
const categoryRef = ref<HTMLElement>()
const maintenanceChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let categoryChart: echarts.ECharts | null = null
let maintenanceChart: echarts.ECharts | null = null

onMounted(() => {
  // 巡查月度趋势
  if (trendRef.value) {
    trendChart = echarts.init(trendRef.value)
    trendChart.setOption({
      backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 15, bottom: 25, left: 45 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: { type: 'value', axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      series: [
        { name: '巡查次数', type: 'bar', data: [220, 235, 286, 0, 0, 0, 0, 0, 0, 0, 0, 0], itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
        { name: '发现问题', type: 'bar', data: [28, 32, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0], itemStyle: { color: '#FFB020', borderRadius: [3, 3, 0, 0] } },
      ]
    })
  }
  // 问题分类饼图
  if (categoryRef.value) {
    categoryChart = echarts.init(categoryRef.value)
    categoryChart.setOption({
      backgroundColor: 'transparent', tooltip: { trigger: 'item' },
      color: ['#3B82F6', '#00D4AA', '#FFB020', '#FF4757', '#8B5CF6'],
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 },
        data: [{ value: 12, name: '结构缺陷' }, { value: 8, name: '淤积堵塞' }, { value: 6, name: '井盖缺损' }, { value: 5, name: '设施损坏' }, { value: 3, name: '其他' }]
      }]
    })
  }
  // 养护工作量趋势
  if (maintenanceChartRef.value) {
    maintenanceChart = echarts.init(maintenanceChartRef.value)
    maintenanceChart.setOption({
      backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 60, bottom: 25, left: 45 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: [
        { type: 'value', name: '工时(h)', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        { type: 'value', name: '费用(万)', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
      ],
      series: [
        { name: '工时', type: 'bar', data: [980, 1120, 1248], itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
        { name: '费用', type: 'line', yAxisIndex: 1, data: [8.5, 9.2, 10.0], lineStyle: { color: '#FF4757' }, itemStyle: { color: '#FF4757' } },
      ]
    })
  }
  window.addEventListener('resize', () => { trendChart?.resize(); categoryChart?.resize(); maintenanceChart?.resize() })
})

onUnmounted(() => { trendChart?.dispose(); categoryChart?.dispose(); maintenanceChart?.dispose() })
</script>

<template>
  <div class="space-y-4">
    <!-- Tab -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5 w-fit">
        <button v-for="tab in statTabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }}
        </button>
      </div>
      <button @click="handleExport"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
        <Download class="w-3 h-3" /> 导出报表
      </button>
    </div>

    <!-- 巡查统计 -->
    <template v-if="activeTab === 'patrol'">
      <div class="grid grid-cols-4 gap-3">
        <div v-for="kpi in patrolKPIs" :key="kpi.label"
          class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-dim">{{ kpi.label }}</span>
            <component :is="kpi.icon" class="w-4 h-4" :style="{ color: kpi.color }" />
          </div>
          <p class="text-2xl font-bold text-default">{{ kpi.value }}</p>
          <p class="text-xs mt-1" :class="kpi.change.startsWith('+') ? 'text-success' : 'text-warning'">{{ kpi.change }}
            环比</p>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2 bg-card border border-themed rounded-xl p-4 shadow-themed">
          <h4 class="text-sm font-semibold text-default mb-2">月度巡查趋势</h4>
          <div ref="trendRef" class="h-52"></div>
        </div>
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <h4 class="text-sm font-semibold text-default mb-2">问题分类</h4>
          <div ref="categoryRef" class="h-52"></div>
        </div>
      </div>
    </template>

    <!-- 养护工作量 -->
    <template v-if="activeTab === 'maintenance'">
      <div class="grid grid-cols-6 gap-3">
        <div v-for="ms in maintenanceStats" :key="ms.label"
          class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
          <p class="text-xs text-dim mb-1">{{ ms.label }}</p>
          <p class="text-xl font-bold text-default">{{ ms.value }}</p>
          <p class="text-[10px] text-muted-themed">{{ ms.unit }}</p>
        </div>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">养护工作量趋势</h4>
        <div ref="maintenanceChartRef" class="h-56"></div>
      </div>
    </template>

    <!-- 绩效评估 -->
    <template v-if="activeTab === 'performance'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">排名</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">姓名</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">班组</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">任务数</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">完成率</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">平均时长</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">发现问题</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">综合评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in performanceData" :key="p.rank"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs">
                <span class="w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-bold"
                  :class="p.rank <= 3 ? 'bg-primary/15 text-primary' : 'text-dim'">{{ p.rank }}</span>
              </td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ p.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ p.team }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ p.tasks }}</td>
              <td class="px-4 py-2.5 text-xs font-medium" :class="p.completion >= 98 ? 'text-success' : 'text-warning'">
                {{ p.completion }}%</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ p.avgTime }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ p.issues }}</td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-surface rounded-full h-1.5">
                    <div class="h-1.5 rounded-full bg-primary" :style="{ width: p.score + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold text-primary">{{ p.score }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <ToastNotify ref="toast" />
  </div>
</template>
