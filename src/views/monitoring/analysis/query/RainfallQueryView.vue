<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Droplets, Search, RefreshCw } from 'lucide-vue-next'

const activeFunc = ref('realtime')
const funcTabs = [
  { key: 'realtime', label: '实时数据' },
  { key: 'history', label: '历史数据' },
  { key: 'chart', label: '图表展示' },
]

const selectedStation = ref('all')
const stations = ['全部站点', '芙蓉路雨量站', '左家塘街道雨量站', '圭塘街道雨量站', '洞井街道雨量站', '黎托街道雨量站', '侯家塘区雨量站']
const startDate = ref('2024-03-01')
const endDate = ref('2024-03-15')

// 实时数据
const realtimeData = ref([
  { station: '芙蓉路雨量站', value: 3.2, cumulative: 28.5, level: '小雨', status: 'normal', time: '14:30:05' },
  { station: '左家塘街道雨量站', value: 8.5, cumulative: 45.2, level: '大雨', status: 'warning', time: '14:30:02' },
  { station: '圭塘街道雨量站', value: 1.8, cumulative: 12.6, level: '小雨', status: 'normal', time: '14:29:58' },
  { station: '洞井街道雨量站', value: 0.4, cumulative: 3.8, level: '小雨', status: 'normal', time: '14:30:01' },
  { station: '黎托街道雨量站', value: 12.6, cumulative: 68.4, level: '大雨', status: 'danger', time: '14:30:03' },
  { station: '侯家塘区雨量站', value: 5.3, cumulative: 32.1, level: '中雨', status: 'warning', time: '14:29:59' },
])

// 历史数据
const historyData = ref([
  { date: '2024-03-15 14:00', station: '芙蓉路雨量站', value: 3.2, cumulative: 28.5, level: '小雨', duration: '6h' },
  { date: '2024-03-15 13:00', station: '左家塘街道雨量站', value: 8.5, cumulative: 45.2, level: '大雨', duration: '8h' },
  { date: '2024-03-14 20:00', station: '黎托街道雨量站', value: 12.6, cumulative: 68.4, level: '大雨', duration: '10h' },
  { date: '2024-03-14 16:00', station: '圭塘街道雨量站', value: 2.1, cumulative: 15.8, level: '小雨', duration: '4h' },
  { date: '2024-03-13 22:00', station: '侯家塘区雨量站', value: 5.6, cumulative: 32.1, level: '中雨', duration: '7h' },
  { date: '2024-03-12 08:00', station: '洞井街道雨量站', value: 0.8, cumulative: 5.2, level: '小雨', duration: '3h' },
])

function getLevelColor(l: string) { return l === '暴雨' ? 'text-danger' : l === '大雨' ? 'text-warning' : l === '中雨' ? 'text-info' : 'text-success' }
function getLevelBg(l: string) { return l === '暴雨' ? 'bg-danger/10' : l === '大雨' ? 'bg-warning/10' : l === '中雨' ? 'bg-info/10' : 'bg-success/10' }
function getStatusColor(s: string) { return s === 'normal' ? 'text-success' : s === 'warning' ? 'text-warning' : 'text-danger' }

// 图表
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value || chart) return
  chart = echarts.init(chartRef.value)
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
    grid: { top: 35, right: 15, bottom: 25, left: 50 },
    xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: { type: 'value', name: 'mm/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
    series: [
      { name: '柱状图(瞬时)', type: 'bar', data: hours.map(() => +(Math.random() * 8).toFixed(1)), itemStyle: { color: 'rgba(59,130,246,0.5)' } },
      { name: '折线图(累计)', type: 'line', smooth: true, data: hours.map((_, i) => +((i + 1) * 1.2 + Math.random() * 3).toFixed(1)), lineStyle: { color: '#00D4AA', width: 2 }, itemStyle: { color: '#00D4AA' }, yAxisIndex: 0 },
    ],
  })
  window.addEventListener('resize', handleResize)
}
function handleResize() { chart?.resize() }
onMounted(() => { if (activeFunc.value === 'chart') initChart() })
onUnmounted(() => { chart?.dispose(); chart = null; window.removeEventListener('resize', handleResize) })

function switchFunc(key: string) {
  activeFunc.value = key
  if (key === 'chart') setTimeout(initChart, 50)
}
</script>

<template>
  <div class="space-y-4">
    <!-- 查询条件 + 功能Tab -->
    <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Droplets class="w-4 h-4 text-primary" />
          <span class="text-sm font-semibold text-default">雨量数据查询</span>
        </div>
        <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
          <button v-for="ft in funcTabs" :key="ft.key" @click="switchFunc(ft.key)"
            class="px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
            :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">
            {{ ft.label }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <select v-model="selectedStation"
          class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
          <option v-for="s in stations" :key="s" :value="s">{{ s }}</option>
        </select>
        <div class="flex items-center gap-1.5 text-xs">
          <input v-model="startDate" type="date"
            class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
          <span class="text-dim">至</span>
          <input v-model="endDate" type="date"
            class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
        </div>
        <button
          class="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
          <Search class="w-3.5 h-3.5" /> 查询
        </button>
        <button class="p-1.5 rounded hover:bg-hover-themed transition-colors cursor-pointer">
          <RefreshCw class="w-3.5 h-3.5 text-dim" />
        </button>
      </div>
    </div>

    <!-- 实时数据 -->
    <div v-if="activeFunc === 'realtime'" class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b border-themed bg-surface/50">
            <th class="text-left px-4 py-2.5 text-dim font-medium">雨量站</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">瞬时雨量(mm/h)</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">累计雨量(mm)</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">降雨等级</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in realtimeData" :key="d.station"
            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
            <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
            <td class="text-center px-4 py-2.5 text-default font-bold">{{ d.value }}</td>
            <td class="text-center px-4 py-2.5 text-default">{{ d.cumulative }}</td>
            <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                :class="[getLevelColor(d.level), getLevelBg(d.level)]">{{ d.level }}</span></td>
            <td class="text-center px-4 py-2.5"><span :class="getStatusColor(d.status)">{{ d.status === 'normal' ? '正常'
              : d.status === 'warning' ? '预警' : '报警' }}</span></td>
            <td class="text-center px-4 py-2.5 text-dim">{{ d.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 历史数据 -->
    <div v-if="activeFunc === 'history'" class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b border-themed bg-surface/50">
            <th class="text-left px-4 py-2.5 text-dim font-medium">时间</th>
            <th class="text-left px-4 py-2.5 text-dim font-medium">雨量站</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">瞬时(mm/h)</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">累计(mm)</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">等级</th>
            <th class="text-center px-4 py-2.5 text-dim font-medium">持续时长</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in historyData" :key="d.date + d.station"
            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
            <td class="px-4 py-2.5 text-dim">{{ d.date }}</td>
            <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
            <td class="text-center px-4 py-2.5 text-default font-bold">{{ d.value }}</td>
            <td class="text-center px-4 py-2.5 text-default">{{ d.cumulative }}</td>
            <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                :class="[getLevelColor(d.level), getLevelBg(d.level)]">{{ d.level }}</span></td>
            <td class="text-center px-4 py-2.5 text-dim">{{ d.duration }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 图表 -->
    <div v-if="activeFunc === 'chart'" class="bg-card border border-themed rounded-xl shadow-themed p-4">
      <h4 class="text-sm font-semibold text-default mb-3">雨量数据图表</h4>
      <div ref="chartRef" class="h-72"></div>
    </div>
  </div>
</template>
