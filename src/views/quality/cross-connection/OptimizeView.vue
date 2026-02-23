<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, Play, Lightbulb } from 'lucide-vue-next'

const activeFunc = ref('scheme')
const funcTabs = [
    { key: 'scheme', label: '改造方案' },
    { key: 'simulate', label: '效果模拟' },
    { key: 'optimize', label: '运行优化' },
]

const schemes = ref([
    { id: 1, area: '圭塘街道劳动路', plan: '雨污分流改造', tech: '新建污水管DN400、封堵混接口', length: '45m', cost: '约38万元', duration: '15天', priority: '紧急', phase: 'Q2 2024' },
    { id: 2, area: '黎托街道浏阳河段', plan: '系统分流改造', tech: '双管分铺、雨水管改建', length: '80m', cost: '约95万元', duration: '30天', priority: '紧急', phase: 'Q2-Q3 2024' },
    { id: 3, area: '洞井街道浏阳河路', plan: '接口封堵+分流', tech: '封堵雨水接入口、增设截流井', length: '30m', cost: '约22万元', duration: '10天', priority: '高', phase: 'Q3 2024' },
    { id: 4, area: '侯家塘街道东塘路', plan: '局部改造', tech: '商铺排污管接入污水管', length: '12m', cost: '约5万元', duration: '3天', priority: '中', phase: 'Q4 2024' },
])

const simulations = ref([
    { area: '圭塘街道劳动路', metric: '混接量削减', before: '450m³/日', after: '0m³/日', reduction: '100%', benefit: '年节约处理费12.3万元' },
    { area: '圭塘街道劳动路', metric: '雨水管COD', before: '185mg/L', after: '<30mg/L', reduction: '84%', benefit: '护城河水质达标' },
    { area: '黎托街道浏阳河段', metric: '混接量削减', before: '620m³/日', after: '15m³/日', reduction: '97.6%', benefit: '年节约17万元' },
    { area: '黎托街道浏阳河段', metric: '污水厂进水COD', before: '185mg/L', after: '230mg/L', reduction: '+24%恢复', benefit: '脱氮效率提升' },
    { area: '洞井街道浏阳河路', metric: '污水管雨天流量', before: '210m³/h', after: '85m³/h', reduction: '59.5%', benefit: '消除超负荷风险' },
])

const optimizeSuggestions = ref([
    { id: 1, area: '调度管理', suggestion: '汛期对混接严重区域启动预截流调度，削减雨天混接峰值', impact: '雨天混接削减40%', priority: '高' },
    { id: 2, area: '监测预警', suggestion: '混接高发区域加密水质监测频次（15min→5min），提前识别', impact: '预警提前30min', priority: '高' },
    { id: 3, area: '管网维护', suggestion: '对已识别混接点实施季度专项巡查，防止混接恶化', impact: '新增混接减少60%', priority: '中' },
    { id: 4, area: '源头管控', suggestion: '加强排水户排放许可管理，源头避免混接', impact: '新混接源减少80%', priority: '中' },
    { id: 5, area: '技术升级', suggestion: '部署混接智能感知传感器，实现自动化混接监测', impact: '识别效率提升3倍', priority: '低' },
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

        <template v-if="activeFunc === 'scheme'">
            <div class="flex items-center gap-2 mb-1">
                <Wrench class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">混接改造方案</span>
            </div>
            <div class="space-y-3">
                <div v-for="s in schemes" :key="s.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ s.area
                                }}</span><span class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{
                                s.plan }}</span></div><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="s.priority === '紧急' ? 'bg-danger/10 text-danger' : s.priority === '高' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                            s.priority }}</span>
                    </div>
                    <p class="text-[10px] text-default mb-2">🔧 {{ s.tech }}</p>
                    <div class="grid grid-cols-4 gap-2 text-[10px]">
                        <div><span class="text-dim">长度: </span><span class="text-default">{{ s.length }}</span></div>
                        <div><span class="text-dim">预算: </span><span class="text-primary font-bold">{{ s.cost }}</span>
                        </div>
                        <div><span class="text-dim">工期: </span><span class="text-default">{{ s.duration }}</span></div>
                        <div><span class="text-dim">计划: </span><span class="text-info">{{ s.phase }}</span></div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'simulate'">
            <div class="flex items-center gap-2 mb-1">
                <Play class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">优化效果模拟</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">指标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">改造前</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">改造后</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">削减率</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">效益</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(s, i) in simulations" :key="i"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium text-[10px]">{{ s.area }}</td>
                            <td class="px-2 py-2.5 text-default">{{ s.metric }}</td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ s.before }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ s.after }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ s.reduction }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ s.benefit }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'optimize'">
            <div class="flex items-center gap-2 mb-1">
                <Lightbulb class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">运行优化建议</span>
            </div>
            <div class="space-y-3">
                <div v-for="o in optimizeSuggestions" :key="o.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-default">{{
                            o.area }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="o.priority === '高' ? 'bg-danger/10 text-danger' : o.priority === '中' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                            o.priority }}</span></div>
                    <p class="text-[10px] text-default mb-1">💡 {{ o.suggestion }}</p>
                    <p class="text-[10px] text-success">📈 {{ o.impact }}</p>
                </div>
            </div>
        </template>
    </div>
</template>
