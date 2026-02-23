<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Eye, CheckCircle, XCircle, Send } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('list')
const funcTabs = [
    { key: 'list', label: '工单信息' },
    { key: 'review', label: '工单审核' },
    { key: 'dispatch', label: '工单派发' },
]

const orders = ref([
    { id: 'WO-2024-001', title: '万家丽路主干管网季度巡查', plan: 'PL-2024-001', type: '例行', priority: 'B', area: '圭塘街道', assignee: '张伟', createTime: '2024-03-01 08:00', deadline: '2024-03-07', status: 'in_progress', progress: 65, points: 15 },
    { id: 'WO-2024-002', title: '侯家塘街道排口月度巡查', plan: 'PL-2024-002', type: '例行', priority: 'B', area: '侯家塘街道', assignee: '李明', createTime: '2024-03-01 08:30', deadline: '2024-03-05', status: 'in_progress', progress: 40, points: 10 },
    { id: 'WO-2024-003', title: '左家塘街道暴雨应急巡查', plan: 'PL-2024-003', type: '应急', priority: 'S', area: '左家塘街道', assignee: '', createTime: '2024-03-15 06:00', deadline: '2024-03-15', status: 'pending_review', progress: 0, points: 8 },
    { id: 'WO-2024-004', title: '黎托街道浏阳河段异常排查', plan: '', type: '临时', priority: 'A', area: '黎托街道', assignee: '赵刚', createTime: '2024-03-14 14:00', deadline: '2024-03-15', status: 'pending_dispatch', progress: 0, points: 5 },
    { id: 'WO-2024-005', title: '圭塘街道劳动路管段复查', plan: 'PL-2024-001', type: '复查', priority: 'A', area: '圭塘街道', assignee: '王强', createTime: '2024-03-10 09:00', deadline: '2024-03-12', status: 'completed', progress: 100, points: 3 },
])

const showDetail = ref(false)
const detailOrder = ref<typeof orders.value[0] | null>(null)
function viewOrder(o: typeof orders.value[0]) { detailOrder.value = o; showDetail.value = true }

const reviewOrders = ref([
    { id: 'WO-2024-003', title: '左家塘街道暴雨应急巡查', type: '应急', applicant: '王强', time: '2024-03-15 06:00', points: 8, items: 6, remark: '暴雨橙色预警，需紧急巡查低洼区域', status: 'pending' },
    { id: 'WO-2024-006', title: '洞井街道浏阳河排口专项', type: '专项', applicant: '刘芳', time: '2024-03-14 10:00', points: 6, items: 4, remark: '水质异常疑似混接，需排查', status: 'pending' },
])

const dispatchOrders = ref([
    { id: 'WO-2024-004', title: '黎托街道浏阳河段异常排查', type: '临时', priority: 'A', area: '黎托街道', points: 5, deadline: '2024-03-15', candidates: ['赵刚', '陈亮', '王强'], selected: '' },
])

function approveOrder(o: typeof reviewOrders.value[0]) { o.status = 'approved'; toast.value?.show(`工单 "${o.id}" 审核通过`, 'success') }
function rejectOrder(o: typeof reviewOrders.value[0]) { o.status = 'rejected'; toast.value?.show(`工单 "${o.id}" 已驳回`, 'warning') }
function dispatchOrder(o: typeof dispatchOrders.value[0]) {
    if (!o.selected) { toast.value?.show('请先选择巡查人员', 'warning'); return }
    toast.value?.show(`工单 "${o.id}" 已派发给 ${o.selected}`, 'success')
}

