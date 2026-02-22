<script setup lang="ts">
import { ref } from 'vue'
import { Radio, Bell, TrendingUp } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('monitor')
const funcTabs = [
    { key: 'monitor', label: '数据监控' },
    { key: 'alarm', label: '入侵报警' },
    { key: 'anomaly', label: '异常识别' },
]

const monitorData = ref([
    { station: '朝阳路-流量站', type: '流量', value: 125.8, unit: 'm³/h', baseline: 80, deviation: '+57.3%', status: '异常', time: '10:25' },
    { station: '建设大道-水质站', type: '电导率', value: 420, unit: 'μS/cm', baseline: 680, deviation: '-38.2%', status: '异常', time: '10:20' },
    { station: '西城区-流量站', type: '流量', value: 68.5, unit: 'm³/h', baseline: 65, deviation: '+5.4%', status: '正常', time: '10:30' },
    { station: '通州运河-流量站', type: '流量', value: 210.3, unit: 'm³/h', baseline: 150, deviation: '+40.2%', status: '预警', time: '10:15' },
    { station: '丰台南路-水位站', type: '水位', value: 1.85, unit: 'm', baseline: 1.2, deviation: '+54.2%', status: '异常', time: '10:22' },
])

const alarmRules = ref([
    { id: 1, name: '旱天高流量', condition: '旱天流量 > 基线×1.3', type: '流量异常', level: '二级', enabled: true },
    { id: 2, name: '水质突变', condition: '电导率突降 > 30%', type: '水质异常', level: '一级', enabled: true },
    { id: 3, name: '夜间异常流量', condition: '0-6时流量 > 基线×1.5', type: '流量异常', level: '二级', enabled: true },
    { id: 4, name: '水位骤升', condition: '水位10min增幅 > 0.3m', type: '水位异常', level: '一级', enabled: true },
    { id: 5, name: '雨后滞后高峰', condition: '降雨停止2h后流量仍超基线1.2×', type: '入侵特征', level: '三级', enabled: false },
])

const anomalies = ref([
    { id: 1, time: '2024-03-15 02:30', station: '朝阳路-流量站', type: '旱天高流量', duration: '4.5h', peakDeviation: '+85%', confidence: 92, suspectedSource: '地下水入侵', status: '已确认' },
    { id: 2, time: '2024-03-14 22:15', station: '建设大道-水质站', type: '电导率突降', duration: '2h', peakDeviation: '-45%', confidence: 88, suspectedSource: '河水倒灌', status: '已确认' },
    { id: 3, time: '2024-03-13 14:00', station: '通州运河-流量站', type: '雨后滞后峰', duration: '6h', peakDeviation: '+60%', confidence: 75, suspectedSource: '雨水入渗', status: '待核实' },
])

function statusClass(s: string) { return s === '异常' ? 'bg-danger/10 text-danger' : s === '预警' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success' }
</script>

<template>
    <div class="space-y-4">
        <ToastNotify ref="toast" />
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'monitor'">
            <div class="flex items-center gap-2 mb-1">
                <Radio class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">实时数据监控</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">监测站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">当前值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">基线值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">偏差</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in monitorData" :key="d.station"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ d.station }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.type }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ d.value }}<span
                                    class="text-[10px] text-dim">{{ d.unit }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.baseline }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="d.status === '异常' ? 'text-danger' : d.status === '预警' ? 'text-warning' : 'text-success'">
                                {{ d.deviation }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="statusClass(d.status)">{{ d.status }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.time }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'alarm'">
            <div class="flex items-center gap-2 mb-1">
                <Bell class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">入侵报警规则</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">规则名称</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">判定条件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">级别</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">启用</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in alarmRules" :key="r.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.name }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px] font-mono">{{ r.condition }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ r.type
                                    }}</span></td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="r.level === '一级' ? 'bg-danger/10 text-danger' : r.level === '二级' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                    r.level }}</span></td>
                            <td class="text-center px-2 py-2.5"><button
                                    @click="r.enabled = !r.enabled; toast?.show(r.enabled ? '已启用' : '已禁用', 'info')"
                                    class="w-8 h-4 rounded-full transition-colors cursor-pointer"
                                    :class="r.enabled ? 'bg-success' : 'bg-surface'">
                                    <div class="w-3 h-3 rounded-full bg-white shadow transition-transform"
                                        :class="r.enabled ? 'translate-x-4.5' : 'translate-x-0.5'"></div>
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'anomaly'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingUp class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">异常波动识别</span>
            </div>
            <div class="space-y-3">
                <div v-for="a in anomalies" :key="a.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ a.station
                                }}</span><span class="text-[10px] px-1.5 py-0.5 rounded bg-danger/10 text-danger">{{
                                a.type }}</span></div><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="a.status === '已确认' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                            a.status }}</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-[10px]">
                        <div><span class="text-dim">时间: </span><span class="text-default">{{ a.time }}</span></div>
                        <div><span class="text-dim">持续: </span><span class="text-primary font-bold">{{ a.duration
                                }}</span></div>
                        <div><span class="text-dim">峰值偏差: </span><span class="text-danger font-bold">{{ a.peakDeviation
                                }}</span></div>
                        <div><span class="text-dim">置信度: </span><span class="font-bold"
                                :class="a.confidence >= 85 ? 'text-success' : 'text-warning'">{{ a.confidence }}%</span>
                        </div>
                    </div>
                    <p class="text-[10px] text-info mt-1">🔍 疑似: {{ a.suspectedSource }}</p>
                </div>
            </div>
        </template>
    </div>
</template>
