<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('daily')
const funcTabs = [{ key: 'daily', label: '运行日报' }, { key: 'monthly', label: '运行月报' }]

const dailyReport = ref({
    date: '2024-03-15', totalInFlow: 2670, totalOutFlow: 2620, totalPower: 390,
    stations: [
        { name: '雨花泵站', status: '正常', pumps: '3/4', inFlow: 850, outFlow: 830, power: 120, faults: 0 },
        { name: '侯家塘泵站', status: '正常', pumps: '2/3', inFlow: 620, outFlow: 610, power: 85, faults: 0 },
        { name: '黎托泵站', status: '预警', pumps: '4/5', inFlow: 1200, outFlow: 1180, power: 180, faults: 1 },
        { name: '左家塘泵站', status: '待机', pumps: '0/3', inFlow: 0, outFlow: 0, power: 5, faults: 0 },
    ]
})

const monthlyReport = ref({
    month: '2024-03', totalEnergy: 78500, totalWater: 138000, unitEnergy: 0.569, faults: 8, repairHours: 42,
    stations: [
        { name: '雨花泵站', energy: 24500, water: 45000, unit: 0.544, faults: 2, uptime: 98.5 },
        { name: '侯家塘泵站', energy: 16800, water: 32000, unit: 0.525, faults: 1, uptime: 99.2 },
        { name: '黎托泵站', energy: 28200, water: 48000, unit: 0.588, faults: 3, uptime: 97.8 },
        { name: '左家塘泵站', energy: 5200, water: 8000, unit: 0.650, faults: 1, uptime: 95.0 },
        { name: '洞井泵站', energy: 3800, water: 5000, unit: 0.760, faults: 1, uptime: 90.5 },
    ]
})
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

        <template v-if="activeFunc === 'daily'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <FileText class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">运行日报 — {{
                        dailyReport.date }}</span>
                </div><button @click="toast?.show('导出日报PDF', 'success')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-info">{{ dailyReport.totalInFlow }}<span
                            class="text-[10px] text-dim">m³/h</span></p>
                    <p class="text-[10px] text-dim">总进水</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-success">{{ dailyReport.totalOutFlow }}<span
                            class="text-[10px] text-dim">m³/h</span></p>
                    <p class="text-[10px] text-dim">总出水</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold text-warning">{{ dailyReport.totalPower }}<span
                            class="text-[10px] text-dim">kW</span></p>
                    <p class="text-[10px] text-dim">总功率</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵组</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进水</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">出水</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">功率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">故障</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in dailyReport.stations" :key="s.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.name }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="s.status === '正常' ? 'bg-success/10 text-success' : s.status === '预警' ? 'bg-warning/10 text-warning' : 'bg-surface text-dim'">{{
                                        s.status }}</span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ s.pumps }}</td>
                            <td class="text-center px-2 py-2.5 text-info font-bold">{{ s.inFlow }}</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ s.outFlow }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ s.power }}kW</td>
                            <td class="text-center px-2 py-2.5"
                                :class="s.faults > 0 ? 'text-danger font-bold' : 'text-success'">{{ s.faults }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'monthly'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <FileText class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">运行月报 — {{
                        monthlyReport.month }}</span>
                </div><button @click="toast?.show('导出月报PDF', 'success')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">电耗(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">水量(m³)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">单位电耗</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">故障次数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设备可用率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in monthlyReport.stations" :key="s.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ s.energy.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ s.water.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="s.unit <= 0.55 ? 'text-success' : 'text-warning'">{{ s.unit }}</td>
                            <td class="text-center px-2 py-2.5"
                                :class="s.faults > 2 ? 'text-danger font-bold' : 'text-default'">{{ s.faults }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="s.uptime >= 98 ? 'text-success' : s.uptime >= 95 ? 'text-warning' : 'text-danger'">
                                {{ s.uptime }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
