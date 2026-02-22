<script setup lang="ts">
import { ref } from 'vue'
import { Clock, AlertTriangle, DollarSign, Users, Download, Printer, BarChart3 } from 'lucide-vue-next'

const activeFunc = ref('workload')
const funcTabs = [
    { key: 'workload', label: '工时里程' },
    { key: 'issues', label: '问题统计' },
    { key: 'cost', label: '成本分析' },
    { key: 'report', label: '报表图表' },
]

// 工时里程
const workloadData = ref({
    totalHours: 620, totalMileage: '245km',
    byPerson: [
        { name: '张伟', hours: 180, mileage: '72km', tasks: 15, type: '清淤/修复' },
        { name: '王强', hours: 160, mileage: '65km', tasks: 12, type: '修复/检测' },
        { name: '李明', hours: 140, mileage: '58km', tasks: 13, type: '清淤/排口' },
        { name: '赵刚', hours: 80, mileage: '30km', tasks: 8, type: '保养' },
        { name: '刘芳', hours: 60, mileage: '20km', tasks: 6, type: '水质检测' },
    ],
    byType: [
        { type: '清淤', hours: 220, pct: 35.5 },
        { type: '修复', hours: 150, pct: 24.2 },
        { type: '检测', hours: 120, pct: 19.4 },
        { type: '保养', hours: 80, pct: 12.9 },
        { type: '其他', hours: 50, pct: 8.1 },
    ]
})

// 问题
const maintIssues = ref({
    total: 32,
    byType: [
        { type: '管壁腐蚀', count: 8, pct: 25 },
        { type: '接口渗漏', count: 7, pct: 21.9 },
        { type: '淤积反复', count: 6, pct: 18.8 },
        { type: '设备损坏', count: 5, pct: 15.6 },
        { type: '其他', count: 6, pct: 18.8 },
    ]
})

// 成本
const costData = ref({
    totalCost: 186500,
    material: { total: 82000, items: [{ name: '管材', cost: 35000 }, { name: '密封件', cost: 18000 }, { name: '井盖', cost: 15000 }, { name: '药剂', cost: 8000 }, { name: '其他', cost: 6000 }] },
    labor: { total: 72000, avgPerOrder: 1800, byTeam: [{ team: 'A班', cost: 28000 }, { team: 'B班', cost: 24000 }, { team: 'C班', cost: 20000 }] },
    time: { avgPerOrder: '4.2h', byType: [{ type: '清淤', avg: '3.5h' }, { type: '修复', avg: '6.2h' }, { type: '检测', avg: '4.0h' }, { type: '保养', avg: '2.5h' }] },
    equipment: { total: 32500 }
})

