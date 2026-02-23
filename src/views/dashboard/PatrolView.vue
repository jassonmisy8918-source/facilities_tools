<script setup lang="ts">
import { ref } from 'vue'
import { ClipboardList, Search } from 'lucide-vue-next'

const activeFunc = ref('stats')
const funcTabs = [{ key: 'stats', label: '任务单统计' }, { key: 'track', label: '工单跟踪' }]

const orderStats = ref({ total: 258, completed: 210, inProgress: 32, pending: 16 })
const patrolPerf = ref([
    { name: '张工', tasks: 45, completed: 43, issues: 12, efficiency: 95.6 },
    { name: '李工', tasks: 38, completed: 36, issues: 8, efficiency: 94.7 },
    { name: '王工', tasks: 42, completed: 40, issues: 15, efficiency: 95.2 },
])
const maintenancePerf = ref([
    { name: '赵工', tasks: 28, completed: 26, avgTime: '2.5h', cost: '8500元', efficiency: 92.9 },
    { name: '钱工', tasks: 22, completed: 21, avgTime: '3.2h', cost: '7200元', efficiency: 95.5 },
])
const patrolOrders = ref([
    { id: 'XC-20240315-001', area: '圭塘街道', status: '进行中', progress: 75, issues: '发现管道渗漏1处' },
    { id: 'XC-20240315-002', area: '洞井街道', status: '已完成', progress: 100, issues: '无异常' },
    { id: 'XC-20240314-003', area: '黎托街道', status: '问题待处理', progress: 60, issues: '井盖缺失2处待修复' },
])
const maintenanceOrders = ref([
    { id: 'YH-20240315-001', facility: '主干管A清淤', status: '进行中', progress: 50, issues: '淤积严重进度偏慢' },
    { id: 'YH-20240314-002', facility: '检查井修复', status: '已完成', progress: 100, issues: '无' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>
        <template v-if="activeFunc === 'stats'">
            <div class="flex items-center gap-2 mb-1">
                <ClipboardList class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">任务单统计</span>
            </div>
            <div class="grid grid-cols-4 gap-3 mb-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-primary">{{ orderStats.total }}</p>
                    <p class="text-[10px] text-dim">总工单</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-success">{{ orderStats.completed }}</p>
                    <p class="text-[10px] text-dim">已完成</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-warning">{{ orderStats.inProgress }}</p>
                    <p class="text-[10px] text-dim">进行中</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-danger">{{ orderStats.pending }}</p>
                    <p class="text-[10px] text-dim">待处理</p>
                </div>
            </div>
            <span class="text-xs font-bold text-default block mb-2">巡查人员绩效</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">任务数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">完成</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">上报问题</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">效率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in patrolPerf" :key="p.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.name }}</td>
                            <td class="text-center px-2 py-2.5">{{ p.tasks }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ p.completed }}</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ p.issues }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ p.efficiency }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span class="text-xs font-bold text-default block mb-2">养护人员绩效</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">任务</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">完成</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">均用时</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">成本</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">效率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in maintenancePerf" :key="m.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ m.name }}</td>
                            <td class="text-center px-2 py-2.5">{{ m.tasks }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ m.completed }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ m.avgTime }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ m.cost }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ m.efficiency }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-if="activeFunc === 'track'">
            <div class="flex items-center gap-2 mb-1">
                <Search class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">工单跟踪</span>
            </div>
            <span class="text-xs font-bold text-default block mb-2">巡查工单</span>
            <div class="space-y-2 mb-3">
                <div v-for="o in patrolOrders" :key="o.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-3">
                    <div class="flex items-center justify-between mb-1"><span
                            class="text-[10px] font-mono text-primary">{{ o.id }}</span><span
                            class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="o.status === '已完成' ? 'bg-success/10 text-success' : o.status === '进行中' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'">{{
                            o.status }}</span></div>
                    <div class="w-full h-1.5 bg-surface rounded-full overflow-hidden mb-1">
                        <div class="h-full bg-primary rounded-full" :style="{ width: o.progress + '%' }"></div>
                    </div>
                    <p class="text-[10px] text-dim">{{ o.area }} · {{ o.issues }}</p>
                </div>
            </div>
            <span class="text-xs font-bold text-default block mb-2">养护工单</span>
            <div class="space-y-2">
                <div v-for="o in maintenanceOrders" :key="o.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-3">
                    <div class="flex items-center justify-between mb-1"><span
                            class="text-[10px] font-mono text-primary">{{ o.id }}</span><span
                            class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="o.status === '已完成' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'">{{
                            o.status }}</span></div>
                    <div class="w-full h-1.5 bg-surface rounded-full overflow-hidden mb-1">
                        <div class="h-full bg-primary rounded-full" :style="{ width: o.progress + '%' }"></div>
                    </div>
                    <p class="text-[10px] text-dim">{{ o.facility }} · {{ o.issues }}</p>
                </div>
            </div>
        </template>
    </div>
</template>
