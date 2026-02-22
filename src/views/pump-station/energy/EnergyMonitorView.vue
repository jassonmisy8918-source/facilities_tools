<script setup lang="ts">
import { ref, computed } from 'vue'
import { Zap, BarChart3 } from 'lucide-vue-next'

const activeFunc = ref('total')
const funcTabs = [
    { key: 'total', label: '总电耗' },
    { key: 'pump', label: '单泵电耗' },
    { key: 'ratio', label: '能耗占比' },
]

const totalEnergy = ref({
    today: 2850, yesterday: 2720, thisMonth: 78500, lastMonth: 75200,
    stations: [
        { name: '朝阳泵站', today: 860, month: 24500, trend: '+3.2%' },
        { name: '西城泵站', today: 580, month: 16800, trend: '-1.5%' },
        { name: '通州泵站', today: 1020, month: 28200, trend: '+5.1%' },
        { name: '丰台泵站', today: 180, month: 5200, trend: '-8.3%' },
        { name: '海淀泵站', today: 210, month: 3800, trend: '0%' },
    ]
})

const pumpEnergy = ref([
    { station: '朝阳泵站', pump: '1号泵', power: 15, hours: 22, energy: 330, efficiency: 88.5 },
    { station: '朝阳泵站', pump: '2号泵', power: 15, hours: 18, energy: 270, efficiency: 86.2 },
    { station: '朝阳泵站', pump: '3号泵', power: 15, hours: 20, energy: 300, efficiency: 87.8 },
    { station: '西城泵站', pump: '1号泵', power: 11, hours: 21, energy: 231, efficiency: 90.1 },
    { station: '西城泵站', pump: '2号泵', power: 11, hours: 16, energy: 176, efficiency: 89.5 },
    { station: '通州泵站', pump: '1号泵', power: 22, hours: 23, energy: 506, efficiency: 85.3 },
    { station: '通州泵站', pump: '2号泵', power: 22, hours: 22, energy: 484, efficiency: 84.9 },
])

const ratioData = ref([
    { item: '水泵', energy: 2100, pct: 73.7, color: 'bg-primary' },
    { item: '格栅/辅助', energy: 320, pct: 11.2, color: 'bg-info' },
    { item: '照明/暖通', energy: 180, pct: 6.3, color: 'bg-warning' },
    { item: '配电损耗', energy: 150, pct: 5.3, color: 'bg-danger' },
    { item: '其他', energy: 100, pct: 3.5, color: 'bg-surface' },
])

const totalToday = computed(() => totalEnergy.value.today)
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'total'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{ totalEnergy.today }}<span
                            class="text-xs text-dim">kWh</span></p>
                    <p class="text-[10px] text-dim">今日总电耗</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ totalEnergy.yesterday }}<span
                            class="text-xs text-dim">kWh</span></p>
                    <p class="text-[10px] text-dim">昨日总电耗</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{ (totalEnergy.thisMonth / 1000).toFixed(1) }}<span
                            class="text-xs text-dim">MWh</span></p>
                    <p class="text-[10px] text-dim">本月累计</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{ (totalEnergy.lastMonth / 1000).toFixed(1) }}<span
                            class="text-xs text-dim">MWh</span></p>
                    <p class="text-[10px] text-dim">上月累计</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Zap class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">各泵站电耗</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">今日(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">本月(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">占比</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">环比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in totalEnergy.stations" :key="s.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ s.today }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ s.month.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ (s.today / totalToday * 100).toFixed(1) }}%
                            </td>
                            <td class="text-center px-2 py-2.5"
                                :class="s.trend.startsWith('+') ? 'text-danger' : s.trend.startsWith('-') ? 'text-success' : 'text-dim'">
                                {{ s.trend }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'pump'">
            <div class="flex items-center gap-2 mb-1">
                <Zap class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">单泵电耗明细</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">水泵</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">功率(kW)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">运行(h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">电耗(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">效率(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in pumpEnergy" :key="p.station + p.pump"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default">{{ p.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default font-medium">{{ p.pump }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.power }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.hours }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ p.energy }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="p.efficiency >= 88 ? 'text-success' : p.efficiency >= 85 ? 'text-warning' : 'text-danger'">
                                {{ p.efficiency }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'ratio'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">能耗占比分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                        <div class="text-center">
                            <p class="text-lg font-bold text-primary">{{ totalEnergy.today }}</p>
                            <p class="text-[10px] text-dim">kWh</p>
                        </div>
                    </div>
                    <div class="flex-1 space-y-2">
                        <div v-for="r in ratioData" :key="r.item" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-16">{{ r.item }}</span>
                            <div class="flex-1 h-4 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full" :class="r.color" :style="{ width: r.pct + '%' }"></div>
                            </div><span class="text-[10px] text-default font-bold w-12 text-right">{{ r.pct
                                }}%</span><span class="text-[10px] text-dim w-16 text-right">{{ r.energy }}kWh</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
