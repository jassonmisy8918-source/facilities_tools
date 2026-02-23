<script setup lang="ts">
import { ref } from 'vue'
import { GitMerge, Waves, Droplets, Settings, MapPin } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('ledger')
const funcTabs = [
    { key: 'ledger', label: '混接台账' },
    { key: 'flow', label: '水流/水质分析' },
    { key: 'algorithm', label: '算法配置' },
    { key: 'locate', label: '区域识别与定位' },
]

const ledger = ref([
    { id: 1, location: '圭塘街道劳动路MH-12~MH-15', type: '污水接入雨水管', degree: '严重', diameter: 'DN300→DN400', length: '45m', source: '居民小区排污', status: '已确认', detectDate: '2024-02-15' },
    { id: 2, location: '洞井街道浏阳河路MH-08~MH-10', type: '雨水接入污水管', degree: '中等', diameter: 'DN200→DN500', length: '30m', source: '屋面雨水', status: '已确认', detectDate: '2024-03-01' },
    { id: 3, location: '黎托街道浏阳河段MH-22~MH-25', type: '双向混接', degree: '严重', diameter: 'DN400', length: '80m', source: '市政管网交叉', status: '处理中', detectDate: '2024-01-20' },
    { id: 4, location: '侯家塘街道东塘路MH-05', type: '污水接入雨水管', degree: '轻微', diameter: 'DN150→DN300', length: '12m', source: '商铺排污', status: '待核实', detectDate: '2024-03-10' },
])

const flowData = ref([
    { station: '劳动路-雨水管', dryFlow: 15.2, wetFlow: 85.6, ratio: 5.6, anomaly: '旱天流量偏高', status: '混接特征' },
    { station: '浏阳河路-污水管', dryFlow: 68.5, wetFlow: 210.3, ratio: 3.1, anomaly: '雨天流量骤增', status: '混接特征' },
    { station: '浏阳河段-雨水管', dryFlow: 22.0, wetFlow: 120.0, ratio: 5.5, anomaly: '旱天+雨天均异常', status: '双向混接' },
    { station: '东塘路-雨水管', dryFlow: 5.8, wetFlow: 35.0, ratio: 6.0, anomaly: '旱天轻微偏高', status: '疑似' },
])

const waterQuality = ref([
    { station: '劳动路-雨水管', cod: 185, ss: 120, nh3n: 25, ph: 7.2, baseline_cod: 30, verdict: '明显污染' },
    { station: '浏阳河路-污水管', cod: 95, ss: 45, nh3n: 8, ph: 6.8, baseline_cod: 250, verdict: '浓度偏低' },
])

const algorithms = ref([
    { id: 1, name: '旱天流量异常', logic: '旱天流量 > 基线×2.0', weight: 30, enabled: true },
    { id: 2, name: '雨天流量骤增', logic: '雨天污水管流量增幅 > 150%', weight: 25, enabled: true },
    { id: 3, name: '水质指标异常', logic: '雨水管COD > 80mg/L', weight: 25, enabled: true },
    { id: 4, name: '流量相关性', logic: '雨水管流量与降雨相关系数 < 0.3', weight: 20, enabled: false },
])

const identifiedAreas = ref([
    { area: '圭塘街道劳动路段', pipes: 3, points: 2, degree: '严重', mixVolume: '约450m³/日', confidence: 92 },
    { area: '洞井街道浏阳河路段', pipes: 2, points: 1, degree: '中等', mixVolume: '约180m³/日', confidence: 85 },
    { area: '黎托街道浏阳河段', pipes: 4, points: 3, degree: '严重', mixVolume: '约620m³/日', confidence: 88 },
    { area: '侯家塘街道东塘路段', pipes: 1, points: 1, degree: '轻微', mixVolume: '约35m³/日', confidence: 68 },
])

const crossMarkers = [
    { lng: 113.050, lat: 28.150, title: '圭塘街道劳动路段', label: '劳动路 · 严重 · 450m³/日' },
    { lng: 113.02, lat: 28.17, title: '洞井街道浏阳河路段', label: '浏阳河路 · 中等 · 180m³/日' },
    { lng: 113.07, lat: 28.135, title: '黎托街道浏阳河段', label: '浏阳河段 · 严重 · 620m³/日', color: 'red' },
    { lng: 113.04, lat: 28.133, title: '侯家塘街道东塘路段', label: '东塘 · 轻微 · 35m³/日' },
]

function degreeClass(d: string) { return d === '严重' ? 'bg-danger/10 text-danger' : d === '中等' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'ledger'">
            <div class="flex items-center gap-2 mb-1">
                <GitMerge class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">雨污混接台账</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">位置</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">程度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管径</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">长度</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">来源</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">检出日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="l in ledger" :key="l.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default text-[10px]">{{ l.location }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1 py-0.5 rounded bg-surface text-default">{{ l.type }}</span>
                            </td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="degreeClass(l.degree)">{{ l.degree }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ l.diameter }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ l.length }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ l.source }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="l.status === '已确认' ? 'bg-success/10 text-success' : l.status === '处理中' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'">{{
                                        l.status }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ l.detectDate }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'flow'">
            <div class="flex items-center gap-2 mb-1">
                <Waves class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">水流动态分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">监测站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">旱天流量(m³/h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">雨天流量(m³/h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">倍率</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">异常特征</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">判定</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="f in flowData" :key="f.station"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ f.station }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ f.dryFlow }}</td>
                            <td class="text-center px-2 py-2.5 text-info font-bold">{{ f.wetFlow }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="f.ratio >= 5 ? 'text-danger' : 'text-warning'">{{ f.ratio }}x</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ f.anomaly }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="f.status === '双向混接' ? 'bg-danger/10 text-danger' : f.status === '混接特征' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                        f.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex items-center gap-2 mb-1">
                <Droplets class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">水质变化分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">监测站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">COD(mg/L)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">SS(mg/L)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">NH₃-N(mg/L)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">pH</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">基线COD</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">判定</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="q in waterQuality" :key="q.station"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ q.station }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="q.cod > q.baseline_cod ? 'text-danger' : 'text-warning'">{{ q.cod }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ q.ss }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ q.nh3n }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ q.ph }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ q.baseline_cod }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-danger/10 text-danger">{{
                                        q.verdict }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'algorithm'">
            <div class="flex items-center gap-2 mb-1">
                <Settings class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">混接识别算法配置</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">算法名称</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">判定逻辑</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">权重(%)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">启用</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in algorithms" :key="a.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ a.name }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px] font-mono">{{ a.logic }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ a.weight }}</td>
                            <td class="text-center px-2 py-2.5"><button @click="a.enabled = !a.enabled"
                                    class="w-8 h-4 rounded-full transition-colors cursor-pointer"
                                    :class="a.enabled ? 'bg-success' : 'bg-surface'">
                                    <div class="w-3 h-3 rounded-full bg-white shadow transition-transform"
                                        :class="a.enabled ? 'translate-x-4.5' : 'translate-x-0.5'"></div>
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'locate'">
            <div class="flex items-center gap-2 mb-1">
                <MapPin class="w-4 h-4 text-danger" /><span
                    class="text-sm font-semibold text-default">混接区域识别与点位定位</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-3 mb-3">
                <AMapView :markers="crossMarkers" height="260px" />
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管段数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">混接点</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">程度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">混接量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">置信度</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in identifiedAreas" :key="a.area"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ a.area }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ a.pipes }}</td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ a.points }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="degreeClass(a.degree)">{{ a.degree }}</span></td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ a.mixVolume }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="a.confidence >= 85 ? 'text-success' : 'text-warning'">{{ a.confidence }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
