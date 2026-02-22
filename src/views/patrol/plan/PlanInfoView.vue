<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Pencil, Trash2, Eye, CheckCircle, XCircle, Copy } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('plans')
const funcTabs = [
    { key: 'plans', label: '计划信息管理' },
    { key: 'approval', label: '审批流程' },
    { key: 'templates', label: '模板管理' },
]

// 计划列表
const plans = ref([
    { id: 'PL-2024-001', name: '朝阳区主干管网季度巡查', area: '朝阳区', cycle: '季度', scope: '主干管网 DN400以上', assignee: '张伟', status: 'active', startDate: '2024-01-01', endDate: '2024-03-31', points: 45, progress: 78 },
    { id: 'PL-2024-002', name: '西城区排口日常巡查', area: '西城区', cycle: '月度', scope: '排口及检查井', assignee: '李明', status: 'active', startDate: '2024-03-01', endDate: '2024-03-31', points: 28, progress: 55 },
    { id: 'PL-2024-003', name: '丰台区暴雨应急巡查', area: '丰台区', cycle: '临时', scope: '低洼点、泵站进出口', assignee: '王强', status: 'pending', startDate: '2024-03-15', endDate: '2024-03-16', points: 15, progress: 0 },
    { id: 'PL-2024-004', name: '通州区管网年度普查', area: '通州区', cycle: '年度', scope: '全覆盖', assignee: '赵刚', status: 'completed', startDate: '2024-01-01', endDate: '2024-12-31', points: 120, progress: 100 },
])

// 审批
const approvals = ref([
    { id: 'APR-001', plan: 'PL-2024-003', planName: '丰台区暴雨应急巡查', applicant: '王强', applyTime: '2024-03-14 09:00', level: 1, approver: '李主管', status: 'pending', remark: '暴雨预警，需紧急巡查' },
    { id: 'APR-002', plan: 'PL-2024-002', planName: '西城区排口日常巡查', applicant: '李明', applyTime: '2024-02-28 14:00', level: 2, approver: '张主任', status: 'approved', remark: '3月例行巡查', approveTime: '2024-02-28 16:30' },
    { id: 'APR-003', plan: 'PL-2024-001', planName: '朝阳区主干管网季度巡查', applicant: '张伟', applyTime: '2023-12-25 10:00', level: 2, approver: '张主任', status: 'approved', remark: 'Q1巡查计划', approveTime: '2023-12-26 09:00' },
])

// 模板
const templates = ref([
    { id: 'TPL-001', name: '主干管网季度巡查模板', type: '季度', scope: '主干管网', points: 40, items: 12, lastUsed: '2024-01-01', usedCount: 8 },
    { id: 'TPL-002', name: '排口月度巡查模板', type: '月度', scope: '排口/检查井', points: 25, items: 8, lastUsed: '2024-03-01', usedCount: 24 },
    { id: 'TPL-003', name: '暴雨应急巡查模板', type: '临时', scope: '低洼点/泵站', points: 15, items: 6, lastUsed: '2024-03-15', usedCount: 5 },
    { id: 'TPL-004', name: '年度全覆盖普查模板', type: '年度', scope: '全覆盖', points: 100, items: 20, lastUsed: '2024-01-01', usedCount: 2 },
])

const showDetail = ref(false)
const detailPlan = ref<typeof plans.value[0] | null>(null)
function viewPlan(p: typeof plans.value[0]) { detailPlan.value = p; showDetail.value = true }

function getStatusColor(s: string) { return s === 'active' ? 'text-success' : s === 'pending' ? 'text-warning' : s === 'completed' ? 'text-info' : 'text-dim' }
function getStatusBg(s: string) { return s === 'active' ? 'bg-success/10' : s === 'pending' ? 'bg-warning/10' : s === 'completed' ? 'bg-info/10' : 'bg-surface' }
function getStatusText(s: string) { return s === 'active' ? '执行中' : s === 'pending' ? '待审批' : s === 'completed' ? '已完成' : '已终止' }

