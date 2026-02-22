<script setup lang="ts">
import { ref } from 'vue'
import { Database, Gauge, Play, FileText, AlertTriangle, GitBranch } from 'lucide-vue-next'
const activeFunc = ref('history')
const funcTabs = [
    { key: 'history', label: '历史污水量' },
    { key: 'load', label: '管网负荷' },
    { key: 'simulate', label: '策略模拟' },
    { key: 'strategy', label: '调度策略' },
    { key: 'emergency', label: '应急预案' },
    { key: 'version', label: '版本管理' },
]

const historyData = ref([
    { period: '2024-03-15', peak: 12500, valley: 4200, avg: 7800, total: 187200, weather: '晴' },
    { period: '2024-03-14', peak: 18500, valley: 5100, avg: 10200, total: 244800, weather: '中雨' },
    { period: '2024-03-13', peak: 11800, valley: 4000, avg: 7500, total: 180000, weather: '晴' },
    { period: '2024-03-12', peak: 22000, valley: 5800, avg: 12500, total: 300000, weather: '暴雨' },
    { period: '2024-03-11', peak: 12000, valley: 4100, avg: 7600, total: 182400, weather: '多云' },
])

const loadData = ref([
    { pipe: '主干管A(朝阳)', capacity: 15000, current: 12500, utilization: 83.3, status: '高负荷' },
    { pipe: '主干管B(海淀)', capacity: 12000, current: 6800, utilization: 56.7, status: '正常' },
    { pipe: '分支管C(通州)', capacity: 8000, current: 7200, utilization: 90.0, status: '超负荷' },
    { pipe: '主干管D(丰台)', capacity: 10000, current: 5500, utilization: 55.0, status: '正常' },
    { pipe: '分支管E(西城)', capacity: 6000, current: 4800, utilization: 80.0, status: '高负荷' },
])

const simulations = ref([
    { id: 1, name: '方案A-均衡分流', desc: '将朝阳40%流量分流至海淀', loadBalance: 72, overflow: 0, energy: 85, score: 88 },
    { id: 2, name: '方案B-优先通州', desc: '增加通州管段排水能力', loadBalance: 65, overflow: 0, energy: 78, score: 75 },
    { id: 3, name: '方案C-晚高峰调蓄', desc: '18-22时启用调蓄设施', loadBalance: 80, overflow: 0, energy: 90, score: 92 },
])

const strategies = ref([
    { id: 1, name: '旱天常规调度', trigger: '日常', rule: '按时段负荷均衡分配', targets: '主干管A/B/D', status: '生效中', updated: '2024-03-01' },
    { id: 2, name: '雨天增量调度', trigger: '降雨>10mm', rule: '启动调蓄+分流至低负荷管段', targets: '全管网', status: '生效中', updated: '2024-03-05' },
    { id: 3, name: '暴雨应急调度', trigger: '降雨>50mm', rule: '全量调蓄+泵站满负荷', targets: '全管网+泵站', status: '生效中', updated: '2024-02-20' },
])

const emergencies = ref([
    { id: 1, scenario: '暴雨内涝', level: '一级', response: '全量启动调蓄→泵站满载→溢流口预开', resources: '应急泵3台/发电机2台', lastDrill: '2024-02-15' },
    { id: 2, scenario: '泵站故障', level: '二级', response: '临近泵站接力→手动启动备用→调度分流', resources: '备用泵组/移动电源', lastDrill: '2024-01-20' },
    { id: 3, scenario: '管道堵塞', level: '三级', response: '上游截流→旁通绕行→应急清淤', resources: '清淤车2辆/封堵器具', lastDrill: '2024-03-01' },
])

const versions = ref([
    { ver: 'V3.2', date: '2024-03-05', author: '王工', changes: '新增雨天增量策略', status: '当前版本' },
    { ver: 'V3.1', date: '2024-02-20', author: '赵工', changes: '优化暴雨应急参数', status: '历史版本' },
    { ver: 'V3.0', date: '2024-01-15', author: '王工', changes: '策略体系重构', status: '历史版本' },
    { ver: 'V2.5', date: '2023-12-01', author: '李工', changes: '增加通州分支调度', status: '已归档' },
])

