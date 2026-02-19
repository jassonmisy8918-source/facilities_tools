<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Zap, TrendingDown, Leaf, Lightbulb, ArrowDown, ArrowUp, Droplets, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const timeRange = ref('month')
const timeRanges = [{ key: 'week', label: '本周' }, { key: 'month', label: '本月' }, { key: 'quarter', label: '本季度' }, { key: 'year', label: '本年' }]
function changeRange(k: string) { timeRange.value = k; toast.value?.show(`已切换至${timeRanges.find(r => r.key === k)?.label}`, 'info') }
function handleExport() { toast.value?.show('能耗数据导出中...', 'info') }

// 能耗 KPI
const energyKPIs = ref([
  { label: '今日用电', value: '3,248', unit: 'kWh', change: '-5.2%', trend: 'down', icon: Zap, color: '#3B82F6' },
  { label: '本月累计', value: '82,450', unit: 'kWh', change: '+2.1%', trend: 'up', icon: Zap, color: '#FFB020' },
  { label: '单位水量电耗', value: '0.42', unit: 'kWh/m³', change: '-3.8%', trend: 'down', icon: Droplets, color: '#00D4AA' },
  { label: '月碳排放', value: '56.8', unit: '吨CO₂', change: '-4.5%', trend: 'down', icon: Leaf, color: '#14B8A6' },
])

// 各泵站能耗
const stationEnergy = ref([
  { name: '朝阳路泵站', daily: 1250, monthly: 32800, unitCost: 0.38, pumpCount: 3, load: 78 },
  { name: '东湖泵站', daily: 1450, monthly: 38200, unitCost: 0.45, pumpCount: 3, load: 92 },
  { name: '和平路泵站', daily: 380, monthly: 8650, unitCost: 0.52, pumpCount: 2, load: 45 },
  { name: '民生路泵站', daily: 168, monthly: 2800, unitCost: 0.35, pumpCount: 2, load: 35 },
])

// 节能建议
const suggestions = ref([
  { id: 1, title: '东湖泵站运行优化', content: '建议在23:00-6:00低谷时段增加运行台数，利用峰谷电价差降低成本。', savings: '预计月节省 ¥3,200', priority: 'high' },
  { id: 2, title: '和平路泵站变频调速', content: '2号泵长期在低负载运行，建议加装变频器实现按需调节，降低无功损耗。', savings: '预计月节省 ¥1,800', priority: 'medium' },
  { id: 3, title: '老旧电机更换计划', content: '朝阳路泵站1号泵电机效率偏低(86%)，建议更换为高效电机(IE3级)。', savings: '预计年节省 ¥12,000', priority: 'low' },
])

// 图表
const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const pumpCompareRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let pumpCompare: echarts.ECharts | null = null

