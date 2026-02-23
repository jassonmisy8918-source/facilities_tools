<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, BarChart3 } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('info')
const funcTabs = [
    { key: 'info', label: '来源信息' },
    { key: 'locate', label: '定位入侵点' },
    { key: 'stats', label: '入侵源统计' },
]

const sourceEvents = ref([
    { id: 1, time: '2024-03-15 02:30', pipe: 'P-CD-001', location: '圭塘街道万家丽路45.2m', type: '地下水入侵', flowAnomaly: '+85%', conductivity: '-38%', confidence: 92, status: '已确认' },
    { id: 2, time: '2024-03-14 22:15', pipe: 'P-CD-003', location: '圭塘街道万家丽路河段', type: '河水倒灌', flowAnomaly: '+40%', conductivity: '-45%', confidence: 88, status: '已确认' },
    { id: 3, time: '2024-03-13 14:00', pipe: 'P-TZ-002', location: '黎托街道浏阳河段120m', type: '雨水入渗', flowAnomaly: '+60%', conductivity: '-15%', confidence: 75, status: '待核实' },
])

const locatedPoints = ref([
    { id: 1, pipe: 'P-CD-001', position: '45.2m', gps: '28.150°N,113.050°E', type: '地下水', method: '流量平衡法', severity: '严重', events: 5, firstDetect: '2024-01-15' },
    { id: 2, pipe: 'P-CD-003', position: '河段接口', gps: '28.148°N,113.05°E', type: '河水', method: '水质比对法', severity: '中等', events: 3, firstDetect: '2024-02-20' },
    { id: 3, pipe: 'P-TZ-002', position: '120m接口', gps: '28.135°N,113.07°E', type: '雨水', method: '流量分析法', severity: '轻微', events: 2, firstDetect: '2024-03-01' },
])

const sourceStats = ref({
    byArea: [
        { area: '圭塘街道', events: 8, volume: 1250, pct: 45.5, mainType: '地下水' },
        { area: '黎托街道', events: 5, volume: 820, pct: 29.8, mainType: '雨水' },
        { area: '侯家塘街道', events: 2, volume: 350, pct: 12.7, mainType: '地下水' },
        { area: '左家塘街道', events: 2, volume: 330, pct: 12.0, mainType: '河水' },
    ],
    byType: [
        { type: '地下水入侵', count: 10, pct: 58.8, color: 'bg-primary' },
        { type: '雨水入渗', count: 4, pct: 23.5, color: 'bg-info' },
        { type: '河水倒灌', count: 3, pct: 17.6, color: 'bg-warning' },
    ],
})

const intrusionMarkers = computed(() => locatedPoints.value.map(p => {
    const parts = p.gps.replace(/°[NE]/g, '').split(',')
    return { lng: parseFloat(parts[1] ?? '0'), lat: parseFloat(parts[0] ?? '0'), title: p.pipe, label: `${p.pipe} · ${p.type} · ${p.severity}`, color: p.severity === '严重' ? 'red' : undefined }
}))

function severityClass(s: string) { return s === '严重' ? 'bg-danger/10 text-danger' : s === '中等' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'info'">
            <div class="flex items-center gap-2 mb-1">
                <MapPin class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">入侵来源信息</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">位置</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">流量偏差</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">电导率变化</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">置信度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in sourceEvents" :key="s.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ s.time }}</td>
                            <td class="px-2 py-2.5 text-primary font-mono font-bold">{{ s.pipe }}</td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ s.location }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ s.type
                                    }}</span></td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ s.flowAnomaly }}</td>
                            <td class="text-center px-2 py-2.5 text-info font-bold">{{ s.conductivity }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="s.confidence >= 85 ? 'text-success' : 'text-warning'">{{ s.confidence }}%</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="s.status === '已确认' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                        s.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'locate'">
            <div class="flex items-center gap-2 mb-1">
                <MapPin class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">入侵点定位</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-3 mb-3">
                <AMapView :markers="intrusionMarkers" height="260px" />
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">位置</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">定位方法</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">严重度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">累计事件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">首次检出</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in locatedPoints" :key="p.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ p.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.position }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.type }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ p.method }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="severityClass(p.severity)">{{ p.severity }}</span></td>
                            <td class="text-center px-2 py-2.5 text-warning font-bold">{{ p.events }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.firstDetect }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'stats'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">入侵源统计</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-3">按区域</span>
                    <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                        <table class="w-full text-xs">
                            <thead>
                                <tr class="border-b border-themed bg-surface/50">
                                    <th class="text-left px-3 py-2 text-dim font-medium">区域</th>
                                    <th class="text-center px-2 py-2 text-dim font-medium">事件数</th>
                                    <th class="text-center px-2 py-2 text-dim font-medium">入侵量(m³)</th>
                                    <th class="text-center px-2 py-2 text-dim font-medium">占比</th>
                                    <th class="text-center px-2 py-2 text-dim font-medium">主要类型</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="a in sourceStats.byArea" :key="a.area" class="border-b border-themed/30">
                                    <td class="px-3 py-2 text-default font-medium">{{ a.area }}</td>
                                    <td class="text-center px-2 py-2 text-danger font-bold">{{ a.events }}</td>
                                    <td class="text-center px-2 py-2 text-primary">{{ a.volume.toLocaleString() }}</td>
                                    <td class="text-center px-2 py-2 text-dim">{{ a.pct }}%</td>
                                    <td class="text-center px-2 py-2 text-default">{{ a.mainType }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-3">按入侵类型</span>
                    <div class="space-y-3">
                        <div v-for="t in sourceStats.byType" :key="t.type" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-20">{{ t.type }}</span>
                            <div class="flex-1 h-4 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full" :class="t.color" :style="{ width: t.pct + '%' }"></div>
                            </div><span class="text-[10px] text-default font-bold w-8 text-right">{{ t.count
                                }}</span><span class="text-[10px] text-dim w-10 text-right">{{ t.pct }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
