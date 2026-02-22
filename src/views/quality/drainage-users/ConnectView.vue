<script setup lang="ts">
import { ref } from 'vue'
import { Link, GitBranch, BarChart3 } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('relation')
const funcTabs = [
    { key: 'relation', label: '接驳关系' },
    { key: 'topo', label: '拓扑查看' },
    { key: 'load', label: '负荷分析' },
]

const connections = ref([
    { user: '朝阳工业园A厂', pipe: 'P-CD-001', point: 'MH-12', diameter: 'DN300→DN600', flowDir: '东→西', coordinate: '116.468,39.932', method: '压力接驳', status: '正常' },
    { user: '海淀科技大厦', pipe: 'P-HD-003', point: 'MH-08', diameter: 'DN150→DN500', flowDir: '北→南', coordinate: '116.32,39.98', method: '重力接驳', status: '正常' },
    { user: '通州化工厂', pipe: 'P-TZ-002', point: 'MH-22', diameter: 'DN400→DN800', flowDir: '南→北', coordinate: '116.655,39.905', method: '压力接驳', status: '关注' },
    { user: '丰台医院', pipe: 'P-FT-005', point: 'MH-15', diameter: 'DN200→DN400', flowDir: '西→东', coordinate: '116.35,39.86', method: '重力接驳', status: '正常' },
])

const connectionMarkers = ref([
    { lng: 116.468, lat: 39.932, title: '朝阳工业园', label: '朝阳工业园 · 800m³/日' },
    { lng: 116.32, lat: 39.98, title: '海淀科技大厦', label: '科技大厦 · 120m³/日' },
    { lng: 116.655, lat: 39.905, title: '通州化工厂', label: '通州化工 · 1500m³/日', color: 'red' },
    { lng: 116.35, lat: 39.86, title: '丰台医院', label: '丰台医院 · 300m³/日' },
])

const loadImpact = ref([
    { user: '朝阳工业园A厂', volume: 800, pipeCap: 15000, contribution: 5.3, peakImpact: '高峰叠加', risk: '中' },
    { user: '通州化工厂', volume: 1500, pipeCap: 8000, contribution: 18.8, peakImpact: '显著增负', risk: '高' },
    { user: '丰台医院', volume: 300, pipeCap: 10000, contribution: 3.0, peakImpact: '影响较小', risk: '低' },
    { user: '海淀科技大厦', volume: 120, pipeCap: 12000, contribution: 1.0, peakImpact: '可忽略', risk: '低' },
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

        <template v-if="activeFunc === 'relation'">
            <div class="flex items-center gap-2 mb-1">
                <Link class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">接驳关系信息</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">排水户</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">接驳点</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管径</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">流向</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in connections" :key="c.user"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium text-[10px]">{{ c.user }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-mono font-bold text-[10px]">{{ c.pipe
                                }}</td>
                            <td class="text-center px-2 py-2.5 text-default text-[10px]">{{ c.point }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ c.diameter }}</td>
                            <td class="text-center px-2 py-2.5 text-default text-[10px]">{{ c.flowDir }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1 py-0.5 rounded bg-surface text-default">{{ c.method
                                    }}</span></td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="c.status === '正常' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                    c.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'topo'">
            <div class="flex items-center gap-2 mb-1">
                <GitBranch class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">接驳管网拓扑</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-3 mb-3">
                <AMapView :markers="connectionMarkers" height="300px" />
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <span class="text-xs font-bold text-default block mb-2">水流路径</span>
                <div class="space-y-2">
                    <div v-for="c in connections" :key="c.user" class="flex items-center gap-2 text-[10px]">
                        <span class="text-default font-medium w-28 truncate">{{ c.user }}</span>
                        <span class="text-dim">→</span><span class="text-primary font-mono">{{ c.point }}</span>
                        <span class="text-dim">→</span><span class="text-primary font-mono">{{ c.pipe }}</span>
                        <span class="text-dim">({{ c.flowDir }})</span>
                        <span class="text-dim">→</span><span class="text-success">污水厂</span>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'load'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">接驳点负荷影响分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">排水户</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">排水量(m³/日)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管段容量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">贡献率</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">高峰影响</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">风险</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="l in loadImpact" :key="l.user"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium text-[10px]">{{ l.user }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ l.volume }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ l.pipeCap.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center justify-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="l.contribution >= 15 ? 'bg-danger' : l.contribution >= 5 ? 'bg-warning' : 'bg-success'"
                                            :style="{ width: Math.min(l.contribution * 3, 100) + '%' }"></div>
                                    </div><span class="text-[10px] font-bold"
                                        :class="l.contribution >= 15 ? 'text-danger' : l.contribution >= 5 ? 'text-warning' : 'text-success'">{{
                                        l.contribution }}%</span>
                                </div>
                            </td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ l.peakImpact }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="l.risk === '高' ? 'bg-danger/10 text-danger' : l.risk === '中' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'">{{
                                    l.risk }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