function getStatusColor(s: string) { return s === 'in_progress' ? 'text-primary' : s === 'completed' ? 'text-success' : s === 'pending_review' ? 'text-warning' : s === 'pending_dispatch' ? 'text-info' : 'text-dim' }
function getStatusBg(s: string) { return s === 'in_progress' ? 'bg-primary/10' : s === 'completed' ? 'bg-success/10' : s === 'pending_review' ? 'bg-warning/10' : s === 'pending_dispatch' ? 'bg-info/10' : 'bg-surface' }
function getStatusText(s: string) { return s === 'in_progress' ? '执行中' : s === 'completed' ? '已完成' : s === 'pending_review' ? '待审核' : s === 'pending_dispatch' ? '待派发' : '已关闭' }
function getPriorityColor(p: string) { return p === 'S' ? 'bg-danger text-white' : p === 'A' ? 'bg-warning text-white' : p === 'B' ? 'bg-info/80 text-white' : 'bg-surface text-dim' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                    class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    {{ ft.label }}
                    <span v-if="ft.key === 'review'"
                        class="ml-1 px-1 py-0.5 text-[8px] rounded bg-danger text-white font-bold">{{
                            reviewOrders.filter(o => o.status === 'pending').length}}</span>
                    <span v-if="ft.key === 'dispatch'"
                        class="ml-1 px-1 py-0.5 text-[8px] rounded bg-warning text-white font-bold">{{
                            dispatchOrders.length }}</span>
                </button>
            </div>
            <button v-if="activeFunc === 'list'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" />新建工单
            </button>
        </div>

        <!-- 工单列表 -->
        <template v-if="activeFunc === 'list'">
            <div class="grid grid-cols-5 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ orders.length }}</p>
                    <p class="text-[10px] text-dim mt-0.5">总工单</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{orders.filter(o => o.status === 'in_progress').length
                    }}</p>
                    <p class="text-[10px] text-dim mt-0.5">执行中</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-warning">{{orders.filter(o => o.status ===
                        'pending_review').length}}</p>
                    <p class="text-[10px] text-dim mt-0.5">待审核</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{orders.filter(o => o.status ===
                        'pending_dispatch').length}}</p>
                    <p class="text-[10px] text-dim mt-0.5">待派发</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{orders.filter(o => o.status === 'completed').length}}
                    </p>
                    <p class="text-[10px] text-dim mt-0.5">已完成</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-3 py-2.5 text-dim font-medium">标题</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">优先级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">执行人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">截止</th>
                            <th class="text-center px-3 py-2.5 text-dim font-medium">进度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in orders" :key="o.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ o.id }}</td>
                            <td class="px-3 py-2.5 text-default font-medium">{{ o.title }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[9px] px-1.5 py-0.5 rounded font-bold"
                                    :class="getPriorityColor(o.priority)">{{ o.priority }}</span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.type }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.area }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.assignee || '—' }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ o.deadline }}</td>
                            <td class="text-center px-3 py-2.5">
                                <div class="flex items-center gap-1">
                                    <div class="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full transition-all"
                                            :class="o.progress === 100 ? 'bg-success' : 'bg-primary'"
                                            :style="{ width: o.progress + '%' }"></div>
                                    </div><span class="text-[10px] text-dim w-7 text-right">{{ o.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="[getStatusColor(o.status), getStatusBg(o.status)]">{{
                                        getStatusText(o.status) }}</span></td>
                            <td class="text-center px-2 py-2.5"><button @click="viewOrder(o)"
                                    class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Eye class="w-3 h-3 text-primary" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 工单审核 -->
        <template v-if="activeFunc === 'review'">
            <div v-for="o in reviewOrders" :key="o.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2 mb-1"><span class="text-xs font-bold text-default">{{
                            o.title }}</span><span class="text-[10px] text-primary font-mono">{{ o.id }}</span><span
                                class="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{{ o.type
                                }}</span></div>
                        <div class="flex items-center gap-3 text-[10px] text-dim"><span>申请人: {{ o.applicant
                        }}</span><span>时间: {{ o.time }}</span><span>巡查点: {{ o.points }}个</span><span>检查项: {{
                                    o.items }}项</span></div>
                        <p class="text-[10px] text-default mt-1.5">📝 {{ o.remark }}</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                            :class="o.status === 'approved' ? 'bg-success/10 text-success' : o.status === 'rejected' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">{{
                                o.status === 'approved' ? '已通过' : o.status === 'rejected' ? '已驳回' : '待审核' }}</span>
                        <template v-if="o.status === 'pending'">
                            <button @click="approveOrder(o)"
                                class="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 cursor-pointer">
                                <CheckCircle class="w-3.5 h-3.5" />
                            </button>
                            <button @click="rejectOrder(o)"
                                class="p-1.5 rounded-md bg-danger/10 text-danger hover:bg-danger/20 cursor-pointer">
                                <XCircle class="w-3.5 h-3.5" />
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </template>

        <!-- 工单派发 -->
        <template v-if="activeFunc === 'dispatch'">
            <div v-for="o in dispatchOrders" :key="o.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ o.title
                    }}</span><span class="text-[10px] text-primary font-mono">{{ o.id }}</span><span
                            class="text-[9px] px-1.5 py-0.5 rounded font-bold" :class="getPriorityColor(o.priority)">{{
                                o.priority }}</span></div>
                    <span class="text-[10px] text-dim">截止: {{ o.deadline }}</span>
                </div>
                <div class="flex items-center gap-3 text-[10px] text-dim mb-3"><span>区域: {{ o.area }}</span><span>巡查点:
                        {{ o.points }}个</span></div>
                <div class="flex items-center gap-3">
                    <select v-model="o.selected"
                        class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                        <option value="">选择巡查人员</option>
                        <option v-for="c in o.candidates" :key="c" :value="c">{{ c }}</option>
                    </select>
                    <button @click="dispatchOrder(o)"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Send class="w-3.5 h-3.5" />派发
                    </button>
                </div>
            </div>
            <div v-if="dispatchOrders.length === 0"
                class="bg-card border border-themed rounded-xl shadow-themed p-8 text-center">
                <p class="text-dim text-xs">暂无待派发工单</p>
            </div>
        </template>

        <ModalDialog :show="showDetail" title="工单详情" @close="showDetail = false" @confirm="showDetail = false">
            <div v-if="detailOrder" class="space-y-3 text-xs">
                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">工单编号</p>
                        <p class="text-default font-bold mt-0.5">{{ detailOrder.id }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">标题</p>
                        <p class="text-default font-bold mt-0.5">{{ detailOrder.title }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">类型 / 优先级</p>
                        <p class="text-default mt-0.5">{{ detailOrder.type }} / {{ detailOrder.priority }}级</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">区域</p>
                        <p class="text-default mt-0.5">{{ detailOrder.area }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">执行人</p>
                        <p class="text-default mt-0.5">{{ detailOrder.assignee || '未分配' }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">截止日期</p>
                        <p class="text-default mt-0.5">{{ detailOrder.deadline }}</p>
                    </div>
                </div>
            </div>
        </ModalDialog>
        <ToastNotify ref="toast" />
    </div>
</template>