function loadClass(u: number) { return u >= 90 ? 'text-danger' : u >= 75 ? 'text-warning' : 'text-success' }
function loadStatusClass(s: string) { return s === '超负荷' ? 'bg-danger/10 text-danger' : s === '高负荷' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success' }
</script>

<template>
    <div class="space-y-4">

        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'history'">
            <div class="flex items-center gap-2 mb-1">
                <Database class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">历史污水量</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">峰值(m³/h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">谷值(m³/h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">均值(m³/h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日总量(m³)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">天气</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in historyData" :key="h.period"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default">{{ h.period }}</td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ h.peak.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ h.valley.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ h.avg.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.total.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="h.weather.includes('雨') ? 'bg-info/10 text-info' : 'bg-surface text-dim'">{{
                                        h.weather }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'load'">
            <div class="flex items-center gap-2 mb-1">
                <Gauge class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">管网负荷</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设计容量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">当前流量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负荷率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="l in loadData" :key="l.pipe" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ l.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ l.capacity.toLocaleString() }}m³/h</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ l.current.toLocaleString() }}
                            </td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center justify-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="l.utilization >= 90 ? 'bg-danger' : l.utilization >= 75 ? 'bg-warning' : 'bg-success'"
                                            :style="{ width: l.utilization + '%' }"></div>
                                    </div><span class="text-[10px] font-bold" :class="loadClass(l.utilization)">{{
                                        l.utilization }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="loadStatusClass(l.status)">{{ l.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'simulate'">
            <div class="flex items-center gap-2 mb-1">
                <Play class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">策略模拟测试</span>
            </div>
            <div class="space-y-3">
                <div v-for="s in simulations" :key="s.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        s.name }}</span><span class="text-lg font-bold text-primary">{{ s.score }}分</span></div>
                    <p class="text-[10px] text-dim mb-2">📋 {{ s.desc }}</p>
                    <div class="grid grid-cols-3 gap-3 text-center">
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-sm font-bold" :class="s.loadBalance >= 75 ? 'text-success' : 'text-warning'">
                                {{ s.loadBalance }}%</p>
                            <p class="text-[10px] text-dim">负荷均衡</p>
                        </div>
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-sm font-bold" :class="s.overflow === 0 ? 'text-success' : 'text-danger'">{{
                                s.overflow }}</p>
                            <p class="text-[10px] text-dim">溢流风险</p>
                        </div>
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-sm font-bold" :class="s.energy >= 85 ? 'text-success' : 'text-warning'">{{
                                s.energy }}%</p>
                            <p class="text-[10px] text-dim">能效评分</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'strategy'">
            <div class="flex items-center gap-2 mb-1">
                <FileText class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">调度策略</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">策略名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">触发条件</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">调度规则</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">作用目标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">更新</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in strategies" :key="s.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.name }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ s.trigger
                                    }}</span></td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ s.rule }}</td>
                            <td class="text-center px-2 py-2.5 text-default text-[10px]">{{ s.targets }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-success/10 text-success">{{
                                        s.status }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ s.updated }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'emergency'">
            <div class="flex items-center gap-2 mb-1">
                <AlertTriangle class="w-4 h-4 text-danger" /><span
                    class="text-sm font-semibold text-default">应急调度方案</span>
            </div>
            <div class="space-y-3">
                <div v-for="e in emergencies" :key="e.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        e.scenario }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="e.level === '一级' ? 'bg-danger/10 text-danger' : e.level === '二级' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                e.level }}</span></div>
                    <p class="text-[10px] text-default mb-1">🔧 {{ e.response }}</p>
                    <div class="flex gap-4 text-[10px]"><span class="text-dim">资源: <span class="text-primary">{{
                        e.resources }}</span></span><span class="text-dim">最近演练: <span class="text-default">{{
                                    e.lastDrill }}</span></span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'version'">
            <div class="flex items-center gap-2 mb-1">
                <GitBranch class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">策略版本管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">版本</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">作者</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">变更说明</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="v in versions" :key="v.ver" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-primary font-bold">{{ v.ver }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ v.date }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ v.author }}</td>
                            <td class="px-2 py-2.5 text-default">{{ v.changes }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="v.status === '当前版本' ? 'bg-success/10 text-success' : v.status === '历史版本' ? 'bg-surface text-dim' : 'bg-info/10 text-info'">{{
                                        v.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
