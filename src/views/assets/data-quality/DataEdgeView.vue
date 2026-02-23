<script setup lang="ts">
import { ref } from 'vue'
import {
    GitPullRequestArrow, ScanSearch, FileCheck, Spline, PenLine,
    FileText, PlayCircle, AlertTriangle, Download
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 接边功能（5 个功能点）=====================
const edgeTools = [
    { key: 'autoCheck', label: '相邻图幅自动接边检查', icon: ScanSearch, desc: '自动检测跨图幅管线、节点的连接情况' },
    { key: 'attrCheck', label: '接边处属性一致性校验', icon: FileCheck, desc: '校验接边处要素属性信息是否一致' },
    { key: 'autoSmooth', label: '图形自动平滑接边', icon: Spline, desc: '自动调整接边处几何形状，平顺连接' },
    { key: 'manualAdjust', label: '手动接边调整工具', icon: PenLine, desc: '人工干预完成复杂跨图幅接边' },
    { key: 'report', label: '接边处理报告生成', icon: FileText, desc: '生成操作日志与结果统计报告' },
]
const activeTool = ref('')

// ===================== 图幅列表 =====================
const tileSheets = ref([
    { id: 'TS-001', name: '圭塘街道-东', neighbor: 'TS-002', status: 'checked', issues: 3, fixed: 2 },
    { id: 'TS-002', name: '圭塘街道-西', neighbor: 'TS-001', status: 'checked', issues: 5, fixed: 5 },
    { id: 'TS-003', name: '洞井街道-北', neighbor: 'TS-004', status: 'pending', issues: 0, fixed: 0 },
    { id: 'TS-004', name: '洞井街道-南', neighbor: 'TS-003', status: 'pending', issues: 0, fixed: 0 },
    { id: 'TS-005', name: '侯家塘街道-东', neighbor: 'TS-006', status: 'checked', issues: 7, fixed: 4 },
    { id: 'TS-006', name: '侯家塘街道-西', neighbor: 'TS-005', status: 'issue', issues: 8, fixed: 2 },
])

// ===================== 接边问题详情 =====================
const edgeIssues = ref([
    { id: 1, type: '管线断连', location: 'TS-001 ↔ TS-002 接边处', desc: '管段 PS-001234 断连，间距 0.3m', severity: 'high', status: '已修复' },
    { id: 2, type: '属性不一致', location: 'TS-001 ↔ TS-002 接边处', desc: '管径属性不一致：DN400 vs DN600', severity: 'medium', status: '已修复' },
    { id: 3, type: '管线偏移', location: 'TS-001 ↔ TS-002 接边处', desc: '管线横向偏移 1.2m', severity: 'low', status: '待处理' },
    { id: 4, type: '节点缺失', location: 'TS-005 ↔ TS-006 接边处', desc: '接边处缺少检查井节点', severity: 'high', status: '待处理' },
    { id: 5, type: '高程差异', location: 'TS-005 ↔ TS-006 接边处', desc: '接边处高程差 0.5m', severity: 'medium', status: '待处理' },
])

function runTool(key: string) {
    activeTool.value = key
    const tool = edgeTools.find(t => t.key === key)
    toast.value?.show(`${tool?.label}已启动`, 'info')
}

function runAutoCheck() {
    toast.value?.show('自动接边检查执行中...', 'info')
}

function getSheetStatusClass(s: string) {
    if (s === 'checked') return 'bg-success/15 text-success'
    if (s === 'issue') return 'bg-danger/15 text-danger'
    return 'bg-surface text-dim'
}
function getSheetStatusText(s: string) {
    if (s === 'checked') return '已检查'
    if (s === 'issue') return '有问题'
    return '待检查'
}

function getSeverityClass(s: string) { return s === 'high' ? 'bg-danger/15 text-danger' : s === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info' }

function handleExport() { toast.value?.show('接边报告导出中...', 'info') }
</script>

<template>
    <div class="space-y-4">
        <!-- 工具选择 -->
        <div class="grid grid-cols-5 gap-3">
            <button v-for="tool in edgeTools" :key="tool.key" @click="runTool(tool.key)"
                class="bg-card border rounded-xl p-3 shadow-themed text-left transition-all cursor-pointer"
                :class="activeTool === tool.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
                <div class="p-1.5 rounded-lg mb-2" :class="activeTool === tool.key ? 'bg-primary/20' : 'bg-surface'">
                    <component :is="tool.icon" class="w-4 h-4"
                        :class="activeTool === tool.key ? 'text-primary' : 'text-dim'" />
                </div>
                <p class="text-xs font-medium" :class="activeTool === tool.key ? 'text-primary' : 'text-default'">{{
                    tool.label }}</p>
                <p class="text-[10px] text-muted-themed mt-0.5 line-clamp-2">{{ tool.desc }}</p>
            </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- 图幅列表 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-1.5">
                        <GitPullRequestArrow class="w-4 h-4 text-primary" />图幅接边状态
                    </h3>
                    <button @click="runAutoCheck"
                        class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <PlayCircle class="w-3 h-3" />自动检查
                    </button>
                </div>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">图幅编号</th>
                            <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">名称</th>
                            <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">相邻图幅</th>
                            <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">问题/已修</th>
                            <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ts in tileSheets" :key="ts.id"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2 text-xs font-mono text-primary">{{ ts.id }}</td>
                            <td class="px-4 py-2 text-xs text-default">{{ ts.name }}</td>
                            <td class="px-4 py-2 text-xs text-dim font-mono">{{ ts.neighbor }}</td>
                            <td class="px-4 py-2 text-xs">
                                <span class="text-warning">{{ ts.issues }}</span>
                                <span class="text-dim"> / </span>
                                <span class="text-success">{{ ts.fixed }}</span>
                            </td>
                            <td class="px-4 py-2">
                                <span class="text-[10px] px-2 py-0.5 rounded-md"
                                    :class="getSheetStatusClass(ts.status)">{{ getSheetStatusText(ts.status) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 接边问题列表 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-1.5">
                        <AlertTriangle class="w-4 h-4 text-warning" />接边问题
                    </h3>
                    <button @click="handleExport"
                        class="flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer">
                        <Download class="w-3 h-3" />导出报告
                    </button>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="issue in edgeIssues" :key="issue.id" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-1">
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="getSeverityClass(issue.severity)">{{ issue.type }}</span>
                                <span class="text-xs font-medium text-default">{{ issue.location }}</span>
                            </div>
                            <span class="text-[10px] px-2 py-0.5 rounded-md"
                                :class="issue.status === '已修复' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'">{{
                                    issue.status }}</span>
                        </div>
                        <p class="text-[10px] text-muted-themed">{{ issue.desc }}</p>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
