<script setup lang="ts">
import { ref } from 'vue'
import { ClipboardCheck, Send, Users, Camera, CheckCircle } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('plan')
const funcTabs = [
    { key: 'plan', label: '巡检计划' },
    { key: 'assign', label: '任务分配' },
    { key: 'result', label: '巡检结果' },
    { key: 'tracking', label: '闭环跟踪' },
]

// ── 巡检计划 ──
const inspPlans = ref([
    { id: 1, name: '雨花泵站周巡检', station: '雨花泵站', cycle: '每周', items: '水泵/电机/阀门/仪表', route: 'A区→B区→配电室', owner: '张伟', status: '已发布', nextDate: '2024-03-18' },
    { id: 2, name: '侯家塘泵站月巡检', station: '侯家塘泵站', cycle: '每月', items: '全设备', route: '进水口→泵房→出水口', owner: '李明', status: '已发布', nextDate: '2024-04-01' },
    { id: 3, name: '黎托泵站日巡检', station: '黎托泵站', cycle: '每日', items: '水泵运行状态/水位', route: '泵房→前池→后池', owner: '赵刚', status: '待审核', nextDate: '2024-03-16' },
])

// ── 任务分配 ──
const inspTasks = ref([
    { id: 1, plan: '雨花泵站周巡检', assignee: '张伟', skill: '机电', workload: 3, date: '2024-03-18', status: '待执行', method: '自动' },
    { id: 2, plan: '侯家塘泵站月巡检', assignee: '李明', skill: '综合', workload: 2, date: '2024-04-01', status: '待执行', method: '手动' },
    { id: 3, plan: '黎托泵站日巡检', assignee: '赵刚', skill: '水泵', workload: 5, date: '2024-03-16', status: '执行中', method: '自动' },
    { id: 4, plan: '雨花泵站周巡检', assignee: '刘芳', skill: '仪表', workload: 2, date: '2024-03-18', status: '待执行', method: '自动' },
])

// ── 巡检结果 ──
const inspResults = ref([
    { id: 1, plan: '黎托泵站日巡检', inspector: '赵刚', date: '2024-03-15', items: 8, normal: 7, issue: 1, issueDesc: '3号泵异响', photos: 3, status: '已提交' },
    { id: 2, plan: '雨花泵站周巡检', inspector: '张伟', date: '2024-03-11', items: 15, normal: 15, issue: 0, issueDesc: '-', photos: 5, status: '已审核' },
    { id: 3, plan: '侯家塘泵站月巡检', inspector: '李明', date: '2024-03-01', items: 22, normal: 20, issue: 2, issueDesc: '阀门渗漏/仪表偏差', photos: 8, status: '已审核' },
])

// ── 闭环跟踪 ──
const trackingItems = ref([
    { id: 1, source: '黎托泵站日巡检', issue: '3号泵异响', level: '一般', findDate: '2024-03-15', measure: '更换轴承', executor: '王强', deadline: '2024-03-20', status: '整改中', progress: 60 },
    { id: 2, source: '侯家塘泵站月巡检', issue: '阀门渗漏', level: '重要', findDate: '2024-03-01', measure: '更换密封垫', executor: '赵刚', deadline: '2024-03-10', status: '已闭环', progress: 100 },
    { id: 3, source: '侯家塘泵站月巡检', issue: '仪表偏差', level: '一般', findDate: '2024-03-01', measure: '重新校准', executor: '刘芳', deadline: '2024-03-08', status: '已闭环', progress: 100 },
])

function planStatusClass(s: string) { return s === '已发布' ? 'bg-success/10 text-success' : s === '待审核' ? 'bg-warning/10 text-warning' : 'bg-surface text-dim' }
function taskStatusClass(s: string) { return s === '执行中' ? 'bg-primary/10 text-primary' : s === '待执行' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success' }

const showPublishPlan = ref(false)
const publishForm = ref({ name: '', station: '', cycle: '每周', items: '', owner: '' })
function openPublishPlan() { publishForm.value = { name: '', station: '', cycle: '每周', items: '', owner: '' }; showPublishPlan.value = true }
function doPublishPlan() { showPublishPlan.value = false; toast.value?.show('巡检计划已发布', 'success') }
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

        <!-- 巡检计划 -->
        <template v-if="activeFunc === 'plan'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <ClipboardCheck class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">巡检计划管理</span>
                </div>
                <button @click="openPublishPlan()"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Send class="w-3.5 h-3.5" />发布计划
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">计划名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">周期</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">巡检内容</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">责任人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">下次执行</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in inspPlans" :key="p.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.name }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.station }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ p.cycle }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ p.items }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.owner }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ p.nextDate }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="planStatusClass(p.status)">{{ p.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 任务分配 -->
        <template v-if="activeFunc === 'assign'">
            <div class="flex items-center gap-2 mb-1">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">巡检任务分配</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">关联计划</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">巡检人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">技能</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">当前工作量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">分配方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in inspTasks" :key="t.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ t.plan }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ t.assignee }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ t.skill }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-primary font-bold">{{ t.workload
                            }}</span> 任务</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ t.date }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="t.method === '自动' ? 'bg-info/10 text-info' : 'bg-surface text-dim'">{{
                                        t.method }}</span></td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="taskStatusClass(t.status)">{{ t.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 巡检结果 -->
        <template v-if="activeFunc === 'result'">
            <div class="flex items-center gap-2 mb-1">
                <Camera class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">巡检结果记录</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">关联计划</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">巡检人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">检查项</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">正常</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">异常</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">问题描述</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">照片</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in inspResults" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.plan }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.inspector }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.date }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.items }}</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ r.normal }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="r.issue > 0 ? 'text-danger' : 'text-success'">{{ r.issue }}</td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ r.issueDesc }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ r.photos }}张</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="r.status === '已审核' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'">{{
                                        r.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 闭环跟踪 -->
        <template v-if="activeFunc === 'tracking'">
            <div class="flex items-center gap-2 mb-1">
                <CheckCircle class="w-4 h-4 text-success" /><span
                    class="text-sm font-semibold text-default">巡检闭环跟踪</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">来源</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">问题</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">整改措施</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">执行人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">期限</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in trackingItems" :key="t.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default text-[10px]">{{ t.source }}</td>
                            <td class="px-2 py-2.5 text-default font-medium">{{ t.issue }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="t.level === '重要' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">{{
                                        t.level }}</span></td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ t.measure }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ t.executor }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ t.deadline }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="t.progress === 100 ? 'bg-success' : 'bg-primary'"
                                            :style="{ width: t.progress + '%' }"></div>
                                    </div><span class="text-[10px] text-dim">{{ t.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="t.status === '已闭环' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'">{{
                                        t.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 发布计划弹窗 -->
        <ModalDialog :show="showPublishPlan" title="发布巡检计划" @close="showPublishPlan = false" @confirm="doPublishPlan">
            <div class="space-y-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">计划名称</label>
                    <input v-model="publishForm.name" type="text" placeholder="如 雨花泵站周巡检"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">泵站</label>
                        <input v-model="publishForm.station" type="text" placeholder="如 雨花泵站"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">巡检周期</label>
                        <select v-model="publishForm.cycle"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                            <option>每日</option>
                            <option>每周</option>
                            <option>每月</option>
                            <option>每季</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">巡检内容</label>
                    <input v-model="publishForm.items" type="text" placeholder="如 水泵/电机/阀门/仪表"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">责任人</label>
                    <input v-model="publishForm.owner" type="text" placeholder="请输入责任人"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
