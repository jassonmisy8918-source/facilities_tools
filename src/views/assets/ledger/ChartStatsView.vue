<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import {
  BarChart3, PieChart, TrendingUp, MousePointerClick, Link2, Layers,
  SlidersHorizontal, Download, RefreshCw
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 维度控制 =====================
const dimensionOptions = {
  district: ['全部', '圭塘街道', '洞井街道', '侯家塘街道', '雨花亭街道', '左家塘街道'],
  period: ['近7天', '近30天', '近90天', '近1年', '近3年'],
  type: ['全部类型', '排水管网', '检查井', '雨水口', '泵站', '排放口', '监测设备'],
}
const selectedDistrict = ref('全部')
const selectedPeriod = ref('近1年')
const selectedType = ref('全部类型')

// ===================== 自定义指标 =====================
const customMetrics = ref([
  { key: 'facilityCount', label: '设施数量', active: true },
  { key: 'defectRate', label: '缺陷率', active: true },
  { key: 'coverage', label: '覆盖率', active: false },
  { key: 'utilization', label: '利用率', active: false },
  { key: 'maintenance', label: '维护频次', active: true },
  { key: 'compliance', label: '达标率', active: false },
])
const showMetricPanel = ref(false)

// ===================== 统计概览 =====================
const statCards = ref([
  { label: '设施总数', value: '23,847', change: '+2.3%', positive: true },
  { label: '正常运行', value: '22,156', change: '+1.8%', positive: true },
  { label: '缺陷数量', value: '1,247', change: '-5.2%', positive: true },
  { label: '维修完成率', value: '94.6%', change: '+3.1%', positive: true },
])

// ===================== ECharts 图表 =====================
const barChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const lineChartRef = ref<HTMLElement>()
const multiChartRef = ref<HTMLElement>()
let barChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let lineChart: echarts.ECharts | null = null
let multiChart: echarts.ECharts | null = null

// 高亮的类型（图表交互筛选）
const highlightedType = ref('')

const baseTextStyle = { color: 'var(--text-dim)', fontSize: 10 }
const splitLineStyle = { lineStyle: { color: 'var(--border-themed)', type: 'dashed' as const } }

function initBarChart() {
  if (!barChartRef.value) return
  barChart = echarts.init(barChartRef.value)
  const types = ['排水管网', '检查井', '雨水口', '泵站', '排放口', '监测设备', '闸门', '阀门']
  const values = [12456, 8234, 6120, 18, 89, 156, 24, 35]
  barChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 30, right: 20, bottom: 40, left: 60 },
    xAxis: { type: 'category', data: types, axisLabel: { ...baseTextStyle, rotate: 20 }, axisLine: { lineStyle: { color: 'var(--border-themed)' } } },
    yAxis: { type: 'value', axisLabel: baseTextStyle, splitLine: splitLineStyle },
    series: [{
      type: 'bar', data: values, barWidth: '50%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3B82F6' }, { offset: 1, color: '#1D4ED8' }
        ])
      },
      emphasis: { itemStyle: { color: '#60A5FA' } }
    }],
  })
  barChart.on('click', (params: any) => {
    highlightedType.value = params.name
    toast.value?.show(`已筛选：${params.name}，共 ${params.value} 条`, 'info')
  })
}

function initPieChart() {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { ...baseTextStyle, fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['35%', '50%'],
      avoidLabelOverlap: true,
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold' } },
      data: [
        { value: 12456, name: '排水管网', itemStyle: { color: '#3B82F6' } },
        { value: 8234, name: '检查井', itemStyle: { color: '#00D4AA' } },
        { value: 6120, name: '雨水口', itemStyle: { color: '#FFB020' } },
        { value: 156, name: '监测设备', itemStyle: { color: '#8B5CF6' } },
        { value: 89, name: '排放口', itemStyle: { color: '#F97316' } },
        { value: 95, name: '其他', itemStyle: { color: '#6B7280' } },
      ],
    }],
  })
  pieChart.on('click', (params: any) => {
    highlightedType.value = params.name
    toast.value?.show(`已筛选：${params.name}`, 'info')
  })
}

