<script setup lang="ts">
import { ref } from 'vue'
import { Link, ClipboardList, Users, CheckCircle } from 'lucide-vue-next'
const activeFunc = ref('overview')
const funcTabs = [
    { key: 'overview', label: '处置总览' },
    { key: 'process', label: '处置记录' },
    { key: 'assign', label: '责任指派' },
]

const disposeItems = ref([
    { id: 1, alarm: '前池水位超高', station: '黎托泵站', level: '告警', time: '2024-03-15 16:20', workOrder: 'WO-2024-0315', assignee: '赵刚', measure: '启动备用泵降低水位', progress: 80, status: '处理中' },
    { id: 2, alarm: '进水流量异常', station: '雨花泵站', level: '预警', time: '2024-03-15 14:30', workOrder: 'WO-2024-0314', assignee: '张伟', measure: '排查上游管网堵塞', progress: 100, status: '已闭环' },
    { id: 3, alarm: '水泵故障停机', station: '洞井泵站', level: '严重', time: '2024-03-14 22:15', workOrder: 'WO-2024-0313', assignee: '王强', measure: '更换电机轴承、电气检修', progress: 100, status: '已闭环' },
    { id: 4, alarm: '格栅过载', station: '左家塘泵站', level: '告警', time: '2024-03-13 11:20', workOrder: '-', assignee: '待指派', measure: '-', progress: 0, status: '待处理' },
    { id: 5, alarm: '电机过温', station: '侯家塘泵站', level: '告警', time: '2024-03-14 09:30', workOrder: 'WO-2024-0312', assignee: '李明', measure: '清洁散热通道、更换风扇', progress: 100, status: '已闭环' },
])

const processRecords = ref([
    { id: 1, alarm: '进水流量异常', step: '接警确认', operator: '张伟', time: '2024-03-15 14:32', content: '确认收到告警，前往现场排查' },
    { id: 2, alarm: '进水流量异常', step: '现场排查', operator: '张伟', time: '2024-03-15 15:00', content: '发现上游检查井淤积导致流量波动' },
    { id: 3, alarm: '进水流量异常', step: '处置完成', operator: '张伟', time: '2024-03-15 17:30', content: '清淤完毕，流量恢复正常，闭环' },
    { id: 4, alarm: '水泵故障停机', step: '接警确认', operator: '王强', time: '2024-03-14 22:18', content: '确认2号泵异常停机，启动应急预案' },
    { id: 5, alarm: '水泵故障停机', step: '故障诊断', operator: '王强', time: '2024-03-14 23:00', content: '诊断为轴承损坏导致电机过载停机' },
    { id: 6, alarm: '水泵故障停机', step: '维修完成', operator: '王强', time: '2024-03-15 10:00', content: '更换轴承，试运行正常，闭环' },
])

const assignHistory = ref([
    { id: 1, alarm: '前池水位超高', station: '黎托泵站', assignee: '赵刚', method: '自动', time: '2024-03-15 16:21', reason: '值班人员自动匹配' },
    { id: 2, alarm: '水泵故障停机', station: '洞井泵站', assignee: '王强', method: '手动', time: '2024-03-14 22:17', reason: '维修主管指定' },
    { id: 3, alarm: '进水流量异常', station: '雨花泵站', assignee: '张伟', method: '自动', time: '2024-03-15 14:31', reason: '站长自动匹配' },
    { id: 4, alarm: '电机过温', station: '侯家塘泵站', assignee: '李明', method: '手动', time: '2024-03-14 09:35', reason: '管理员手动指派' },
])

function levelClass(l: string) { return l === '严重' ? 'bg-danger/10 text-danger' : l === '告警' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
function statusClass(s: string) { return s === '已闭环' ? 'bg-success/10 text-success' : s === '处理中' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger' }
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

        <template v-if="activeFunc === 'overview'">
            <div class="flex items-center gap-2 mb-1">
                <CheckCircle class="w-4 h-4 text-success" /><span
                    class="text-sm font-semibold text-default">处置闭环跟踪</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">报警事件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">工单</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">责任人</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">处置措施</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in disposeItems" :key="d.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ d.alarm }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.station }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="levelClass(d.level)">{{ d.level }}</span></td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px]"
                                    :class="d.workOrder !== '-' ? 'text-primary font-bold' : 'text-dim'">
                                    <Link v-if="d.workOrder !== '-'" class="w-3 h-3 inline mr-0.5" />{{ d.workOrder }}
                                </span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.assignee }}</td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ d.measure }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center gap-1">
                                    <div class="w-10 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="d.progress === 100 ? 'bg-success' : d.progress > 0 ? 'bg-primary' : 'bg-danger'"
                                            :style="{ width: d.progress + '%' }"></div>
                                    </div><span class="text-[10px] text-dim">{{ d.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="statusClass(d.status)">{{ d.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'process'">
            <div class="flex items-center gap-2 mb-1">
                <ClipboardList class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">处置过程记录</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">报警事件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">步骤</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">记录内容</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in processRecords" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.alarm }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{{ r.step
                                    }}</span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.operator }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ r.time }}</td>
                            <td class="px-2 py-2.5 text-default">{{ r.content }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'assign'">
            <div class="flex items-center gap-2 mb-1">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">责任人指派记录</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">报警事件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">责任人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">指派说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in assignHistory" :key="a.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ a.alarm }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ a.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default font-medium">{{ a.assignee }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="a.method === '自动' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{
                                        a.method }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ a.time }}</td>
                            <td class="px-2 py-2.5 text-default">{{ a.reason }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
