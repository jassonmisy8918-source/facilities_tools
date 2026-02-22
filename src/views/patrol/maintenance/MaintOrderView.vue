<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Eye, AlertTriangle, Radio } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('list')
const funcTabs = [
    { key: 'list', label: '工单管理' },
    { key: 'auto', label: '自动分配' },
    { key: 'track', label: '跟踪进度' },
    { key: 'issues', label: '问题管理' },
    { key: 'cost', label: '成本与设备' },
]

const orders = ref([
    { id: 'MO-001', title: '建设大道DN400清淤', type: '清淤', priority: 'B', area: '朝阳区', facility: 'DN400雨水管', assignee: '张伟', status: 'in_progress', progress: 70, hours: 4.5, cost: 2800 },
    { id: 'MO-002', title: '民生路MH-05井盖修复', type: '修复', priority: 'A', area: '朝阳区', facility: 'MH-05检查井', assignee: '王强', status: 'review', progress: 0, hours: 0, cost: 0 },
    { id: 'MO-003', title: '西城区排口格栅更换', type: '更换', priority: 'B', area: '西城区', facility: 'OUT-03排口', assignee: '李明', status: 'completed', progress: 100, hours: 3, cost: 1500 },
    { id: 'MO-004', title: '丰台区DN600管道检测', type: 'CCTV检测', priority: 'B', area: '丰台区', facility: 'DN600污水管', assignee: '', status: 'pending', progress: 0, hours: 0, cost: 0 },
])

const autoTasks = ref([
    { order: 'MO-004', title: '丰台区DN600管道检测', skill: 'CCTV操作', candidates: [{ name: '王强', load: 2, skill: '✓', distance: '5km', score: 92 }, { name: '张伟', load: 3, skill: '✓', distance: '8km', score: 78 }, { name: '赵刚', load: 1, skill: '✗', distance: '3km', score: 45 }] },
])

const issues = ref([
    { id: 'MI-001', order: 'MO-001', desc: '清淤过程发现管壁局部腐蚀', level: 'medium', status: 'open', reporter: '张伟', time: '2024-03-15 10:00' },
    { id: 'MI-002', order: 'MO-003', desc: '格栅基座螺栓锈蚀需更换', level: 'low', status: 'closed', reporter: '李明', time: '2024-03-12 14:30' },
])

const costData = ref({ totalCost: 4300, laborCost: 2600, materialCost: 1200, equipmentCost: 500, orders: 3 })

const deviceStatus = ref([
    { name: '高压清洗车-01', type: '清洗车', status: 'working', location: '建设大道', order: 'MO-001', runtime: '4.5h' },
    { name: 'CCTV检测车-01', type: '检测车', status: 'idle', location: '中心车库', order: '', runtime: '0h' },
    { name: '抽水泵-03', type: '水泵', status: 'working', location: '丰台区', order: 'MO-004', runtime: '2h' },
])

