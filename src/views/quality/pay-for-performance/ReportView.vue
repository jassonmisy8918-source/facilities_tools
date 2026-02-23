<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Layout, Clock, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('generate')
const funcTabs = [
    { key: 'generate', label: '报告生成' },
    { key: 'template', label: '模板管理' },
    { key: 'history', label: '历史报告' },
]

const generatedReports = ref([
    { id: 1, title: '雨花污水厂2024年3月按效付费评估报告', period: '2024-03', plant: '雨花污水厂', score: 96.67, level: '优秀', payRate: '105%', amount: '325.5万', generated: '2024-04-01 09:00', status: '已生成' },
    { id: 2, title: '黎托街道污水厂2024年3月按效付费评估报告', period: '2024-03', plant: '黎托街道污水厂', score: 82.5, level: '良好', payRate: '100%', amount: '280.0万', generated: '2024-04-01 09:15', status: '已生成' },
    { id: 3, title: '洞井污水厂2024年3月按效付费评估报告', period: '2024-03', plant: '洞井污水厂', score: 91.3, level: '优秀', payRate: '105%', amount: '350.0万', generated: '2024-04-01 09:30', status: '待审核' },
])

const templates = ref([
    { id: 1, name: '月度评估报告模板', type: '月报', sections: '基本信息/指标得分/综合评定/付费计算', version: 'V2.0', updated: '2024-01-15', status: '默认' },
    { id: 2, name: '季度汇总报告模板', type: '季报', sections: '季度总结/趋势分析/排名对比/改进建议', version: 'V1.5', updated: '2024-02-01', status: '启用' },
    { id: 3, name: '年度综合报告模板', type: '年报', sections: '年度概览/全年指标/同比分析/结算汇总', version: 'V1.0', updated: '2023-12-20', status: '启用' },
])

const historyReports = ref([
    { period: '2024年3月', count: 3, avgScore: 90.2, totalPay: '955.5万', highestPlant: '雨花污水厂(96.67)', lowestPlant: '黎托街道污水厂(82.5)' },
    { period: '2024年2月', count: 4, avgScore: 85.3, totalPay: '1180.0万', highestPlant: '洞井污水厂(92.1)', lowestPlant: '左家塘污水厂(76.5)' },
    { period: '2024年1月', count: 4, avgScore: 82.1, totalPay: '1120.0万', highestPlant: '雨花污水厂(88.5)', lowestPlant: '黎托街道污水厂(72.3)' },
    { period: '2023年12月', count: 4, avgScore: 84.8, totalPay: '1150.0万', highestPlant: '洞井污水厂(90.2)', lowestPlant: '左家塘污水厂(78.1)' },
])

function levelClass(l: string) { return l === '优秀' ? 'bg-success/10 text-success' : l === '良好' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning' }
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

        <template v-if="activeFunc === 'generate'">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                    <FileText class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">评估报告自动生成</span>
                </div><button @click="toast?.show('报告生成中...', 'info')"
                    class="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">生成本月报告</button>
            </div>
            <div class="space-y-3">
                <div v-for="r in generatedReports" :key="r.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        r.title }}</span>
                        <div class="flex items-center gap-2"><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="levelClass(r.level)">{{ r.level }}</span><button
                                @click="toast?.show('报告已下载', 'success')"
                                class="text-primary hover:text-primary-light cursor-pointer">
                                <Download class="w-3.5 h-3.5" />
                            </button></div>
                    </div>
                    <div class="grid grid-cols-5 gap-2 text-[10px]">
                        <div><span class="text-dim">综合分: </span><span class="text-default font-bold">{{ r.score
                        }}</span></div>
                        <div><span class="text-dim">付费率: </span><span class="text-primary font-bold">{{ r.payRate
                        }}</span></div>
                        <div><span class="text-dim">付费额: </span><span class="text-success font-bold">{{ r.amount
                        }}</span></div>
                        <div><span class="text-dim">生成: </span><span class="text-dim">{{ r.generated }}</span></div>
                        <div><span class="text-dim">状态: </span><span
                                :class="r.status === '已生成' ? 'text-success' : 'text-warning'">{{ r.status }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'template'">
            <div class="flex items-center gap-2 mb-1">
                <Layout class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">报告模板管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">模板名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">包含章节</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">版本</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">更新</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in templates" :key="t.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ t.name }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ t.type
                                    }}</span></td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ t.sections }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ t.version }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ t.updated }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="t.status === '默认' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'">{{
                                        t.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'history'">
            <div class="flex items-center gap-2 mb-1">
                <Clock class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">历史报告查询</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">考核期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">报告数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">平均分</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">总付费额</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">最高分</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">最低分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="h in historyReports" :key="h.period"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default font-medium">{{ h.period }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ h.count }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="h.avgScore >= 85 ? 'text-success' : 'text-warning'">{{ h.avgScore }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ h.totalPay }}</td>
                            <td class="px-2 py-2.5 text-success text-[10px]">{{ h.highestPlant }}</td>
                            <td class="px-2 py-2.5 text-warning text-[10px]">{{ h.lowestPlant }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
