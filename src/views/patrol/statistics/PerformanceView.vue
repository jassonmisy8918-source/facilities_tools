<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Sliders, FileText, PlusCircle, TrendingUp, Archive, Printer, Cpu } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('indicators')
const funcTabs = [
    { key: 'indicators', label: '指标管理' },
    { key: 'threshold', label: '阈值设定' },
    { key: 'template', label: '报告模板' },
    { key: 'analysis', label: '评估分析' },
    { key: 'reports', label: '评估报告' },
    { key: 'equipment', label: '设备故障' },
]

// 指标
const indicators = ref([
    { id: 1, name: '任务完成率', category: '巡查', weight: 20, formula: '完成数/总数×100%', threshold: 85, scoring: '≥85%满分,每降5%扣5分', isSystem: true },
    { id: 2, name: '巡查覆盖率', category: '巡查', weight: 15, formula: '覆盖里程/总里程×100%', threshold: 80, scoring: '≥80%满分,每降5%扣3分', isSystem: true },
    { id: 3, name: '问题发现率', category: '巡查', weight: 15, formula: '发现问题数/巡查次数', threshold: 0.5, scoring: '≥0.5满分,每降0.1扣2分', isSystem: true },
    { id: 4, name: '养护及时率', category: '养护', weight: 20, formula: '按时完成数/总数×100%', threshold: 90, scoring: '≥90%满分,每降5%扣5分', isSystem: true },
    { id: 5, name: '成本控制率', category: '养护', weight: 15, formula: '实际/预算×100%', threshold: 100, scoring: '≤100%满分,每超5%扣3分', isSystem: true },
    { id: 6, name: '客户满意度', category: '综合', weight: 15, formula: '满意评价数/总数×100%', threshold: 90, scoring: '≥90%满分,每降5%扣5分', isSystem: false },
])
const showAddIndicator = ref(false)
const addIndicatorForm = ref({ name: '', category: '巡查', weight: '', formula: '', threshold: '', scoring: '' })
function openAddIndicator() { addIndicatorForm.value = { name: '', category: '巡查', weight: '', formula: '', threshold: '', scoring: '' }; showAddIndicator.value = true }
function doAddIndicator() { showAddIndicator.value = false; toast.value?.show('自定义指标添加成功', 'success') }

// 报告模板
const templates = ref([
    { id: 1, name: '月度绩效报告', level: '班组级', dimensions: '任务完成/成本控制/效率', status: '启用' },
    { id: 2, name: '季度综合报告', level: '部门级', dimensions: '全维度', status: '启用' },
    { id: 3, name: '年度考核报告', level: '公司级', dimensions: '全维度+同比分析', status: '启用' },
])

// 评估分析
const evaluationData = ref([
    { name: '张伟', team: 'A班', taskRate: 95, coverageRate: 88, issueRate: 0.6, timelyRate: 92, costRate: 98, satisfaction: 95, total: 93.2, rank: 1 },
    { name: '王强', team: 'A班', taskRate: 90, coverageRate: 85, issueRate: 0.5, timelyRate: 88, costRate: 95, satisfaction: 90, total: 89.5, rank: 2 },
    { name: '李明', team: 'B班', taskRate: 88, coverageRate: 80, issueRate: 0.4, timelyRate: 85, costRate: 92, satisfaction: 88, total: 86.0, rank: 3 },
    { name: '刘芳', team: 'B班', taskRate: 82, coverageRate: 75, issueRate: 0.3, timelyRate: 80, costRate: 88, satisfaction: 85, total: 80.8, rank: 4 },
    { name: '赵刚', team: 'C班', taskRate: 75, coverageRate: 60, issueRate: 0.2, timelyRate: 72, costRate: 110, satisfaction: 78, total: 70.2, rank: 5 },
])

// 评估报告
const evalReports = ref([
    { id: 1, name: '2024年3月 A班绩效报告', period: '2024-03', template: '月度绩效报告', status: '已审核', date: '2024-04-02' },
    { id: 2, name: '2024年Q1 综合绩效报告', period: '2024-Q1', template: '季度综合报告', status: '已生成', date: '2024-04-08' },
    { id: 3, name: '2024年3月 B班绩效报告', period: '2024-03', template: '月度绩效报告', status: '待审核', date: '2024-04-03' },
])