// 报表
const reports = ref([
    { name: '2024年3月养护月报', period: '2024-03', generated: true, date: '2024-04-01' },
    { name: '2024年Q1养护季报', period: '2024-Q1', generated: true, date: '2024-04-05' },
    { name: '2024年3月成本分析', period: '2024-03', generated: false, date: '' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 工时里程 -->
        <template v-if="activeFunc === 'workload'">
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{ workloadData.totalHours }}<span
                            class="text-xs text-dim">h</span></p>
                    <p class="text-[10px] text-dim">总工时</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{ workloadData.totalMileage }}</p>
                    <p class="text-[10px] text-dim">总里程</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                        <Users class="w-4 h-4 text-primary" /><span class="text-xs font-bold text-default">个人工作量</span>
                    </div>
                    <table class="w-full text-xs">
                        <thead>
                            <tr class="border-b border-themed bg-surface/50">
                                <th class="text-left px-3 py-2 text-dim font-medium">姓名</th>
                                <th class="text-center px-2 py-2 text-dim font-medium">工时</th>
                                <th class="text-center px-2 py-2 text-dim font-medium">里程</th>
                                <th class="text-center px-2 py-2 text-dim font-medium">工单</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in workloadData.byPerson" :key="p.name" class="border-b border-themed/30">
                                <td class="px-3 py-2 text-default font-medium">{{ p.name }}</td>
                                <td class="text-center px-2 py-2 text-primary font-bold">{{ p.hours }}h</td>
                                <td class="text-center px-2 py-2 text-info">{{ p.mileage }}</td>
                                <td class="text-center px-2 py-2 text-default">{{ p.tasks }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <Clock class="w-4 h-4 text-info" /><span class="text-xs font-bold text-default">按类型分布</span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="t in workloadData.byType" :key="t.type" class="flex items-center gap-2"><span
                                class="text-[10px] text-default w-10 shrink-0">{{ t.type }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full" :style="{ width: t.pct + '%' }"></div>
                            </div><span class="text-[10px] text-dim w-14 text-right">{{ t.hours }}h</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 问题 -->
        <template v-if="activeFunc === 'issues'">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-3xl font-bold text-warning">{{ maintIssues.total }}</p>
                <p class="text-[10px] text-dim">养护发现问题数</p>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-2 mb-3">
                    <AlertTriangle class="w-4 h-4 text-warning" /><span
                        class="text-xs font-bold text-default">问题类型分布</span>
                </div>
                <div class="space-y-2">
                    <div v-for="t in maintIssues.byType" :key="t.type" class="flex items-center gap-2"><span
                            class="text-[10px] text-default w-16 shrink-0">{{ t.type }}</span>
                        <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                            <div class="h-full bg-warning rounded-full" :style="{ width: t.pct + '%' }"></div>
                        </div><span class="text-[10px] text-dim w-14 text-right">{{ t.count }} ({{ t.pct }}%)</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- 成本 -->
        <template v-if="activeFunc === 'cost'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-xl font-bold text-default">¥{{ (costData.totalCost / 10000).toFixed(1) }}万</p>
                    <p class="text-[10px] text-dim">总成本</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-xl font-bold text-info">¥{{ (costData.material.total / 10000).toFixed(1) }}万</p>
                    <p class="text-[10px] text-dim">材料成本</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-xl font-bold text-primary">¥{{ (costData.labor.total / 10000).toFixed(1) }}万</p>
                    <p class="text-[10px] text-dim">人力成本</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-xl font-bold text-warning">¥{{ (costData.equipment.total / 10000).toFixed(1) }}万</p>
                    <p class="text-[10px] text-dim">设备成本</p>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-2">
                        <DollarSign class="w-3.5 h-3.5 text-info" /><span
                            class="text-xs font-bold text-default">材料明细</span>
                    </div>
                    <div class="space-y-1.5">
                        <div v-for="m in costData.material.items" :key="m.name"
                            class="flex justify-between text-[10px]"><span class="text-default">{{ m.name }}</span><span
                                class="text-primary font-bold">¥{{ m.cost.toLocaleString() }}</span></div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-2">
                        <Users class="w-3.5 h-3.5 text-primary" /><span
                            class="text-xs font-bold text-default">人力(按班组)</span>
                    </div>
                    <div class="space-y-1.5">
                        <div v-for="t in costData.labor.byTeam" :key="t.team" class="flex justify-between text-[10px]">
                            <span class="text-default">{{ t.team }}</span><span class="text-primary font-bold">¥{{
                                t.cost.toLocaleString() }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-2">
                        <Clock class="w-3.5 h-3.5 text-warning" /><span
                            class="text-xs font-bold text-default">时间成本</span>
                    </div>
                    <p class="text-[10px] text-dim mb-2">平均: <span class="text-primary font-bold">{{
                        costData.time.avgPerOrder }}</span>/工单</p>
                    <div class="space-y-1.5">
                        <div v-for="t in costData.time.byType" :key="t.type" class="flex justify-between text-[10px]">
                            <span class="text-default">{{ t.type }}</span><span class="text-default font-bold">{{ t.avg
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 报表 -->
        <template v-if="activeFunc === 'report'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <BarChart3 class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">统计报表</span>
                </div>
                <div class="flex gap-2"><button
                        class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                        <Download class="w-3.5 h-3.5" />导出Excel
                    </button><button
                        class="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed cursor-pointer">
                        <Printer class="w-3.5 h-3.5" />打印
                    </button></div>
            </div>
            <div class="space-y-3">
                <div v-for="r in reports" :key="r.name"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-default">{{ r.name }}</p>
                        <p class="text-[10px] text-dim">{{ r.period }}{{ r.generated ? ' · ' + r.date : '' }}</p>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                        :class="r.generated ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                            r.generated ? '已生成' : '待生成' }}</span>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <span class="text-xs font-bold text-default mb-2 block">📊 统计图表预览</span>
                <div class="h-32 bg-surface rounded-lg flex items-center justify-center text-xs text-dim">柱状图 / 折线图 /
                    饼图（需接入 ECharts）</div>
            </div>
        </template>
    </div>
</template>
