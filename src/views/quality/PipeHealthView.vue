<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { HeartPulse, AlertTriangle, Wrench } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// 管道健康 Tab —— 需求 9.1.5.4.1
const healthTabs = [
  { key: 'archive', label: '健康档案' },
  { key: 'defect', label: '管道缺陷' },
  { key: 'repair', label: '修复计划' },
]
const activeTab = ref('archive')

// 健康档案
const healthRecords = ref([
  { id: 1, segment: '朝阳路 P01-P05', material: 'HDPE', age: 6, score: 92, grade: 'A', defects: 0 },
  { id: 2, segment: '民生路 P01-P10', material: '钢筋混凝土', age: 12, score: 75, grade: 'B', defects: 3 },
  { id: 3, segment: '和平路 P05-P08', material: 'PVC', age: 15, score: 58, grade: 'C', defects: 5 },
  { id: 4, segment: '新华路 P01-P03', material: '钢筋混凝土', age: 20, score: 42, grade: 'D', defects: 8 },
  { id: 5, segment: '建设大道 P10-P15', material: 'PE', age: 3, score: 98, grade: 'A', defects: 0 },
  { id: 6, segment: '东湖路 P01-P06', material: '球墨铸铁', age: 10, score: 81, grade: 'B', defects: 2 },
])

// 管道缺陷
const defects = ref([
  { id: 'DF-001', segment: '和平路 P05-P06', type: '裂缝', position: '距起点25.3m', grade: '中度', method: 'CCTV检测', date: '2024-03-10', status: 'confirmed', hasImage: true },
  { id: 'DF-002', segment: '新华路 P01-P02', type: '变形', position: '距起点12.8m', grade: '严重', method: 'CCTV检测', date: '2024-03-08', status: 'repairing', hasImage: true },
  { id: 'DF-003', segment: '民生路 P03-P04', type: '腐蚀', position: '距起点8.5m', grade: '轻度', method: 'QV检测', date: '2024-03-05', status: 'confirmed', hasImage: false },
  { id: 'DF-004', segment: '新华路 P02-P03', type: '渗漏', position: '距起点45.2m', grade: '严重', method: 'CCTV检测', date: '2024-03-01', status: 'repaired', hasImage: true },
  { id: 'DF-005', segment: '和平路 P06-P07', type: '错口', position: '距起点18.0m', grade: '中度', method: 'CCTV检测', date: '2024-02-28', status: 'confirmed', hasImage: true },
])

// 修复计划
const repairPlans = ref([
  { id: 'RP-001', segment: '新华路 P01-P03', method: '非开挖修复(CIPP)', length: 65, estimatedCost: 185000, priority: '紧急', startDate: '2024-03-20', status: 'planning', progress: 0 },
  { id: 'RP-002', segment: '和平路 P05-P07', method: '局部修复(点状修复)', length: 28, estimatedCost: 42000, priority: '高', startDate: '2024-04-01', status: 'approved', progress: 0 },
  { id: 'RP-003', segment: '民生路 P03-P04', method: '管道内衬', length: 35, estimatedCost: 75000, priority: '一般', startDate: '2024-04-15', status: 'planning', progress: 0 },
])

// 图表
const gradeChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
let gradeChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

onMounted(() => {
  if (gradeChartRef.value) {
    gradeChart = echarts.init(gradeChartRef.value)
    gradeChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item' },
      color: ['#00D4AA', '#3B82F6', '#FFB020', '#FF4757'],
      series: [{ type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 }, data: [{ value: 35, name: 'A级' }, { value: 28, name: 'B级' }, { value: 22, name: 'C级' }, { value: 15, name: 'D级' }] }]
    })
  }
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { top: 20, right: 15, bottom: 25, left: 40 },
      xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: { type: 'value', name: '平均分', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      series: [{ type: 'line', smooth: true, data: [82, 80, 78, 76, 74, 73], lineStyle: { color: '#FFB020', width: 2 }, itemStyle: { color: '#FFB020' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255,176,32,0.2)' }, { offset: 1, color: 'rgba(255,176,32,0)' }]) } }]
    })
  }
  window.addEventListener('resize', () => { gradeChart?.resize(); trendChart?.resize() })
})

onUnmounted(() => { gradeChart?.dispose(); trendChart?.dispose() })

