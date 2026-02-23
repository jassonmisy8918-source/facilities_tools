<script setup lang="ts">
import { ref } from 'vue'
import { Database, Calculator, Search, BarChart3 } from 'lucide-vue-next'

const activeFunc = ref('collect')
const funcTabs = [
    { key: 'collect', label: '数据汇聚' },
    { key: 'calc', label: '评估计算' },
    { key: 'result', label: '结果查询' },
    { key: 'board', label: '考核看板' },
]

const dataSource = ref([
    { source: '在线监测系统', type: '水质', items: 'COD/氨氮/TP/TN/pH', freq: '每2小时', count: 1520, lastSync: '2024-03-15 10:00', status: '正常' },
    { source: '流量计量系统', type: '水量', items: '进出水流量/回流量', freq: '每小时', count: 720, lastSync: '2024-03-15 10:00', status: '正常' },
    { source: '能耗监测系统', type: '能耗', items: '用电量/药剂量', freq: '每日', count: 30, lastSync: '2024-03-15 08:00', status: '正常' },
    { source: '设备管理系统', type: '运维', items: '设备状态/检修记录', freq: '每日', count: 15, lastSync: '2024-03-15 08:00', status: '正常' },
    { source: '污泥管理系统', type: '污泥', items: '产泥量/处置去向', freq: '每日', count: 30, lastSync: '2024-03-14 18:00', status: '延迟' },
])

const calcResults = ref([
    { indicator: '出水COD达标率', weight: 20, target: '≥95%', actual: '96.7%', score: 96.7, weightedScore: 19.34 },
    { indicator: '出水氨氮达标率', weight: 15, target: '≥95%', actual: '93.3%', score: 93.3, weightedScore: 14.0 },
    { indicator: '污水处理量完成率', weight: 15, target: '≥90%', actual: '98.5%', score: 98.5, weightedScore: 14.78 },
    { indicator: '污泥规范处置率', weight: 10, target: '100%', actual: '100%', score: 100, weightedScore: 10.0 },
    { indicator: '设备完好率', weight: 10, target: '≥95%', actual: '97.2%', score: 97.2, weightedScore: 9.72 },
    { indicator: '单位电耗', weight: 10, target: '≤0.30', actual: '0.28', score: 93.3, weightedScore: 9.33 },
    { indicator: '安全生产', weight: 10, target: '100分', actual: '100分', score: 100, weightedScore: 10.0 },
    { indicator: '信息化运行', weight: 10, target: '≥90%', actual: '95.0%', score: 95.0, weightedScore: 9.5 },
])

const totalScore = ref(96.67)

const queryResults = ref([
    { period: '2024年3月', plant: '雨花污水厂', score: 96.67, level: '优秀', payRate: '105%', amount: '325.5万', status: '已审核' },
    { period: '2024年2月', plant: '雨花污水厂', score: 88.5, level: '良好', payRate: '100%', amount: '310.0万', status: '已结算' },
    { period: '2024年1月', plant: '雨花污水厂', score: 75.2, level: '合格', payRate: '95%', amount: '294.5万', status: '已结算' },
    { period: '2024年3月', plant: '黎托街道污水厂', score: 82.5, level: '良好', payRate: '100%', amount: '280.0万', status: '已审核' },
    { period: '2024年3月', plant: '洞井污水厂', score: 91.3, level: '优秀', payRate: '105%', amount: '350.0万', status: '审核中' },
])

const boardData = ref({
    plants: [
        { name: '洞井污水厂', score: 91.3, rank: 1, trend: '↑' },
        { name: '雨花污水厂', score: 96.67, rank: 2, trend: '↑' },
        { name: '黎托街道污水厂', score: 82.5, rank: 3, trend: '→' },
        { name: '左家塘污水厂', score: 78.0, rank: 4, trend: '↓' },
    ],
})

