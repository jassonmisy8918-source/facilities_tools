<script setup lang="ts">
import { ref } from 'vue'
import { TrendingUp, FileText, AlertTriangle, BarChart3 } from 'lucide-vue-next'

const activeFunc = ref('trend')
const funcTabs = [
    { key: 'trend', label: '趋势分析' },
    { key: 'report', label: '节能报告' },
    { key: 'unit', label: '单位水量电耗' },
    { key: 'high', label: '高耗能标注' },
]

const trendData = ref([
    { month: '2024-01', energy: 72000, water: 125000, unit: 0.576 },
    { month: '2024-02', energy: 68500, water: 118000, unit: 0.581 },
    { month: '2024-03', energy: 78500, water: 138000, unit: 0.569 },
])

const unitData = ref([
    { station: '雨花泵站', water: 45000, energy: 24500, unit: 0.544, benchmark: 0.55, status: '达标' },
    { station: '侯家塘泵站', water: 32000, energy: 16800, unit: 0.525, benchmark: 0.55, status: '优秀' },
    { station: '黎托泵站', water: 48000, energy: 28200, unit: 0.588, benchmark: 0.55, status: '偏高' },
    { station: '左家塘泵站', water: 8000, energy: 5200, unit: 0.650, benchmark: 0.55, status: '偏高' },
    { station: '洞井泵站', water: 5000, energy: 3800, unit: 0.760, benchmark: 0.55, status: '超标' },
])

const highEnergy = ref([
    { device: '1号泵(黎托街道)', actual: 0.588, benchmark: 0.55, excess: '+6.9%', age: 5, suggestion: '更换为高效节能泵，预计节能12%', model: 'QW-HE200-300' },
    { device: '格栅机(左家塘)', actual: 8.5, benchmark: 6.0, excess: '+41.7%', age: 3, suggestion: '更换变频控制，预计节能25%', model: 'VFD-GS800' },
    { device: '全站(洞井)', actual: 0.760, benchmark: 0.55, excess: '+38.2%', age: 8, suggestion: '整站改造评估，泵组+电气全面升级', model: '-' },
])

const savingReports = ref([
    { id: 1, period: '2024年Q1', potential: '15.2%', saving: '约3.6万kWh/季', cost: '约2.5万元/季', items: ['黎托泵站运行策略优化', '左家塘格栅改造', '洞井整站评估'] },
])

function unitClass(s: string) { return s === '优秀' ? 'bg-success/10 text-success' : s === '达标' ? 'bg-info/10 text-info' : s === '偏高' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'trend'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingUp class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">能耗趋势分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="h-32 bg-surface rounded-lg flex items-center justify-center text-xs text-dim">
                    <BarChart3 class="w-5 h-5 mr-2" />能耗趋势曲线（需接入 ECharts）
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">月份</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">总电耗(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">总水量(m³)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">单位水量电耗</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in trendData" :key="t.month"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default">{{ t.month }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ t.energy.toLocaleString() }}
                            </td>
                            <td class="text-center px-2 py-2.5 text-info">{{ t.water.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="t.unit <= 0.55 ? 'text-success' : 'text-warning'">{{ t.unit }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'report'">
            <div class="flex items-center gap-2 mb-1">
                <FileText class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">节能潜力分析报告</span>
            </div>
            <div v-for="r in savingReports" :key="r.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-3"><span class="text-xs font-bold text-default">{{
                    r.period }}</span><span class="text-xs text-success font-bold">节能潜力: {{ r.potential }}</span>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3">
                    <div class="bg-surface rounded-lg p-3 text-center">
                        <p class="text-lg font-bold text-primary">{{ r.saving }}</p>
                        <p class="text-[10px] text-dim">预计节电</p>
                    </div>
                    <div class="bg-surface rounded-lg p-3 text-center">
                        <p class="text-lg font-bold text-success">{{ r.cost }}</p>
                        <p class="text-[10px] text-dim">预计节费</p>
                    </div>
                </div>
                <div>
                    <p class="text-[10px] text-dim mb-1">优化建议:</p>
                    <ul class="space-y-1">
                        <li v-for="i in r.items" :key="i" class="text-[10px] text-default">💡 {{ i }}</li>
                    </ul>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'unit'">
            <span class="text-sm font-semibold text-default block">单位水量电耗（含行业标杆）</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">水量(m³)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">电耗(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">单位电耗</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">标杆值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">评价</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in unitData" :key="u.station"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ u.station }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ u.water.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ u.energy.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="u.unit <= u.benchmark ? 'text-success' : 'text-danger'">{{ u.unit }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ u.benchmark }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="unitClass(u.status)">{{ u.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'high'">
            <div class="flex items-center gap-2 mb-1">
                <AlertTriangle class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">高耗能设备 &
                    更换建议</span>
            </div>
            <div class="space-y-3">
                <div v-for="h in highEnergy" :key="h.device"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">⚠️
                            {{ h.device }}</span><span class="text-[10px] text-danger font-bold">超标 {{ h.excess
                            }}</span></div>
                    <div class="grid grid-cols-3 gap-2 text-[10px] mb-2">
                        <div><span class="text-dim">实际值: </span><span class="text-danger font-bold">{{ h.actual
                                }}</span></div>
                        <div><span class="text-dim">标杆值: </span><span class="text-success">{{ h.benchmark }}</span>
                        </div>
                        <div><span class="text-dim">设备年龄: </span><span class="text-default">{{ h.age }}年</span></div>
                    </div>
                    <p class="text-[10px] text-primary">🔧 {{ h.suggestion }} <span v-if="h.model !== '-'"
                            class="text-dim">推荐型号: {{ h.model }}</span></p>
                </div>
            </div>
        </template>
    </div>
</template>