function approvePlan(a: typeof approvals.value[0]) { a.status = 'approved'; toast.value?.show(`"${a.planName}" 已审批通过`, 'success') }
function rejectPlan(a: typeof approvals.value[0]) { a.status = 'rejected'; toast.value?.show(`"${a.planName}" 已驳回`, 'warning') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                    class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                        ft.label }}</button>
            </div>
            <button v-if="activeFunc === 'plans'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" />新增计划
            </button>
        </div>

        <!-- 计划信息管理 -->
        <template v-if="activeFunc === 'plans'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ plans.length }}</p>
                    <p class="text-[10px] text-dim mt-0.5">总计划数</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{plans.filter(p => p.status === 'active').length}}</p>
                    <p class="text-[10px] text-dim mt-0.5">执行中</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-warning">{{plans.filter(p => p.status === 'pending').length}}
                    </p>
                    <p class="text-[10px] text-dim mt-0.5">待审批</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{plans.filter(p => p.status === 'completed').length}}</p>
                    <p class="text-[10px] text-dim mt-0.5">已完成</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">计划名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">周期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">责任人</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">巡查点</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">进度</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in plans" :key="p.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-primary font-mono">{{ p.id }}</td>
                            <td class="px-4 py-2.5 text-default font-medium">{{ p.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.area }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.cycle }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.assignee }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.points }}</td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center gap-1.5">
                                    <div class="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full transition-all"
                                            :class="p.progress === 100 ? 'bg-success' : 'bg-primary'"
                                            :style="{ width: p.progress + '%' }"></div>
                                    </div><span class="text-[10px] text-dim w-8 text-right">{{ p.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-4 py-2.5"><span
                                    class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="[getStatusColor(p.status), getStatusBg(p.status)]">{{
                                        getStatusText(p.status) }}</span></td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center justify-center gap-1"><button @click="viewPlan(p)"
                                        class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                        <Eye class="w-3 h-3 text-primary" />
                                    </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                        <Pencil class="w-3 h-3 text-dim" />
                                    </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                        <Trash2 class="w-3 h-3 text-danger" />
                                    </button></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 审批流程 -->
        <template v-if="activeFunc === 'approval'">
            <div class="space-y-3">
                <div v-for="a in approvals" :key="a.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center gap-2 mb-1"><span class="text-xs font-bold text-default">{{
                                a.planName }}</span><span class="text-[10px] text-primary font-mono">{{ a.plan
                                    }}</span></div>
                            <div class="flex items-center gap-3 text-[10px] text-dim"><span>申请人: {{ a.applicant
                            }}</span><span>时间: {{ a.applyTime }}</span><span>第{{ a.level }}级审批</span><span>审批人:
                                    {{ a.approver }}</span></div>
                            <p class="text-[10px] text-default mt-1.5">{{ a.remark }}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="a.status === 'approved' ? 'bg-success/10 text-success' : a.status === 'rejected' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">{{
                                    a.status === 'approved' ? '已通过' : a.status === 'rejected' ? '已驳回' : '待审批' }}</span>
                            <template v-if="a.status === 'pending'">
                                <button @click="approvePlan(a)"
                                    class="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors cursor-pointer">
                                    <CheckCircle class="w-3.5 h-3.5" />
                                </button>
                                <button @click="rejectPlan(a)"
                                    class="p-1.5 rounded-md bg-danger/10 text-danger hover:bg-danger/20 transition-colors cursor-pointer">
                                    <XCircle class="w-3.5 h-3.5" />
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 模板管理 -->
        <template v-if="activeFunc === 'templates'">
            <div class="grid grid-cols-2 gap-3">
                <div v-for="t in templates" :key="t.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        t.name }}</span><span
                            class="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{{ t.type
                            }}</span></div>
                    <div class="grid grid-cols-2 gap-y-1 text-[10px] mb-3">
                        <div><span class="text-dim">范围: </span><span class="text-default">{{ t.scope }}</span></div>
                        <div><span class="text-dim">巡查点: </span><span class="text-default">{{ t.points }}个</span></div>
                        <div><span class="text-dim">检查项: </span><span class="text-default">{{ t.items }}项</span></div>
                        <div><span class="text-dim">使用次数: </span><span class="text-primary font-bold">{{ t.usedCount
                        }}</span></div>
                    </div>
                    <div class="flex items-center justify-between pt-2 border-t border-themed/30">
                        <span class="text-[10px] text-dim">最近使用: {{ t.lastUsed }}</span>
                        <div class="flex items-center gap-1">
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
            </div>
        </template>

        <ModalDialog :show="showDetail" title="计划详情" @close="showDetail = false" @confirm="showDetail = false">
            <div v-if="detailPlan" class="space-y-3 text-xs">
                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">编号</p>
                        <p class="text-default font-bold mt-0.5">{{ detailPlan.id }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">名称</p>
                        <p class="text-default font-bold mt-0.5">{{ detailPlan.name }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">区域</p>
                        <p class="text-default mt-0.5">{{ detailPlan.area }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">周期</p>
                        <p class="text-default mt-0.5">{{ detailPlan.cycle }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">范围</p>
                        <p class="text-default mt-0.5">{{ detailPlan.scope }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">责任人</p>
                        <p class="text-default mt-0.5">{{ detailPlan.assignee }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">起止时间</p>
                        <p class="text-default mt-0.5">{{ detailPlan.startDate }} 至 {{ detailPlan.endDate }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">巡查点数</p>
                        <p class="text-primary font-bold mt-0.5">{{ detailPlan.points }}</p>
                    </div>
                </div>
            </div>
        </ModalDialog>
        <ToastNotify ref="toast" />
    </div>
</template>
