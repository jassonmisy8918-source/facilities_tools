<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, Wrench, FileText, Play } from 'lucide-vue-next'

const activeFunc = ref('bottleneck')
const funcTabs = [
    { key: 'bottleneck', label: '瓶颈诊断' },
    { key: 'suggest', label: '改造建议' },
    { key: 'emergency', label: '应急预案' },
]

const bottlenecks = ref([
    { id: 1, station: '通州泵站', area: '能耗', desc: '单位水量电耗0.588，超标6.9%', impact: '年多耗电约5.8万kWh', severity: '高', root: '泵组效率下降+运行策略粗放' },
    { id: 2, station: '海淀泵站', area: '设备', desc: '设备健康指数45，设备老化严重', impact: '故障频发，可用率仅90.5%', severity: '严重', root: '2号泵电机老化、全站设备超龄' },
    { id: 3, station: '丰台泵站', area: '辅助', desc: '格栅机频繁过载', impact: '影响进水预处理效率', severity: '中', root: '链条材质不适配、缺变频控制' },
])

const reformSuggestions = ref([
    { id: 1, station: '海淀泵站', plan: '泵组+电气全面升级改造', investment: '约85万元', payback: '3年', saving: '年节电约9.5万kWh', priority: '紧急' },
    { id: 2, station: '通州泵站', plan: '变频改造+运行策略优化', investment: '约25万元', payback: '2年', saving: '年节电约5.8万kWh', priority: '高' },
    { id: 3, station: '丰台泵站', plan: '格栅机变频改造+材质升级', investment: '约12万元', payback: '1.5年', saving: '年节电约2万kWh', priority: '中' },
])

const emergencyPlans = ref([
    { id: 1, type: '水泵故障停机', level: '二级', flow: '启动备用泵→通知值班→调度协调→故障排查→抢修', resources: '备用泵组/维修工具/备件', owner: '站长', lastDrill: '2024-02-15' },
    { id: 2, type: '暴雨超量进水', level: '一级', flow: '全泵启动→开启溢流→上报调度→请求支援', resources: '全泵组/防汛物资/排水车', owner: '调度中心', lastDrill: '2024-01-20' },
    { id: 3, type: '配电系统故障', level: '二级', flow: '切换备用电源→通知电力→值班值守→恢复送电', resources: '柴油发电机/UPS/配电备件', owner: '电气主管', lastDrill: '2024-03-01' },
    { id: 4, type: '有毒气体泄漏', level: '一级', flow: '报警疏散→通风排气→气体检测→专业处置', resources: '防毒面具/气体检测仪/通风设备', owner: '安全主管', lastDrill: '2023-12-10' },
])

function severityClass(s: string) { return s === '严重' ? 'bg-danger/10 text-danger' : s === '高' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'bottleneck'">
            <div class="flex items-center gap-2 mb-1">
                <AlertTriangle class="w-4 h-4 text-danger" /><span
                    class="text-sm font-semibold text-default">运行瓶颈诊断</span>
            </div>
            <div class="space-y-3">
                <div v-for="b in bottlenecks" :key="b.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ b.station
                                }}</span><span class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ b.area
                                }}</span></div><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="severityClass(b.severity)">{{ b.severity }}</span>
                    </div>
                    <p class="text-[10px] text-default mb-1">🔍 {{ b.desc }}</p>
                    <p class="text-[10px] text-danger mb-1">⚠ 影响: {{ b.impact }}</p>
                    <p class="text-[10px] text-dim">根因: {{ b.root }}</p>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'suggest'">
            <div class="flex items-center gap-2 mb-1">
                <Wrench class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">瓶颈改造建议</span>
            </div>
            <div class="space-y-3">
                <div v-for="r in reformSuggestions" :key="r.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                            r.station }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="r.priority === '紧急' ? 'bg-danger/10 text-danger' : r.priority === '高' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                            r.priority }}</span></div>
                    <p class="text-[10px] text-default mb-2">📋 {{ r.plan }}</p>
                    <div class="grid grid-cols-3 gap-2 text-[10px]">
                        <div class="bg-surface rounded p-2 text-center">
                            <p class="text-primary font-bold">{{ r.investment }}</p>
                            <p class="text-dim">投资</p>
                        </div>
                        <div class="bg-surface rounded p-2 text-center">
                            <p class="text-info font-bold">{{ r.payback }}</p>
                            <p class="text-dim">回收期</p>
                        </div>
                        <div class="bg-surface rounded p-2 text-center">
                            <p class="text-success font-bold">{{ r.saving }}</p>
                            <p class="text-dim">预计节能</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'emergency'">
            <div class="flex items-center gap-2 mb-1">
                <FileText class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">应急预案管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">预案类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">响应等级</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">处置流程</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">责任人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最近演练</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in emergencyPlans" :key="e.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ e.type }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="e.level === '一级' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">{{
                                    e.level }}</span></td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ e.flow }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ e.owner }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ e.lastDrill }}</td>
                            <td class="text-center px-2 py-2.5"><button
                                    class="text-[10px] text-primary hover:underline cursor-pointer flex items-center gap-0.5 mx-auto">
                                    <Play class="w-3 h-3" />推演
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
