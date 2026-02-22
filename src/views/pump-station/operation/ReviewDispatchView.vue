<script setup lang="ts">
import { ref } from 'vue'
import { Eye, CheckCircle, XCircle, Users, Send } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('review')
const funcTabs = [
    { key: 'review', label: '审核管理' },
    { key: 'dispatch', label: '派发管理' },
    { key: 'status', label: '工单状态' },
]

const reviewItems = ref([
    { id: 1, device: '2号水泵', station: '朝阳泵站', fault: '轴承异响', reporter: '张伟', time: '2024-03-15', history: 2, status: '待审核' },
    { id: 2, device: '阀门DN300', station: '通州泵站', fault: '关闭不严', reporter: '赵刚', time: '2024-03-14', history: 0, status: '待审核' },
    { id: 3, device: '格栅机', station: '丰台泵站', fault: '链条断裂', reporter: '李明', time: '2024-03-14', history: 3, status: '已通过' },
    { id: 4, device: '仪表FL-02', station: '西城泵站', fault: '信号丢失', reporter: '刘芳', time: '2024-03-13', history: 1, status: '已退回' },
])

const dispatchItems = ref([
    { id: 1, order: 'WO-0315-01', device: '2号水泵', station: '朝阳泵站', assignee: '王强', skill: '机电维修', workload: 2, method: '智能', status: '已派发' },
    { id: 2, order: 'WO-0314-01', device: '格栅机', station: '丰台泵站', assignee: '赵刚', skill: '机械维修', workload: 3, method: '人工', status: '已派发' },
    { id: 3, order: 'WO-0313-01', device: '配电柜B', station: '通州泵站', assignee: '李明', skill: '电气维修', workload: 1, method: '智能', status: '处理中' },
])

const orderStatus = ref([
    { id: 'WO-0315-01', device: '2号水泵', station: '朝阳泵站', assignee: '王强', created: '2024-03-15', status: '待处理', progress: 0 },
    { id: 'WO-0314-01', device: '格栅机', station: '丰台泵站', assignee: '赵刚', created: '2024-03-14', status: '处理中', progress: 60 },
    { id: 'WO-0313-01', device: '配电柜B', station: '通州泵站', assignee: '李明', created: '2024-03-13', status: '处理中', progress: 85 },
    { id: 'WO-0312-01', device: '流量计FL-03', station: '西城泵站', assignee: '刘芳', created: '2024-03-12', status: '已完成', progress: 100 },
    { id: 'WO-0310-01', device: '进水阀', station: '朝阳泵站', assignee: '赵刚', created: '2024-03-10', status: '已驳回', progress: 0 },
])

function reviewStatusClass(s: string) { return s === '已通过' ? 'bg-success/10 text-success' : s === '已退回' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning' }
function orderStatusClass(s: string) { return s === '已完成' ? 'bg-success/10 text-success' : s === '处理中' ? 'bg-primary/10 text-primary' : s === '已驳回' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning' }
</script>

<template>
    <div class="space-y-4">
        <ToastNotify ref="toast" />
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'review'">
            <span class="text-sm font-semibold text-default block">报修审核</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">故障</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">报修人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">历史维修</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in reviewItems" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.station }}</td>
                            <td class="px-2 py-2.5 text-default">{{ r.fault }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.reporter }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-primary font-bold">{{ r.history
                                    }}</span> 次</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="reviewStatusClass(r.status)">{{ r.status }}</span></td>
                            <td class="text-center px-2 py-2.5">
                                <div v-if="r.status === '待审核'" class="flex gap-1 justify-center"><button
                                        @click="toast?.show('已通过', 'success')"
                                        class="p-1 text-success hover:bg-success/10 rounded cursor-pointer">
                                        <CheckCircle class="w-3.5 h-3.5" />
                                    </button><button @click="toast?.show('已退回', 'warning')"
                                        class="p-1 text-danger hover:bg-danger/10 rounded cursor-pointer">
                                        <XCircle class="w-3.5 h-3.5" />
                                    </button><button
                                        class="p-1 text-primary hover:bg-primary/10 rounded cursor-pointer">
                                        <Eye class="w-3.5 h-3.5" />
                                    </button></div><span v-else class="text-[10px] text-dim">-</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'dispatch'">
            <div class="flex items-center gap-2 mb-1">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">任务派发</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">工单</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">维修人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">技能</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">工作量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in dispatchItems" :key="d.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-bold">{{ d.order }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default font-medium">{{ d.assignee }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.skill }}</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ d.workload }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="d.method === '智能' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{
                                    d.method }}</span></td>
                            <td class="text-center px-2 py-2.5"><button @click="toast?.show('人工调整', 'info')"
                                    class="text-[10px] text-primary hover:underline cursor-pointer">调整</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'status'">
            <div class="flex items-center gap-2 mb-1">
                <Send class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">工单状态监控</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">工单号</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负责人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">创建日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in orderStatus" :key="o.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-bold">{{ o.id }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ o.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.assignee }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ o.created }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="o.progress === 100 ? 'bg-success' : o.progress > 0 ? 'bg-primary' : 'bg-surface'"
                                            :style="{ width: Math.max(o.progress, 5) + '%' }"></div>
                                    </div><span class="text-[10px] text-dim">{{ o.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="orderStatusClass(o.status)">{{ o.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
