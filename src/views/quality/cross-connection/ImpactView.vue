<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, Droplets, Factory, Globe } from 'lucide-vue-next'

const activeFunc = ref('quality')
const funcTabs = [
    { key: 'quality', label: '水质影响' },
    { key: 'volume', label: '水量影响' },
    { key: 'plant', label: '污水厂影响' },
    { key: 'env', label: '水环境影响' },
]

const qualityImpact = ref([
    { area: '朝阳区民生路', indicator: 'COD', baseline: 30, actual: 185, increase: '517%', impact: '严重超标排入雨水管', risk: '高' },
    { area: '朝阳区民生路', indicator: 'SS', baseline: 20, actual: 120, increase: '500%', impact: '悬浮物严重超标', risk: '高' },
    { area: '海淀区清河路', indicator: 'COD', baseline: 250, actual: 95, increase: '-62%', impact: '污水厂进水浓度降低', risk: '中' },
    { area: '通州区运河段', indicator: 'NH₃-N', baseline: 35, actual: 15, increase: '-57%', impact: '氮负荷波动', risk: '中' },
])

const volumeImpact = ref([
    { area: '朝阳区民生路', dryMix: 450, wetMix: 1200, annualMix: 164250, pctOfTotal: 8.5, costImpact: '约12.3万元/年' },
    { area: '海淀区清河路', dryMix: 180, wetMix: 650, annualMix: 65700, pctOfTotal: 3.4, costImpact: '约4.9万元/年' },
    { area: '通州区运河段', dryMix: 620, wetMix: 1800, annualMix: 226300, pctOfTotal: 11.7, costImpact: '约17.0万元/年' },
    { area: '西城区西单路', dryMix: 35, wetMix: 120, annualMix: 12775, pctOfTotal: 0.7, costImpact: '约1.0万元/年' },
])

const plantImpact = ref([
    { item: '进水COD浓度下降', before: '250mg/L', after: '185mg/L', change: '-26%', effect: '碳源不足，脱氮效率降低', severity: '严重' },
    { item: '处理水量增加', before: '5.2万m³/日', after: '5.7万m³/日', change: '+9.6%', effect: '超设计负荷运行风险', severity: '中等' },
    { item: '污泥产量变化', before: '12t/日', after: '10.5t/日', change: '-12.5%', effect: '产泥减少但含水率上升', severity: '轻微' },
    { item: '电耗变化', before: '0.28kWh/m³', after: '0.31kWh/m³', change: '+10.7%', effect: '单位水量电耗增加', severity: '中等' },
])

const envImpact = ref([
    { waterBody: '朝阳护城河', mixType: '污水入雨水管', pollution: 'COD/SS超标排放', currentClass: 'Ⅴ类', targetClass: 'Ⅳ类', gap: '未达标', recommendation: '截污改造' },
    { waterBody: '清河(海淀段)', mixType: '雨水入污水管', pollution: '间接导致溢流', currentClass: 'Ⅳ类', targetClass: 'Ⅲ类', gap: '基本达标', recommendation: '分流改造' },
    { waterBody: '运河(通州段)', mixType: '双向混接', pollution: '旱天排污+雨天溢流', currentClass: 'Ⅴ类', targetClass: 'Ⅳ类', gap: '未达标', recommendation: '系统改造' },
])

function riskClass(r: string) { return r === '高' || r === '严重' ? 'bg-danger/10 text-danger' : r === '中' || r === '中等' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'quality'">
            <div class="flex items-center gap-2 mb-1">
                <Droplets class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">水质影响评估</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">指标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">基线值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">实测值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">变化</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">影响</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">风险</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(q, i) in qualityImpact" :key="i"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium text-[10px]">{{ q.area }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ q.indicator }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ q.baseline }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ q.actual }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="q.increase.startsWith('-') ? 'text-info' : 'text-danger'">{{ q.increase }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ q.impact }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium" :class="riskClass(q.risk)">{{
                                    q.risk }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'volume'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">水量影响评估</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">旱天(m³/日)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">雨天(m³/日)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">年混接量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">占比</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">经济损失</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="v in volumeImpact" :key="v.area"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium text-[10px]">{{ v.area }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ v.dryMix }}</td>
                            <td class="text-center px-2 py-2.5 text-info font-bold">{{ v.wetMix }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ v.annualMix.toLocaleString() }}m³</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="v.pctOfTotal >= 10 ? 'text-danger' : v.pctOfTotal >= 5 ? 'text-warning' : 'text-default'">
                                {{ v.pctOfTotal }}%</td>
                            <td class="text-center px-2 py-2.5 text-danger">{{ v.costImpact }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'plant'">
            <div class="flex items-center gap-2 mb-1">
                <Factory class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">污水处理厂影响评估</span>
            </div>
            <div class="space-y-3">
                <div v-for="p in plantImpact" :key="p.item"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                            p.item }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="riskClass(p.severity)">{{ p.severity }}</span></div>
                    <div class="grid grid-cols-3 gap-3 text-center mb-2">
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-sm font-bold text-dim">{{ p.before }}</p>
                            <p class="text-[10px] text-dim">混接前</p>
                        </div>
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-sm font-bold text-primary">{{ p.after }}</p>
                            <p class="text-[10px] text-dim">混接后</p>
                        </div>
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-sm font-bold"
                                :class="p.change.startsWith('+') ? 'text-danger' : 'text-info'">{{ p.change }}</p>
                            <p class="text-[10px] text-dim">变化</p>
                        </div>
                    </div>
                    <p class="text-[10px] text-dim">⚠ {{ p.effect }}</p>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'env'">
            <div class="flex items-center gap-2 mb-1">
                <Globe class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">水环境影响评估</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">受纳水体</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">混接类型</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">污染特征</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">现状</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">目标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">达标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">建议</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in envImpact" :key="e.waterBody"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ e.waterBody }}</td>
                            <td class="text-center px-2 py-2.5 text-default text-[10px]">{{ e.mixType }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ e.pollution }}</td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ e.currentClass }}</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ e.targetClass }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="e.gap === '未达标' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'">{{
                                    e.gap }}</span></td>
                            <td class="text-center px-2 py-2.5 text-primary text-[10px]">{{ e.recommendation }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
