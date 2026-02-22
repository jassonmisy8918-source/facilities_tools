<script setup lang="ts">
import { ref } from 'vue'
import { Search, Download, Printer, FileText, Eye } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'

const activeFunc = ref('query')
const funcTabs = [
    { key: 'query', label: '事件记录查询' },
    { key: 'report', label: '报告生成' },
]

const events = ref([
    { id: 'EM-2024-001', name: '丰台区暴雨内涝', type: '自然灾害', level: 'I级', startTime: '2024-03-15 06:00', endTime: '2024-03-15 09:30', duration: '3.5小时', status: 'resolved', location: '丰台区南苑路', handler: '应急组A', result: '排水完成，道路恢复通行', measures: '启动3台泵车排水，设置10处沙袋围挡', casualties: 0, loss: '轻微' },
    { id: 'EM-2024-002', name: '通州区管网冒溢', type: '设施故障', level: 'II级', startTime: '2024-03-10 14:30', endTime: '2024-03-10 16:20', duration: '1.8小时', status: 'resolved', location: '通州区运河大道', handler: '抢修组B', result: '管道疏通，恢复正常排水', measures: '现场围挡+高压清洗+管道检测', casualties: 0, loss: '无' },
    { id: 'EM-2024-003', name: '西城区水质异常', type: '环境事件', level: 'II级', startTime: '2024-03-05 10:00', endTime: '2024-03-05 14:00', duration: '4小时', status: 'resolved', location: '西城区清河段', handler: '检测组C', result: '确认混接源头，临时封堵', measures: '水质采样+溯源排查+临时封堵混接管', casualties: 0, loss: '无' },
    { id: 'EM-2024-004', name: '海淀区泵站停电', type: '设施故障', level: 'III级', startTime: '2024-02-28 22:00', endTime: '2024-02-28 23:15', duration: '1.3小时', status: 'resolved', location: '海淀区中关村泵站', handler: '运维组D', result: '发电机启动，供电恢复后切回', measures: '发电机应急供电+电力部门协调', casualties: 0, loss: '无' },
])

const searchKeyword = ref('')
const typeFilter = ref('all')
const levelFilter = ref('all')

const showDetail = ref(false)
const detailEvent = ref<typeof events.value[0] | null>(null)
function viewEvent(e: typeof events.value[0]) { detailEvent.value = e; showDetail.value = true }

// 报告
const reportEvents = ref([
    { id: 'EM-2024-001', name: '丰台区暴雨内涝', generated: true, reportDate: '2024-03-16' },
    { id: 'EM-2024-002', name: '通州区管网冒溢', generated: true, reportDate: '2024-03-11' },
    { id: 'EM-2024-003', name: '西城区水质异常', generated: false, reportDate: '' },
    { id: 'EM-2024-004', name: '海淀区泵站停电', generated: true, reportDate: '2024-03-01' },
])

function getLevelColor(l: string) { return l === 'I级' ? 'bg-danger/10 text-danger' : l === 'II级' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <!-- 查询 -->
        <template v-if="activeFunc === 'query'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3">
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                        v-model="searchKeyword" placeholder="搜索事件..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                </div>
                <select v-model="typeFilter"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部类型</option>
                    <option>自然灾害</option>
                    <option>设施故障</option>
                    <option>环境事件</option>
                </select>
                <select v-model="levelFilter"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部等级</option>
                    <option>I级</option>
                    <option>II级</option>
                    <option>III级</option>
                </select>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-3 py-2.5 text-dim font-medium">事件名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">地点</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">耗时</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">处置人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in events" :key="e.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ e.id }}</td>
                            <td class="px-3 py-2.5 text-default font-medium">{{ e.name }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ e.type }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-bold"
                                    :class="getLevelColor(e.level)">{{ e.level }}</span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ e.location }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ e.duration }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ e.handler }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">已处置</span>
                            </td>
                            <td class="text-center px-2 py-2.5"><button @click="viewEvent(e)"
                                    class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Eye class="w-3 h-3 text-primary" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 报告 -->
        <template v-if="activeFunc === 'report'">
            <div class="space-y-3">
                <div v-for="r in reportEvents" :key="r.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <FileText class="w-5 h-5" :class="r.generated ? 'text-success' : 'text-dim'" />
                        <div>
                            <p class="text-xs font-bold text-default">{{ r.name }}</p>
                            <p class="text-[10px] text-dim">{{ r.id }}{{ r.generated ? ' · 生成日期: ' + r.reportDate : ''
                                }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                            :class="r.generated ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                r.generated ? '已生成' : '待生成' }}</span>
                        <button v-if="!r.generated"
                            class="px-3 py-1 bg-primary text-white rounded text-[10px] font-medium hover:bg-primary-light cursor-pointer">生成报告</button>
                        <template v-else>
                            <button class="p-1.5 rounded hover:bg-hover-themed cursor-pointer">
                                <Eye class="w-3.5 h-3.5 text-primary" />
                            </button>
                            <button class="p-1.5 rounded hover:bg-hover-themed cursor-pointer">
                                <Download class="w-3.5 h-3.5 text-dim" />
                            </button>
                            <button class="p-1.5 rounded hover:bg-hover-themed cursor-pointer">
                                <Printer class="w-3.5 h-3.5 text-dim" />
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </template>

        <ModalDialog :show="showDetail" title="事件详情" @close="showDetail = false" @confirm="showDetail = false">
            <div v-if="detailEvent" class="space-y-3 text-xs">
                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">编号</p>
                        <p class="text-default font-bold mt-0.5">{{ detailEvent.id }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">事件名称</p>
                        <p class="text-default font-bold mt-0.5">{{ detailEvent.name }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">类型 / 等级</p>
                        <p class="text-default mt-0.5">{{ detailEvent.type }} / {{ detailEvent.level }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">地点</p>
                        <p class="text-default mt-0.5">{{ detailEvent.location }}</p>
                    </div>
                    <div class="col-span-2 p-3 rounded-lg bg-surface">
                        <p class="text-dim">处置措施</p>
                        <p class="text-default mt-0.5">{{ detailEvent.measures }}</p>
                    </div>
                    <div class="col-span-2 p-3 rounded-lg bg-surface">
                        <p class="text-dim">处置结果</p>
                        <p class="text-default mt-0.5">{{ detailEvent.result }}</p>
                    </div>
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
