<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Droplets, AlertTriangle, MapPin, TrendingUp } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// KPI
const intrusionKPIs = ref([
  { label: '外水入侵点', value: 21, unit: '处', color: '#FF4757' },
  { label: '影响管段', value: 38, unit: '段', color: '#FFB020' },
  { label: '外水占比', value: 28, unit: '%', color: '#3B82F6' },
  { label: '已治理', value: 12, unit: '处', color: '#00D4AA' },
])

const intrusionRecords = ref([
  { id: 'EW-001', segment: '朝阳路 P03-P04', type: '地下水入渗', rate: '15.2 m³/h', proportion: '32%', severity: 'high', detectDate: '2024-02-15', status: 'investigating' },
  { id: 'EW-002', segment: '新华街 P08-P10', type: '河水倒灌', rate: '8.5 m³/h', proportion: '18%', severity: 'high', detectDate: '2024-01-20', status: 'treating' },
  { id: 'EW-003', segment: '和平路 P12-P14', type: '雨水混接', rate: '5.8 m³/h', proportion: '12%', severity: 'medium', detectDate: '2024-03-05', status: 'investigating' },
  { id: 'EW-004', segment: '建设大道 P20-P22', type: '地下水入渗', rate: '3.2 m³/h', proportion: '8%', severity: 'low', detectDate: '2024-02-28', status: 'treated' },
  { id: 'EW-005', segment: '东湖路 P05-P06', type: '施工排水接入', rate: '12.0 m³/h', proportion: '25%', severity: 'high', detectDate: '2024-03-10', status: 'investigating' },
])

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item' },
      color: ['#FF4757', '#FFB020', '#3B82F6', '#00D4AA', '#8B5CF6'],
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 },
        data: [{ value: 8, name: '地下水入渗' }, { value: 3, name: '河水倒灌' }, { value: 5, name: '雨水混接' }, { value: 2, name: '施工排水接入' }, { value: 3, name: '其他' }]
      }]
    })
    window.addEventListener('resize', () => chart?.resize())
  }
})

onUnmounted(() => { chart?.dispose() })

function getSeverityClass(s: string) { return s === 'high' ? 'bg-danger/15 text-danger' : s === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info' }
function getSeverityText(s: string) { return s === 'high' ? '严重' : s === 'medium' ? '中等' : '轻微' }
function getStatusClass(s: string) { return s === 'investigating' ? 'bg-warning/15 text-warning' : s === 'treating' ? 'bg-info/15 text-info' : 'bg-success/15 text-success' }
function getStatusText(s: string) { return s === 'investigating' ? '排查中' : s === 'treating' ? '治理中' : '已治理' }

function advanceStatus(r: typeof intrusionRecords.value[0]) {
  const flow: Record<string, string> = { investigating: 'treating', treating: 'treated' }
  const next = flow[r.status]
  if (next) { r.status = next; toast.value?.show(`状态已更新为「${getStatusText(next)}」`, 'success') }
}
</script>

<template>
  <div class="space-y-4">
    <!-- KPI -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="kpi in intrusionKPIs" :key="kpi.label"
        class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
        <p class="text-3xl font-bold" :style="{ color: kpi.color }">{{ kpi.value }}</p>
        <p class="text-xs text-dim mt-1">{{ kpi.label }} ({{ kpi.unit }})</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <!-- 列表 -->
      <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管段</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">入侵类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">入侵量</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">占比</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">严重度</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in intrusionRecords" :key="r.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ r.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ r.segment }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.type }}</td>
              <td class="px-4 py-2.5 text-xs text-default font-mono">{{ r.rate }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-warning">{{ r.proportion }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getSeverityClass(r.severity)">{{ getSeverityText(r.severity) }}</span></td>
              <td class="px-4 py-2.5">
                <button v-if="r.status !== 'treated'" @click="advanceStatus(r)"
                  class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  :class="getStatusClass(r.status)">{{ getStatusText(r.status) }}</button>
                <span v-else class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(r.status)">{{
                  getStatusText(r.status) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 类型分布 -->
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">入侵类型分布</h4>
        <div ref="chartRef" class="h-56"></div>
      </div>
    </div>

    <ToastNotify ref="toast" />
  </div>
</template>
