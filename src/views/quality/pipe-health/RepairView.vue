<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, ListOrdered, Lightbulb, Calendar, DollarSign, Archive } from 'lucide-vue-next'
const activeFunc = ref('index')
const funcTabs = [
    { key: 'index', label: '修复指数' },
    { key: 'scheme', label: '修复方案' },
    { key: 'plan', label: '修复计划' },
    { key: 'progress', label: '进度与成本' },
    { key: 'records', label: '修复记录' },
]

const repairIndex = ref([
    { pipe: 'P-TZ-002', health: 48, defect: 4, env: '高风险', repairIdx: 95, rank: 1, urgency: '紧急' },
    { pipe: 'P-XC-001', health: 45, defect: 3, env: '中风险', repairIdx: 88, rank: 2, urgency: '紧急' },
    { pipe: 'P-HD-003', health: 58, defect: 3, env: '低风险', repairIdx: 72, rank: 3, urgency: '高' },
    { pipe: 'P-CD-001', health: 71.5, defect: 2, env: '低风险', repairIdx: 45, rank: 4, urgency: '中' },
    { pipe: 'P-FT-005', health: 85.2, defect: 0, env: '低风险', repairIdx: 12, rank: 5, urgency: '低' },
])

const schemes = ref([
    { id: 1, name: 'CIPP内衬修复', type: '非开挖', scope: '裂缝/腐蚀/轻微变形', diameter: 'DN200-1200', cost: '800-1500元/m', duration: '1-3天/段', maintain: true },
    { id: 2, name: '紫外光固化修复', type: '非开挖', scope: '点状裂缝/接口问题', diameter: 'DN150-800', cost: '500-1000元/m', duration: '0.5-1天/段', maintain: true },
    { id: 3, name: '开挖更换', type: '开挖', scope: '严重变形/坍塌', diameter: '不限', cost: '2000-5000元/m', duration: '3-7天/段', maintain: true },
    { id: 4, name: '管道点状修复', type: '非开挖', scope: '局部破损', diameter: 'DN200-600', cost: '300-600元/处', duration: '0.5天/处', maintain: true },
    { id: 5, name: '螺旋缠绕修复', type: '非开挖', scope: '大口径劣化管道', diameter: 'DN800-2000', cost: '1200-2500元/m', duration: '2-5天/段', maintain: true },
])

const recommended = ref([
    { pipe: 'P-TZ-002', defect: '管壁变形15%', recommend: 'CIPP内衬修复', reason: '变形率未超20%，适合非开挖', confidence: 88 },
    { pipe: 'P-TZ-002', defect: '腐蚀0.5m²', recommend: 'CIPP内衬修复', reason: '腐蚀面积适中，可同段施工', confidence: 92 },
    { pipe: 'P-XC-001', defect: '多处劣化', recommend: '螺旋缠绕修复', reason: 'DN1000大口径，适用缠绕工艺', confidence: 85 },
])

const plans = ref([
    { id: 1, pipe: 'P-TZ-002', scheme: 'CIPP内衬', start: '2024-04-01', end: '2024-04-05', owner: '赵刚', team: 3, equipment: 'CIPP设备组', material: '树脂内衬', budget: 68000, status: '待执行' },
    { id: 2, pipe: 'P-XC-001', scheme: '螺旋缠绕', start: '2024-04-10', end: '2024-04-18', owner: '王强', team: 5, equipment: '缠绕设备组', material: 'PE缠绕带', budget: 125000, status: '规划中' },
])

const progressItems = ref([
    { pipe: 'P-HD-003', scheme: '紫外光固化', progress: 100, budget: 35000, actual: 32800, owner: '李明', status: '已完成' },
    { pipe: 'P-TZ-002', scheme: 'CIPP内衬', progress: 0, budget: 68000, actual: 0, owner: '赵刚', status: '待执行' },
])

const records = ref([
    { id: 1, pipe: 'P-HD-003', scheme: '紫外光固化', location: '海淀区清河路92.1m', date: '2024-03-10', owner: '李明', duration: '6h', cost: 32800, before: '树根侵入/管径20%', after: '修复完成/畅通', photos: 5, archived: true },
    { id: 2, pipe: 'P-CD-001', scheme: '管道清淤', location: '朝阳区建设大道78.5m', date: '2024-02-28', owner: '张伟', duration: '3h', cost: 8500, before: '沉积物/管径30%', after: '清淤完成/畅通', photos: 3, archived: true },
])

function urgencyClass(u: string) { return u === '紧急' ? 'bg-danger/10 text-danger' : u === '高' ? 'bg-warning/10 text-warning' : u === '中' ? 'bg-info/10 text-info' : 'bg-surface text-dim' }
</script>

