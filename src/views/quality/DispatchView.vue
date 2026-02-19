<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Send, Droplets, Zap, Clock, CheckCircle } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// KPI
const dispatchKPIs = ref([
  { label: '今日总处理量', value: '12.8', unit: '万m³', color: '#3B82F6' },
  { label: '管网负荷率', value: '72', unit: '%', color: '#00D4AA' },
  { label: '调度指令', value: '6', unit: '条', color: '#FFB020' },
  { label: '应急响应', value: '0', unit: '次', color: '#8B5CF6' },
])

// 调度指令
const commands = ref([
  { id: 'DC-001', title: '东湖泵站 3号泵 启动', reason: '进水水位达预警值', issuer: '调度中心', time: '2024-03-15 14:20', target: '东湖泵站', status: 'executed', type: 'auto' },
  { id: 'DC-002', title: '朝阳路泵站 调度比例调整为85%', reason: '下游管网满载', issuer: '张调度', time: '2024-03-15 12:30', target: '朝阳路泵站', status: 'executed', type: 'manual' },
  { id: 'DC-003', title: '和平路闸门 开度调至60%', reason: '上游来水量减少', issuer: '调度中心', time: '2024-03-15 11:00', target: '和平路闸站', status: 'executed', type: 'auto' },
  { id: 'DC-004', title: '西城排放口 限流50%', reason: '水质超标，限制排放', issuer: '李调度', time: '2024-03-15 10:15', target: '西城排放口', status: 'pending', type: 'manual' },
])

// 管网运行概况图
const flowChartRef = ref<HTMLElement>()
let flowChart: echarts.ECharts | null = null

onMounted(() => {
  if (flowChartRef.value) {
    flowChart = echarts.init(flowChartRef.value)
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
    flowChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 50, bottom: 25, left: 50 },
      xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 2 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: [
        { type: 'value', name: '流量(m³/h)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        { type: 'value', name: '负荷(%)', nameTextStyle: { color: '#5A6B7C' }, max: 100, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
      ],
      series: [
        { name: '总处理流量', type: 'area', smooth: true, data: hours.map((_, i) => 350 + Math.sin(i / 4) * 150 + Math.random() * 50), lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) } },
        { name: '管网负荷', type: 'line', yAxisIndex: 1, smooth: true, data: hours.map((_, i) => 55 + Math.sin(i / 4) * 20 + Math.random() * 5), lineStyle: { color: '#FFB020', type: 'dashed' }, itemStyle: { color: '#FFB020' }, symbol: 'none' },
      ]
    })
    window.addEventListener('resize', () => flowChart?.resize())
  }
})

onUnmounted(() => { flowChart?.dispose() })

function getTypeClass(t: string) { return t === 'auto' ? 'bg-info/15 text-info' : 'bg-primary/15 text-primary' }
function getStatusClass(s: string) { return s === 'executed' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning' }
function getStatusText(s: string) { return s === 'executed' ? '已执行' : '待执行' }

// 下发指令弹窗
const showCmdModal = ref(false)
const cmdForm = ref({ target: '', content: '', reason: '' })
function openCmdModal() { cmdForm.value = { target: '', content: '', reason: '' }; showCmdModal.value = true }
function doSendCmd() {
  if (!cmdForm.value.target || !cmdForm.value.content) { toast.value?.show('请填写完整指令信息', 'warning'); return }
  commands.value.unshift({ id: `DC-${String(commands.value.length + 1).padStart(3, '0')}`, title: cmdForm.value.content, reason: cmdForm.value.reason, issuer: '当前用户', time: new Date().toLocaleString(), target: cmdForm.value.target, status: 'pending', type: 'manual' })
  showCmdModal.value = false
  toast.value?.show('指令已下发', 'success')
}
function executeCmd(cmd: typeof commands.value[0]) {
  cmd.status = 'executed'
  toast.value?.show(`指令 "${cmd.title}" 已执行`, 'success')
}
</script>

<template>
  <div class="space-y-4">
    <!-- KPI -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="kpi in dispatchKPIs" :key="kpi.label"
        class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-dim">{{ kpi.label }}</span>
        </div>
        <p class="text-2xl font-bold" :style="{ color: kpi.color }">{{ kpi.value }}</p>
        <p class="text-xs text-muted-themed mt-0.5">{{ kpi.unit }}</p>
      </div>
    </div>

    <!-- 调度流量趋势 -->
    <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
      <h4 class="text-sm font-semibold text-default mb-2">24小时流量及负荷趋势</h4>
      <div ref="flowChartRef" class="h-52"></div>
    </div>

    <!-- 调度指令表 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
        <h4 class="text-sm font-semibold text-default">调度指令</h4>
        <button @click="openCmdModal"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
          <Send class="w-3 h-3" /> 下发指令
        </button>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-themed">
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">指令内容</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">原因</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">下发方</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">时间</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cmd in commands" :key="cmd.id"
            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
            <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ cmd.id }}</td>
            <td class="px-4 py-2.5 text-xs font-medium text-default">{{ cmd.title }}</td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ cmd.reason }}</td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ cmd.issuer }}</td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ cmd.time }}</td>
            <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md" :class="getTypeClass(cmd.type)">{{
              cmd.type === 'auto' ? '自动' : '人工' }}</span></td>
            <td class="px-4 py-2.5">
              <button v-if="cmd.status === 'pending'" @click="executeCmd(cmd)"
                class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                :class="getStatusClass(cmd.status)">{{ getStatusText(cmd.status) }}</button>
              <span v-else class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(cmd.status)">{{
                getStatusText(cmd.status) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 下发指令弹窗 -->
    <ModalDialog :show="showCmdModal" title="下发调度指令" @close="showCmdModal = false" @confirm="doSendCmd">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-dim mb-1 block">目标设施 <span class="text-danger">*</span></label>
          <select v-model="cmdForm.target"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
            <option value="">请选择</option>
            <option>东湖泵站</option>
            <option>朝阳路泵站</option>
            <option>和平路闸站</option>
            <option>西城排放口</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">指令内容 <span class="text-danger">*</span></label>
          <input v-model="cmdForm.content" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="例如：3号泵 启动" />
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">原因</label>
          <textarea v-model="cmdForm.reason" rows="2"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary resize-none"
            placeholder="调度原因"></textarea>
        </div>
      </div>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
