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
    { id: 'WO-2024-001', title: '万家丽路主干管网季度巡查', plan: 'PL-2024-001', type: '例行', priority: 'B', area: '圭塘街道', assignee: '张伟', createTime: '2024-03-01 08:00', deadline: '2024-03-07', status: 'in_progress', progress: 65, points: 15, history: [{ time: '2024-03-01 08:00', user: '系统', action: '工单创建', detail: '自动生成例行巡查工单' }, { time: '2024-03-01 09:30', user: '管理员', action: '审核通过', detail: '审核通过，优先级B' }, { time: '2024-03-01 10:00', user: '管理员', action: '派发工单', detail: '派发给张伟' }, { time: '2024-03-01 14:00', user: '张伟', action: '开始执行', detail: '到达圭塘街道开始巡查' }, { time: '2024-03-03 10:30', user: '张伟', action: '进度更新', detail: '已完成10/15个巡查点' }] },
    { id: 'WO-2024-002', title: '侯家塘街道排口月度巡查', plan: 'PL-2024-002', type: '例行', priority: 'B', area: '侯家塘街道', assignee: '李明', createTime: '2024-03-01 08:30', deadline: '2024-03-05', status: 'in_progress', progress: 40, points: 10, history: [{ time: '2024-03-01 08:30', user: '系统', action: '工单创建', detail: '自动生成例行巡查工单' }, { time: '2024-03-01 09:45', user: '管理员', action: '审核通过', detail: '审核通过' }, { time: '2024-03-01 10:30', user: '管理员', action: '派发工单', detail: '派发给李明' }, { time: '2024-03-02 08:00', user: '李明', action: '开始执行', detail: '开始排口巡查' }] },
    { id: 'WO-2024-003', title: '左家塘街道暴雨应急巡查', plan: 'PL-2024-003', type: '应急', priority: 'S', area: '左家塘街道', assignee: '', createTime: '2024-03-15 06:00', deadline: '2024-03-15', status: 'pending_review', progress: 0, points: 8, history: [{ time: '2024-03-15 06:00', user: '王强', action: '提交工单', detail: '暴雨橙色预警，申请紧急巡查' }] },
    { id: 'WO-2024-004', title: '黎托街道浏阳河段异常排查', plan: '', type: '临时', priority: 'A', area: '黎托街道', assignee: '赵刚', createTime: '2024-03-14 14:00', deadline: '2024-03-15', status: 'pending_dispatch', progress: 0, points: 5, history: [{ time: '2024-03-14 14:00', user: '刘芳', action: '提交工单', detail: '浏阳河段水质异常' }, { time: '2024-03-14 15:00', user: '管理员', action: '审核通过', detail: '情况紧急，立即通过' }] },
    { id: 'WO-2024-005', title: '圭塘街道劳动路管段复查', plan: 'PL-2024-001', type: '复查', priority: 'A', area: '圭塘街道', assignee: '王强', createTime: '2024-03-10 09:00', deadline: '2024-03-12', status: 'completed', progress: 100, points: 3, history: [{ time: '2024-03-10 09:00', user: '系统', action: '工单创建', detail: '问题复查工单' }, { time: '2024-03-10 09:30', user: '管理员', action: '审核通过', detail: '通过' }, { time: '2024-03-10 10:00', user: '管理员', action: '派发工单', detail: '派发给王强' }, { time: '2024-03-10 14:00', user: '王强', action: '开始执行', detail: '到达现场' }, { time: '2024-03-11 16:00', user: '王强', action: '执行完成', detail: '所有复查点位合格' }, { time: '2024-03-12 09:00', user: '管理员', action: '工单闭环', detail: '确认完成，工单关闭' }] },
])

const showDetail = ref(false)
const detailOrder = ref<typeof orders.value[0] | null>(null)
const detailTab = ref<'info' | 'history'>('info')
function viewOrder(o: typeof orders.value[0]) { detailOrder.value = o; detailTab.value = 'info'; showDetail.value = true }

