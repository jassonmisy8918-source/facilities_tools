<script setup lang="ts">
import { ref } from 'vue'
import { Users, Wrench, BookOpen, Link, Star, RotateCcw, CheckCircle } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('consult')
const funcTabs = [
    { key: 'consult', label: '会商与支援' },
    { key: 'cases', label: '历史案例' },
    { key: 'accept', label: '工单验收' },
    { key: 'feedback', label: '满意度评价' },
    { key: 'rework', label: '返修管理' },
]

const consultRequests = ref([
    { id: 1, order: 'WO-0314-01', device: '格栅机', type: '多方会商', expert: '技术部/供应商', initiator: '赵刚', time: '2024-03-14 14:00', status: '已完成', result: '确认链条材质升级方案' },
    { id: 2, order: 'WO-0313-01', device: '配电柜B', type: '技术支援', expert: '电气工程师', initiator: '李明', time: '2024-03-13 17:00', status: '处理中', result: '远程指导接触器更换' },
])

const historyCases = ref([
    { id: 1, device: '水泵', fault: '轴承损坏', solution: '更换SKF轴承+对中校准', duration: '4h', parts: '轴承×2', times: 5 },
    { id: 2, device: '格栅机', fault: '链条断裂', solution: '更换不锈钢链条+张紧调整', duration: '3h', parts: '链条1条', times: 3 },
    { id: 3, device: '电机', fault: '绝缘击穿', solution: '重绕线圈/更换电机', duration: '8h', parts: '绝缘材料', times: 2 },
    { id: 4, device: '阀门', fault: '密封失效', solution: '更换密封垫+研磨阀座', duration: '2h', parts: '密封垫×2', times: 4 },
])

const acceptItems = ref([
    { id: 1, order: 'WO-0312-01', device: '流量计FL-03', assignee: '刘芳', completed: '2024-03-12 16:00', result: '校准完成/精度恢复', photos: 3, status: '已通过' },
    { id: 2, order: 'WO-0313-01', device: '配电柜B', assignee: '李明', completed: '2024-03-14 10:00', result: '接触器已更换/测试通过', photos: 4, status: '待验收' },
])

const feedbacks = ref([
    { id: 1, order: 'WO-0312-01', reporter: '刘芳', assignee: '赵刚', score: 5, comment: '维修及时，专业技术好', time: '2024-03-12 17:00' },
    { id: 2, order: 'WO-0310-02', reporter: '张伟', assignee: '王强', score: 4, comment: '处理效果好，响应略慢', time: '2024-03-11 15:00' },
])

const reworks = ref([
    { id: 1, order: 'WO-0308-01', device: '阀门DN200', reason: '维修后仍有轻微渗漏', reworkOrder: 'RW-0310-01', assignee: '赵刚', status: '已完成' },
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

        <template v-if="activeFunc === 'consult'">
            <div class="flex items-center gap-2 mb-1">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">会商与技术支援</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">工单</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">专家</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">发起人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in consultRequests" :key="c.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-bold">{{ c.order }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ c.device }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="c.type === '多方会商' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{
                                    c.type }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ c.expert }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ c.initiator }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="c.status === '已完成' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'">{{
                                    c.status }}</span></td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ c.result }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'cases'">
            <div class="flex items-center gap-2 mb-1">
                <BookOpen class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">历史案例库</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div v-for="c in historyCases" :key="c.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                            c.device }} — {{ c.fault }}</span><span class="text-[10px] text-dim">{{ c.times }}次</span>
                    </div>
                    <div class="space-y-1 text-[10px]">
                        <p class="text-default">
                            <Wrench class="w-3 h-3 inline text-primary mr-1" />{{ c.solution }}
                        </p>
                        <p class="text-dim">⏱ {{ c.duration }} · 🔧 {{ c.parts }}</p>
                    </div>
                    <button @click="toast?.show('已关联至当前工单', 'success')"
                        class="mt-2 flex items-center gap-0.5 text-[10px] text-primary hover:underline cursor-pointer">
                        <Link class="w-3 h-3" />关联工单
                    </button>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'accept'">
            <div class="flex items-center gap-2 mb-1">
                <CheckCircle class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">在线验收</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">工单</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">维修人</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">维修结果</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">照片</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in acceptItems" :key="a.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-bold">{{ a.order }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ a.device }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ a.assignee }}</td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ a.result }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ a.photos }}张</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="a.status === '已通过' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                    a.status }}</span></td>
                            <td class="text-center px-2 py-2.5"><button v-if="a.status === '待验收'"
                                    @click="toast?.show('验收通过', 'success')"
                                    class="text-[10px] text-primary hover:underline cursor-pointer">验收</button><span
                                    v-else class="text-[10px] text-dim">-</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'feedback'">
            <div class="flex items-center gap-2 mb-1">
                <Star class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">满意度评价</span>
            </div>
            <div class="space-y-3">
                <div v-for="f in feedbacks" :key="f.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-primary">{{
                            f.order }}</span>
                        <div class="flex gap-0.5"><span v-for="i in 5" :key="i" class="text-sm"
                                :class="i <= f.score ? 'text-warning' : 'text-surface'">★</span></div>
                    </div>
                    <p class="text-[10px] text-default mb-1">{{ f.comment }}</p>
                    <p class="text-[10px] text-dim">评价人: {{ f.reporter }} → 维修人: {{ f.assignee }} · {{ f.time }}</p>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'rework'">
            <div class="flex items-center gap-2 mb-1">
                <RotateCcw class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">返修管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">原工单</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">返修原因</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">返修工单</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负责人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in reworks" :key="r.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-dim">{{ r.order }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.device }}</td>
                            <td class="px-2 py-2.5 text-default">{{ r.reason }}</td>
                            <td class="text-center px-2 py-2.5 text-danger font-bold">{{ r.reworkOrder }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.assignee }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-success/10 text-success">{{
                                    r.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