function getStatusText(s: string) { return s === 'in_progress' ? '执行中' : s === 'completed' ? '已完成' : s === 'review' ? '待审核' : '待分配' }
function getStatusColor(s: string) { return s === 'in_progress' ? 'text-primary bg-primary/10' : s === 'completed' ? 'text-success bg-success/10' : s === 'review' ? 'text-warning bg-warning/10' : 'text-info bg-info/10' }
function assignTask(c: { name: string }) { toast.value?.show(`已分配给 ${c.name}`, 'success') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 工单列表 -->
        <div v-if="activeFunc === 'list'" class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between"><span
                    class="text-sm font-semibold text-default">养护工单</span><button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />新建
                </button></div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2.5 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2.5 text-dim font-medium">标题</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">设施</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">人员</th>
                        <th class="text-center px-3 py-2.5 text-dim font-medium">进度</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">工时</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="o in orders" :key="o.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ o.id }}</td>
                        <td class="px-3 py-2.5 text-default font-medium">{{ o.title }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ o.type }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ o.facility }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ o.assignee || '—' }}</td>
                        <td class="text-center px-3 py-2.5">
                            <div class="flex items-center gap-1">
                                <div class="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                                    <div class="h-full rounded-full"
                                        :class="o.progress === 100 ? 'bg-success' : 'bg-primary'"
                                        :style="{ width: o.progress + '%' }"></div>
                                </div><span class="text-[10px] text-dim w-7">{{ o.progress }}%</span>
                            </div>
                        </td>
                        <td class="text-center px-2 py-2.5 text-default">{{ o.hours ? o.hours + 'h' : '—' }}</td>
                        <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="getStatusColor(o.status)">{{ getStatusText(o.status) }}</span></td>
                        <td class="text-center px-2 py-2.5"><button
                                class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                <Eye class="w-3 h-3 text-primary" />
                            </button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 自动分配 -->
        <template v-if="activeFunc === 'auto'">
            <div v-for="t in autoTasks" :key="t.order"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-2 mb-3"><span class="text-xs font-bold text-default">{{ t.title
                }}</span><span class="text-[10px] text-primary font-mono">{{ t.order }}</span><span
                        class="text-[10px] text-dim">需求技能: {{ t.skill }}</span></div>
                <div class="space-y-2">
                    <div v-for="c in t.candidates" :key="c.name"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface">
                        <div class="flex items-center gap-3"><span class="text-xs font-medium text-default">{{ c.name
                        }}</span><span class="text-[10px] text-dim">负载: {{ c.load }}单</span><span
                                class="text-[10px]" :class="c.skill === '✓' ? 'text-success' : 'text-danger'">技能: {{
                                    c.skill }}</span><span class="text-[10px] text-dim">距离: {{ c.distance }}</span></div>
                        <div class="flex items-center gap-2"><span class="text-xs font-bold"
                                :class="c.score >= 80 ? 'text-success' : c.score >= 60 ? 'text-warning' : 'text-dim'">{{
                                    c.score }}分</span><button @click="assignTask(c)"
                                class="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-medium hover:bg-primary/20 cursor-pointer"
                                :class="c.score < 60 ? 'opacity-50' : ''">分配</button></div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 跟踪进度 -->
        <div v-if="activeFunc === 'track'" class="space-y-3">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ orders.length }}</p>
                    <p class="text-[10px] text-dim">总工单</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{orders.filter(o => o.status === 'in_progress').length
                    }}</p>
                    <p class="text-[10px] text-dim">执行中</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{orders.filter(o => o.status === 'completed').length}}
                    </p>
                    <p class="text-[10px] text-dim">已完成</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-warning">{{orders.filter(o => o.status === 'pending' || o.status
                        ===
                        'review').length}}</p>
                    <p class="text-[10px] text-dim">待处理</p>
                </div>
            </div>
            <div v-for="o in orders.filter(o => o.status === 'in_progress')" :key="o.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                    o.title
                }}</span><span class="text-[10px] text-dim">{{ o.assignee }} · {{ o.hours }}h</span></div>
                <div class="h-2.5 bg-surface rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all" :style="{ width: o.progress + '%' }">
                    </div>
                </div>
                <div class="flex items-center justify-between mt-1 text-[10px]"><span class="text-dim">{{ o.facility
                }}</span><span class="text-primary font-bold">{{ o.progress }}%</span></div>
            </div>
        </div>

        <!-- 问题管理 -->
        <div v-if="activeFunc === 'issues'" class="space-y-3">
            <div v-for="i in issues" :key="i.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2">
                            <AlertTriangle class="w-3.5 h-3.5"
                                :class="i.level === 'medium' ? 'text-warning' : 'text-info'" />
                            <span class="text-xs font-bold text-default">{{ i.desc }}</span>
                        </div>
                        <div class="text-[10px] text-dim mt-0.5">工单: {{ i.order }} · {{ i.reporter }} · {{ i.time }}
                        </div>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                        :class="i.status === 'open' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'">{{
                            i.status
                                === 'open' ? '待整改' : '已闭环' }}</span>
                </div>
            </div>
        </div>

        <!-- 成本与设备 -->
        <template v-if="activeFunc === 'cost'">
            <div class="grid grid-cols-5 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-default">¥{{ costData.totalCost }}</p>
                    <p class="text-[10px] text-dim">总成本</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-primary">¥{{ costData.laborCost }}</p>
                    <p class="text-[10px] text-dim">人工</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-info">¥{{ costData.materialCost }}</p>
                    <p class="text-[10px] text-dim">材料</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-warning">¥{{ costData.equipmentCost }}</p>
                    <p class="text-[10px] text-dim">设备</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-success">{{ costData.orders }}</p>
                    <p class="text-[10px] text-dim">工单数</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Radio class="w-4 h-4 text-primary" /><span class="text-xs font-semibold text-default">设备状态监控</span>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="d in deviceStatus" :key="d.name"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface">
                        <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full"
                                :class="d.status === 'working' ? 'bg-success animate-pulse' : 'bg-gray-400'"></span>
                            <div>
                                <p class="text-xs font-medium text-default">{{ d.name }}</p>
                                <p class="text-[10px] text-dim">{{ d.type }} · {{ d.location }}</p>
                            </div>
                        </div>
                        <div class="text-[10px] text-right">
                            <p :class="d.status === 'working' ? 'text-success' : 'text-dim'">{{ d.status === 'working' ?
                                '作业中' : '空闲' }}</p>
                            <p class="text-dim">{{ d.order || '—' }} · {{ d.runtime }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <ToastNotify ref="toast" />
    </div>
</template>