// 审核确认弹窗
const showReviewConfirm = ref(false)
const reviewAction = ref<'approve' | 'reject'>('approve')
const reviewTarget = ref<typeof reviewOrders.value[0] | null>(null)
const reviewRemark = ref('')
function openReviewConfirm(o: typeof reviewOrders.value[0], action: 'approve' | 'reject') {
    reviewTarget.value = o; reviewAction.value = action; reviewRemark.value = ''; showReviewConfirm.value = true
}
function confirmReview() {
    if (!reviewTarget.value) return
    reviewTarget.value.status = reviewAction.value === 'approve' ? 'approved' : 'rejected'
    showReviewConfirm.value = false
    toast.value?.show(reviewAction.value === 'approve' ? `工单 "${reviewTarget.value.id}" 审核通过` : `工单 "${reviewTarget.value.id}" 已驳回`, reviewAction.value === 'approve' ? 'success' : 'warning')
}

const reviewOrders = ref([
    { id: 'WO-2024-003', title: '左家塘街道暴雨应急巡查', type: '应急', applicant: '王强', time: '2024-03-15 06:00', points: 8, items: 6, remark: '暴雨橙色预警，需紧急巡查低洼区域', status: 'pending' },
    { id: 'WO-2024-006', title: '洞井街道浏阳河排口专项', type: '专项', applicant: '刘芳', time: '2024-03-14 10:00', points: 6, items: 4, remark: '水质异常疑似混接，需排查', status: 'pending' },
])

const dispatchOrders = ref([
    { id: 'WO-2024-004', title: '黎托街道浏阳河段异常排查', type: '临时', priority: 'A', area: '黎托街道', points: 5, deadline: '2024-03-15', candidates: ['赵刚', '陈亮', '王强'], selected: '' },
])

function dispatchOrder(o: typeof dispatchOrders.value[0]) {
    if (!o.selected) { toast.value?.show('请先选择巡查人员', 'warning'); return }
    toast.value?.show(`工单 "${o.id}" 已派发给 ${o.selected}`, 'success')
}

function getStatusColor(s: string) { return s === 'in_progress' ? 'text-primary' : s === 'completed' ? 'text-success' : s === 'pending_review' ? 'text-warning' : s === 'pending_dispatch' ? 'text-info' : 'text-dim' }
function getStatusBg(s: string) { return s === 'in_progress' ? 'bg-primary/10' : s === 'completed' ? 'bg-success/10' : s === 'pending_review' ? 'bg-warning/10' : s === 'pending_dispatch' ? 'bg-info/10' : 'bg-surface' }
function getStatusText(s: string) { return s === 'in_progress' ? '执行中' : s === 'completed' ? '已完成' : s === 'pending_review' ? '待审核' : s === 'pending_dispatch' ? '待派发' : '已关闭' }
function getPriorityColor(p: string) { return p === 'S' ? 'bg-danger text-white' : p === 'A' ? 'bg-warning text-white' : p === 'B' ? 'bg-info/80 text-white' : 'bg-surface text-dim' }

