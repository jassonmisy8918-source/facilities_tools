<script setup lang="ts">
import { ref } from 'vue'
import { Leaf, Calculator } from 'lucide-vue-next'

const activeFunc = ref('ledger')
const funcTabs = [
    { key: 'ledger', label: '碳排放台账' },
    { key: 'calc', label: '排放量计算' },
]

const carbonData = ref([
    { station: '雨花泵站', energy: 24500, factor: 0.5810, carbon: 14.24, monthPrev: 13.89, trend: '+2.5%' },
    { station: '侯家塘泵站', energy: 16800, factor: 0.5810, carbon: 9.76, monthPrev: 10.12, trend: '-3.6%' },
    { station: '黎托泵站', energy: 28200, factor: 0.5810, carbon: 16.38, monthPrev: 15.52, trend: '+5.5%' },
    { station: '左家塘泵站', energy: 5200, factor: 0.5810, carbon: 3.02, monthPrev: 3.35, trend: '-9.9%' },
    { station: '洞井泵站', energy: 3800, factor: 0.5810, carbon: 2.21, monthPrev: 2.20, trend: '+0.5%' },
])

const totalCarbon = ref({ today: 1.66, month: 45.61, year: 520.8, yearTarget: 500 })

const calcPeriods = ref([
    { period: '2024-03-15', type: '日', energy: 2850, carbon: 1.66 },
    { period: '2024-03', type: '月', energy: 78500, carbon: 45.61 },
    { period: '2024-02', type: '月', energy: 68500, carbon: 39.80 },
    { period: '2024-01', type: '月', energy: 72000, carbon: 41.83 },
    { period: '2023', type: '年', energy: 850000, carbon: 493.85 },
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

        <template v-if="activeFunc === 'ledger'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ totalCarbon.today }}<span
                            class="text-xs text-dim">tCO₂</span></p>
                    <p class="text-[10px] text-dim">今日碳排放</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-warning">{{ totalCarbon.month }}<span
                            class="text-xs text-dim">tCO₂</span></p>
                    <p class="text-[10px] text-dim">本月累计</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold"
                        :class="totalCarbon.year <= totalCarbon.yearTarget ? 'text-success' : 'text-danger'">{{
                            totalCarbon.year }}<span class="text-xs text-dim">tCO₂</span></p>
                    <p class="text-[10px] text-dim">年度累计</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{ totalCarbon.yearTarget }}<span
                            class="text-xs text-dim">tCO₂</span></p>
                    <p class="text-[10px] text-dim">年度目标</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Leaf class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">各泵站碳排放</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">电耗(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">排放因子</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">碳排放(tCO₂)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">上月</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">环比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in carbonData" :key="c.station"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ c.station }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ c.energy.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.factor }}</td>
                            <td class="text-center px-2 py-2.5 text-warning font-bold">{{ c.carbon }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.monthPrev }}</td>
                            <td class="text-center px-2 py-2.5"
                                :class="c.trend.startsWith('+') ? 'text-danger' : 'text-success'">{{ c.trend }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'calc'">
            <div class="flex items-center gap-2 mb-1">
                <Calculator class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">碳排放量计算</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 mb-3">
                <p class="text-[10px] text-dim mb-1">计算公式（国家标准）:</p>
                <p class="text-xs text-default font-mono bg-surface rounded p-2">碳排放量(tCO₂) = 电耗(kWh) × 排放因子(0.5810
                    tCO₂/MWh) ÷ 1000</p>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">时段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">统计类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">电耗(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">碳排放(tCO₂)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in calcPeriods" :key="c.period"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default font-medium">{{ c.period }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-info/10 text-info">{{ c.type }}</span>
                            </td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ c.energy.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-warning font-bold">{{ c.carbon }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
