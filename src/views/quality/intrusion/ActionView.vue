<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, Link, CheckCircle, Lightbulb } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('scheme')
const funcTabs = [
    { key: 'scheme', label: '修复方案' },
    { key: 'order', label: '关联工单' },
    { key: 'track', label: '执行跟踪' },
    { key: 'optimize', label: '优化建议' },
]

const repairSchemes = ref([
    { id: 1, pipe: 'P-CD-001', point: '45.2m', type: '地下水', recommend: '接口注浆封堵', reason: '接口位置地下水入渗，注浆成本低效果好', cost: '约1.2万元', duration: '1天', confidence: 90 },
    { id: 2, pipe: 'P-CD-003', point: '河段接口', type: '河水', recommend: '止水闸安装+管道修复', reason: '河水倒灌需物理隔断+管道密封', cost: '约5.8万元', duration: '3天', confidence: 85 },
    { id: 3, pipe: 'P-TZ-002', point: '120m接口', type: '雨水', recommend: '接口密封+雨污分流改造', reason: '接口老化导致雨水渗入，需系统改造', cost: '约8.5万元', duration: '5天', confidence: 78 },
])

const linkedOrders = ref([
    { orderId: 'WO-INT-001', pipe: 'P-CD-001', scheme: '接口注浆', createTime: '2024-03-15 10:00', assignee: '张伟', status: '执行中', progress: 60 },
    { orderId: 'WO-INT-002', pipe: 'P-CD-003', scheme: '止水闸安装', createTime: '2024-03-14 14:00', assignee: '赵刚', status: '待派发', progress: 0 },
])

const trackItems = ref([
    {
        orderId: 'WO-INT-001', pipe: 'P-CD-001', timeline: [
            { time: '03-15 10:00', action: '工单创建', status: '完成' },
            { time: '03-15 14:00', action: '材料准备', status: '完成' },
            { time: '03-16 08:00', action: '现场施工', status: '进行中' },
            { time: '03-16 16:00', action: '验收检测', status: '待执行' },
        ]
    },
])

const optimizeSuggestions = ref([
    { id: 1, area: '管网运行', suggestion: '圭塘街道万家丽路段降低运行水位0.3m，减少地下水入侵压差', impact: '预计减少入侵30%', priority: '高' },
    { id: 2, area: '调度优化', suggestion: '汛期对黎托街道浏阳河段实施截流调度，避免雨水入渗高峰', impact: '预计减少雨水入渗50%', priority: '高' },
    { id: 3, area: '监测加密', suggestion: '左家塘南路增设2处流量监测点，提升入侵检测灵敏度', impact: '提前2h发现入侵事件', priority: '中' },
    { id: 4, area: '长效治理', suggestion: '制定年度管道接口密封计划，逐步消除入浸点', impact: '年减少外水3000m³', priority: '中' },
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

        <template v-if="activeFunc === 'scheme'">
            <div class="flex items-center gap-2 mb-1">
                <Wrench class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">修复方案建议</span>
            </div>
            <div class="space-y-3">
                <div v-for="s in repairSchemes" :key="s.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-primary font-mono">{{
                                s.pipe }}</span><span class="text-[10px] text-dim">{{ s.point }}</span><span
                                class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ s.type }}</span>
                        </div><span class="text-[10px] font-bold"
                            :class="s.confidence >= 85 ? 'text-success' : 'text-warning'">置信度 {{ s.confidence }}%</span>
                    </div>
                    <p class="text-xs text-success font-medium mb-1">🔧 {{ s.recommend }}</p>
                    <p class="text-[10px] text-dim mb-2">{{ s.reason }}</p>
                    <div class="flex gap-4 text-[10px]"><span class="text-dim">预算: <span
                                class="text-primary font-bold">{{ s.cost }}</span></span><span class="text-dim">工期:
                            <span class="text-default font-bold">{{ s.duration }}</span></span></div>
                    <button @click="toast?.show('已创建关联工单', 'success')"
                        class="mt-2 flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-medium hover:bg-primary-light cursor-pointer">
                        <Link class="w-3 h-3" />创建工单
                    </button>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'order'">
            <div class="flex items-center gap-2 mb-1">
                <Link class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">关联工单</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">工单号</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方案</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">创建时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负责人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in linkedOrders" :key="o.orderId"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ o.orderId }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.scheme }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ o.createTime }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.assignee }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full bg-primary rounded-full"
                                            :style="{ width: o.progress + '%' }"></div>
                                    </div><span class="text-[10px] text-dim">{{ o.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="o.status === '执行中' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'">{{
                                    o.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'track'">
            <div class="flex items-center gap-2 mb-1">
                <CheckCircle class="w-4 h-4 text-success" /><span
                    class="text-sm font-semibold text-default">措施执行跟踪</span>
            </div>
            <div class="space-y-3">
                <div v-for="t in trackItems" :key="t.orderId"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3"><span class="text-xs font-bold text-primary font-mono">{{
                            t.orderId }}</span><span class="text-[10px] text-dim">{{ t.pipe }}</span></div>
                    <div class="space-y-2">
                        <div v-for="(step, i) in t.timeline" :key="i" class="flex items-center gap-3">
                            <div class="w-2 h-2 rounded-full shrink-0"
                                :class="step.status === '完成' ? 'bg-success' : step.status === '进行中' ? 'bg-primary animate-pulse' : 'bg-surface'">
                            </div>
                            <span class="text-[10px] text-dim w-24">{{ step.time }}</span>
                            <span class="text-[10px] text-default font-medium flex-1">{{ step.action }}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="step.status === '完成' ? 'bg-success/10 text-success' : step.status === '进行中' ? 'bg-primary/10 text-primary' : 'bg-surface text-dim'">{{
                                step.status }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'optimize'">
            <div class="flex items-center gap-2 mb-1">
                <Lightbulb class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">运行优化调整建议</span>
            </div>
            <div class="space-y-3">
                <div v-for="o in optimizeSuggestions" :key="o.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-default">{{
                            o.area }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="o.priority === '高' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">{{
                            o.priority }}</span></div>
                    <p class="text-[10px] text-default mb-1">💡 {{ o.suggestion }}</p>
                    <p class="text-[10px] text-success">📈 {{ o.impact }}</p>
                </div>
            </div>
        </template>
    </div>
</template>
