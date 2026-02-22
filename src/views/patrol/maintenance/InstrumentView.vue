<script setup lang="ts">
import { ref } from 'vue'
import { Gauge, Activity, AlertTriangle, Send, Bell, Download, Users } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('level')
const funcTabs = [
    { key: 'level', label: '液位计校准' },
    { key: 'flow', label: '流量计校准' },
    { key: 'issues', label: '维护问题' },
    { key: 'alert', label: '告警提醒' },
    { key: 'repair', label: '报修工单' },
    { key: 'diagnosis', label: '故障诊断' },
    { key: 'task', label: '任务分配' },
    { key: 'export', label: '记录导出' },
]

const levelCalibrations = ref([
    { id: 'LC-001', instrument: '液位计-YW-001', location: '和平路泵站', calibDate: '2024-03-01', nextCalib: '2024-06-01', param: '量程0-5m/精度±0.5%', result: '合格', operator: '张工' },
    { id: 'LC-002', instrument: '液位计-YW-002', location: '建设大道MH-15', calibDate: '2024-02-15', nextCalib: '2024-05-15', param: '量程0-3m/精度±1%', result: '合格', operator: '李工' },
    { id: 'LC-003', instrument: '液位计-YW-003', location: '西城区泵站', calibDate: '2023-12-01', nextCalib: '2024-03-01', param: '量程0-5m/精度±0.5%', result: '偏差超标', operator: '王工' },
])

const flowCalibrations = ref([
    { id: 'FC-001', instrument: '流量计-LL-001', location: '建设大道DN400', calibDate: '2024-02-20', nextCalib: '2024-08-20', param: '量程0-500L/s/精度±2%', result: '合格', operator: '张工' },
    { id: 'FC-002', instrument: '流量计-LL-002', location: '民生路DN600', calibDate: '2024-01-15', nextCalib: '2024-07-15', param: '量程0-800L/s/精度±1.5%', result: '合格', operator: '李工' },
])

const instrumentIssues = ref([
    { id: 'II-001', instrument: '液位计-YW-003', issue: '零点漂移超过允许范围', level: 'medium', status: 'open', reportTime: '2024-03-02', order: 'IR-001' },
    { id: 'II-002', instrument: '流量计-LL-003', issue: '信号断续，疑似传感器接触不良', level: 'high', status: 'processing', reportTime: '2024-03-10', order: 'IR-002' },
])

const alerts = ref([
    { id: 'AL-001', instrument: '液位计-YW-003', type: '超期未校准', dueDate: '2024-03-01', overdueDays: 14, status: 'active' },
    { id: 'AL-002', instrument: '液位计-YW-005', type: '即将到期', dueDate: '2024-03-20', overdueDays: -5, status: 'reminder' },
])

const diagnosisResult = ref({ instrument: '', symptoms: '', possibleCauses: ['传感器老化', '线缆接触不良', '信号干扰', '零点漂移'], solutions: ['更换传感器探头', '检修接线端子', '增加屏蔽措施', '重新校准零点'] })