function levelClass(l: string) { return l === '优秀' ? 'bg-success/10 text-success' : l === '良好' ? 'bg-primary/10 text-primary' : l === '合格' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'collect'">
            <div class="flex items-center gap-2 mb-1">
                <Database class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">评估数据汇聚</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">数据源</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类别</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">数据项</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">采集频率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">数据量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最近同步</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in dataSource" :key="d.source"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ d.source }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ d.type
                                    }}</span></td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ d.items }}</td>
                            <td class="text-center px-2 py-2.5 text-default text-[10px]">{{ d.freq }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ d.count }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ d.lastSync }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="d.status === '正常' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                        d.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'calc'">
            <div class="flex items-center gap-2 mb-1">
                <Calculator class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">绩效评估计算 ——
                    2024年3月</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">指标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">权重</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">目标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">实际值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">得分</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">加权分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in calcResults" :key="c.indicator"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ c.indicator }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.weight }}%</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.target }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ c.actual }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="c.score >= 95 ? 'text-success' : c.score >= 80 ? 'text-primary' : 'text-warning'">
                                {{ c.score }}</td>
                            <td class="text-center px-2 py-2.5 text-default font-bold">{{ c.weightedScore.toFixed(2) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                <p class="text-[10px] text-dim mb-1">综合得分</p>
                <p class="text-3xl font-bold text-success">{{ totalScore }}</p>
                <p class="text-xs text-success mt-1">优秀 · 付费率 105%</p>
            </div>
        </template>

        <template v-if="activeFunc === 'result'">
            <div class="flex items-center gap-2 mb-1">
                <Search class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">评估结果查询</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">考核期</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">污水厂</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">综合得分</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">付费率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">付费额</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in queryResults" :key="r.period + r.plant"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default">{{ r.period }}</td>
                            <td class="px-2 py-2.5 text-default font-medium">{{ r.plant }}</td>
                            <td class="text-center px-2 py-2.5 text-lg font-bold"
                                :class="r.score >= 90 ? 'text-success' : r.score >= 80 ? 'text-primary' : 'text-warning'">
                                {{ r.score }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="levelClass(r.level)">{{ r.level }}</span></td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ r.payRate }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.amount }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="r.status === '已结算' ? 'bg-success/10 text-success' : r.status === '已审核' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'">{{
                                        r.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'board'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">动态考核看板 ——
                    2024年3月</span>
            </div>
            <div class="grid grid-cols-4 gap-3 mb-3">
                <div v-for="p in boardData.plants" :key="p.name"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center"
                    :class="p.rank === 1 ? 'border-success/50' : ''">
                    <p class="text-[10px] text-dim mb-1">#{{ p.rank }}</p>
                    <p class="text-xs font-bold text-default mb-1">{{ p.name }}</p>
                    <p class="text-2xl font-bold"
                        :class="p.score >= 90 ? 'text-success' : p.score >= 80 ? 'text-primary' : 'text-warning'">{{
                            p.score }}</p>
                    <p class="text-[10px] mt-1"
                        :class="p.trend === '↑' ? 'text-success' : p.trend === '↓' ? 'text-danger' : 'text-dim'">{{
                            p.trend }} 趋势</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <span class="text-xs font-bold text-default block mb-2">排名对比</span>
                <div class="space-y-2">
                    <div v-for="p in boardData.plants" :key="p.name" class="flex items-center gap-2">
                        <span class="text-[10px] text-dim w-20 truncate">{{ p.name }}</span>
                        <div class="flex-1 h-4 bg-surface rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                :class="p.score >= 90 ? 'bg-success' : p.score >= 80 ? 'bg-primary' : 'bg-warning'"
                                :style="{ width: p.score + '%' }"></div>
                        </div>
                        <span class="text-xs font-bold w-12 text-right"
                            :class="p.score >= 90 ? 'text-success' : p.score >= 80 ? 'text-primary' : 'text-warning'">{{
                                p.score }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
