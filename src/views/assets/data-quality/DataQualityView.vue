<script setup lang="ts">
import { ref } from 'vue'
import {
  GitMerge, ArrowDownUp, Route, Unplug, Copy,
  PlayCircle, BookTemplate, Settings2, FileText, Download,
  CheckCircle, XCircle, ChevronRight
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 质检规则（10 个功能点）=====================
const inspectionRules = ref([
  { id: 'QR-001', key: 'crossConnect', name: '管道混错接自动检测', desc: '基于管道流向与属性信息自动识别雨污混接点', icon: GitMerge, severity: 'high', enabled: true, lastRun: '2024-03-15 09:30', issues: 23 },
  { id: 'QR-002', key: 'bigToSmall', name: '大管接小管逻辑检查', desc: '自动校验管道连接合理性，下游管径小于上游', icon: ArrowDownUp, severity: 'high', enabled: true, lastRun: '2024-03-15 09:30', issues: 15 },
  { id: 'QR-003', key: 'deadEnd', name: '管网断头点识别', desc: '自动定位未与其他管线连接的管线末端', icon: Route, severity: 'medium', enabled: true, lastRun: '2024-03-14 14:20', issues: 42 },
  { id: 'QR-004', key: 'reverseSlope', name: '管道逆坡分析', desc: '自动检测管道坡度方向错误的管段', icon: ArrowDownUp, severity: 'medium', enabled: true, lastRun: '2024-03-14 14:20', issues: 18 },
  { id: 'QR-005', key: 'isolated', name: '孤立设施检查', desc: '发现未接入管网系统的独立井、管等设施', icon: Unplug, severity: 'low', enabled: true, lastRun: '2024-03-13 10:00', issues: 8 },
  { id: 'QR-006', key: 'duplicate', name: '空间与属性重复要素检测', desc: '识别位置或属性完全重复的地理要素', icon: Copy, severity: 'low', enabled: true, lastRun: '2024-03-13 10:00', issues: 31 },
])

// ===================== 批量质检 =====================
const selectedRules = ref<string[]>(['QR-001', 'QR-002', 'QR-003', 'QR-004', 'QR-005', 'QR-006'])
const batchRunning = ref(false)
const batchProgress = ref(0)

function toggleRuleSelect(id: string) {
  const idx = selectedRules.value.indexOf(id)
  if (idx >= 0) selectedRules.value.splice(idx, 1)
  else selectedRules.value.push(id)
}

function runBatchInspection() {
  if (selectedRules.value.length === 0) { toast.value?.show('请至少选择一项质检规则', 'warning'); return }
  batchRunning.value = true; batchProgress.value = 0
  const interval = setInterval(() => {
    batchProgress.value += 10
    if (batchProgress.value >= 100) {
      clearInterval(interval); batchRunning.value = false
      toast.value?.show(`批量质检完成，${selectedRules.value.length} 条规则已执行`, 'success')
    }
  }, 300)
}

// ===================== 规则模板库 =====================
const ruleTemplates = ref([
  { id: 'TPL-01', name: '排水管网标准质检', rules: 6, desc: '适用于排水管网的标准化质检流程', usageCount: 128 },
  { id: 'TPL-02', name: '新入库数据快检', rules: 4, desc: '新导入数据的快速质量校验', usageCount: 56 },
  { id: 'TPL-03', name: '区域边界数据质检', rules: 3, desc: '跨区域接边数据专项校验', usageCount: 34 },
])

function applyTemplate(name: string) { toast.value?.show(`已应用模板「${name}」`, 'success') }

// ===================== 自定义规则 =====================
const showCustomRule = ref(false)
const customRuleForm = ref({ name: '', field: '', operator: '>', value: '', severity: 'medium' })
function saveCustomRule() {
  if (!customRuleForm.value.name) { toast.value?.show('请输入规则名称', 'warning'); return }
  toast.value?.show(`自定义规则「${customRuleForm.value.name}」已保存`, 'success')
  showCustomRule.value = false
  customRuleForm.value = { name: '', field: '', operator: '>', value: '', severity: 'medium' }
}

// ===================== 质检报告 =====================
const reports = ref([
  { id: 'RPT-001', name: '2024年Q1数据质检报告', date: '2024-03-15', totalChecked: 28136, passed: 26820, failed: 1316, passRate: 95.3, status: 'completed' },
  { id: 'RPT-002', name: '排水管网数据专项质检', date: '2024-03-10', totalChecked: 15680, passed: 14892, failed: 788, passRate: 95.0, status: 'completed' },
  { id: 'RPT-003', name: '新入库数据质检', date: '2024-03-14', totalChecked: 320, passed: 298, failed: 22, passRate: 93.1, status: 'completed' },
])

function downloadReport(name: string) { toast.value?.show(`正在下载「${name}」...`, 'info') }
function generateReport() { toast.value?.show('正在生成质检报告...', 'info') }

// ===================== 通用 =====================
function getSeverityClass(s: string) { return s === 'high' ? 'bg-danger/15 text-danger' : s === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info' }
function getSeverityText(s: string) { return s === 'high' ? '严重' : s === 'medium' ? '一般' : '轻微' }
</script>

<template>
  <div class="space-y-4">
    <!-- 质检概览 -->
    <div class="grid grid-cols-4 gap-3">
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <p class="text-xs text-dim mb-1">质检规则</p>
        <p class="text-xl font-bold text-default">{{ inspectionRules.length }} <span
            class="text-xs text-muted-themed font-normal">条</span></p>
      </div>
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <p class="text-xs text-dim mb-1">已启用规则</p>
        <p class="text-xl font-bold text-success">{{inspectionRules.filter(r => r.enabled).length}} <span
            class="text-xs text-muted-themed font-normal">条</span></p>
      </div>
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <p class="text-xs text-dim mb-1">待处理问题</p>
        <p class="text-xl font-bold text-warning">{{inspectionRules.reduce((s, r) => s + r.issues, 0)}} <span
            class="text-xs text-muted-themed font-normal">项</span></p>
      </div>
      <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <p class="text-xs text-dim mb-1">质检报告</p>
        <p class="text-xl font-bold text-default">{{ reports.length }} <span
            class="text-xs text-muted-themed font-normal">份</span></p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <!-- 左侧：质检规则列表 -->
      <div class="col-span-2 space-y-4">
        <!-- 批量质检工具栏 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <PlayCircle class="w-4 h-4 text-primary" />
              <span class="text-xs font-semibold text-default">批量质检</span>
              <span class="text-[10px] text-muted-themed">已选 {{ selectedRules.length }} 条规则</span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="showCustomRule = !showCustomRule"
                class="flex items-center gap-1 px-3 py-1.5 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                <Settings2 class="w-3.5 h-3.5" /> 自定义规则
              </button>
              <button @click="runBatchInspection" :disabled="batchRunning"
                class="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light disabled:opacity-50 transition-colors cursor-pointer">
                <PlayCircle class="w-3.5 h-3.5" /> 执行质检
              </button>
            </div>
          </div>
          <!-- 进度条 -->
          <div v-if="batchRunning" class="mt-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] text-dim">质检进度</span>
              <span class="text-[10px] text-primary font-medium">{{ batchProgress }}%</span>
            </div>
            <div class="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full transition-all" :style="{ width: batchProgress + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- 规则卡片 -->
        <div class="space-y-2">
          <div v-for="rule in inspectionRules" :key="rule.id"
            class="bg-card border border-themed rounded-xl shadow-themed p-3 hover:border-primary/30 transition-colors">
            <div class="flex items-start gap-3">
              <label class="mt-0.5 cursor-pointer">
                <input type="checkbox" :checked="selectedRules.includes(rule.id)" @change="toggleRuleSelect(rule.id)"
                  class="w-3.5 h-3.5 accent-primary cursor-pointer" />
              </label>
              <div class="p-2 rounded-lg bg-surface">
                <component :is="rule.icon" class="w-4 h-4 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-semibold text-default">{{ rule.name }}</span>
                  <span class="text-[10px] font-mono text-muted-themed">{{ rule.id }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded" :class="getSeverityClass(rule.severity)">{{
                    getSeverityText(rule.severity) }}</span>
                </div>
                <p class="text-[10px] text-muted-themed">{{ rule.desc }}</p>
                <div class="flex items-center gap-4 mt-2 text-[10px] text-dim">
                  <span>上次运行: {{ rule.lastRun }}</span>
                  <span class="text-warning font-medium">发现 {{ rule.issues }} 个问题</span>
                </div>
              </div>
              <button @click="rule.enabled = !rule.enabled; toast?.show(`规则已${rule.enabled ? '启用' : '停用'}`, 'info')"
                class="text-[10px] px-2.5 py-1 rounded-md cursor-pointer transition-colors"
                :class="rule.enabled ? 'bg-success/15 text-success hover:bg-success/25' : 'bg-surface text-dim hover:bg-hover-themed'">
                {{ rule.enabled ? '已启用' : '已停用' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="space-y-4">
        <!-- 规则模板库 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
          <div class="px-3 py-2.5 border-b border-themed flex items-center gap-1.5">
            <BookTemplate class="w-3.5 h-3.5 text-primary" />
            <span class="text-xs font-semibold text-default">规则模板库</span>
          </div>
          <div class="p-2 space-y-1">
            <button v-for="tpl in ruleTemplates" :key="tpl.id" @click="applyTemplate(tpl.name)"
              class="w-full text-left p-2.5 rounded-lg bg-surface hover:bg-hover-themed transition-colors cursor-pointer">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-default">{{ tpl.name }}</span>
                <ChevronRight class="w-3 h-3 text-muted-themed" />
              </div>
              <p class="text-[10px] text-muted-themed">{{ tpl.desc }}</p>
              <div class="flex items-center gap-3 mt-1 text-[10px] text-dim">
                <span>{{ tpl.rules }} 条规则</span>
                <span>使用 {{ tpl.usageCount }} 次</span>
              </div>
            </button>
          </div>
        </div>

        <!-- 自定义规则弹窗 -->
        <div v-if="showCustomRule" class="bg-card border border-primary/30 rounded-xl shadow-themed p-3">
          <h4 class="text-xs font-semibold text-default mb-3 flex items-center gap-1.5">
            <Settings2 class="w-3.5 h-3.5 text-primary" /> 自定义质检规则
          </h4>
          <div class="space-y-2">
            <input v-model="customRuleForm.name" type="text" placeholder="规则名称"
              class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
            <div class="grid grid-cols-3 gap-1.5">
              <input v-model="customRuleForm.field" type="text" placeholder="检查字段"
                class="bg-input border border-themed rounded-lg px-2 py-2 text-xs text-default focus:outline-none focus:border-primary" />
              <select v-model="customRuleForm.operator"
                class="bg-input border border-themed rounded-lg px-2 py-2 text-xs text-default focus:outline-none focus:border-primary">
                <option value=">">大于</option>
                <option value="<">小于</option>
                <option value="=">等于</option>
                <option value="!=">不等于</option>
                <option value="contains">包含</option>
              </select>
              <input v-model="customRuleForm.value" type="text" placeholder="阈值"
                class="bg-input border border-themed rounded-lg px-2 py-2 text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <select v-model="customRuleForm.severity"
              class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
              <option value="high">严重</option>
              <option value="medium">一般</option>
              <option value="low">轻微</option>
            </select>
            <div class="flex gap-2">
              <button @click="saveCustomRule"
                class="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">保存规则</button>
              <button @click="showCustomRule = false"
                class="px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:bg-hover-themed transition-colors cursor-pointer">取消</button>
            </div>
          </div>
        </div>

        <!-- 质检报告 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
          <div class="px-3 py-2.5 border-b border-themed flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <FileText class="w-3.5 h-3.5 text-primary" />
              <span class="text-xs font-semibold text-default">质检报告</span>
            </div>
            <button @click="generateReport"
              class="text-[10px] text-primary hover:underline cursor-pointer">生成报告</button>
          </div>
          <div class="p-2 space-y-1">
            <div v-for="rpt in reports" :key="rpt.id" class="p-2.5 rounded-lg bg-surface">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-medium text-default">{{ rpt.name }}</span>
                <span class="text-[10px] bg-success/15 text-success px-1.5 py-0.5 rounded">完成</span>
              </div>
              <div class="flex items-center gap-3 text-[10px] text-dim mb-1.5">
                <span>{{ rpt.date }}</span>
                <span>检查 {{ rpt.totalChecked.toLocaleString() }} 条</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-[10px]">
                  <span class="flex items-center gap-0.5">
                    <CheckCircle class="w-3 h-3 text-success" />{{ rpt.passed.toLocaleString() }}
                  </span>
                  <span class="flex items-center gap-0.5">
                    <XCircle class="w-3 h-3 text-danger" />{{ rpt.failed.toLocaleString() }}
                  </span>
                  <span class="font-medium" :class="rpt.passRate >= 95 ? 'text-success' : 'text-warning'">{{
                    rpt.passRate }}%</span>
                </div>
                <button @click="downloadReport(rpt.name)"
                  class="text-[10px] text-primary hover:underline cursor-pointer flex items-center gap-0.5">
                  <Download class="w-3 h-3" />下载
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ToastNotify ref="toast" />
  </div>
</template>
