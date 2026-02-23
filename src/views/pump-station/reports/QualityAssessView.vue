<script setup lang="ts">
import { ref } from 'vue'
import { Award, Timer, CheckCircle, Trophy, Heart, AlertTriangle } from 'lucide-vue-next'

const activeFunc = ref('performance')
const funcTabs = [
    { key: 'performance', label: '绩效管理' },
    { key: 'ranking', label: '绩效排名' },
    { key: 'health', label: '设备健康' },
]

const performanceData = ref([
    { person: '张伟', team: 'A班', completionRate: 98.5, avgResponse: '12min', repairQuality: 97.2, orders: 45, score: 95 },
    { person: '王强', team: 'B班', completionRate: 96.8, avgResponse: '15min', repairQuality: 95.8, orders: 42, score: 92 },
    { person: '赵刚', team: 'A班', completionRate: 95.2, avgResponse: '18min', repairQuality: 98.5, orders: 38, score: 91 },
    { person: '李明', team: 'B班', completionRate: 97.5, avgResponse: '10min', repairQuality: 93.5, orders: 50, score: 93 },
    { person: '刘芳', team: 'C班', completionRate: 92.0, avgResponse: '22min', repairQuality: 96.0, orders: 30, score: 86 },
])

const teamRanking = ref([
    { rank: 1, team: 'A班', score: 93.0, orders: 83, completion: 96.9, response: '15min', members: 2 },
    { rank: 2, team: 'B班', score: 92.5, orders: 92, completion: 97.2, response: '12.5min', members: 2 },
    { rank: 3, team: 'C班', score: 86.0, orders: 30, completion: 92.0, response: '22min', members: 1 },
])

const healthIndex = ref([
    { device: '1号水泵', station: '雨花泵站', health: 85, factors: '振动偏高', trend: '下降', priority: false },
    { device: '主电机', station: '侯家塘泵站', health: 92, factors: '正常', trend: '平稳', priority: false },
    { device: '2号水泵', station: '黎托泵站', health: 68, factors: '效率衰减+振动', trend: '下降', priority: true },
    { device: '格栅机', station: '左家塘泵站', health: 72, factors: '链条磨损', trend: '下降', priority: true },
    { device: '2号水泵', station: '洞井泵站', health: 45, factors: '电机老化+效率低', trend: '持续下降', priority: true },
    { device: '阀门DN300', station: '黎托泵站', health: 88, factors: '轻微渗漏', trend: '平稳', priority: false },
])

function healthClass(h: number) { return h >= 85 ? 'text-success' : h >= 70 ? 'text-warning' : 'text-danger' }
function scoreClass(s: number) { return s >= 93 ? 'text-success' : s >= 88 ? 'text-primary' : 'text-warning' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'performance'">
            <div class="flex items-center gap-2 mb-1">
                <Award class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">运维绩效</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">班组</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">完成率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">响应时效</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">修复合格率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">工单数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">综合分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in performanceData" :key="p.person"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.person }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.team }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="p.completionRate >= 97 ? 'text-success' : 'text-warning'">{{ p.completionRate
                                }}%</td>
                            <td class="text-center px-2 py-2.5 text-primary">
                                <Timer class="w-3 h-3 inline mr-0.5" />{{ p.avgResponse }}
                            </td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="p.repairQuality >= 96 ? 'text-success' : 'text-warning'">
                                <CheckCircle class="w-3 h-3 inline mr-0.5" />{{ p.repairQuality }}%
                            </td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.orders }}</td>
                            <td class="text-center px-2 py-2.5 font-bold text-lg" :class="scoreClass(p.score)">{{
                                p.score }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'ranking'">
            <div class="flex items-center gap-2 mb-1">
                <Trophy class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">班组绩效排名</span>
            </div>
            <div class="space-y-3">
                <div v-for="t in teamRanking" :key="t.rank"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                        :class="t.rank === 1 ? 'bg-warning/20 text-warning' : t.rank === 2 ? 'bg-surface text-dim' : 'bg-surface text-dim'">
                        {{ t.rank }}</div>
                    <div class="flex-1">
                        <p class="text-xs font-bold text-default">{{ t.team }} <span class="text-[10px] text-dim">({{
                            t.members }}人)</span></p>
                        <div class="flex gap-4 mt-1 text-[10px]"><span class="text-dim">工单: <span
                                    class="text-primary font-bold">{{ t.orders }}</span></span><span
                                class="text-dim">完成率: <span class="text-success font-bold">{{ t.completion
                                    }}%</span></span><span class="text-dim">响应: <span class="text-info font-bold">{{
                                        t.response }}</span></span></div>
                    </div>
                    <div class="text-2xl font-bold" :class="scoreClass(t.score)">{{ t.score }}</div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'health'">
            <div class="flex items-center gap-2 mb-1">
                <Heart class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">设备健康指数</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">健康指数</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">影响因素</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">趋势</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">优先维护</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in healthIndex" :key="h.device + h.station"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ h.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ h.station }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-lg font-bold"
                                    :class="healthClass(h.health)">{{ h.health }}</span></td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ h.factors }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="h.trend === '下降' || h.trend === '持续下降' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'">{{
                                        h.trend }}</span></td>
                            <td class="text-center px-2 py-2.5"><span v-if="h.priority"
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-danger/10 text-danger font-medium">
                                    <AlertTriangle class="w-3 h-3 inline" /> 优先
                                </span><span v-else class="text-[10px] text-dim">-</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