<template>
    <div class="space-y-4">

        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'index'">
            <div class="flex items-center gap-2 mb-1">
                <ListOrdered class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">修复指数与优先级排序</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-2 py-2.5 text-dim font-medium">#</th>
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">健康度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">缺陷等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">环境风险</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">修复指数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">紧迫度</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in repairIndex" :key="r.pipe"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-2 py-2.5 text-lg font-bold"
                                :class="r.rank <= 2 ? 'text-danger' : 'text-dim'">{{ r.rank }}</td>
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ r.pipe }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="r.health >= 70 ? 'text-success' : r.health >= 55 ? 'text-warning' : 'text-danger'">
                                {{ r.health }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="r.defect >= 4 ? 'text-danger' : 'text-warning'">{{ r.defect }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.env }}</td>
                            <td class="text-center px-2 py-2.5 text-xl font-bold text-primary">{{ r.repairIdx }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="urgencyClass(r.urgency)">{{ r.urgency }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'scheme'">
            <div class="flex items-center gap-2 mb-1">
                <Wrench class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">修复方案库</span>
            </div>
            <div class="grid grid-cols-3 gap-3 mb-3">
                <div v-for="s in schemes" :key="s.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        s.name }}</span><span class="text-[10px] px-1.5 py-0.5 rounded"
                            :class="s.type === '非开挖' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                s.type }}</span></div>
                    <div class="space-y-1 text-[10px]">
                        <p class="text-dim">适用: <span class="text-default">{{ s.scope }}</span></p>
                        <p class="text-dim">管径: <span class="text-default">{{ s.diameter }}</span></p>
                        <p class="text-dim">费用: <span class="text-primary font-bold">{{ s.cost }}</span></p>
                        <p class="text-dim">工期: <span class="text-default">{{ s.duration }}</span></p>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2 mb-1">
                <Lightbulb class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">智能推荐</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">缺陷</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">推荐方案</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">推荐理由</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">置信度</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in recommended" :key="r.pipe + r.defect"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ r.pipe }}</td>
                            <td class="px-2 py-2.5 text-default">{{ r.defect }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-medium">{{ r.recommend }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ r.reason }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="r.confidence >= 90 ? 'text-success' : 'text-warning'">{{ r.confidence }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'plan'">
            <div class="flex items-center gap-2 mb-1">
                <Calendar class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">修复计划与资源分配</span>
            </div>
            <div class="space-y-3">
                <div v-for="p in plans" :key="p.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-primary font-mono">{{
                            p.pipe }}</span><span
                                class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ p.scheme }}</span>
                        </div><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            :class="p.status === '待执行' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                p.status }}</span>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-[10px]">
                        <div><span class="text-dim">周期: </span><span class="text-default">{{ p.start }} ~ {{ p.end
                        }}</span></div>
                        <div><span class="text-dim">负责人: </span><span class="text-default">{{ p.owner }}</span></div>
                        <div><span class="text-dim">团队: </span><span class="text-default">{{ p.team }}人</span></div>
                        <div><span class="text-dim">预算: </span><span class="text-primary font-bold">¥{{
                            p.budget.toLocaleString() }}</span></div>
                    </div>
                    <div class="flex gap-2 text-[10px] mt-1"><span class="text-dim">设备: <span class="text-default">{{
                        p.equipment }}</span></span><span class="text-dim">材料: <span class="text-default">{{
                                    p.material }}</span></span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'progress'">
            <div class="flex items-center gap-2 mb-1">
                <DollarSign class="w-4 h-4 text-success" /><span
                    class="text-sm font-semibold text-default">进度跟踪与成本管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方案</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">预算</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">实际</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负责人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in progressItems" :key="p.pipe"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ p.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.scheme }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="p.progress === 100 ? 'bg-success' : 'bg-primary'"
                                            :style="{ width: p.progress + '%' }"></div>
                                    </div><span class="text-[10px] text-dim">{{ p.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5 text-dim">¥{{ p.budget.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="p.actual <= p.budget ? 'text-success' : 'text-danger'">¥{{
                                    p.actual.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.owner }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="p.status === '已完成' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                        p.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'records'">
            <div class="flex items-center gap-2 mb-1">
                <Archive class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">修复记录档案</span>
            </div>
            <div class="space-y-3">
                <div v-for="r in records" :key="r.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-primary font-mono">{{
                            r.pipe }}</span><span
                                class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ r.scheme }}</span>
                        </div><span v-if="r.archived"
                            class="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">已归档</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-[10px] mb-2">
                        <div><span class="text-dim">位置: </span><span class="text-default">{{ r.location }}</span></div>
                        <div><span class="text-dim">日期: </span><span class="text-default">{{ r.date }}</span></div>
                        <div><span class="text-dim">负责人: </span><span class="text-default">{{ r.owner }}</span></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-[10px] bg-surface rounded-lg p-2">
                        <div><span class="text-danger">修复前: </span><span class="text-default">{{ r.before }}</span>
                        </div>
                        <div><span class="text-success">修复后: </span><span class="text-default">{{ r.after }}</span>
                        </div>
                    </div>
                    <div class="flex gap-3 mt-2 text-[10px] text-dim"><span>耗时: <span class="text-primary font-bold">{{
                        r.duration }}</span></span><span>费用: <span class="text-warning font-bold">¥{{
                                    r.cost.toLocaleString() }}</span></span><span>照片: <span class="text-info">{{ r.photos
                                }}张</span></span></div>
                </div>
            </div>
        </template>
    </div>
</template>
