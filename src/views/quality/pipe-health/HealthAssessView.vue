<script setup lang="ts">
import { ref } from 'vue'
import { Heart, TrendingDown, Bell, FileText, Calculator } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('factors')
const funcTabs = [
    { key: 'factors', label: '影响因素' },
    { key: 'score', label: '健康度评分' },
    { key: 'trend', label: '趋势与预警' },
    { key: 'maintain', label: '养护指数' },
]

const pipeFactors = ref([
    { pipe: 'P-CD-001', material: 'HDPE', age: 8, diameter: 'DN600', selfScore: 72, envScore: 68, maintScore: 75, totalScore: 71.5 },
    { pipe: 'P-HD-003', material: '钢筋混凝土', age: 15, diameter: 'DN800', selfScore: 55, envScore: 62, maintScore: 60, totalScore: 58.3 },
    { pipe: 'P-TZ-002', material: 'PVC', age: 12, diameter: 'DN400', selfScore: 48, envScore: 45, maintScore: 52, totalScore: 48.0 },
    { pipe: 'P-FT-005', material: 'HDPE', age: 5, diameter: 'DN500', selfScore: 88, envScore: 82, maintScore: 85, totalScore: 85.2 },
    { pipe: 'P-XC-001', material: '球墨铸铁', age: 20, diameter: 'DN1000', selfScore: 42, envScore: 50, maintScore: 45, totalScore: 45.0 },
])

const factorWeights = ref([
    { factor: '管材类型', weight: 15, desc: 'HDPE > 球墨铸铁 > 钢筋混凝土 > PVC' },
    { factor: '管龄', weight: 25, desc: '管龄越大得分越低' },
    { factor: '管径', weight: 10, desc: '大管径结构稳定性更高' },
    { factor: '地质条件', weight: 15, desc: '软土地基风险较高' },
    { factor: '地面荷载', weight: 10, desc: '重载交通路段风险叠加' },
    { factor: '运行负荷', weight: 10, desc: '超负荷运行加速劣化' },
    { factor: '维护频次', weight: 15, desc: '定期养护延缓劣化' },
])

const healthTrend = ref([
    { pipe: 'P-TZ-002', scores: [65, 60, 55, 52, 48], months: ['2023-11', '2023-12', '2024-01', '2024-02', '2024-03'], trend: '加速劣化', alert: true },
    { pipe: 'P-XC-001', scores: [52, 50, 48, 46, 45], months: ['2023-11', '2023-12', '2024-01', '2024-02', '2024-03'], trend: '持续下降', alert: true },
    { pipe: 'P-CD-001', scores: [78, 76, 74, 73, 71.5], months: ['2023-11', '2023-12', '2024-01', '2024-02', '2024-03'], trend: '缓慢下降', alert: false },
])

const alertThresholds = ref([
    { level: '红色预警', threshold: '< 40', action: '立即修复', count: 0 },
    { level: '橙色预警', threshold: '40-55', action: '优先修复', count: 2 },
    { level: '黄色预警', threshold: '55-70', action: '计划维修', count: 1 },
    { level: '正常', threshold: '≥ 70', action: '常规养护', count: 2 },
])

const maintainIndex = ref([
    { pipe: 'P-TZ-002', health: 48, defectGrade: 4, lastClean: '2023-06', lastRepair: '2023-08', inspections: 2, maintIndex: 92, priority: '紧急' },
    { pipe: 'P-XC-001', health: 45, defectGrade: 3, lastClean: '2023-09', lastRepair: '-', inspections: 1, maintIndex: 88, priority: '高' },
    { pipe: 'P-HD-003', health: 58, defectGrade: 3, lastClean: '2024-01', lastRepair: '2023-12', inspections: 3, maintIndex: 72, priority: '中' },
    { pipe: 'P-CD-001', health: 71.5, defectGrade: 2, lastClean: '2024-02', lastRepair: '-', inspections: 4, maintIndex: 55, priority: '低' },
    { pipe: 'P-FT-005', health: 85.2, defectGrade: 0, lastClean: '2024-03', lastRepair: '-', inspections: 5, maintIndex: 20, priority: '常规' },
])

