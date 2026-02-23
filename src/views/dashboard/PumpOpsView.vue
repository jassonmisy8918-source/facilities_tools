<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, Search } from 'lucide-vue-next'

const activeFunc = ref('stats')
const funcTabs = [{ key: 'stats', label: '运维工单统计' }, { key: 'track', label: '工单跟踪' }]

const stats = ref({ total: 156, completed: 128, inProgress: 18, pending: 10 })
const perfData = ref([
    { name: '张维修', score: 92.5, tasks: 35, completion: 97.1 },
    { name: '李运维', score: 88.2, tasks: 28, completion: 92.9 },
])
const healthData = ref([
    { station: '韶山路泵站', index: 92, faultFreq: 0.8, energyEff: 0.28, status: '良好' },
    { station: '圭塘河泵站', index: 85, faultFreq: 1.5, energyEff: 0.31, status: '一般' },
    { station: '劳动路泵站', index: 78, faultFreq: 2.2, energyEff: 0.35, status: '关注' },
])
const orders = ref([
    { id: 'PS-20240315-001', station: '韶山路泵站', type: '保养', progress: 80, issue: '阀门密封需更换' },
    { id: 'PS-20240314-002', station: '圭塘河泵站', type: '维修', progress: 100, issue: '无' },
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
                <Wrench class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">泵站运维统计</span>
            </div>
            <div class="grid grid-cols-4 gap-3 mb-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-primary">{{ stats.total }}</p>
                    <p class="text-[10px] text-dim">总工单</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-success">{{ stats.completed }}</p>
                    <p class="text-[10px] text-dim">已完成</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-warning">{{ stats.inProgress }}</p>
                    <p class="text-[10px] text-dim">进行中</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-2xl font-bold text-danger">{{ stats.pending }}</p>
                    <p class="text-[10px] text-dim">待处理</p>
                </div>
            </div>
            <span class="text-xs font-bold text-default block mb-2">设备健康/故障/能效</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">健康指数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">故障频率(次/月)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">能效(kWh/m³)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in healthData" :key="h.station"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ h.station }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="h.index >= 90 ? 'text-success' : h.index >= 80 ? 'text-primary' : 'text-warning'">
                                {{ h.index }}</td>
                            <td class="text-center px-2 py-2.5"
                                :class="h.faultFreq >= 2 ? 'text-danger font-bold' : 'text-default'">{{ h.faultFreq }}
                            </td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.energyEff }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="h.status === '良好' ? 'bg-success/10 text-success' : h.status === '关注' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'">{{
                                    h.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span class="text-xs font-bold text-default block mb-2">运维绩效</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">评分</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">任务数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">完成率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in perfData" :key="p.name" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ p.score }}</td>
                            <td class="text-center px-2 py-2.5">{{ p.tasks }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ p.completion }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-if="activeFunc === 'track'">
            <div class="flex items-center gap-2 mb-1">
                <Search class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">泵站工单跟踪</span>
            </div>
            <div class="space-y-2">
                <div v-for="o in orders" :key="o.id" class="bg-card border border-themed rounded-xl shadow-themed p-3">
                    <div class="flex items-center justify-between mb-1"><span
                            class="text-[10px] font-mono text-primary">{{ o.id }}</span><span
                            class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="o.progress === 100 ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'">{{
                            o.type }}</span></div>
                    <div class="w-full h-1.5 bg-surface rounded-full overflow-hidden mb-1">
                        <div class="h-full bg-primary rounded-full" :style="{ width: o.progress + '%' }"></div>
                    </div>
                    <p class="text-[10px] text-dim">{{ o.station }} · {{ o.issue }}</p>
                </div>
            </div>
        </template>
    </div>
</template>
