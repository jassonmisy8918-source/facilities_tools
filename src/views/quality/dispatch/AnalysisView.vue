<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, Settings, FileText, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('visual')
const funcTabs = [
    { key: 'visual', label: '数据可视化' },
    { key: 'model', label: '模型优化' },
    { key: 'report', label: '评估报告' },
]

const visualMetrics = ref([
    { metric: '管网总流量', value: '32,000', unit: 'm³/h', trend: '+5.2%', period: '今日均值' },
    { metric: '平均负荷率', value: '68.5', unit: '%', trend: '-2.1%', period: '当前' },
    { metric: '溢流事件', value: '0', unit: '次', trend: '0', period: '本月' },
    { metric: '调度响应', value: '2.5', unit: 'min', trend: '-15%', period: '平均' },
    { metric: '能源效率', value: '0.28', unit: 'kWh/m³', trend: '-3.4%', period: '今日' },
])

const modelParams = ref([
    { param: '曼宁系数(n)', current: 0.013, calibrated: 0.014, deviation: '+7.7%', confidence: 92, lastCal: '2024-03-10' },
    { param: '入渗率', current: '8%', calibrated: '10.5%', deviation: '+31%', confidence: 85, lastCal: '2024-03-05' },
    { param: '调蓄系数', current: 0.85, calibrated: 0.82, deviation: '-3.5%', confidence: 90, lastCal: '2024-03-10' },
    { param: '泵效率修正', current: 0.78, calibrated: 0.75, deviation: '-3.8%', confidence: 88, lastCal: '2024-03-08' },
])

const modelHistory = ref([
    { version: 'M-V3.5', date: '2024-03-10', accuracy: 94.2, improvement: '+1.5%', samples: 1250 },
    { version: 'M-V3.4', date: '2024-02-28', accuracy: 92.7, improvement: '+2.3%', samples: 1100 },
    { version: 'M-V3.3', date: '2024-02-15', accuracy: 90.4, improvement: '+1.8%', samples: 980 },
])

const reports = ref([
    { id: 1, period: '2024年3月上旬', loadBalance: 72.5, overflow: 0, energyEff: 0.28, responseTime: '2.5min', satisfaction: '良好', score: 88 },
    { id: 2, period: '2024年2月', loadBalance: 68.2, overflow: 1, energyEff: 0.31, responseTime: '3.2min', satisfaction: '一般', score: 75 },
    { id: 3, period: '2024年1月', loadBalance: 70.5, overflow: 0, energyEff: 0.29, responseTime: '2.8min', satisfaction: '良好', score: 82 },
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

        <template v-if="activeFunc === 'visual'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">调度数据可视化</span>
            </div>
            <div class="grid grid-cols-5 gap-3">
                <div v-for="m in visualMetrics" :key="m.metric"
                    class="bg-card border border-themed rounded-xl shadow-themed p-3 text-center">
                    <p class="text-[10px] text-dim mb-1">{{ m.metric }}</p>
                    <p class="text-xl font-bold text-primary">{{ m.value }}<span class="text-[10px] text-dim">{{ m.unit
                            }}</span></p>
                    <p class="text-[10px] mt-1"
                        :class="m.trend.startsWith('-') ? 'text-success' : m.trend === '0' ? 'text-dim' : 'text-warning'">
                        {{ m.trend }} <span class="text-dim">{{ m.period }}</span></p>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'model'">
            <div class="flex items-center gap-2 mb-1">
                <Settings class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">分析模型优化</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">参数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">当前值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">校准值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">偏差</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">置信度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">校准日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in modelParams" :key="p.param"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.param }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.current }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ p.calibrated }}</td>
                            <td class="text-center px-2 py-2.5 text-warning font-bold">{{ p.deviation }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="p.confidence >= 90 ? 'text-success' : 'text-warning'">{{ p.confidence }}%</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.lastCal }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span class="text-xs font-bold text-default block mb-2">模型版本历史</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">版本</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">准确率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">提升</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">样本数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in modelHistory" :key="h.version"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-primary font-bold">{{ h.version }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ h.date }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ h.accuracy }}%</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ h.improvement }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.samples }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'report'">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                    <FileText class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">调度评估报告</span>
                </div><button @click="toast?.show('报告已导出', 'success')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">时段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负荷均衡(%)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">溢流</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">能效</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">响应</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">评价</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">综合分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in reports" :key="r.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.period }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="r.loadBalance >= 70 ? 'text-success' : 'text-warning'">{{ r.loadBalance }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="r.overflow === 0 ? 'text-success' : 'text-danger'">{{ r.overflow }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.energyEff }}kWh/m³</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.responseTime }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="r.satisfaction === '良好' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                    r.satisfaction }}</span></td>
                            <td class="text-center px-2 py-2.5 text-lg font-bold text-primary">{{ r.score }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
