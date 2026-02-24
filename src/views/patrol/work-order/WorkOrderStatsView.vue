<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Pencil, Trash2, Download, Printer, BarChart3, FileText, Settings, ArrowRight, GripVertical } from 'lucide-vue-next'

const activeFunc = ref('templates')
const funcTabs = [
    { key: 'templates', label: '工单模板' },
    { key: 'reports', label: '统计报告' },
    { key: 'kpi', label: '关键指标' },
    { key: 'workflow', label: '流程配置' },
]

// 模板
const templates = ref([
    { id: 'WT-001', name: '主干管网例行巡查工单', type: '例行', scope: '主干管网', points: 15, items: 12, estimateTime: '3.5小时', usedCount: 32, lastUsed: '2024-03-01' },
    { id: 'WT-002', name: '排口月度巡查工单', type: '例行', scope: '排口设施', points: 10, items: 8, estimateTime: '2小时', usedCount: 24, lastUsed: '2024-03-01' },
    { id: 'WT-003', name: '暴雨应急巡查工单', type: '应急', scope: '低洼/泵站', points: 8, items: 6, estimateTime: '1.5小时', usedCount: 5, lastUsed: '2024-03-15' },
    { id: 'WT-004', name: '管线异常排查工单', type: '临时', scope: '指定区域', points: 5, items: 10, estimateTime: '2小时', usedCount: 12, lastUsed: '2024-03-14' },
    { id: 'WT-005', name: '问题复查确认工单', type: '复查', scope: '整改点位', points: 3, items: 5, estimateTime: '1小时', usedCount: 18, lastUsed: '2024-03-10' },
])

// 报告
const reports = ref([
    { period: '2024年3月', total: 28, completed: 22, completionRate: 78.6, avgTime: '2.8小时', overdue: 2, overdueRate: 7.1, issues: 8, critical: 1 },
    { period: '2024年2月', total: 25, completed: 24, completionRate: 96.0, avgTime: '2.5小时', overdue: 1, overdueRate: 4.0, issues: 5, critical: 0 },
    { period: '2024年1月', total: 20, completed: 20, completionRate: 100.0, avgTime: '2.3小时', overdue: 0, overdueRate: 0, issues: 3, critical: 0 },
])

// ===================== 关键指标 =====================
const kpiFilter = ref('all')
const kpiData = ref({
    total: 73, completed: 66, completionRate: 90.4, dutyRate: 95.2,
    avgResponseTime: '35分钟', avgExecuteTime: '2.5小时', overdueCount: 3, overdueRate: 4.1,
    byStatus: [
        { status: '待审核', count: 2, color: 'text-warning' },
        { status: '待派发', count: 1, color: 'text-info' },
        { status: '执行中', count: 4, color: 'text-primary' },
        { status: '已完成', count: 63, color: 'text-success' },
        { status: '已驳回', count: 1, color: 'text-danger' },
        { status: '超时', count: 3, color: 'text-danger' },
    ],
    byMonth: [
        { month: '1月', total: 20, completed: 20, rate: 100 },
        { month: '2月', total: 25, completed: 24, rate: 96 },
        { month: '3月', total: 28, completed: 22, rate: 78.6 },
    ],
})

