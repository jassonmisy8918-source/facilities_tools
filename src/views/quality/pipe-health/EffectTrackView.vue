<script setup lang="ts">
import { ref } from 'vue'
import { Target, TrendingUp, RefreshCw, BarChart3, FileText } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('track')
const funcTabs = [
    { key: 'track', label: '效果跟踪' },
    { key: 'improve', label: '改善分析' },
    { key: 'review', label: '周期复查' },
    { key: 'metrics', label: '评估指标' },
]

const trackItems = ref([
    { pipe: 'P-HD-003', scheme: '紫外光固化', repairDate: '2024-03-10', healthBefore: 58, healthAfter: 82, healthNow: 80, defectBefore: '树根侵入20%', defectAfter: '已修复', status: '良好' },
    { pipe: 'P-CD-001', scheme: '管道清淤', repairDate: '2024-02-28', healthBefore: 71.5, healthAfter: 85, healthNow: 83, defectBefore: '沉积物30%', defectAfter: '已清淤', status: '良好' },
])

const improvements = ref([
    { pipe: 'P-HD-003', metric: '健康度', before: 58, after: 82, change: '+24', improvement: '41.4%' },
    { pipe: 'P-HD-003', metric: '缺陷等级', before: 3, after: 0, change: '-3', improvement: '100%消除' },
    { pipe: 'P-CD-001', metric: '健康度', before: 71.5, after: 85, change: '+13.5', improvement: '18.9%' },
    { pipe: 'P-CD-001', metric: '过流能力', before: 70, after: 95, change: '+25', improvement: '35.7%' },
])

const reviews = ref([
    { pipe: 'P-HD-003', reviewNo: 1, date: '2024-04-10', method: 'CCTV', result: '修复层完好，无渗漏', health: 80, nextReview: '2024-07-10' },
    { pipe: 'P-CD-001', reviewNo: 1, date: '2024-03-28', method: '目视', result: '管径畅通，轻微回淤', health: 83, nextReview: '2024-06-28' },
])

const evalMetrics = ref([
    { metric: '修复合格率', formula: '验收合格数/修复总数', target: '≥95%', actual: '100%', status: '达标' },
    { metric: '缺陷复发率', formula: '复发缺陷数/已修复缺陷数', target: '≤5%', actual: '0%', status: '达标' },
    { metric: '寿命延长周期', formula: '预测剩余寿命增量', target: '≥10年', actual: '12-15年', status: '达标' },
    { metric: '健康度提升幅度', formula: '修复后健康度-修复前', target: '≥20分', actual: '18.8分(平均)', status: '接近' },
    { metric: '成本效益比', formula: '健康度提升/单位成本', target: '≥0.5分/千元', actual: '0.58分/千元', status: '达标' },
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

        <template v-if="activeFunc === 'track'">
            <div class="flex items-center gap-2 mb-1">
                <Target class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">修复效果跟踪</span>
            </div>
            <div class="space-y-3">
                <div v-for="t in trackItems" :key="t.pipe"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-primary font-mono">{{
                                t.pipe }}</span><span
                                class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ t.scheme
                                }}</span><span class="text-[10px] text-dim">{{ t.repairDate }}</span></div><span
                            class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-success/10 text-success">{{ t.status
                            }}</span>
                    </div>
                    <div class="grid grid-cols-3 gap-3 text-center">
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-lg font-bold text-danger">{{ t.healthBefore }}</p>
                            <p class="text-[10px] text-dim">修复前</p>
                        </div>
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-lg font-bold text-success">{{ t.healthAfter }}</p>
                            <p class="text-[10px] text-dim">修复后</p>
                        </div>
                        <div class="bg-surface rounded-lg p-2">
                            <p class="text-lg font-bold"
                                :class="t.healthNow >= t.healthAfter - 5 ? 'text-success' : 'text-warning'">{{
                                t.healthNow }}</p>
                            <p class="text-[10px] text-dim">当前</p>
                        </div>
                    </div>
                    <div class="flex gap-2 mt-2 text-[10px]"><span class="text-danger">前: {{ t.defectBefore
                            }}</span><span class="text-dim">→</span><span class="text-success">后: {{ t.defectAfter
                            }}</span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'improve'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingUp class="w-4 h-4 text-success" /><span
                    class="text-sm font-semibold text-default">改善程度分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">指标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">修复前</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">修复后</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">变化</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">改善幅度</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(im, i) in improvements" :key="i"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ im.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-default font-medium">{{ im.metric }}</td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ im.before }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ im.after }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ im.change }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ im.improvement }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'review'">
            <div class="flex items-center gap-2 mb-1">
                <RefreshCw class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">周期性复查</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">复查次数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方法</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">结果</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">健康度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">下次复查</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in reviews" :key="r.pipe + r.reviewNo"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ r.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-default">第{{ r.reviewNo }}次</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.date }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.method }}</td>
                            <td class="px-2 py-2.5 text-default">{{ r.result }}</td>
                            <td class="text-center px-2 py-2.5 font-bold text-success">{{ r.health }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ r.nextReview }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'metrics'">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                    <BarChart3 class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">效果评估指标</span>
                </div><button @click="toast?.show('评估报告已生成', 'success')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <FileText class="w-3.5 h-3.5" />生成报告
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">评估指标</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">计算方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">目标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">实际</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">达标</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in evalMetrics" :key="e.metric"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ e.metric }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ e.formula }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ e.target }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ e.actual }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="e.status === '达标' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                    e.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
