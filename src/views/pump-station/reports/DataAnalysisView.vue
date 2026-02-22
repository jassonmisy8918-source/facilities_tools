<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, TrendingUp, MapPin, Lightbulb } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('fault-type')
const funcTabs = [
    { key: 'fault-type', label: '故障类型' },
    { key: 'fault-freq', label: '故障频率' },
    { key: 'mttr', label: '修复时间' },
    { key: 'hotspot', label: '故障热点' },
    { key: 'predict', label: '能耗预测' },
    { key: 'optimize', label: '节能建议' },
]

const faultTypes = ref([
    { type: '机械故障', count: 12, pct: 35.3, sub: ['轴承损坏(5)', '密封失效(4)', '叶轮磨损(3)'] },
    { type: '电气故障', count: 8, pct: 23.5, sub: ['接触器故障(3)', '电机过热(3)', '绝缘降低(2)'] },
    { type: '仪表故障', count: 6, pct: 17.6, sub: ['信号丢失(3)', '精度偏差(2)', '传感器损坏(1)'] },
    { type: '管道阀门', count: 5, pct: 14.7, sub: ['密封渗漏(3)', '阀门卡顿(2)'] },
    { type: '辅助设备', count: 3, pct: 8.8, sub: ['格栅过载(2)', '风机异响(1)'] },
])

const faultFreq = ref([
    { device: '1号水泵(朝阳)', faults: 3, freq: '1.5次/年', mtbf: '2920h', level: '一般' },
    { device: '格栅机(丰台)', faults: 4, freq: '2.0次/年', mtbf: '2190h', level: '关注' },
    { device: '主电机(西城)', faults: 2, freq: '1.0次/年', mtbf: '4380h', level: '良好' },
    { device: '配电柜B(通州)', faults: 3, freq: '1.5次/年', mtbf: '2920h', level: '一般' },
])

const mttrData = ref([
    { type: '机械故障', avgMttr: '4.2h', minMttr: '2h', maxMttr: '8h', target: '4h', status: '超标' },
    { type: '电气故障', avgMttr: '2.8h', minMttr: '1h', maxMttr: '6h', target: '3h', status: '达标' },
    { type: '仪表故障', avgMttr: '1.5h', minMttr: '0.5h', maxMttr: '3h', target: '2h', status: '达标' },
    { type: '管道阀门', avgMttr: '3.5h', minMttr: '1h', maxMttr: '5h', target: '3h', status: '超标' },
])

const energyPredict = ref([
    { month: '2024-04', predict: 76000, confidence: 85, trend: '持平' },
    { month: '2024-05', predict: 82000, confidence: 80, trend: '上升' },
    { month: '2024-06', predict: 88000, confidence: 78, trend: '上升' },
    { month: '2024-Q3', predict: 265000, confidence: 75, trend: '上升' },
    { month: '2025', predict: 890000, confidence: 70, trend: '上升' },
])

const optimizeSuggestions = ref([
    { id: 1, area: '运行策略', suggestion: '通州泵站采用变频调速，减少空转', saving: '12%', priority: '高' },
    { id: 2, area: '设备升级', suggestion: '海淀泵站更换高效节能泵组', saving: '18%', priority: '高' },
    { id: 3, area: '管理优化', suggestion: '丰台格栅机改用变频控制', saving: '25%', priority: '中' },
    { id: 4, area: '调度优化', suggestion: '非高峰期降低运行台数', saving: '8%', priority: '中' },
])

function levelClass(l: string) { return l === '良好' ? 'bg-success/10 text-success' : l === '关注' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning' }

const faultMarkers = [
    { lng: 116.468, lat: 39.932, title: '朝阳泵站', label: '朝阳 · 机械故障3次' },
    { lng: 116.32, lat: 39.98, title: '海淀泵站', label: '海淀 · 电机故障2次' },
    { lng: 116.655, lat: 39.905, title: '通州泵站', label: '通州 · 配电故障3次', color: 'red' },
    { lng: 116.35, lat: 39.86, title: '丰台泵站', label: '丰台 · 格栅故障4次', color: 'red' },
]
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'fault-type'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">故障类型统计</span>
            </div>
            <div class="space-y-3">
                <div v-for="f in faultTypes" :key="f.type"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        f.type }}</span>
                        <div class="flex items-center gap-2"><span class="text-primary font-bold text-xs">{{ f.count
                        }}次</span><span class="text-[10px] text-dim">{{ f.pct }}%</span></div>
                    </div>
                    <div class="w-full h-2 bg-surface rounded-full mb-2">
                        <div class="h-full bg-primary rounded-full" :style="{ width: f.pct + '%' }"></div>
                    </div>
                    <div class="flex flex-wrap gap-1"><span v-for="s in f.sub" :key="s"
                            class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ s }}</span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'fault-freq'">
            <span class="text-sm font-semibold text-default block">故障发生频率 (MTBF)</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">故障数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">频率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">MTBF</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">评级</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="f in faultFreq" :key="f.device"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ f.device }}</td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ f.faults }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ f.freq }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ f.mtbf }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="levelClass(f.level)">{{ f.level }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'mttr'">
            <span class="text-sm font-semibold text-default block">平均修复时间 (MTTR)</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">故障类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">平均</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最短</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最长</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">目标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">达标</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in mttrData" :key="m.type" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ m.type }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ m.avgMttr }}</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ m.minMttr }}</td>
                            <td class="text-center px-2 py-2.5 text-danger">{{ m.maxMttr }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ m.target }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="m.status === '达标' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">{{
                                        m.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'hotspot'">
            <div class="flex items-center gap-2 mb-1">
                <MapPin class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">故障热点分布</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
                <AMapView :markers="faultMarkers" height="300px" />
            </div>
        </template>

        <template v-if="activeFunc === 'predict'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingUp class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">能耗预测</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">时段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">预测(kWh)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">置信度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">趋势</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in energyPredict" :key="e.month"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default font-medium">{{ e.month }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ e.predict.toLocaleString() }}
                            </td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="e.confidence >= 80 ? 'text-success' : 'text-warning'">{{ e.confidence }}%</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="e.trend === '上升' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'">{{
                                        e.trend }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'optimize'">
            <div class="flex items-center gap-2 mb-1">
                <Lightbulb class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">节能优化建议</span>
            </div>
            <div class="space-y-3">
                <div v-for="o in optimizeSuggestions" :key="o.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-default">{{
                        o.area }}</span>
                        <div class="flex items-center gap-2"><span class="text-[10px] text-success font-bold">节能 {{
                            o.saving }}</span><span class="text-[10px] px-1.5 py-0.5 rounded"
                                :class="o.priority === '高' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">{{
                                    o.priority }}</span></div>
                    </div>
                    <p class="text-[10px] text-default">💡 {{ o.suggestion }}</p>
                </div>
            </div>
        </template>
    </div>
</template>