function healthClass(h: number) { return h >= 70 ? 'text-success' : h >= 55 ? 'text-warning' : 'text-danger' }
function priorityClass(p: string) { return p === '紧急' ? 'bg-danger/10 text-danger' : p === '高' ? 'bg-warning/10 text-warning' : p === '中' ? 'bg-info/10 text-info' : 'bg-surface text-dim' }
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

        <template v-if="activeFunc === 'factors'">
            <div class="flex items-center gap-2 mb-1">
                <Heart class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">多因素健康度评估</span>
            </div>
            <div class="grid grid-cols-7 gap-2 mb-3">
                <div v-for="w in factorWeights" :key="w.factor"
                    class="bg-card border border-themed rounded-lg p-2 text-center shadow-themed">
                    <p class="text-lg font-bold text-primary">{{ w.weight }}%</p>
                    <p class="text-[10px] text-default font-medium">{{ w.factor }}</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管材</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管龄</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管径</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">自身</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">环境</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">维护</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">综合</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in pipeFactors" :key="p.pipe"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ p.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.material }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.age }}年</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.diameter }}</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="healthClass(p.selfScore)">{{
                                p.selfScore }}</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="healthClass(p.envScore)">{{ p.envScore
                                }}</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="healthClass(p.maintScore)">{{
                                p.maintScore }}</td>
                            <td class="text-center px-2 py-2.5 text-lg font-bold" :class="healthClass(p.totalScore)">{{
                                p.totalScore }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'score'">
            <div class="flex items-center gap-2 mb-1">
                <Calculator class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">健康度评分与报告</span>
            </div>
            <div class="grid grid-cols-5 gap-3 mb-3">
                <div v-for="p in pipeFactors" :key="p.pipe"
                    class="bg-card border border-themed rounded-xl shadow-themed p-3 text-center cursor-pointer hover:border-primary transition-colors">
                    <p class="text-[10px] text-primary font-mono mb-1">{{ p.pipe }}</p>
                    <p class="text-2xl font-bold" :class="healthClass(p.totalScore)">{{ p.totalScore }}</p>
                    <p class="text-[10px] text-dim">{{ p.material }} · {{ p.age }}年</p>
                </div>
            </div>
            <button @click="toast?.show('健康度报告已生成', 'success')"
                class="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                <FileText class="w-3.5 h-3.5" />生成健康度报告
            </button>
        </template>

        <template v-if="activeFunc === 'trend'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingDown class="w-4 h-4 text-danger" /><span
                    class="text-sm font-semibold text-default">健康度趋势与预警</span>
            </div>
            <div class="grid grid-cols-4 gap-3 mb-3">
                <div v-for="a in alertThresholds" :key="a.level"
                    class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-lg font-bold"
                        :class="a.level === '红色预警' ? 'text-danger' : a.level === '橙色预警' ? 'text-warning' : a.level === '黄色预警' ? 'text-info' : 'text-success'">
                        {{ a.count }}</p>
                    <p class="text-[10px] text-default font-medium">{{ a.level }}</p>
                    <p class="text-[10px] text-dim">{{ a.threshold }}</p>
                </div>
            </div>
            <div class="space-y-3">
                <div v-for="t in healthTrend" :key="t.pipe"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span
                            class="text-xs font-bold text-primary font-mono">{{ t.pipe }}</span>
                        <div class="flex items-center gap-2"><span class="text-[10px]"
                                :class="t.alert ? 'text-danger font-bold' : 'text-dim'">
                                <Bell v-if="t.alert" class="w-3 h-3 inline animate-pulse" /> {{ t.trend }}
                            </span></div>
                    </div>
                    <div class="flex items-end gap-1 h-12">
                        <div v-for="(s, i) in t.scores" :key="i" class="flex-1 rounded-t" :class="healthClass(s)"
                            :style="{ height: s + '%', opacity: 0.5 + i * 0.12, backgroundColor: 'currentColor' }">
                        </div>
                    </div>
                    <div class="flex justify-between text-[10px] text-dim mt-1"><span v-for="m in t.months" :key="m">{{
                            m.slice(5) }}</span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'maintain'">
            <div class="flex items-center gap-2 mb-1">
                <Calculator class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">养护指数</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">健康度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">缺陷等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最近清淤</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最近维修</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">巡检次数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">养护指数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">优先级</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in maintainIndex" :key="m.pipe"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ m.pipe }}</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="healthClass(m.health)">{{ m.health }}
                            </td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="m.defectGrade >= 4 ? 'text-danger' : m.defectGrade >= 3 ? 'text-warning' : 'text-default'">
                                {{ m.defectGrade }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ m.lastClean }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ m.lastRepair }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ m.inspections }}</td>
                            <td class="text-center px-2 py-2.5 text-lg font-bold text-primary">{{ m.maintIndex }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="priorityClass(m.priority)">{{ m.priority }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
