<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Pencil, Trash2, Eye, CheckCircle, XCircle, Search, Package, Download } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('plans')
const funcTabs = [
    { key: 'plans', label: '计划信息' },
    { key: 'adjust', label: '调整优化' },
    { key: 'material', label: '材料库存' },
    { key: 'approval', label: '计划审批' },
    { key: 'history', label: '历史记录' },
]

const plans = ref([
    { id: 'MP-2024-001', name: '圭塘街道主干管网春季清淤', type: '清淤', area: '圭塘街道', cycle: '季度', scope: 'DN400+ 主干管', assignee: '张伟', startDate: '2024-03-01', endDate: '2024-03-31', status: 'active', progress: 45 },
    { id: 'MP-2024-002', name: '侯家塘街道老旧管段修复', type: '修复', area: '侯家塘街道', cycle: '专项', scope: '2005年前管段', assignee: '赵刚', startDate: '2024-03-15', endDate: '2024-04-30', status: 'pending', progress: 0 },
    { id: 'MP-2024-003', name: '左家塘街道检查井维护保养', type: '保养', area: '左家塘街道', cycle: '年度', scope: '全区检查井', assignee: '王强', startDate: '2024-01-01', endDate: '2024-06-30', status: 'active', progress: 60 },
])

const adjustments = ref([
    { id: 'ADJ-01', plan: 'MP-2024-001', reason: '近期暴雨导致淤积加重', before: '季度清淤', after: '月度清淤', factor: '气象数据', time: '2024-03-10', operator: '张主管' },
    { id: 'ADJ-02', plan: 'MP-2024-003', reason: '部分井盖破损率上升', before: '年度保养', after: '半年保养(重点区域)', factor: '故障记录', time: '2024-02-28', operator: '李主任' },
])

const materials = ref([
    { id: 'MAT-001', name: 'DN400 PVC管材', spec: 'DN400×6m', unit: '根', stock: 25, minStock: 10, location: '圭塘街道仓库', lastIn: '2024-03-01', lastOut: '2024-03-12' },
    { id: 'MAT-002', name: 'HDPE修复内衬', spec: 'DN200-600', unit: '米', stock: 120, minStock: 50, location: '中心仓库', lastIn: '2024-02-15', lastOut: '2024-03-08' },
    { id: 'MAT-003', name: '井盖(球墨铸铁)', spec: '700×700', unit: '个', stock: 8, minStock: 5, location: '圭塘街道仓库', lastIn: '2024-01-20', lastOut: '2024-03-14' },
    { id: 'MAT-004', name: '密封胶圈', spec: 'DN200-800', unit: '套', stock: 200, minStock: 100, location: '中心仓库', lastIn: '2024-03-05', lastOut: '2024-03-10' },
    { id: 'MAT-005', name: '水泥砂浆', spec: 'C30', unit: '吨', stock: 3, minStock: 2, location: '左家塘街道仓库', lastIn: '2024-02-20', lastOut: '2024-03-06' },
])

const approvals = ref([
    { id: 'APR-M01', plan: 'MP-2024-002', planName: '侯家塘街道老旧管段修复', applicant: '赵刚', time: '2024-03-10 09:00', approver: '张主任', status: 'pending' },
])

const historyRecords = ref([
    { id: 'MH-001', facility: '万家丽路DN400', type: '清淤', date: '2024-02-15', worker: '张伟', duration: '3小时', result: '清淤完成，管内积泥约0.8m³' },
    { id: 'MH-002', facility: '劳动路MH-05', type: '井盖更换', date: '2024-02-20', worker: '王强', duration: '1.5小时', result: '更换球墨铸铁井盖，恢复通行' },
    { id: 'MH-003', facility: '侯家塘街道OUT-03', type: '排口清理', date: '2024-03-01', worker: '李明', duration: '2小时', result: '清理垃圾杂物约50kg' },
])

function getStatusColor(s: string) { return s === 'active' ? 'text-success bg-success/10' : s === 'pending' ? 'text-warning bg-warning/10' : 'text-info bg-info/10' }
function getStatusText(s: string) { return s === 'active' ? '执行中' : s === 'pending' ? '待审批' : '已完成' }
function approve(a: typeof approvals.value[0]) { a.status = 'approved'; toast.value?.show('审批通过', 'success') }
function reject(a: typeof approvals.value[0]) { a.status = 'rejected'; toast.value?.show('已驳回', 'warning') }

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', type: '', area: '', assignee: '' })

function openAdd() { addForm.value = { name: '', type: '', area: '', assignee: '' }; showAddModal.value = true }
function doAdd() { showAddModal.value = false; toast.value?.show('新增成功', 'success') }

