<script setup lang="ts">
import { ref } from 'vue'
import { Droplets, Clock, FileText, Bell, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('realtime')
const funcTabs = [
    { key: 'realtime', label: '实时监测' },
    { key: 'history', label: '历史查询' },
    { key: 'report', label: '趋势报告' },
    { key: 'alarm', label: '异常预警' },
]

const realtimeData = ref([
    { user: '朝阳工业园A厂', flow: 35.2, cod: 420, ss: 180, ph: 7.5, nh3n: 28, temp: 25.3, time: '10:30', status: '正常' },
    { user: '通州化工厂', flow: 68.5, cod: 750, ss: 320, ph: 6.2, nh3n: 45, temp: 28.1, time: '10:28', status: '预警' },
    { user: '丰台医院', flow: 12.8, cod: 200, ss: 85, ph: 7.1, nh3n: 15, temp: 22.5, time: '10:32', status: '正常' },
    { user: '海淀科技大厦', flow: 5.2, cod: 180, ss: 60, ph: 7.3, nh3n: 12, temp: 21.8, time: '10:25', status: '正常' },
])

const historyQuery = ref({ user: '朝阳工业园A厂', period: '近30天' })
const historyData = ref([
    { date: '2024-03-15', avgFlow: 33.5, avgCod: 415, maxCod: 480, avgPh: 7.5, compliance: '达标' },
    { date: '2024-03-14', avgFlow: 34.2, avgCod: 430, maxCod: 520, avgPh: 7.4, compliance: '超标1次' },
    { date: '2024-03-13', avgFlow: 32.8, avgCod: 408, maxCod: 465, avgPh: 7.6, compliance: '达标' },
    { date: '2024-03-12', avgFlow: 38.5, avgCod: 455, maxCod: 580, avgPh: 7.3, compliance: '超标2次' },
    { date: '2024-03-11', avgFlow: 33.0, avgCod: 410, maxCod: 470, avgPh: 7.5, compliance: '达标' },
])

const alarms = ref([
    { id: 1, user: '通州化工厂', time: '2024-03-15 10:28', indicator: 'COD', value: 750, limit: 800, threshold: '93.8%', level: '黄色', status: '已通知' },
    { id: 2, user: '通州化工厂', time: '2024-03-14 14:15', indicator: 'COD', value: 850, limit: 800, threshold: '超标6.3%', level: '红色', status: '已处理' },
    { id: 3, user: '朝阳工业园A厂', time: '2024-03-12 22:00', indicator: 'COD', value: 520, limit: 500, threshold: '超标4%', level: '红色', status: '已处理' },
    { id: 4, user: '通州化工厂', time: '2024-03-10 08:30', indicator: 'pH', value: 5.8, limit: 6, threshold: '低于下限', level: '橙色', status: '已处理' },
])
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

        <template v-if="activeFunc === 'realtime'">
            <div class="flex items-center gap-2 mb-1">
                <Droplets class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">实时监测数据</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">排水户</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">流量(m³/h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">COD</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">SS</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">pH</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">NH₃-N</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">温度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in realtimeData" :key="d.user"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium text-[10px]">{{ d.user }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ d.flow }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="d.cod > 500 ? 'text-danger' : 'text-default'">{{ d.cod }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.ss }}</td>
                            <td class="text-center px-2 py-2.5"
                                :class="d.ph < 6 || d.ph > 9 ? 'text-danger font-bold' : 'text-default'">{{ d.ph }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.nh3n }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.temp }}°C</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.time }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="d.status === '正常' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                    d.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'history'">
            <div class="flex items-center gap-2 mb-1">
                <Clock class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">历史数据查询 —— {{
                    historyQuery.user }}</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日均流量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日均COD</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">峰值COD</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日均pH</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">达标情况</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in historyData" :key="h.date"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default">{{ h.date }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ h.avgFlow }}m³/h</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.avgCod }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="h.maxCod > 500 ? 'text-danger' : 'text-default'">{{ h.maxCod }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.avgPh }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="h.compliance === '达标' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'">{{
                                    h.compliance }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'report'">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                    <FileText class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">水质水量变化趋势报告</span>
                </div><button @click="toast?.show('报告已导出', 'success')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">流量趋势(近5日)</span>
                    <div class="flex items-end gap-1 h-16">
                        <div v-for="h in historyData" :key="h.date" class="flex-1 rounded-t bg-primary/70"
                            :style="{ height: (h.avgFlow / 40 * 100) + '%' }"></div>
                    </div>
                    <div class="flex justify-between text-[10px] text-dim mt-1"><span v-for="h in historyData"
                            :key="h.date">{{ h.date.slice(5) }}</span></div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">COD趋势(近5日)</span>
                    <div class="flex items-end gap-1 h-16">
                        <div v-for="h in historyData" :key="h.date" class="flex-1 rounded-t"
                            :class="h.maxCod > 500 ? 'bg-danger/70' : 'bg-success/70'"
                            :style="{ height: (h.avgCod / 500 * 100) + '%' }"></div>
                    </div>
                    <div class="flex justify-between text-[10px] text-dim mt-1"><span v-for="h in historyData"
                            :key="h.date">{{ h.date.slice(5) }}</span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'alarm'">
            <div class="flex items-center gap-2 mb-1">
                <Bell class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">异常数据预警</span>
            </div>
            <div class="space-y-3">
                <div v-for="a in alarms" :key="a.id" class="bg-card border border-themed rounded-xl shadow-themed p-4"
                    :class="a.level === '红色' ? 'border-danger/30' : ''">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ a.user
                                }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="a.level === '红色' ? 'bg-danger/10 text-danger' : a.level === '橙色' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                a.level }}</span></div><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="a.status === '已处理' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                            a.status }}</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-[10px]">
                        <div><span class="text-dim">时间: </span><span class="text-default">{{ a.time }}</span></div>
                        <div><span class="text-dim">指标: </span><span class="text-danger font-bold">{{ a.indicator
                                }}</span></div>
                        <div><span class="text-dim">实测: </span><span class="text-danger font-bold">{{ a.value }}</span>
                            <span class="text-dim">/ 限值 {{ a.limit }}</span></div>
                        <div><span class="text-dim">偏离: </span><span class="text-warning font-bold">{{ a.threshold
                                }}</span></div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