// ===================== 工单流程配置 =====================
const workflowSteps = ref([
    { id: 1, name: '工单创建', desc: '巡检员或系统自动创建工单', autoApprove: false, timeout: 0, role: '巡检员/系统', enabled: true },
    { id: 2, name: '工单审核', desc: '管理员审核工单内容和优先级', autoApprove: false, timeout: 24, role: '管理员', enabled: true },
    { id: 3, name: '工单派发', desc: '将审核通过的工单分配给巡检人员', autoApprove: false, timeout: 4, role: '调度员', enabled: true },
    { id: 4, name: '工单执行', desc: '巡检人员按工单要求执行巡查', autoApprove: false, timeout: 48, role: '巡检员', enabled: true },
    { id: 5, name: '结果审核', desc: '审核巡查结果和上报问题', autoApprove: true, timeout: 12, role: '管理员', enabled: true },
    { id: 6, name: '工单闭环', desc: '确认完成并关闭工单', autoApprove: true, timeout: 0, role: '系统', enabled: true },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 模板 -->
        <div v-if="activeFunc === 'templates'" class="grid grid-cols-2 gap-3">
            <div v-for="t in templates" :key="t.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                    t.name }}</span><span
                        class="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{{ t.type
                        }}</span></div>
                <div class="grid grid-cols-2 gap-y-1 text-[10px] mb-3">
                    <div><span class="text-dim">范围: </span><span class="text-default">{{ t.scope }}</span></div>
                    <div><span class="text-dim">巡查点: </span><span class="text-default">{{ t.points }}个</span></div>
                    <div><span class="text-dim">检查项: </span><span class="text-default">{{ t.items }}项</span></div>
                    <div><span class="text-dim">预计耗时: </span><span class="text-default">{{ t.estimateTime }}</span>
                    </div>
                    <div><span class="text-dim">使用次数: </span><span class="text-primary font-bold">{{ t.usedCount
                            }}</span></div>
                    <div><span class="text-dim">最近使用: </span><span class="text-default">{{ t.lastUsed }}</span></div>
                </div>
                <div class="flex items-center gap-1 pt-2 border-t border-themed/30">
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer" title="使用模板">
                        <Copy class="w-3 h-3 text-primary" />
                    </button>
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                        <Pencil class="w-3 h-3 text-dim" />
                    </button>
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                        <Trash2 class="w-3 h-3 text-danger" />
                    </button>
                </div>
            </div>
        </div>

        <!-- 统计报告 -->
        <template v-if="activeFunc === 'reports'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <BarChart3 class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">工单统计报告</span>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        class="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed transition-colors cursor-pointer">
                        <Download class="w-3.5 h-3.5" />导出
                    </button>
                    <button
                        class="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed transition-colors cursor-pointer">
                        <Printer class="w-3.5 h-3.5" />打印
                    </button>
                </div>
            </div>
            <div class="space-y-3">
                <div v-for="r in reports" :key="r.period"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <FileText class="w-4 h-4 text-info" /><span class="text-xs font-bold text-default">{{
                                r.period }} 工单统计</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 gap-3 mb-3">
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-default">{{ r.total }}</p>
                            <p class="text-[10px] text-dim">总工单</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-success">{{ r.completed }}</p>
                            <p class="text-[10px] text-dim">已完成</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold"
                                :class="r.completionRate >= 90 ? 'text-success' : r.completionRate >= 70 ? 'text-warning' : 'text-danger'">
                                {{ r.completionRate }}%</p>
                            <p class="text-[10px] text-dim">完成率</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-info">{{ r.avgTime }}</p>
                            <p class="text-[10px] text-dim">平均耗时</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 gap-3">
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold" :class="r.overdue > 0 ? 'text-danger' : 'text-success'">{{
                                r.overdue }}</p>
                            <p class="text-[10px] text-dim">超时工单</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold" :class="r.overdueRate > 5 ? 'text-danger' : 'text-success'">{{
                                r.overdueRate }}%</p>
                            <p class="text-[10px] text-dim">超时率</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-warning">{{ r.issues }}</p>
                            <p class="text-[10px] text-dim">上报问题</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold" :class="r.critical > 0 ? 'text-danger' : 'text-success'">{{
                                r.critical }}</p>
                            <p class="text-[10px] text-dim">严重问题</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 关键指标统计 -->
        <template v-if="activeFunc === 'kpi'">
            <!-- 顶部指标卡 -->
            <div class="grid grid-cols-4 gap-3">
                <button @click="kpiFilter = kpiFilter === 'all' ? 'all' : 'all'"
                    class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center cursor-pointer hover:border-primary transition-colors"
                    :class="kpiFilter === 'all' ? 'border-primary ring-1 ring-primary/30' : ''">
                    <p class="text-2xl font-bold text-default">{{ kpiData.total }}</p>
                    <p class="text-[10px] text-dim mt-0.5">总工单</p>
                </button>
                <button @click="kpiFilter = kpiFilter === 'completed' ? 'all' : 'completed'"
                    class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center cursor-pointer hover:border-success transition-colors"
                    :class="kpiFilter === 'completed' ? 'border-success ring-1 ring-success/30' : ''">
                    <p class="text-2xl font-bold text-success">{{ kpiData.completionRate }}%</p>
                    <p class="text-[10px] text-dim mt-0.5">完成率</p>
                </button>
                <button @click="kpiFilter = kpiFilter === 'duty' ? 'all' : 'duty'"
                    class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center cursor-pointer hover:border-info transition-colors"
                    :class="kpiFilter === 'duty' ? 'border-info ring-1 ring-info/30' : ''">
                    <p class="text-2xl font-bold text-info">{{ kpiData.dutyRate }}%</p>
                    <p class="text-[10px] text-dim mt-0.5">履职率</p>
                </button>
                <button @click="kpiFilter = kpiFilter === 'overdue' ? 'all' : 'overdue'"
                    class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center cursor-pointer hover:border-danger transition-colors"
                    :class="kpiFilter === 'overdue' ? 'border-danger ring-1 ring-danger/30' : ''">
                    <p class="text-2xl font-bold text-danger">{{ kpiData.overdueCount }}</p>
                    <p class="text-[10px] text-dim mt-0.5">超时工单</p>
                </button>
            </div>

            <!-- 筛选后结果 -->
            <div v-if="kpiFilter === 'overdue'" class="bg-card border border-danger/30 rounded-xl shadow-themed p-4">
                <p class="text-xs font-semibold text-danger mb-2">⚠ 超时工单（{{ kpiData.overdueCount }}条）</p>
                <div class="space-y-2">
                    <div class="flex items-center justify-between p-2 rounded-lg bg-surface text-[10px]">
                        <span class="text-primary font-mono">WO-2024-007</span>
                        <span class="text-default">万家丽路雨水管网排查</span>
                        <span class="text-danger font-medium">超时12小时</span>
                    </div>
                    <div class="flex items-center justify-between p-2 rounded-lg bg-surface text-[10px]">
                        <span class="text-primary font-mono">WO-2024-011</span>
                        <span class="text-default">侯家塘街道混接排查</span>
                        <span class="text-danger font-medium">超时6小时</span>
                    </div>
                    <div class="flex items-center justify-between p-2 rounded-lg bg-surface text-[10px]">
                        <span class="text-primary font-mono">WO-2024-015</span>
                        <span class="text-default">黎托街道泵站巡检</span>
                        <span class="text-danger font-medium">超时3小时</span>
                    </div>
                </div>
            </div>

            <!-- 状态分布 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <p class="text-xs font-semibold text-default mb-3">状态分布</p>
                <div class="space-y-2">
                    <div v-for="s in kpiData.byStatus" :key="s.status" class="flex items-center gap-3">
                        <span class="text-[10px] text-dim w-12 shrink-0">{{ s.status }}</span>
                        <div class="flex-1 h-4 bg-surface rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all" :class="s.color.replace('text-', 'bg-')"
                                :style="{ width: (s.count / kpiData.total * 100) + '%', minWidth: '4px' }">
                            </div>
                        </div>
                        <span class="text-[10px] font-bold w-6 text-right" :class="s.color">{{ s.count }}</span>
                    </div>
                </div>
            </div>

            <!-- 月度趋势进度条 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <p class="text-xs font-semibold text-default mb-3">月度完成趋势</p>
                <div class="space-y-3">
                    <div v-for="m in kpiData.byMonth" :key="m.month" class="flex items-center gap-3">
                        <span class="text-[10px] text-dim w-8 shrink-0">{{ m.month }}</span>
                        <div class="flex-1">
                            <div class="h-5 bg-surface rounded-full overflow-hidden relative">
                                <div class="h-full rounded-full transition-all"
                                    :class="m.rate >= 90 ? 'bg-success' : m.rate >= 70 ? 'bg-warning' : 'bg-danger'"
                                    :style="{ width: m.rate + '%' }">
                                </div>
                                <span
                                    class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white mix-blend-difference">{{
                                        m.completed }}/{{ m.total }}</span>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold w-10 text-right"
                            :class="m.rate >= 90 ? 'text-success' : m.rate >= 70 ? 'text-warning' : 'text-danger'">{{
                                m.rate }}%</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- 工单流程自定义配置 -->
        <template v-if="activeFunc === 'workflow'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Settings class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">工单流程配置</span>
                </div>
                <p class="text-[10px] text-dim">定义工单从创建到闭环的完整流程节点</p>
            </div>

            <!-- 流程可视化 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <p class="text-xs font-semibold text-default mb-3">当前流程</p>
                <div class="flex items-center gap-1 overflow-x-auto pb-2">
                    <template v-for="(step, i) in workflowSteps" :key="step.id">
                        <div class="flex flex-col items-center shrink-0 px-2 py-1.5 rounded-lg min-w-[80px]"
                            :class="step.enabled ? 'bg-primary/10' : 'bg-surface opacity-50'">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1"
                                :class="step.enabled ? 'bg-primary text-white' : 'bg-surface text-dim'">{{ i + 1 }}
                            </div>
                            <span class="text-[10px] font-semibold"
                                :class="step.enabled ? 'text-primary' : 'text-dim'">{{ step.name }}</span>
                            <span class="text-[8px] text-dim">{{ step.role }}</span>
                        </div>
                        <ArrowRight v-if="i < workflowSteps.length - 1" class="w-3 h-3 text-dim shrink-0" />
                    </template>
                </div>
            </div>

            <!-- 节点详情配置 -->
            <div class="space-y-2">
                <div v-for="(step, i) in workflowSteps" :key="step.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-3">
                        <GripVertical class="w-3.5 h-3.5 text-dim shrink-0 cursor-move" />
                        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            :class="step.enabled ? 'bg-primary text-white' : 'bg-surface text-dim'">{{ i + 1 }}</div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-default">{{ step.name }}</span>
                                <span class="text-[9px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ step.role
                                }}</span>
                            </div>
                            <p class="text-[10px] text-dim mt-0.5">{{ step.desc }}</p>
                        </div>
                        <div class="flex items-center gap-3 shrink-0">
                            <div class="flex items-center gap-1.5">
                                <span class="text-[10px] text-dim">超时:</span>
                                <input v-model.number="step.timeout" type="number" min="0"
                                    class="w-12 bg-input border border-themed rounded px-1.5 py-0.5 text-[10px] text-default text-center focus:outline-none focus:border-primary" />
                                <span class="text-[10px] text-dim">h</span>
                            </div>
                            <label class="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" v-model="step.autoApprove" class="w-3 h-3 accent-primary" />
                                <span class="text-[10px] text-dim">自动通过</span>
                            </label>
                            <label class="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" v-model="step.enabled" class="w-3 h-3 accent-primary" />
                                <span class="text-[10px]" :class="step.enabled ? 'text-success' : 'text-danger'">{{
                                    step.enabled ?
                                        '启用' : '禁用' }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
