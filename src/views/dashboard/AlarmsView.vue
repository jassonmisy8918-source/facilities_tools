<script setup lang="ts">
import { ref } from 'vue'
import { Bell, BarChart3 } from 'lucide-vue-next'

const activeFunc = ref('alerts')
const funcTabs = [{ key: 'alerts', label: '预警信息' }, { key: 'stats', label: '信息统计' }]

const alerts = ref([
    { type: '雨量', level: '红色', station: '雨花雨量站', value: '52mm/h', threshold: '50mm/h', time: '10:15', status: '未处理' },
    { type: '水位', level: '橙色', station: '黎托街道运河节点', value: '3.2m', threshold: '3.0m', time: '10:28', status: '已通知' },
    { type: '流量', level: '黄色', station: '分支管C', value: '7200m³/h', threshold: '7000m³/h', time: '09:45', status: '处理中' },
    { type: '水质', level: '红色', station: '黎托化工厂排口', value: 'COD:750', threshold: 'COD:500', time: '10:30', status: '已通知' },
    { type: '污水厂', level: '黄色', station: '黎托街道厂', value: '进水超设计', threshold: '设计负荷', time: '08:00', status: '处理中' },
    { type: '泵站', level: '橙色', station: '劳动路泵站', value: '3号泵故障', threshold: '-', time: '07:30', status: '维修中' },
])

const alarmStats = ref([
    { type: '雨量告警', total: 28, red: 5, orange: 10, yellow: 13 },
    { type: '水位告警', total: 35, red: 8, orange: 12, yellow: 15 },
    { type: '流量告警', total: 22, red: 3, orange: 8, yellow: 11 },
    { type: '水质告警', total: 18, red: 6, orange: 7, yellow: 5 },
    { type: '污水厂告警', total: 12, red: 2, orange: 4, yellow: 6 },
    { type: '泵站告警', total: 15, red: 3, orange: 5, yellow: 7 },
])

function levelClass(l: string) { return l === '红色' ? 'bg-danger/10 text-danger' : l === '橙色' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>
        <template v-if="activeFunc === 'alerts'">
            <div class="flex items-center gap-2 mb-1">
                <Bell class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">最新预警信息</span>
            </div>
            <div class="space-y-2">
                <div v-for="(a, i) in alerts" :key="i" class="bg-card border border-themed rounded-xl shadow-themed p-3"
                    :class="a.level === '红色' ? 'border-danger/30' : ''">
                    <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center gap-2"><span
                                class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ a.type
                                }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="levelClass(a.level)">{{ a.level }}</span><span
                                class="text-xs font-bold text-default">{{ a.station }}</span></div>
                        <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="a.status === '未处理' ? 'bg-danger/10 text-danger' : a.status === '处理中' || a.status === '维修中' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'">{{
                                a.status }}</span>
                    </div>
                    <div class="flex gap-4 text-[10px]"><span class="text-dim">实测: <span
                                class="text-danger font-bold">{{ a.value }}</span></span><span class="text-dim">阈值: {{
                                    a.threshold }}</span><span class="text-dim">时间: {{ a.time }}</span></div>
                </div>
            </div>
        </template>
        <template v-if="activeFunc === 'stats'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">告警信息统计</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div v-for="s in alarmStats" :key="s.type"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        s.type }}</span><span class="text-lg font-bold text-primary">{{ s.total }}</span></div>
                    <div class="flex gap-2 text-[10px]"><span class="px-1.5 py-0.5 rounded bg-danger/10 text-danger">红
                            {{ s.red }}</span><span class="px-1.5 py-0.5 rounded bg-warning/10 text-warning">橙 {{
                                s.orange }}</span><span class="px-1.5 py-0.5 rounded bg-info/10 text-info">黄 {{ s.yellow
                            }}</span></div>
                </div>
            </div>
        </template>
    </div>
</template>
