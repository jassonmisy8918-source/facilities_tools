<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Monitor, Power, Droplets, Zap, Thermometer, AlertTriangle, CheckCircle, XCircle, Video, Gauge, ArrowDown, ArrowUp } from 'lucide-vue-next'

const stations = ref([
  {
    id: 1, name: '朝阳路泵站', status: 'running',
    pumps: [
      { id: 'P1', status: 'running', flow: 120, current: 32, temp: 45 },
      { id: 'P2', status: 'running', flow: 115, current: 30, temp: 43 },
      { id: 'P3', status: 'standby', flow: 0, current: 0, temp: 25 },
    ],
    inletLevel: 2.8, outletLevel: 1.2, inletWarnLevel: 3.5, outletWarnLevel: 2.0,
    inFlow: 342, outFlow: 335, totalFlow: 342, power: 78, alarms: 0
  },
  {
    id: 2, name: '东湖泵站', status: 'running',
    pumps: [
      { id: 'P1', status: 'running', flow: 180, current: 45, temp: 52 },
      { id: 'P2', status: 'running', flow: 175, current: 44, temp: 50 },
      { id: 'P3', status: 'running', flow: 163, current: 42, temp: 48 },
    ],
    inletLevel: 3.5, outletLevel: 1.8, inletWarnLevel: 4.0, outletWarnLevel: 2.5,
    inFlow: 518, outFlow: 510, totalFlow: 518, power: 92, alarms: 0
  },
  {
    id: 3, name: '和平路泵站', status: 'warning',
    pumps: [
      { id: 'P1', status: 'running', flow: 95, current: 28, temp: 55 },
      { id: 'P2', status: 'fault', flow: 0, current: 0, temp: 65 },
      { id: 'P3', status: 'running', flow: 94, current: 27, temp: 48 },
    ],
    inletLevel: 4.1, outletLevel: 2.0, inletWarnLevel: 3.8, outletWarnLevel: 2.5,
    inFlow: 189, outFlow: 180, totalFlow: 189, power: 45, alarms: 2
  },
  {
    id: 4, name: '民生路泵站', status: 'running',
    pumps: [
      { id: 'P1', status: 'running', flow: 135, current: 35, temp: 42 },
      { id: 'P2', status: 'standby', flow: 0, current: 0, temp: 24 },
    ],
    inletLevel: 2.1, outletLevel: 0.9, inletWarnLevel: 3.5, outletWarnLevel: 2.0,
    inFlow: 135, outFlow: 130, totalFlow: 135, power: 35, alarms: 0
  },
])

const selectedStation = ref(stations.value[0])
const flowChartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function selectStation(station: typeof stations.value[0]) {
  selectedStation.value = station
}

