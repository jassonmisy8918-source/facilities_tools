<script setup lang="ts">
import { ref } from 'vue'
import { Activity, Gauge, Droplets, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-vue-next'

const activeFunc = ref('status')
const funcTabs = [
    { key: 'status', label: '运行状态' },
    { key: 'classify', label: '分类展示' },
    { key: 'history', label: '历史对比' },
    { key: 'water-level', label: '水位监测' },
    { key: 'flow', label: '流量信息' },
    { key: 'summary', label: '数据汇总' },
    { key: 'anomaly', label: '异常分析' },
]

// ── 泵站运行状态 ──
const stations = ref([
    { id: 1, name: '雨花泵站', status: '运行中', pumps: 4, running: 3, power: 120, inFlow: 850, outFlow: 830, frontLevel: 2.8, backLevel: 1.2 },
    { id: 2, name: '侯家塘泵站', status: '运行中', pumps: 3, running: 2, power: 85, inFlow: 620, outFlow: 610, frontLevel: 2.5, backLevel: 1.0 },
    { id: 3, name: '左家塘泵站', status: '待机', pumps: 3, running: 0, power: 5, inFlow: 0, outFlow: 0, frontLevel: 1.2, backLevel: 0.8 },
    { id: 4, name: '黎托泵站', status: '运行中', pumps: 5, running: 4, power: 180, inFlow: 1200, outFlow: 1180, frontLevel: 3.1, backLevel: 1.5 },
    { id: 5, name: '洞井泵站', status: '检修', pumps: 2, running: 0, power: 0, inFlow: 0, outFlow: 0, frontLevel: 0.8, backLevel: 0.5 },
])

function statusColor(s: string) { return s === '运行中' ? 'text-success' : s === '待机' ? 'text-warning' : 'text-danger' }
function statusBg(s: string) { return s === '运行中' ? 'bg-success/10' : s === '待机' ? 'bg-warning/10' : 'bg-danger/10' }

// ── 分类展示 ──
const classifyDimension = ref('type')
const classifyOptions = [
    { key: 'type', label: '按类型' },
    { key: 'area', label: '按区域' },
    { key: 'scale', label: '按规模' },
]
const classifyData = ref({
    type: [
        { group: '雨水泵站', count: 3, stations: ['雨花泵站', '黎托泵站', '洞井泵站'] },
        { group: '污水泵站', count: 2, stations: ['侯家塘泵站', '左家塘泵站'] },
    ],
    area: [
        { group: '城东', count: 2, stations: ['雨花泵站', '黎托泵站'] },
        { group: '城西', count: 2, stations: ['侯家塘泵站', '洞井泵站'] },
        { group: '城南', count: 1, stations: ['左家塘泵站'] },
    ],
    scale: [
        { group: '大型 (≥4台泵)', count: 2, stations: ['雨花泵站', '黎托泵站'] },
        { group: '中型 (2-3台泵)', count: 2, stations: ['侯家塘泵站', '左家塘泵站'] },
        { group: '小型 (<2台泵)', count: 1, stations: ['洞井泵站'] },
    ],
})

// ── 历史数据 ──
const historyPeriods = ref(['近7天', '近30天', '近3月'])
const selectedPeriod = ref('近7天')
const historyMetrics = ref([
    { metric: '进水流量(m³/h)', station: '雨花泵站', values: [820, 850, 830, 860, 840, 850, 870] },
    { metric: '出水流量(m³/h)', station: '雨花泵站', values: [810, 830, 820, 850, 830, 840, 860] },
    { metric: '前池水位(m)', station: '雨花泵站', values: [2.6, 2.8, 2.7, 2.9, 2.8, 2.8, 3.0] },
])

// ── 水位 ──
const waterLevelData = ref([
    { station: '雨花泵站', front: 2.8, frontWarn: 3.5, frontAlarm: 4.0, back: 1.2, backWarn: 2.0, backAlarm: 2.5, trend: '平稳' },
    { station: '侯家塘泵站', front: 2.5, frontWarn: 3.2, frontAlarm: 3.8, back: 1.0, backWarn: 1.8, backAlarm: 2.2, trend: '上升' },
    { station: '黎托泵站', front: 3.1, frontWarn: 3.5, frontAlarm: 4.0, back: 1.5, backWarn: 2.0, backAlarm: 2.5, trend: '上升' },
    { station: '左家塘泵站', front: 1.2, frontWarn: 3.0, frontAlarm: 3.5, back: 0.8, backWarn: 1.5, backAlarm: 2.0, trend: '平稳' },
    { station: '洞井泵站', front: 0.8, frontWarn: 2.8, frontAlarm: 3.2, back: 0.5, backWarn: 1.2, backAlarm: 1.8, trend: '下降' },
])

function levelStatus(val: number, warn: number) { return val >= warn ? 'text-danger' : val >= warn * 0.8 ? 'text-warning' : 'text-success' }

// ── 流量 ──
const flowData = ref([
    { station: '雨花泵站', inFlow: 850, outFlow: 830, diff: 20, diffPct: 2.4, status: '正常' },
    { station: '侯家塘泵站', inFlow: 620, outFlow: 610, diff: 10, diffPct: 1.6, status: '正常' },
    { station: '黎托泵站', inFlow: 1200, outFlow: 1180, diff: 20, diffPct: 1.7, status: '正常' },
    { station: '左家塘泵站', inFlow: 0, outFlow: 0, diff: 0, diffPct: 0, status: '停机' },
    { station: '洞井泵站', inFlow: 0, outFlow: 0, diff: 0, diffPct: 0, status: '检修' },
])

// ── 数据汇总 ──
const summaryData = ref({
    totalStations: 5, running: 3, standby: 1, maintenance: 1,
    totalInFlow: 2670, totalOutFlow: 2620,
    totalPower: 390, avgPower: 78,
    items: [
        { station: '雨花泵站', hours: 22, inFlow: 18700, outFlow: 18260, power: 2640, efficiency: 97.6 },
        { station: '侯家塘泵站', hours: 20, inFlow: 12400, outFlow: 12200, power: 1700, efficiency: 98.4 },
        { station: '黎托泵站', hours: 23, inFlow: 27600, outFlow: 27140, power: 4140, efficiency: 98.3 },
    ]
})

// ── 异常分析 ──
const anomalyAlerts = ref([
    { id: 1, station: '黎托泵站', type: '流量异常', level: '预警', desc: '进水流量突增15%', time: '2024-03-15 14:30', status: '已处理', threshold: '±10%' },
    { id: 2, station: '雨花泵站', type: '水位异常', level: '告警', desc: '前池水位接近预警线', time: '2024-03-15 16:20', status: '处理中', threshold: '3.5m' },
    { id: 3, station: '侯家塘泵站', type: '流量异常', level: '预警', desc: '出水流量波动剧烈', time: '2024-03-14 09:15', status: '已处理', threshold: '±10%' },
    { id: 4, station: '黎托泵站', type: '流量异常', level: '严重', desc: '进出水流量差异>5%', time: '2024-03-13 22:00', status: '待处理', threshold: '5%' },
])

function alertLevelClass(l: string) { return l === '严重' ? 'bg-danger/10 text-danger' : l === '告警' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
function alertStatusClass(s: string) { return s === '已处理' ? 'bg-success/10 text-success' : s === '处理中' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 运行状态 -->
        <template v-if="activeFunc === 'status'">
            <div class="grid grid-cols-5 gap-3">
                <div v-for="st in stations" :key="st.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-default">{{ st.name }}</span>
                        <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="statusBg(st.status) + ' ' + statusColor(st.status)">{{ st.status }}</span>
                    </div>
                    <div class="space-y-1.5 text-[10px]">
                        <div class="flex justify-between"><span class="text-dim">泵组</span><span
                                class="text-default font-medium">{{ st.running }}/{{ st.pumps }} 运行</span></div>
                        <div class="flex justify-between"><span class="text-dim">功率</span><span
                                class="text-primary font-bold">{{ st.power }}kW</span></div>
                        <div class="flex justify-between"><span class="text-dim">进水</span><span
                                class="text-info font-bold">{{ st.inFlow }}m³/h</span></div>
                        <div class="flex justify-between"><span class="text-dim">出水</span><span
                                class="text-success font-bold">{{ st.outFlow }}m³/h</span></div>
                        <div class="flex justify-between"><span class="text-dim">前池</span><span class="font-bold"
                                :class="levelStatus(st.frontLevel, 3.5)">{{ st.frontLevel }}m</span></div>
                        <div class="flex justify-between"><span class="text-dim">后池</span><span class="font-bold"
                                :class="levelStatus(st.backLevel, 2.0)">{{ st.backLevel }}m</span></div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 分类展示 -->
        <template v-if="activeFunc === 'classify'">
            <div class="flex gap-2 mb-2">
                <button v-for="o in classifyOptions" :key="o.key" @click="classifyDimension = o.key"
                    class="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer transition-colors"
                    :class="classifyDimension === o.key ? 'bg-primary text-white' : 'bg-surface text-dim hover:text-default'">{{
                        o.label }}</button>
            </div>
            <div class="space-y-3">
                <div v-for="g in (classifyData as any)[classifyDimension]" :key="g.group"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-default">{{ g.group }}</span>
                        <span class="text-[10px] text-primary font-bold">{{ g.count }} 座</span>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <span v-for="s in g.stations" :key="s"
                            class="text-[10px] px-2 py-1 rounded bg-surface text-default">{{ s }}</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- 历史对比 -->
        <template v-if="activeFunc === 'history'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <TrendingUp class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">历史数据曲线对比</span>
                </div>
                <div class="flex gap-1">
                    <button v-for="p in historyPeriods" :key="p" @click="selectedPeriod = p"
                        class="px-2 py-1 rounded text-[10px] cursor-pointer transition-colors"
                        :class="selectedPeriod === p ? 'bg-primary text-white' : 'bg-surface text-dim hover:text-default'">{{
                            p }}</button>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="h-36 bg-surface rounded-lg flex items-center justify-center text-xs text-dim">
                    <BarChart3 class="w-5 h-5 mr-2" />多指标趋势曲线（需接入 ECharts）
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2 text-dim font-medium">指标</th>
                            <th class="text-left px-2 py-2 text-dim font-medium">泵站</th>
                            <th v-for="(_, i) in historyMetrics[0]?.values" :key="i"
                                class="text-center px-2 py-2 text-dim font-medium">D{{ i + 1 }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in historyMetrics" :key="m.metric + m.station" class="border-b border-themed/30">
                            <td class="px-3 py-2 text-default font-medium">{{ m.metric }}</td>
                            <td class="px-2 py-2 text-dim">{{ m.station }}</td>
                            <td v-for="(v, i) in m.values" :key="i"
                                class="text-center px-2 py-2 text-primary font-bold">{{ v }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 水位监测 -->
        <template v-if="activeFunc === 'water-level'">
            <div class="flex items-center gap-2 mb-2">
                <Droplets class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">前池 /
                    后池水位监测</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">前池水位</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">预警值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">告警值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">后池水位</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">预警值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">告警值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">趋势</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="w in waterLevelData" :key="w.station"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ w.station }}</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="levelStatus(w.front, w.frontWarn)">{{
                                w.front }}m</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ w.frontWarn }}m</td>
                            <td class="text-center px-2 py-2.5 text-danger">{{ w.frontAlarm }}m</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="levelStatus(w.back, w.backWarn)">{{
                                w.back }}m</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ w.backWarn }}m</td>
                            <td class="text-center px-2 py-2.5 text-danger">{{ w.backAlarm }}m</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="w.trend === '上升' ? 'bg-warning/10 text-warning' : w.trend === '下降' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'">{{
                                        w.trend === '上升' ? '↑' : w.trend === '下降' ? '↓' : '→' }} {{ w.trend }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 流量信息 -->
        <template v-if="activeFunc === 'flow'">
            <div class="flex items-center gap-2 mb-2">
                <Gauge class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">进水 /
                    出水流量信息</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-3 py-2.5 text-dim font-medium">进水流量</th>
                            <th class="text-center px-3 py-2.5 text-dim font-medium">出水流量</th>
                            <th class="text-center px-3 py-2.5 text-dim font-medium">差值</th>
                            <th class="text-center px-3 py-2.5 text-dim font-medium">差值比</th>
                            <th class="text-center px-3 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="f in flowData" :key="f.station"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ f.station }}</td>
                            <td class="text-center px-3 py-2.5 text-info font-bold">{{ f.inFlow }}m³/h</td>
                            <td class="text-center px-3 py-2.5 text-success font-bold">{{ f.outFlow }}m³/h</td>
                            <td class="text-center px-3 py-2.5 text-warning">{{ f.diff }}m³/h</td>
                            <td class="text-center px-3 py-2.5"
                                :class="f.diffPct > 3 ? 'text-danger font-bold' : 'text-default'">{{ f.diffPct }}%</td>
                            <td class="text-center px-3 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="f.status === '正常' ? 'bg-success/10 text-success' : f.status === '停机' ? 'bg-surface text-dim' : 'bg-warning/10 text-warning'">{{
                                        f.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 数据汇总 -->
        <template v-if="activeFunc === 'summary'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ summaryData.totalStations }}</p>
                    <p class="text-[10px] text-dim">泵站总数</p>
                    <p class="text-[10px] mt-1"><span class="text-success">{{ summaryData.running }} 运行</span> · <span
                            class="text-warning">{{ summaryData.standby }} 待机</span> · <span class="text-danger">{{
                                summaryData.maintenance }} 检修</span></p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{ summaryData.totalInFlow }}<span
                            class="text-xs text-dim">m³/h</span></p>
                    <p class="text-[10px] text-dim">总进水流量</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{ summaryData.totalOutFlow }}<span
                            class="text-xs text-dim">m³/h</span></p>
                    <p class="text-[10px] text-dim">总出水流量</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{ summaryData.totalPower }}<span
                            class="text-xs text-dim">kW</span></p>
                    <p class="text-[10px] text-dim">总功率</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Activity class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">各泵站运行台账</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">运行时长</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">累计进水</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">累计出水</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">累计耗电</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">效率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in summaryData.items" :key="s.station"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ s.hours }}h</td>
                            <td class="text-center px-2 py-2.5 text-info font-bold">{{ s.inFlow.toLocaleString() }}m³
                            </td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ s.outFlow.toLocaleString()
                            }}m³</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ s.power.toLocaleString() }}kWh</td>
                            <td class="text-center px-2 py-2.5"><span class="font-bold"
                                    :class="s.efficiency >= 98 ? 'text-success' : 'text-primary'">{{ s.efficiency
                                    }}%</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 异常分析 -->
        <template v-if="activeFunc === 'anomaly'">
            <div class="flex items-center gap-2 mb-2">
                <AlertTriangle class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">异常流量分析与预警</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">描述</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">阈值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in anomalyAlerts" :key="a.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ a.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ a.type }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="alertLevelClass(a.level)">{{ a.level }}</span></td>
                            <td class="px-2 py-2.5 text-default">{{ a.desc }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ a.threshold }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ a.time }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="alertStatusClass(a.status)">{{ a.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
