<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Link, AlertTriangle, CheckCircle, Wrench } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// KPI
const crossKPIs = ref([
  { label: '混接点位', value: 34, unit: '处', color: '#FF4757' },
  { label: '已整改', value: 18, unit: '处', color: '#00D4AA' },
  { label: '整改中', value: 10, unit: '处', color: '#3B82F6' },
  { label: '整改率', value: 52.9, unit: '%', color: '#FFB020' },
])

const records = ref([
  { id: 'CC-001', location: '朝阳路28号', type: '雨接污', source: '餐饮排水', pipeSpec: 'DN150→DN300 污水管', detectDate: '2024-01-15', status: 'completed', method: 'CCTV' },
  { id: 'CC-002', location: '新华街56号', type: '污接雨', source: '生活排水', pipeSpec: 'DN100→DN400 雨水管', detectDate: '2024-02-20', status: 'rectifying', method: '水质检测' },
  { id: 'CC-003', location: '和平路商业中心', type: '雨接污', source: '屋面雨水', pipeSpec: 'DN200→DN600 污水管', detectDate: '2024-03-01', status: 'confirmed', method: '现场巡查' },
  { id: 'CC-004', location: '民生路12号', type: '污接雨', source: '洗车废水', pipeSpec: 'DN75→DN300 雨水管', detectDate: '2024-02-10', status: 'completed', method: '水质检测' },
  { id: 'CC-005', location: '建设大道88号', type: '雨接污', source: '地面径流', pipeSpec: 'DN150→DN400 污水管', detectDate: '2024-03-08', status: 'confirmed', method: 'CCTV' },
])

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 15, bottom: 30, left: 45 },
      xAxis: { type: 'category', data: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: { type: 'value', axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      series: [
        { name: '雨接污', type: 'bar', stack: 'total', data: [5, 3, 4, 2, 6], itemStyle: { color: '#FF4757' } },
        { name: '污接雨', type: 'bar', stack: 'total', data: [3, 2, 3, 1, 5], itemStyle: { color: '#FFB020' } },
      ]
    })
    window.addEventListener('resize', () => chart?.resize())
  }
})

onUnmounted(() => { chart?.dispose() })

function getTypeClass(t: string) { return t === '雨接污' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning' }
function getStatusClass(s: string) { return s === 'completed' ? 'bg-success/15 text-success' : s === 'rectifying' ? 'bg-info/15 text-info' : 'bg-warning/15 text-warning' }
function getStatusText(s: string) { return s === 'completed' ? '已整改' : s === 'rectifying' ? '整改中' : '已确认' }

function advanceStatus(r: typeof records.value[0]) {
  const flow: Record<string, string> = { confirmed: 'rectifying', rectifying: 'completed' }
  const next = flow[r.status]
  if (next) { r.status = next; toast.value?.show(`状态已更新为「${getStatusText(next)}」`, 'success') }
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-4 gap-3">
      <div v-for="kpi in crossKPIs" :key="kpi.label"
        class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
        <p class="text-3xl font-bold" :style="{ color: kpi.color }">{{ kpi.value }}</p>
        <p class="text-xs text-dim mt-1">{{ kpi.label }} ({{ kpi.unit }})</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">位置</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">污染源</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管径连接</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">检测方式</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in records" :key="r.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ r.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ r.location }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md" :class="getTypeClass(r.type)">{{
                r.type }}</span></td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.source }}</td>
              <td class="px-4 py-2.5 text-xs text-dim font-mono">{{ r.pipeSpec }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.method }}</td>
              <td class="px-4 py-2.5">
                <button v-if="r.status !== 'completed'" @click="advanceStatus(r)"
                  class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  :class="getStatusClass(r.status)">{{ getStatusText(r.status) }}</button>
                <span v-else class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(r.status)">{{
                  getStatusText(r.status) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-2">各区混接分布</h4>
        <div ref="chartRef" class="h-56"></div>
      </div>
    </div>

    <ToastNotify ref="toast" />
  </div>
</template>