// 设备故障
const faultStats = ref([
    { device: '管道检测机器人', type: '检测设备', area: '圭塘街道', runHours: 1200, faults: 5, frequency: '4.2次/千时', trend: '上升' },
    { device: '高压冲洗车 A', type: '车辆', area: '全区', runHours: 2800, faults: 3, frequency: '1.1次/千时', trend: '稳定' },
    { device: '流量计 FL-03', type: '仪表', area: '侯家塘街道', runHours: 8760, faults: 8, frequency: '0.9次/千时', trend: '下降' },
    { device: '液位计 LV-12', type: '仪表', area: '左家塘街道', runHours: 8760, faults: 12, frequency: '1.4次/千时', trend: '上升' },
    { device: 'CCTV 检测车', type: '车辆', area: '全区', runHours: 1500, faults: 2, frequency: '1.3次/千时', trend: '稳定' },
])

function scoreClass(v: number) { return v >= 90 ? 'text-success' : v >= 80 ? 'text-warning' : 'text-danger' }
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

        <!-- 指标管理 -->
        <template v-if="activeFunc === 'indicators'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Settings class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">评估指标信息管理</span>
                </div>
                <button @click="openAddIndicator()"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <PlusCircle class="w-3.5 h-3.5" />自定义指标
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">指标名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类别</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">权重</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">计算公式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">达标值</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">评分标准</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ind in indicators" :key="ind.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ ind.name }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="ind.category === '巡查' ? 'bg-primary/10 text-primary' : ind.category === '养护' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'">{{
                                        ind.category }}</span></td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ ind.weight }}%</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ ind.formula }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ ind.threshold }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ ind.scoring }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="ind.isSystem ? 'bg-surface text-dim' : 'bg-warning/10 text-warning'">{{
                                        ind.isSystem ? '系统' : '自定义' }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 阈值设定 -->
        <template v-if="activeFunc === 'threshold'">
            <div class="flex items-center gap-2 mb-2">
                <Sliders class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">指标阈值设定</span>
            </div>
            <div class="space-y-3">
                <div v-for="ind in indicators" :key="ind.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div><span class="text-xs font-bold text-default">{{ ind.name }}</span><span
                                class="text-[10px] text-dim ml-2">({{ ind.category }})</span></div>
                        <span class="text-xs font-bold text-primary">当前: {{ ind.threshold }}{{ typeof ind.threshold ===
                            'number' && ind.threshold > 1 ? '%' : '' }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-[10px] text-dim">0</span>
                        <div class="flex-1 h-2 bg-surface rounded-full overflow-hidden relative">
                            <div class="absolute inset-0 flex">
                                <div class="bg-danger h-full" style="width:60%"></div>
                                <div class="bg-warning h-full" style="width:20%"></div>
                                <div class="bg-success h-full" style="width:20%"></div>
                            </div>
                            <div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-white shadow"
                                :style="{ left: (typeof ind.threshold === 'number' && ind.threshold > 1 ? ind.threshold : ind.threshold * 100) + '%' }">
                            </div>
                        </div>
                        <span class="text-[10px] text-dim">100%</span>
                    </div>
                    <p class="text-[10px] text-dim mt-1">{{ ind.scoring }}</p>
                </div>
            </div>
        </template>

        <!-- 报告模板 -->
        <template v-if="activeFunc === 'template'">
            <div class="flex items-center gap-2 mb-2">
                <FileText class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">绩效报告模板管理</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div v-for="t in templates" :key="t.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <p class="text-xs font-bold text-default mb-1">{{ t.name }}</p>
                    <div class="space-y-1 text-[10px] text-dim">
                        <p>层级: <span class="text-default">{{ t.level }}</span></p>
                        <p>维度: <span class="text-default">{{ t.dimensions }}</span></p>
                    </div>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">{{ t.status }}</span>
                        <button class="text-[10px] text-primary hover:underline cursor-pointer">编辑</button>
                    </div>
                </div>
            </div>
        </template>

        <!-- 评估分析 -->
        <template v-if="activeFunc === 'analysis'">
            <div class="flex items-center gap-2 mb-2">
                <TrendingUp class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">综合效能分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-[10px]">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-2 py-2 text-dim font-medium">排名</th>
                            <th class="text-left px-2 py-2 text-dim font-medium">姓名</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">班组</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">任务完成率</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">覆盖率</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">问题发现</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">养护及时</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">成本控制</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">满意度</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">综合得分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in evaluationData" :key="e.name"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="text-center px-2 py-2"><span class="font-bold"
                                    :class="e.rank <= 3 ? 'text-primary' : 'text-dim'">{{ e.rank <= 3 ? ['🥇', '🥈'
                                        , '🥉'][e.rank - 1] : '#' + e.rank }}</span>
                            </td>
                            <td class="px-2 py-2 text-default font-medium">{{ e.name }}</td>
                            <td class="text-center px-2 py-2 text-dim">{{ e.team }}</td>
                            <td class="text-center px-2 py-2" :class="scoreClass(e.taskRate)">{{ e.taskRate }}%</td>
                            <td class="text-center px-2 py-2" :class="scoreClass(e.coverageRate)">{{ e.coverageRate }}%
                            </td>
                            <td class="text-center px-2 py-2 text-default">{{ e.issueRate }}</td>
                            <td class="text-center px-2 py-2" :class="scoreClass(e.timelyRate)">{{ e.timelyRate }}%</td>
                            <td class="text-center px-2 py-2"
                                :class="e.costRate <= 100 ? 'text-success' : 'text-danger'">{{ e.costRate }}%</td>
                            <td class="text-center px-2 py-2" :class="scoreClass(e.satisfaction)">{{ e.satisfaction }}%
                            </td>
                            <td class="text-center px-2 py-2"><span class="text-xs font-bold"
                                    :class="scoreClass(e.total)">{{ e.total }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 评估报告 -->
        <template v-if="activeFunc === 'reports'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Archive class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">评估报告信息管理</span>
                </div>
                <button @click="toast?.show('报告生成中...', 'info')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Printer class="w-3.5 h-3.5" />生成报告
                </button>
            </div>
            <div class="space-y-3">
                <div v-for="r in evalReports" :key="r.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-default">{{ r.name }}</p>
                        <p class="text-[10px] text-dim">模板: {{ r.template }} · {{ r.date }}</p>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                        :class="r.status === '已审核' ? 'bg-success/10 text-success' : r.status === '已生成' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{
                            r.status }}</span>
                </div>
            </div>
        </template>

        <!-- 设备故障 -->
        <template v-if="activeFunc === 'equipment'">
            <div class="flex items-center gap-2 mb-2">
                <Cpu class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">设备故障频率统计</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">运行时长</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">故障次数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">故障频率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">趋势</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="f in faultStats" :key="f.device"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ f.device }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface">{{ f.type }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ f.area }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ f.runHours }}h</td>
                            <td class="text-center px-2 py-2.5 text-warning font-bold">{{ f.faults }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ f.frequency }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="f.trend === '上升' ? 'bg-danger/10 text-danger' : f.trend === '下降' ? 'bg-success/10 text-success' : 'bg-surface text-dim'">{{
                                        f.trend === '上升' ? '↑' : f.trend === '下降' ? '↓' : '→' }} {{ f.trend }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <!-- 自定义指标弹窗 -->
        <ModalDialog :show="showAddIndicator" title="自定义评估指标" @close="showAddIndicator = false"
            @confirm="doAddIndicator">
            <div class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">指标名称</label>
                        <input v-model="addIndicatorForm.name" type="text" placeholder="如 巡查准时率"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">指标类别</label>
                        <select v-model="addIndicatorForm.category"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                            <option>巡查</option>
                            <option>养护</option>
                            <option>综合</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">权重(%)</label>
                        <input v-model="addIndicatorForm.weight" type="number" placeholder="如 15"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">达标值</label>
                        <input v-model="addIndicatorForm.threshold" type="text" placeholder="如 85"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">计算公式</label>
                    <input v-model="addIndicatorForm.formula" type="text" placeholder="如 准时到达数/总巡查数×100%"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">评分标准</label>
                    <input v-model="addIndicatorForm.scoring" type="text" placeholder="如 ≥85%满分,每降5%扣5分"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