function initLineChart() {
  if (!lineChartRef.value) return
  lineChart = echarts.init(lineChartRef.value)
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  lineChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增设施', '维修完成', '缺陷发现'], textStyle: baseTextStyle, top: 0, itemWidth: 12, itemHeight: 3 },
    grid: { top: 35, right: 20, bottom: 30, left: 50 },
    xAxis: { type: 'category', data: months, axisLabel: baseTextStyle, axisLine: { lineStyle: { color: 'var(--border-themed)' } } },
    yAxis: { type: 'value', axisLabel: baseTextStyle, splitLine: splitLineStyle },
    series: [
      {
        name: '新增设施', type: 'line', smooth: true,
        data: [120, 95, 140, 160, 180, 200, 175, 190, 220, 240, 210, 250],
        lineStyle: { width: 2, color: '#3B82F6' }, symbol: 'circle', symbolSize: 4,
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.2)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) },
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: '维修完成', type: 'line', smooth: true,
        data: [80, 70, 90, 110, 130, 150, 140, 155, 170, 180, 165, 190],
        lineStyle: { width: 2, color: '#00D4AA' }, symbol: 'circle', symbolSize: 4,
        itemStyle: { color: '#00D4AA' }
      },
      {
        name: '缺陷发现', type: 'line', smooth: true,
        data: [45, 55, 40, 60, 50, 70, 65, 75, 55, 50, 60, 45],
        lineStyle: { width: 2, color: '#FF4757' }, symbol: 'circle', symbolSize: 4,
        itemStyle: { color: '#FF4757' }
      },
    ],
  })
}

function initMultiChart() {
  if (!multiChartRef.value) return
  multiChart = echarts.init(multiChartRef.value)
  multiChart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['圭塘街道', '洞井街道', '侯家塘街道', '雨花亭街道', '左家塘街道'], textStyle: baseTextStyle, top: 0, itemWidth: 12, itemHeight: 8 },
    grid: { top: 35, right: 20, bottom: 30, left: 50 },
    xAxis: { type: 'category', data: ['管网', '检查井', '雨水口', '泵站', '排放口', '监测设备'], axisLabel: baseTextStyle, axisLine: { lineStyle: { color: 'var(--border-themed)' } } },
    yAxis: { type: 'value', axisLabel: baseTextStyle, splitLine: splitLineStyle },
    series: [
      { name: '圭塘街道', type: 'bar', stack: 'total', data: [3200, 2100, 1500, 5, 22, 40], itemStyle: { color: '#3B82F6' } },
      { name: '洞井街道', type: 'bar', stack: 'total', data: [2800, 1900, 1300, 4, 18, 35], itemStyle: { color: '#00D4AA' } },
      { name: '侯家塘街道', type: 'bar', stack: 'total', data: [2400, 1600, 1200, 3, 15, 30], itemStyle: { color: '#FFB020' } },
      { name: '雨花亭街道', type: 'bar', stack: 'total', data: [2100, 1400, 1100, 3, 17, 28], itemStyle: { color: '#8B5CF6' } },
      { name: '左家塘街道', type: 'bar', stack: 'total', data: [1956, 1234, 1020, 3, 17, 23], itemStyle: { color: '#F97316' } },
    ],
  })
}

function resizeAll() {
  barChart?.resize(); pieChart?.resize(); lineChart?.resize(); multiChart?.resize()
}

function handleExport() { toast.value?.show('统计数据导出中，请稍候...', 'info') }
function refreshData() {
  toast.value?.show('数据已刷新', 'success')
}

watch([selectedDistrict, selectedPeriod, selectedType], () => {
  toast.value?.show(`筛选条件已更新：${selectedDistrict.value} · ${selectedPeriod.value} · ${selectedType.value}`, 'info')
})

onMounted(() => {
  nextTick(() => {
    initBarChart(); initPieChart(); initLineChart(); initMultiChart()
  })
  window.addEventListener('resize', resizeAll)
})

onUnmounted(() => {
  barChart?.dispose(); pieChart?.dispose(); lineChart?.dispose(); multiChart?.dispose()
  window.removeEventListener('resize', resizeAll)
})
</script>