onMounted(() => {
  // 30日趋势
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const days = Array.from({ length: 30 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}日`)
    trendChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 15, bottom: 25, left: 50 },
      xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 4 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: { type: 'value', name: 'kWh', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      series: [
        { name: '日用电量', type: 'bar', data: Array.from({ length: 30 }, () => 2800 + Math.random() * 800), itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3B82F6' }, { offset: 1, color: 'rgba(59,130,246,0.2)' }]) } },
        { name: '日均基线', type: 'line', data: Array(30).fill(3200), lineStyle: { color: '#FF4757', type: 'dashed', width: 1 }, itemStyle: { color: '#FF4757' }, symbol: 'none' },
      ]
    })
  }
  // 能耗占比饼图
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item' },
      color: ['#3B82F6', '#00D4AA', '#FFB020', '#8B5CF6'],
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'],
        label: { color: '#8899AA', fontSize: 10 },
        data: [
          { value: 32800, name: '朝阳路泵站' },
          { value: 38200, name: '东湖泵站' },
          { value: 8650, name: '和平路泵站' },
          { value: 2800, name: '民生路泵站' },
        ]
      }]
    })
  }
  // 单泵电耗对比
  if (pumpCompareRef.value) {
    pumpCompare = echarts.init(pumpCompareRef.value)
    pumpCompare.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { top: 15, right: 15, bottom: 30, left: 50 },
      xAxis: { type: 'category', data: ['朝阳P1', '朝阳P2', '朝阳P3', '东湖P1', '东湖P2', '东湖P3', '和平P1', '和平P3', '民生P1'], axisLabel: { color: '#5A6B7C', fontSize: 9, rotate: 30 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: { type: 'value', name: 'kWh/h', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      series: [{ type: 'bar', data: [12.5, 11.8, 10.2, 18.5, 17.6, 16.8, 8.5, 8.2, 5.6], itemStyle: { color: (params: any) => params.value > 15 ? '#FF4757' : params.value > 10 ? '#FFB020' : '#00D4AA', borderRadius: [3, 3, 0, 0] } }]
    })
  }
  window.addEventListener('resize', () => { trendChart?.resize(); pieChart?.resize(); pumpCompare?.resize() })
})

onUnmounted(() => { trendChart?.dispose(); pieChart?.dispose(); pumpCompare?.dispose() })

function getPriorityClass(p: string) { return p === 'high' ? 'border-danger/30 bg-danger/5' : p === 'medium' ? 'border-warning/30 bg-warning/5' : 'border-themed' }
</script>

<template>
  <div class="space-y-4">
    <!-- 时间范围筛选 + 导出 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
        <button v-for="tr in timeRanges" :key="tr.key" @click="changeRange(tr.key)"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="timeRange === tr.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tr.label }}
        </button>
      </div>
      <button @click="handleExport"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
        <Download class="w-3 h-3" /> 导出报表
      </button>
    </div>

    <!-- KPI 卡片 -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="kpi in energyKPIs" :key="kpi.label" class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-dim">{{ kpi.label }}</span>
          <component :is="kpi.icon" class="w-4 h-4" :style="{ color: kpi.color }" />
        </div>
        <p class="text-2xl font-bold text-default">{{ kpi.value }}</p>
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs text-muted-themed">{{ kpi.unit }}</span>
          <span class="text-xs flex items-center gap-0.5"
            :class="kpi.trend === 'down' ? 'text-success' : 'text-danger'">
            <component :is="kpi.trend === 'down' ? ArrowDown : ArrowUp" class="w-3 h-3" />
            {{ kpi.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- 图表行：趋势 + 占比 -->
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2 bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">30日用电趋势</h4>
        <div ref="trendChartRef" class="h-48"></div>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">泵站能耗占比</h4>
        <div ref="pieChartRef" class="h-48"></div>
      </div>
    </div>

    <!-- 单泵电耗对比 + 泵站明细 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">单泵电耗对比</h4>
        <div ref="pumpCompareRef" class="h-44"></div>
      </div>
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">日耗电</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">月耗电</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">单位水量电耗</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">负载率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="st in stationEnergy" :key="st.name"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ st.name }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ st.daily.toLocaleString() }} kWh</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ st.monthly.toLocaleString() }} kWh</td>
              <td class="px-4 py-2.5 text-xs font-medium" :class="st.unitCost > 0.45 ? 'text-danger' : 'text-success'">
                {{ st.unitCost }} kWh/m³</td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-12 bg-surface rounded-full h-1.5">
                    <div class="h-1.5 rounded-full"
                      :class="st.load > 85 ? 'bg-danger' : st.load > 60 ? 'bg-primary' : 'bg-success'"
                      :style="{ width: st.load + '%' }"></div>
                  </div>
                  <span class="text-[10px] text-muted-themed">{{ st.load }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 节能建议 -->
    <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
      <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
        <Lightbulb class="w-4 h-4 text-warning" /> 节能优化建议
      </h4>
      <div class="space-y-2">
        <div v-for="s in suggestions" :key="s.id" class="p-3 rounded-lg border transition-colors"
          :class="getPriorityClass(s.priority)">
          <div class="flex items-start justify-between">
            <div>
              <h5 class="text-xs font-semibold text-default">{{ s.title }}</h5>
              <p class="text-xs text-dim mt-1">{{ s.content }}</p>
            </div>
            <span class="text-[10px] text-success font-medium whitespace-nowrap ml-4">{{ s.savings }}</span>
          </div>
        </div>
      </div>
    </div>

    <ToastNotify ref="toast" />
  </div>
</template>
