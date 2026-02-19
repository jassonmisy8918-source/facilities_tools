<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { BarChart3, Search, Download, FileText } from 'lucide-vue-next'

// 数据分析 Tab —— 需求 9.1.2.4.4
const analysisTabs = [
  { key: 'correlation', label: '关联分析' },
  { key: 'compare', label: '数据对比' },
  { key: 'report', label: '报表管理' },
]
const activeTab = ref('correlation')

// 查询面板
const selectedPoint = ref('朝阳路DN600')
const selectedTimeRange = ref('7d')
const selectedMetric = ref('flow')
const monitorPointOptions = ['朝阳路DN600', '民生路DN400', '和平路雨量站', '新华街DN800', '东湖泵站进水', '建设大道DN300']
const timeRangeOptions = [{ key: '24h', label: '24小时' }, { key: '7d', label: '7天' }, { key: '30d', label: '30天' }, { key: '90d', label: '90天' }]
const metricOptions = [{ key: 'flow', label: '流量' }, { key: 'level', label: '水位' }, { key: 'rainfall', label: '雨量' }, { key: 'quality', label: '水质' }]

// 报表数据
const reports = ref([
  { id: 'RPT-001', name: '2024年3月日处理量报表', type: '日报', createDate: '2024-03-15', creator: '系统', status: 'completed', format: 'Excel' },
  { id: 'RPT-002', name: '2024年Q1水质监测分析报告', type: '季报', createDate: '2024-03-10', creator: '张工', status: 'completed', format: 'PDF' },
  { id: 'RPT-003', name: '2024年2月BOD/COD分析', type: '月报', createDate: '2024-03-01', creator: '系统', status: 'completed', format: 'Excel' },
  { id: 'RPT-004', name: '暴雨事件应急监测报告', type: '专项', createDate: '2024-02-28', creator: '李工', status: 'completed', format: 'PDF' },
  { id: 'RPT-005', name: '2024年3月流量异常分析', type: '专项', createDate: '2024-03-14', creator: '系统', status: 'generating', format: 'Excel' },
])

// 图表
const mainChartRef = ref<HTMLElement>()
const compareChartRef = ref<HTMLElement>()
let mainChart: echarts.ECharts | null = null
let compareChart: echarts.ECharts | null = null

onMounted(() => {
  if (mainChartRef.value) {
    mainChart = echarts.init(mainChartRef.value)
    const hours = Array.from({ length: 48 }, (_, i) => `${Math.floor(i / 2).toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`)
    mainChart.setOption({
      backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 50, bottom: 25, left: 50 },
      xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 5 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: [
        { type: 'value', name: '水位(m)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        { type: 'value', name: '雨量(mm)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, inverse: true, splitLine: { show: false } },
      ],
      series: [
        { name: '水位', type: 'line', smooth: true, data: hours.map(() => (1.2 + Math.random() * 1.5).toFixed(2)), lineStyle: { color: '#3B82F6', width: 2 }, itemStyle: { color: '#3B82F6' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.2)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) } },
        { name: '雨量', type: 'bar', yAxisIndex: 1, data: hours.map(() => (Math.random() * 3).toFixed(1)), itemStyle: { color: 'rgba(0,212,170,0.6)' } },
      ]
    })
  }
  if (compareChartRef.value) {
    compareChart = echarts.init(compareChartRef.value)
    const days = Array.from({ length: 7 }, (_, i) => `03-${(9 + i).toString().padStart(2, '0')}`)
    compareChart.setOption({
      backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 15, bottom: 25, left: 50 },
      xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      series: [
        { name: '朝阳路DN600', type: 'line', smooth: true, data: [320, 335, 340, 345, 338, 342, 340], lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' } },
        { name: '民生路DN400', type: 'line', smooth: true, data: [180, 185, 192, 188, 195, 190, 187], lineStyle: { color: '#00D4AA' }, itemStyle: { color: '#00D4AA' } },
        { name: '东湖泵站进水', type: 'line', smooth: true, data: [500, 510, 518, 525, 520, 515, 518], lineStyle: { color: '#FFB020' }, itemStyle: { color: '#FFB020' } },
      ]
    })
  }
  window.addEventListener('resize', () => { mainChart?.resize(); compareChart?.resize() })
})

onUnmounted(() => { mainChart?.dispose(); compareChart?.dispose() })
</script>

<template>
  <div class="space-y-4">
    <!-- Tab -->
    <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5 w-fit">
      <button v-for="tab in analysisTabs" :key="tab.key" @click="activeTab = tab.key"
        class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
        :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
        {{ tab.label }}
      </button>
    </div>

    <!-- 查询面板（关联分析 + 对比共用） -->
    <div v-if="activeTab !== 'report'"
      class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-2 text-xs">
        <span class="text-dim">监测点:</span>
        <select v-model="selectedPoint"
          class="bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
          <option v-for="pt in monitorPointOptions" :key="pt">{{ pt }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="text-dim">时间:</span>
        <div class="flex items-center gap-0.5 bg-surface border border-themed rounded-md p-0.5">
          <button v-for="tr in timeRangeOptions" :key="tr.key" @click="selectedTimeRange = tr.key"
            class="px-2 py-1 rounded text-[10px] transition-colors cursor-pointer"
            :class="selectedTimeRange === tr.key ? 'bg-primary text-white' : 'text-dim hover:text-default'">
            {{ tr.label }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="text-dim">指标:</span>
        <select v-model="selectedMetric"
          class="bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
          <option v-for="m in metricOptions" :key="m.key" :value="m.key">{{ m.label }}</option>
        </select>
      </div>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
        <Search class="w-3 h-3" /> 查询
      </button>
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
        <Download class="w-3 h-3" /> 导出
      </button>
    </div>

    <!-- 关联分析 -->
    <template v-if="activeTab === 'correlation'">
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">水位-雨量关联分析</h4>
        <div ref="mainChartRef" class="h-64"></div>
      </div>
    </template>

    <!-- 数据对比 -->
    <template v-if="activeTab === 'compare'">
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">多点位流量对比</h4>
        <div ref="compareChartRef" class="h-64"></div>
      </div>
    </template>

    <!-- 报表管理 -->
    <template v-if="activeTab === 'report'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">报表名称</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">格式</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">创建日期</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">创建人</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in reports" :key="r.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ r.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ r.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.type }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.format }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.createDate }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.creator }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="r.status === 'completed' ? 'bg-success/15 text-success' : 'bg-info/15 text-info'">
                  {{ r.status === 'completed' ? '已生成' : '生成中' }}</span></td>
              <td class="px-4 py-2.5">
                <button class="text-xs text-primary hover:text-primary-light transition-colors cursor-pointer">
                  <Download class="w-3.5 h-3.5 inline mr-0.5" />下载
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