const showAddModal = ref(false)
const addForm = ref({ title: '', type: '例行', priority: 'B', area: '', deadline: '', points: '' })
function openAdd() { addForm.value = { title: '', type: '例行', priority: 'B', area: '', deadline: '', points: '' }; showAddModal.value = true }
function doAdd() {
    if (!addForm.value.title) { toast.value?.show('请输入工单标题', 'warning'); return }
    const newId = `WO-2024-${String(orders.value.length + 1).padStart(3, '0')}`
    orders.value.unshift({
        id: newId, title: addForm.value.title, plan: '', type: addForm.value.type, priority: addForm.value.priority,
        area: addForm.value.area || '-', assignee: '', createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        deadline: addForm.value.deadline || '-', status: 'pending_review', progress: 0, points: Number(addForm.value.points) || 0,
        history: [{ time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'), user: '当前用户', action: '提交工单', detail: addForm.value.title }],
    } as any)
    showAddModal.value = false; toast.value?.show('工单创建成功', 'success')
}
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
            <button v-if="activeFunc === 'list'" @click="openAdd()"
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
                            <button @click="openReviewConfirm(o, 'approve')"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 cursor-pointer text-xs font-semibold">
                                <CheckCircle class="w-4 h-4" />通过
                            </button>
                            <button @click="openReviewConfirm(o, 'reject')"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 cursor-pointer text-xs font-semibold">
                                <XCircle class="w-4 h-4" />驳回
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

        <!-- 审核确认弹窗 -->
        <ModalDialog :show="showReviewConfirm" :title="reviewAction === 'approve' ? '确认审核通过' : '确认驳回工单'"
            @close="showReviewConfirm = false" @confirm="confirmReview">
            <div v-if="reviewTarget" class="space-y-3 text-xs">
                <div class="p-3 rounded-lg bg-surface">
                    <p><span class="text-dim">工单：</span><span class="text-default font-medium">{{ reviewTarget.title
                            }}</span>
                    </p>
                    <p class="mt-1"><span class="text-dim">编号：</span><span class="text-primary font-mono">{{
                        reviewTarget.id
                            }}</span></p>
                    <p class="mt-1"><span class="text-dim">申请人：</span><span class="text-default">{{
                        reviewTarget.applicant
                            }}</span></p>
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">审批备注</label>
                    <textarea v-model="reviewRemark" rows="2"
                        :placeholder="reviewAction === 'approve' ? '通过意见（可选）' : '请填写驳回原因'"
                        class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default resize-none focus:outline-none focus:border-primary"></textarea>
                </div>
                <div class="flex items-center gap-2 p-2 rounded-lg"
                    :class="reviewAction === 'approve' ? 'bg-success/10' : 'bg-danger/10'">
                    <span class="text-[10px]" :class="reviewAction === 'approve' ? 'text-success' : 'text-danger'">{{
                        reviewAction === 'approve' ? '✅ 将通过该工单审核' : '❌ 将驳回该工单' }}</span>
                </div>
            </div>
        </ModalDialog>

        <ModalDialog :show="showDetail" title="工单详情" width="600px" @close="showDetail = false"
            @confirm="showDetail = false">
            <div v-if="detailOrder" class="space-y-3 text-xs">
                <!-- Tab 切换 -->
                <div class="flex items-center gap-0.5 bg-surface rounded-lg p-0.5">
                    <button @click="detailTab = 'info'"
                        class="px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                        :class="detailTab === 'info' ? 'bg-primary text-white' : 'text-dim hover:text-default'">基本信息</button>
                    <button @click="detailTab = 'history'"
                        class="px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                        :class="detailTab === 'history' ? 'bg-primary text-white' : 'text-dim hover:text-default'">操作记录</button>
                </div>
                <!-- 基本信息 -->
                <template v-if="detailTab === 'info'">
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
                    <!-- 进度条 -->
                    <div class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-1"><span class="text-dim">执行进度</span><span
                                class="font-bold"
                                :class="detailOrder.progress === 100 ? 'text-success' : 'text-primary'">{{
                                    detailOrder.progress }}%</span></div>
                        <div class="h-2 bg-card rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all"
                                :class="detailOrder.progress === 100 ? 'bg-success' : 'bg-primary'"
                                :style="{ width: detailOrder.progress + '%' }"></div>
                        </div>
                    </div>
                </template>
                <!-- 操作记录 -->
                <template v-if="detailTab === 'history'">
                    <div class="relative pl-4">
                        <div class="absolute left-[5px] top-1 bottom-1 w-0.5 bg-themed/20 rounded"></div>
                        <div v-for="(h, hi) in (detailOrder as any).history" :key="hi" class="relative mb-3 last:mb-0">
                            <div class="absolute -left-4 top-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                                :class="hi === 0 ? 'bg-primary' : 'bg-success'"></div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-[10px] font-semibold text-default">{{ h.action }}</span>
                                <span class="text-[9px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ h.user }}</span>
                                <span class="text-[9px] text-dim">{{ h.time }}</span>
                            </div>
                            <p class="text-[10px] text-default mt-0.5">{{ h.detail }}</p>
                        </div>
                    </div>
                </template>
            </div>
        </ModalDialog>

        <!-- 新建工单弹窗 -->
        <ModalDialog :show="showAddModal" title="新建工单" @close="showAddModal = false" @confirm="doAdd">
            <div class="space-y-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">工单标题</label>
                    <input v-model="addForm.title" type="text" placeholder="请输入工单标题"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">工单类型</label>
                        <select v-model="addForm.type"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                            <option>例行</option>
                            <option>应急</option>
                            <option>临时</option>
                            <option>复查</option>
                            <option>专项</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">优先级</label>
                        <select v-model="addForm.priority"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                            <option value="S">S-紧急</option>
                            <option value="A">A-重要</option>
                            <option value="B">B-普通</option>
                            <option value="C">C-低</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">巡查区域</label>
                        <input v-model="addForm.area" type="text" placeholder="如 圭塘街道"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">截止日期</label>
                        <input v-model="addForm.deadline" type="date"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">巡查点数</label>
                        <input v-model="addForm.points" type="number" placeholder="如 15"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                </div>
            </div>
        </ModalDialog>
        <ToastNotify ref="toast" />
    </div>
</template>