function getGradeClass(g: string) { return g === 'A' ? 'bg-success/15 text-success' : g === 'B' ? 'bg-info/15 text-info' : g === 'C' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger' }
function getDefectGradeClass(g: string) { return g === '轻度' ? 'bg-info/15 text-info' : g === '中度' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger' }
function getDefectStatusClass(s: string) { return s === 'confirmed' ? 'bg-warning/15 text-warning' : s === 'repairing' ? 'bg-info/15 text-info' : 'bg-success/15 text-success' }
function getDefectStatusText(s: string) { return s === 'confirmed' ? '已确认' : s === 'repairing' ? '修复中' : '已修复' }
function getRepairStatusClass(s: string) { return s === 'planning' ? 'bg-warning/15 text-warning' : s === 'approved' ? 'bg-info/15 text-info' : s === 'executing' ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success' }
function getRepairStatusText(s: string) { return s === 'planning' ? '规划中' : s === 'approved' ? '已审批' : s === 'executing' ? '施工中' : '已完成' }
function getPriorityClass(p: string) { return p === '紧急' ? 'text-danger' : p === '高' ? 'text-warning' : 'text-info' }

// 缺陷详情弹窗
const showDetail = ref(false)
const selectedDefect = ref<typeof defects.value[0] | null>(null)
function openDetail(d: typeof defects.value[0]) { selectedDefect.value = d; showDetail.value = true }

// 缺陷状态推进
function advanceDefectStatus(d: typeof defects.value[0]) {
  const flow: Record<string, string> = { confirmed: 'repairing', repairing: 'repaired' }
  const next = flow[d.status]
  if (next) { d.status = next; toast.value?.show(`缺陷状态已更新为「${getDefectStatusText(next)}」`, 'success') }
}

// 修复计划审批
function approveRepairPlan(rp: typeof repairPlans.value[0]) {
  const flow: Record<string, string> = { planning: 'approved', approved: 'executing', executing: 'completed' }
  const next = flow[rp.status]
  if (next) { rp.status = next; toast.value?.show(`修复计划已推进至「${getRepairStatusText(next)}」`, 'success') }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Tab -->
    <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5 w-fit">
      <button v-for="tab in healthTabs" :key="tab.key" @click="activeTab = tab.key"
        class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
        :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
        {{ tab.label }}
      </button>
    </div>

    <!-- 健康档案 -->
    <template v-if="activeTab === 'archive'">
      <div class="grid grid-cols-2 gap-4">
        <!-- 健康表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-themed">
                <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管段</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">材质</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管龄</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">健康分</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">等级</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">缺陷数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in healthRecords" :key="r.id"
                class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                <td class="px-4 py-2.5 text-xs font-medium text-default">{{ r.segment }}</td>
                <td class="px-4 py-2.5 text-xs text-dim">{{ r.material }}</td>
                <td class="px-4 py-2.5 text-xs text-dim">{{ r.age }}年</td>
                <td class="px-4 py-2.5 text-xs font-bold"
                  :class="r.score >= 80 ? 'text-success' : r.score >= 60 ? 'text-warning' : 'text-danger'">{{ r.score }}
                </td>
                <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                    :class="getGradeClass(r.grade)">{{ r.grade }}级</span></td>
                <td class="px-4 py-2.5 text-xs" :class="r.defects > 0 ? 'text-danger font-medium' : 'text-dim'">{{
                  r.defects }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 图表 -->
        <div class="space-y-4">
          <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
            <h4 class="text-sm font-semibold text-default mb-2">健康等级分布</h4>
            <div ref="gradeChartRef" class="h-40"></div>
          </div>
          <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
            <h4 class="text-sm font-semibold text-default mb-2">健康度趋势</h4>
            <div ref="trendChartRef" class="h-40"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 管道缺陷 -->
    <template v-if="activeTab === 'defect'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管段</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">缺陷类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">位置</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">等级</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">检测方式</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">发现日期</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in defects" :key="d.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ d.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ d.segment }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ d.type }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ d.position }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getDefectGradeClass(d.grade)">{{ d.grade }}</span></td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ d.method }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ d.date }}</td>
              <td class="px-4 py-2.5">
                <button v-if="d.status !== 'repaired'" @click="advanceDefectStatus(d)"
                  class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  :class="getDefectStatusClass(d.status)">{{ getDefectStatusText(d.status) }}</button>
                <span v-else class="text-[10px] px-2 py-0.5 rounded-md" :class="getDefectStatusClass(d.status)">{{
                  getDefectStatusText(d.status) }}</span>
              </td>
              <td class="px-4 py-2.5">
                <button @click="openDetail(d)"
                  class="text-[10px] text-primary hover:underline cursor-pointer">详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 修复计划 -->
    <template v-if="activeTab === 'repair'">
      <div class="space-y-3">
        <div v-for="rp in repairPlans" :key="rp.id" class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                <span :class="getPriorityClass(rp.priority)">●</span> {{ rp.segment }}
              </h4>
              <p class="text-xs text-dim mt-0.5">{{ rp.method }} · 长度 {{ rp.length }}m</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-medium" :class="getPriorityClass(rp.priority)">{{ rp.priority }}</span>
              <button v-if="rp.status !== 'completed'" @click="approveRepairPlan(rp)"
                class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                :class="getRepairStatusClass(rp.status)">{{ getRepairStatusText(rp.status) }}</button>
              <span v-else class="text-[10px] px-2 py-0.5 rounded-md" :class="getRepairStatusClass(rp.status)">{{
                getRepairStatusText(rp.status) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-6 text-xs text-dim">
            <span>预算: <span class="text-default font-medium">¥{{ rp.estimatedCost.toLocaleString() }}</span></span>
            <span>计划开始: {{ rp.startDate }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 缺陷详情弹窗 -->
    <ModalDialog :show="showDetail" title="缺陷详情" @close="showDetail = false" @confirm="showDetail = false">
      <div v-if="selectedDefect" class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div><span class="text-dim">编号：</span><span class="text-default font-mono">{{ selectedDefect.id }}</span>
          </div>
          <div><span class="text-dim">管段：</span><span class="text-default">{{ selectedDefect.segment }}</span></div>
          <div><span class="text-dim">类型：</span><span class="text-default">{{ selectedDefect.type }}</span></div>
          <div><span class="text-dim">位置：</span><span class="text-default">{{ selectedDefect.position }}</span></div>
          <div><span class="text-dim">等级：</span><span class="px-1.5 py-0.5 rounded"
              :class="getDefectGradeClass(selectedDefect.grade)">{{ selectedDefect.grade }}</span></div>
          <div><span class="text-dim">检测方式：</span><span class="text-default">{{ selectedDefect.method }}</span></div>
          <div><span class="text-dim">发现日期：</span><span class="text-default">{{ selectedDefect.date }}</span></div>
          <div><span class="text-dim">状态：</span><span class="px-1.5 py-0.5 rounded"
              :class="getDefectStatusClass(selectedDefect.status)">{{ getDefectStatusText(selectedDefect.status)
              }}</span>
          </div>
        </div>
        <div v-if="selectedDefect.hasImage" class="p-3 bg-surface rounded-lg text-center text-dim">
          📷 CCTV 检测影像（示意）
        </div>
      </div>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