// 入库弹窗
const showStockInModal = ref(false)
const stockInForm = ref({ materialId: '', quantity: '', supplier: '', remark: '' })
function openStockIn() { stockInForm.value = { materialId: '', quantity: '', supplier: '', remark: '' }; showStockInModal.value = true }
function doStockIn() { showStockInModal.value = false; toast.value?.show('入库成功', 'success') }
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
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"
                @click="openAdd()">
                <Plus class="w-3.5 h-3.5" />新增计划
            </button>
        </div>

        <!-- 计划信息 -->
        <div v-if="activeFunc === 'plans'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2.5 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2.5 text-dim font-medium">计划名称</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">区域</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">周期</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">责任人</th>
                        <th class="text-center px-3 py-2.5 text-dim font-medium">进度</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in plans" :key="p.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ p.id }}</td>
                        <td class="px-3 py-2.5 text-default font-medium">{{ p.name }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ p.type }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ p.area }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ p.cycle }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ p.assignee }}</td>
                        <td class="text-center px-3 py-2.5">
                            <div class="flex items-center gap-1">
                                <div class="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                                    <div class="h-full bg-primary rounded-full" :style="{ width: p.progress + '%' }">
                                    </div>
                                </div><span class="text-[10px] text-dim w-7">{{ p.progress }}%</span>
                            </div>
                        </td>
                        <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="getStatusColor(p.status)">{{ getStatusText(p.status) }}</span></td>
                        <td class="text-center px-2 py-2.5">
                            <div class="flex items-center justify-center gap-1"><button
                                    class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Eye class="w-3 h-3 text-primary" />
                                </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Pencil class="w-3 h-3 text-dim" />
                                </button></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 调整优化 -->
        <div v-if="activeFunc === 'adjust'" class="space-y-3">
            <div v-for="a in adjustments" :key="a.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-2 mb-2"><span class="text-xs font-bold text-default">{{ a.plan
                        }}</span><span class="text-[10px] text-dim">{{ a.time }} · {{ a.operator }}</span></div>
                <p class="text-[10px] text-default mb-2">📝 {{ a.reason }}</p>
                <div class="flex items-center gap-2 text-[10px]"><span
                        class="px-2 py-0.5 bg-surface rounded text-dim">{{ a.before }}</span><span
                        class="text-primary">→</span><span
                        class="px-2 py-0.5 bg-primary/10 rounded text-primary font-medium">{{ a.after }}</span><span
                        class="text-dim ml-2">依据: {{ a.factor }}</span></div>
            </div>
        </div>

        <!-- 材料库存 -->
        <div v-if="activeFunc === 'material'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Package class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">养护材料库存</span>
                </div><button @click="openStockIn()"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />入库
                </button>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">名称</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">规格</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">库存</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">最低</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">存放</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="m in materials" :key="m.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2 text-primary font-mono text-[10px]">{{ m.id }}</td>
                        <td class="px-3 py-2 text-default font-medium">{{ m.name }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ m.spec }}</td>
                        <td class="text-center px-2 py-2"><span class="font-bold"
                                :class="m.stock <= m.minStock ? 'text-danger' : 'text-success'">{{ m.stock }}{{ m.unit
                                }}</span></td>
                        <td class="text-center px-2 py-2 text-dim">{{ m.minStock }}{{ m.unit }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ m.location }}</td>
                        <td class="text-center px-2 py-2">
                            <div class="flex items-center justify-center gap-1"><button
                                    class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                    <Pencil class="w-3 h-3 text-dim" />
                                </button><button class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                    <Trash2 class="w-3 h-3 text-danger" />
                                </button></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 审批 -->
        <template v-if="activeFunc === 'approval'">
            <div v-for="a in approvals" :key="a.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ a.planName
                                }}</span><span class="text-[10px] text-primary font-mono">{{ a.plan }}</span></div>
                        <div class="text-[10px] text-dim mt-0.5">申请人: {{ a.applicant }} · {{ a.time }} · 审批人: {{
                            a.approver }}</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                            :class="a.status === 'approved' ? 'bg-success/10 text-success' : a.status === 'rejected' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">{{
                                a.status === 'approved' ? '已通过' : a.status === 'rejected' ? '已驳回' : '待审批' }}</span>
                        <template v-if="a.status === 'pending'"><button @click="approve(a)"
                                class="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 cursor-pointer">
                                <CheckCircle class="w-3.5 h-3.5" />
                            </button><button @click="reject(a)"
                                class="p-1.5 rounded-md bg-danger/10 text-danger hover:bg-danger/20 cursor-pointer">
                                <XCircle class="w-3.5 h-3.5" />
                            </button></template>
                    </div>
                </div>
            </div>
        </template>

        <!-- 历史记录 -->
        <template v-if="activeFunc === 'history'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3 mb-3">
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                        placeholder="搜索设施/人员..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                </div><button
                    class="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设施</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">工时</th>
                            <th class="text-left px-3 py-2.5 text-dim font-medium">结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in historyRecords" :key="h.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ h.id }}</td>
                            <td class="px-3 py-2.5 text-default font-medium">{{ h.facility }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.type }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ h.date }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.worker }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.duration }}</td>
                            <td class="px-3 py-2.5 text-dim">{{ h.result }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <!-- 新增弹窗 -->
        <ModalDialog :show="showAddModal" title="新增养护计划" @close="showAddModal = false" @confirm="doAdd">
            <div class="space-y-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">计划名称</label>
                    <input v-model="addForm.name" type="text" placeholder="请输入计划名称"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">养护类型</label>
                    <input v-model="addForm.type" type="text" placeholder="日常/专项/应急"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">区域</label>
                    <input v-model="addForm.area" type="text" placeholder="请选择区域"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">责任人</label>
                    <input v-model="addForm.assignee" type="text" placeholder="请输入负责人"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
            </div>
        </ModalDialog>

        <!-- 入库弹窗 -->
        <ModalDialog :show="showStockInModal" title="材料入库" @close="showStockInModal = false" @confirm="doStockIn">
            <div class="space-y-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">选择材料</label>
                    <select v-model="stockInForm.materialId"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                        <option value="">请选择材料</option>
                        <option v-for="m in materials" :key="m.id" :value="m.id">{{ m.name }} ({{ m.spec }})</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">入库数量</label>
                        <input v-model="stockInForm.quantity" type="number" placeholder="请输入数量"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">供应商</label>
                        <input v-model="stockInForm.supplier" type="text" placeholder="请输入供应商名称"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">备注</label>
                    <input v-model="stockInForm.remark" type="text" placeholder="可选"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
            </div>
        </ModalDialog>

        <ToastNotify ref="toast" />
    </div>
</template>