function submitRepair(name: string) { toast.value?.show(`${name} 报修工单已创建`, 'success') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 液位计 -->
        <div v-if="activeFunc === 'level'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                <Gauge class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">液位计校准记录</span>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">仪表</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">位置</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">校准日</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">下次校准</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">参数</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">结果</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">操作员</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="l in levelCalibrations" :key="l.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2 text-primary font-mono text-[10px]">{{ l.id }}</td>
                        <td class="px-3 py-2 text-default font-medium">{{ l.instrument }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ l.location }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ l.calibDate }}</td>
                        <td class="text-center px-2 py-2 text-dim">{{ l.nextCalib }}</td>
                        <td class="px-3 py-2 text-dim text-[10px]">{{ l.param }}</td>
                        <td class="text-center px-2 py-2"><span class="text-[10px] font-bold"
                                :class="l.result === '合格' ? 'text-success' : 'text-danger'">{{ l.result }}</span></td>
                        <td class="text-center px-2 py-2 text-default">{{ l.operator }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 流量计 -->
        <div v-if="activeFunc === 'flow'" class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                <Activity class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">流量计校准记录</span>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">仪表</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">位置</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">校准日</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">下次校准</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">参数</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">结果</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="f in flowCalibrations" :key="f.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2 text-primary font-mono text-[10px]">{{ f.id }}</td>
                        <td class="px-3 py-2 text-default font-medium">{{ f.instrument }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ f.location }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ f.calibDate }}</td>
                        <td class="text-center px-2 py-2 text-dim">{{ f.nextCalib }}</td>
                        <td class="px-3 py-2 text-dim text-[10px]">{{ f.param }}</td>
                        <td class="text-center px-2 py-2"><span class="text-[10px] font-bold text-success">{{ f.result
                        }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 维护问题 -->
        <div v-if="activeFunc === 'issues'" class="space-y-3">
            <div v-for="i in instrumentIssues" :key="i.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-start justify-between">
                    <div>
                        <div class="flex items-center gap-2">
                            <AlertTriangle class="w-3.5 h-3.5"
                                :class="i.level === 'high' ? 'text-danger' : 'text-warning'" /><span
                                class="text-xs font-bold text-default">{{ i.instrument }}</span><span
                                class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="i.status === 'open' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'">{{
                                    i.status === 'open' ? '待处理' : '处理中' }}</span>
                        </div>
                        <p class="text-[10px] text-default mt-1">{{ i.issue }}</p>
                        <div class="text-[10px] text-dim mt-0.5">上报: {{ i.reportTime }} · 工单: {{ i.order }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 告警 -->
        <div v-if="activeFunc === 'alert'" class="space-y-3">
            <div v-for="a in alerts" :key="a.id" class="bg-card border rounded-xl shadow-themed p-4"
                :class="a.status === 'active' ? 'border-danger/30' : 'border-warning/30'">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Bell class="w-3.5 h-3.5" :class="a.status === 'active' ? 'text-danger' : 'text-warning'" />
                        <span class="text-xs font-bold text-default">{{ a.instrument }}</span><span
                            class="text-[10px] text-dim">{{ a.type }}</span>
                    </div><span class="text-xs font-bold" :class="a.overdueDays > 0 ? 'text-danger' : 'text-warning'">{{
                        a.overdueDays > 0 ? '超期' + a.overdueDays + '天' : Math.abs(a.overdueDays) + '天后到期' }}</span>
                </div>
            </div>
        </div>

        <!-- 报修 -->
        <div v-if="activeFunc === 'repair'" class="space-y-3">
            <div v-for="i in instrumentIssues.filter(i => i.status === 'open')" :key="i.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center justify-between">
                <div><span class="text-xs font-bold text-default">{{ i.instrument }}</span>
                    <p class="text-[10px] text-dim">{{ i.issue }}</p>
                </div>
                <button @click="submitRepair(i.instrument)"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Send class="w-3.5 h-3.5" />提交报修
                </button>
            </div>
        </div>

        <!-- 诊断 -->
        <div v-if="activeFunc === 'diagnosis'" class="grid grid-cols-2 gap-3">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="text-xs font-bold text-default mb-2">🔍 可能原因</div>
                <div class="space-y-1.5">
                    <div v-for="c in diagnosisResult.possibleCauses" :key="c"
                        class="flex items-center gap-2 text-[10px]"><span
                            class="w-1.5 h-1.5 rounded-full bg-warning"></span><span class="text-default">{{ c }}</span>
                    </div>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="text-xs font-bold text-default mb-2">🔧 建议方案</div>
                <div class="space-y-1.5">
                    <div v-for="s in diagnosisResult.solutions" :key="s" class="flex items-center gap-2 text-[10px]">
                        <span class="w-1.5 h-1.5 rounded-full bg-success"></span><span class="text-default">{{ s
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 任务分配 -->
        <div v-if="activeFunc === 'task'" class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center gap-2 mb-3">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">维护任务分配</span>
            </div>
            <p class="text-[10px] text-dim">根据维护人员技能和工作量自动推荐分配方案（同养护工单自动分配逻辑）</p>
        </div>

        <!-- 导出 -->
        <div v-if="activeFunc === 'export'" class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center gap-2 mb-3">
                <Download class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">记录导出</span>
            </div>
            <div class="flex gap-3"><button
                    class="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">📊
                    导出Excel</button><button
                    class="px-4 py-2 bg-surface text-default rounded-lg text-xs font-medium hover:bg-hover-themed cursor-pointer">📄
                    导出PDF</button></div>
        </div>
        <ToastNotify ref="toast" />
    </div>
</template>