<template>
  <div class="space-y-4">
    <!-- 维度控制 & 工具栏 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 flex-wrap">
          <!-- 区域 -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-dim">区域</span>
            <select v-model="selectedDistrict"
              class="bg-input border border-themed rounded-lg px-2.5 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
              <option v-for="d in dimensionOptions.district" :key="d">{{ d }}</option>
            </select>
          </div>
          <!-- 时间周期 -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-dim">周期</span>
            <div class="flex gap-0.5">
              <button v-for="p in dimensionOptions.period" :key="p" @click="selectedPeriod = p"
                class="px-2 py-1 text-[10px] rounded-md transition-colors cursor-pointer"
                :class="selectedPeriod === p ? 'bg-primary text-white' : 'text-dim hover:bg-hover-themed'">
                {{ p }}
              </button>
            </div>
          </div>
          <!-- 设施类型 -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-dim">类型</span>
            <select v-model="selectedType"
              class="bg-input border border-themed rounded-lg px-2.5 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
              <option v-for="t in dimensionOptions.type" :key="t">{{ t }}</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- 自定义指标 -->
          <div class="relative">
            <button @click="showMetricPanel = !showMetricPanel"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
              <SlidersHorizontal class="w-3.5 h-3.5" /> 指标
            </button>
            <div v-show="showMetricPanel"
              class="absolute right-0 top-9 z-10 w-48 bg-card border border-themed rounded-xl shadow-themed p-3">
              <p class="text-[10px] text-dim font-semibold mb-2">自定义统计指标</p>
              <label v-for="m in customMetrics" :key="m.key"
                class="flex items-center gap-2 py-1 cursor-pointer hover:bg-hover-themed rounded px-1 transition-colors">
                <input type="checkbox" v-model="m.active" class="w-3.5 h-3.5 accent-primary cursor-pointer" />
                <span class="text-xs text-default">{{ m.label }}</span>
              </label>
            </div>
          </div>
          <button @click="refreshData"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
            <RefreshCw class="w-3.5 h-3.5" /> 刷新
          </button>
          <button @click="handleExport"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
            <Download class="w-3.5 h-3.5" /> 导出
          </button>
        </div>
      </div>
    </div>

    <!-- 高亮筛选提示 -->
    <div v-if="highlightedType"
      class="flex items-center justify-between px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
      <div class="flex items-center gap-2">
        <MousePointerClick class="w-4 h-4 text-primary" />
        <span class="text-xs text-primary font-medium">已筛选：{{ highlightedType }}</span>
        <span class="text-[10px] text-muted-themed">点击图表元素联动筛选</span>
      </div>
      <button @click="highlightedType = ''" class="text-xs text-primary hover:underline cursor-pointer">清除筛选</button>
    </div>

    <!-- 统计概览卡片 -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="card in statCards" :key="card.label"
        class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <p class="text-xs text-dim mb-1">{{ card.label }}</p>
        <div class="flex items-end justify-between">
          <p class="text-xl font-bold text-default">{{ card.value }}</p>
          <span class="text-[10px] font-medium" :class="card.positive ? 'text-success' : 'text-danger'">{{ card.change }}</span>
        </div>
      </div>
    </div>

    <!-- 图表网格 -->
    <div class="grid grid-cols-2 gap-4">
      <!-- 柱状图 -->
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-default flex items-center gap-2">
            <BarChart3 class="w-4 h-4 text-primary" />设施数量分类对比
          </h3>
          <span class="text-[10px] text-muted-themed">点击柱体联动筛选</span>
        </div>
        <div ref="barChartRef" class="h-64"></div>
      </div>

      <!-- 饼图 -->
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-default flex items-center gap-2">
            <PieChart class="w-4 h-4 text-primary" />设施类型占比
          </h3>
          <span class="text-[10px] text-muted-themed">点击扇区联动筛选</span>
        </div>
        <div ref="pieChartRef" class="h-64"></div>
      </div>

      <!-- 折线图 -->
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-default flex items-center gap-2">
            <TrendingUp class="w-4 h-4 text-primary" />趋势分析
          </h3>
          <div class="flex items-center gap-1.5">
            <Link2 class="w-3 h-3 text-muted-themed" />
            <span class="text-[10px] text-muted-themed">数据联动中</span>
          </div>
        </div>
        <div ref="lineChartRef" class="h-64"></div>
      </div>

      <!-- 多维度堆叠图 -->
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-default flex items-center gap-2">
            <Layers class="w-4 h-4 text-primary" />多维度统计（区域×类型）
          </h3>
        </div>
        <div ref="multiChartRef" class="h-64"></div>
      </div>
    </div>

    <ToastNotify ref="toast" />
  </div>
</template>
