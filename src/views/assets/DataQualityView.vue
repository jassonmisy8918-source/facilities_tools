<script setup lang="ts">
import { ref } from 'vue'
import { Database, FileCheck, Download, Upload, CheckCircle, XCircle } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// Tab
const dataTabs = [
  { key: 'catalog', label: '数据目录' },
  { key: 'rules', label: '质检规则' },
  { key: 'report', label: '质检报告' },
]
const activeTab = ref('catalog')

// 数据目录
const datasets = ref([
  { id: 1, name: '排水管网基础信息', category: '管网数据', records: 15680, quality: 94, lastUpdate: '2024-03-15', format: 'SHP/GDB' },
  { id: 2, name: '检查井台账数据', category: '设施数据', records: 12456, quality: 91, lastUpdate: '2024-03-14', format: 'Excel' },
  { id: 3, name: '实时监测数据', category: '监测数据', records: 2840000, quality: 98, lastUpdate: '2024-03-15', format: 'DB' },
  { id: 4, name: '巡查记录数据', category: '运维数据', records: 8650, quality: 87, lastUpdate: '2024-03-12', format: 'JSON' },
  { id: 5, name: '泵站运行数据', category: '运行数据', records: 562000, quality: 96, lastUpdate: '2024-03-15', format: 'DB' },
  { id: 6, name: '排水户信息', category: '用户数据', records: 3420, quality: 82, lastUpdate: '2024-02-28', format: 'Excel' },
])

// 质检规则
const qualityRules = ref([
  { id: 'QR-001', name: '混错接检测', description: '检查雨水管接入污水管或污水管接入雨水管', category: '连接检查', severity: 'high', enabled: true },
  { id: 'QR-002', name: '大管接小管检测', description: '检查上游管径大于下游管径的异常连接', category: '管径检查', severity: 'high', enabled: true },
  { id: 'QR-003', name: '断头管检测', description: '检查末端无下游连接的管段', category: '连通检查', severity: 'medium', enabled: true },
  { id: 'QR-004', name: '逆坡管段检测', description: '检查起点标高低于终点标高的管段', category: '坡度检查', severity: 'medium', enabled: true },
  { id: 'QR-005', name: '孤立设施检测', description: '检查无任何管道连接的独立设施', category: '连通检查', severity: 'low', enabled: true },
  { id: 'QR-006', name: '重复要素检测', description: '检查坐标重叠或属性完全相同的记录', category: '唯一性检查', severity: 'low', enabled: true },
  { id: 'QR-007', name: '坐标异常检测', description: '检查超出行政区划范围的坐标点', category: '空间检查', severity: 'medium', enabled: false },
])

// 质检报告
const qualityReports = ref([
  { id: 'QRP-001', name: '2024年Q1数据质检报告', date: '2024-03-15', totalChecked: 28136, passed: 26820, failed: 1316, passRate: 95.3, status: 'completed' },
  { id: 'QRP-002', name: '排水管网数据专项质检', date: '2024-03-10', totalChecked: 15680, passed: 14892, failed: 788, passRate: 95.0, status: 'completed' },
  { id: 'QRP-003', name: '新入库数据质检', date: '2024-03-14', totalChecked: 320, passed: 298, failed: 22, passRate: 93.1, status: 'completed' },
])

function getSeverityClass(s: string) { return s === 'high' ? 'bg-danger/15 text-danger' : s === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info' }
function getSeverityText(s: string) { return s === 'high' ? '严重' : s === 'medium' ? '一般' : '轻微' }

function toggleRule(r: typeof qualityRules.value[0]) {
  r.enabled = !r.enabled
  toast.value?.show(`规则 "${r.name}" 已${r.enabled ? '启用' : '停用'}`, r.enabled ? 'success' : 'info')
}
function handleImport() { toast.value?.show('请选择要导入的数据文件...', 'info') }
function handleExport() { toast.value?.show('数据导出中，请稍候...', 'info') }
function downloadReport(name: string) { toast.value?.show(`正在下载 "${name}"...`, 'info') }
</script>

<template>
  <div class="space-y-4">
    <!-- Tab + 操作 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
        <button v-for="tab in dataTabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button @click="handleImport"
          class="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
          <Upload class="w-3.5 h-3.5" /> 导入
        </button>
        <button @click="handleExport"
          class="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
          <Download class="w-3.5 h-3.5" /> 导出
        </button>
      </div>
    </div>

    <!-- 数据目录 -->
    <template v-if="activeTab === 'catalog'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">数据集名称</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">分类</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">记录数</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">格式</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">最后更新</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">质量评分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ds in datasets" :key="ds.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ ds.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ds.category }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ ds.records.toLocaleString() }}</td>
              <td class="px-4 py-2.5 text-xs text-dim font-mono">{{ ds.format }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ds.lastUpdate }}</td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-surface rounded-full h-1.5">
                    <div class="h-1.5 rounded-full transition-all"
                      :class="ds.quality >= 95 ? 'bg-success' : ds.quality >= 85 ? 'bg-primary' : 'bg-warning'"
                      :style="{ width: ds.quality + '%' }"></div>
                  </div>
                  <span class="text-[10px] font-medium"
                    :class="ds.quality >= 95 ? 'text-success' : ds.quality >= 85 ? 'text-default' : 'text-warning'">{{
                      ds.quality }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 质检规则 -->
    <template v-if="activeTab === 'rules'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">规则名称</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">描述</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">分类</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">严重度</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in qualityRules" :key="r.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ r.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ r.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim max-w-[250px]">{{ r.description }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.category }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getSeverityClass(r.severity)">{{ getSeverityText(r.severity) }}</span></td>
              <td class="px-4 py-2.5">
                <button @click="toggleRule(r)"
                  class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  :class="r.enabled ? 'bg-success/15 text-success hover:bg-success/25' : 'bg-surface text-dim hover:bg-hover-themed'">{{
                    r.enabled ? '已启用' : '已停用' }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 质检报告 -->
    <template v-if="activeTab === 'report'">
      <div class="space-y-3">
        <div v-for="rpt in qualityReports" :key="rpt.id"
          class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="text-sm font-semibold text-default">{{ rpt.name }}</h4>
              <p class="text-xs text-dim mt-0.5">{{ rpt.date }}</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-md bg-success/15 text-success">已完成</span>
          </div>
          <div class="grid grid-cols-4 gap-4 text-xs">
            <div><span class="text-dim">总检查数:</span> <span class="text-default font-medium ml-1">{{
              rpt.totalChecked.toLocaleString() }}</span></div>
            <div class="flex items-center gap-1">
              <CheckCircle class="w-3 h-3 text-success" /> <span class="text-dim">通过:</span> <span
                class="text-success font-medium ml-1">{{ rpt.passed.toLocaleString() }}</span>
            </div>
            <div class="flex items-center gap-1">
              <XCircle class="w-3 h-3 text-danger" /> <span class="text-dim">不通过:</span> <span
                class="text-danger font-medium ml-1">{{ rpt.failed.toLocaleString() }}</span>
            </div>
            <div><span class="text-dim">通过率:</span> <span class="font-bold ml-1"
                :class="rpt.passRate >= 95 ? 'text-success' : 'text-warning'">{{ rpt.passRate }}%</span></div>
          </div>
          <div class="mt-3 pt-3 border-t border-themed/50">
            <button @click="downloadReport(rpt.name)"
              class="flex items-center gap-1 text-xs text-primary hover:text-primary-light cursor-pointer">
              <Download class="w-3 h-3" /> 下载报告
            </button>
          </div>
        </div>
      </div>
    </template>

    <ToastNotify ref="toast" />
  </div>
</template>