onMounted(() => {
  if (flowChartRef.value) {
    chart = echarts.init(flowChartRef.value)
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 15, bottom: 25, left: 45 },
      xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`), axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 3 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      series: [
        { name: '进水流量', type: 'line', smooth: true, data: [280, 260, 240, 220, 200, 210, 250, 300, 340, 360, 380, 370, 350, 340, 360, 370, 350, 330, 310, 300, 290, 285, 280, 275], lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' } },
        { name: '出水流量', type: 'line', smooth: true, data: [275, 255, 235, 215, 195, 205, 245, 295, 335, 355, 375, 365, 345, 335, 355, 365, 345, 325, 305, 295, 285, 280, 275, 270], lineStyle: { color: '#00D4AA' }, itemStyle: { color: '#00D4AA' } },
      ]
    })
  }
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => { chart?.dispose(); chart = null })

function getPumpStatusIcon(s: string) { return s === 'running' ? CheckCircle : s === 'fault' ? XCircle : Power }
function getPumpStatusColor(s: string) { return s === 'running' ? 'text-success' : s === 'fault' ? 'text-danger' : 'text-muted-themed' }
function getPumpStatusText(s: string) { return s === 'running' ? '运行' : s === 'fault' ? '故障' : '待机' }
function getLevelPercent(level: number, warnLevel: number) { return Math.min((level / warnLevel) * 100, 100) }
function getLevelColor(level: number, warnLevel: number) { return level >= warnLevel ? 'bg-danger' : level >= warnLevel * 0.8 ? 'bg-warning' : 'bg-primary' }
</script>

<template>
  <div class="grid grid-cols-4 gap-4" style="height: calc(100vh - 160px)">
    <!-- 泵站列表 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed flex flex-col overflow-hidden">
      <div class="px-4 py-3 border-b border-themed shrink-0">
        <div class="flex items-center gap-1.5">
          <Monitor class="w-4 h-4 text-primary" />
          <span class="text-sm font-semibold text-default">泵站列表</span>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-2 space-y-1.5">
        <button v-for="station in stations" :key="station.id" @click="selectStation(station)"
          class="w-full text-left p-3 rounded-lg transition-all cursor-pointer"
          :class="selectedStation.id === station.id ? 'bg-primary/15 border border-primary/30' : 'bg-surface hover:bg-hover-themed border border-transparent'">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-default">{{ station.name }}</span>
            <span class="w-2 h-2 rounded-full"
              :class="station.status === 'running' ? 'bg-success' : station.status === 'warning' ? 'bg-warning' : 'bg-danger'"></span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[10px]">
            <div class="text-dim">进水 <span class="text-default font-medium">{{ station.inletLevel }}</span> m</div>
            <div class="text-dim">出水 <span class="text-default font-medium">{{ station.outletLevel }}</span> m</div>
            <div class="text-dim">流量 <span class="text-default font-medium">{{ station.totalFlow }}</span> m³/h</div>
            <div class="text-dim">报警 <span class="font-medium"
                :class="station.alarms > 0 ? 'text-danger' : 'text-success'">{{ station.alarms }}</span></div>
          </div>
        </button>
      </div>
    </div>

    <!-- 详情 -->
    <div class="col-span-3 space-y-4 overflow-y-auto">
      <!-- 前后池水位 + 进出流量 -->
      <div class="grid grid-cols-4 gap-3">
        <!-- 前池水位 -->
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-dim">前池水位</span>
            <ArrowDown class="w-3.5 h-3.5 text-info" />
          </div>
          <div class="flex items-end gap-2 mb-2">
            <span class="text-2xl font-bold"
              :class="selectedStation.inletLevel >= selectedStation.inletWarnLevel ? 'text-danger' : 'text-default'">
              {{ selectedStation.inletLevel }}
            </span>
            <span class="text-xs text-muted-themed mb-0.5">m</span>
          </div>
          <div class="w-full bg-surface rounded-full h-2 mb-1">
            <div class="h-2 rounded-full transition-all"
              :class="getLevelColor(selectedStation.inletLevel, selectedStation.inletWarnLevel)"
              :style="{ width: getLevelPercent(selectedStation.inletLevel, selectedStation.inletWarnLevel) + '%' }">
            </div>
          </div>
          <p class="text-[10px] text-muted-themed">预警值: {{ selectedStation.inletWarnLevel }}m</p>
        </div>
        <!-- 后池水位 -->
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-dim">后池水位</span>
            <ArrowUp class="w-3.5 h-3.5 text-success" />
          </div>
          <div class="flex items-end gap-2 mb-2">
            <span class="text-2xl font-bold text-default">{{ selectedStation.outletLevel }}</span>
            <span class="text-xs text-muted-themed mb-0.5">m</span>
          </div>
          <div class="w-full bg-surface rounded-full h-2 mb-1">
            <div class="h-2 rounded-full transition-all"
              :class="getLevelColor(selectedStation.outletLevel, selectedStation.outletWarnLevel)"
              :style="{ width: getLevelPercent(selectedStation.outletLevel, selectedStation.outletWarnLevel) + '%' }">
            </div>
          </div>
          <p class="text-[10px] text-muted-themed">预警值: {{ selectedStation.outletWarnLevel }}m</p>
        </div>
        <!-- 进水流量 -->
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-dim">进水流量</span>
            <Droplets class="w-3.5 h-3.5 text-info" />
          </div>
          <p class="text-2xl font-bold text-default">{{ selectedStation.inFlow }}</p>
          <p class="text-xs text-muted-themed">m³/h</p>
        </div>
        <!-- 出水流量 -->
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-dim">出水流量</span>
            <Droplets class="w-3.5 h-3.5 text-success" />
          </div>
          <p class="text-2xl font-bold text-default">{{ selectedStation.outFlow }}</p>
          <p class="text-xs text-muted-themed">m³/h</p>
        </div>
      </div>

      <!-- 水泵状态 -->
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h3 class="text-sm font-semibold text-default mb-3">{{ selectedStation.name }} — 水泵状态</h3>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="pump in selectedStation.pumps" :key="pump.id"
            class="bg-surface rounded-lg p-3 border border-themed">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-default">{{ pump.id }} 号泵</span>
              <div class="flex items-center gap-1" :class="getPumpStatusColor(pump.status)">
                <component :is="getPumpStatusIcon(pump.status)" class="w-3.5 h-3.5" />
                <span class="text-[10px]">{{ getPumpStatusText(pump.status) }}</span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <Droplets class="w-4 h-4 text-info mx-auto mb-1" />
                <p class="text-sm font-bold text-default">{{ pump.flow }}</p>
                <p class="text-[10px] text-muted-themed">m³/h</p>
              </div>
              <div>
                <Zap class="w-4 h-4 text-warning mx-auto mb-1" />
                <p class="text-sm font-bold text-default">{{ pump.current }}</p>
                <p class="text-[10px] text-muted-themed">A</p>
              </div>
              <div>
                <Thermometer class="w-4 h-4 mx-auto mb-1" :class="pump.temp > 55 ? 'text-danger' : 'text-success'" />
                <p class="text-sm font-bold text-default">{{ pump.temp }}°</p>
                <p class="text-[10px] text-muted-themed">温度</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 流量趋势 -->
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h3 class="text-sm font-semibold text-default mb-2">24h 进/出水流量</h3>
        <div ref="flowChartRef" class="h-48"></div>
      </div>
    </div>
  </div>
</template>
