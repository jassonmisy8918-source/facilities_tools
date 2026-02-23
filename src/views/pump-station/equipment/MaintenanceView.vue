<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Calendar, ClipboardList } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('template')
const funcTabs = [
    { key: 'template', label: '保养模板' },
    { key: 'plan', label: '保养计划' },
    { key: 'record', label: '保养记录' },
]

const templates = ref([
    { id: 1, type: '离心泵', items: ['轴承润滑', '密封检查', '叶轮清洗', '振动检测'], cycle: '每季度', hours: 4 },
    { id: 2, type: '电机', items: ['绝缘测量', '轴承温检', '接线紧固', '风扇清洁'], cycle: '每半年', hours: 2 },
    { id: 3, type: '阀门', items: ['阀体检查', '密封研磨', '执行机构润滑'], cycle: '每年', hours: 3 },
    { id: 4, type: '格栅机', items: ['齿耙清洗', '链条润滑', '减速机检查'], cycle: '每月', hours: 2 },
])

const plans = ref([
    { id: 1, device: '1号水泵', station: '雨花泵站', tpl: '离心泵', date: '2024-03-25', assignee: '王强', auto: true, status: '待执行' },
    { id: 2, device: '主电机', station: '侯家塘泵站', tpl: '电机', date: '2024-06-15', assignee: '赵刚', auto: true, status: '已排期' },
    { id: 3, device: '格栅机', station: '左家塘泵站', tpl: '格栅机', date: '2024-04-05', assignee: '李明', auto: true, status: '待执行' },
])

const records = ref([
    { id: 1, device: '1号水泵', station: '雨花泵站', date: '2024-01-10', duration: '3.5h', operator: '王强', items: '轴承润滑/密封检查', parts: '轴承×2, 密封圈×4', result: '正常' },
    { id: 2, device: '主电机', station: '侯家塘泵站', date: '2023-12-20', duration: '2h', operator: '赵刚', items: '绝缘测量/接线紧固', parts: '-', result: '正常' },
    { id: 3, device: '格栅机', station: '左家塘泵站', date: '2024-02-15', duration: '2.5h', operator: '李明', items: '齿耙清洗/链条润滑', parts: '润滑油5L', result: '链条磨损' },
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

        <template v-if="activeFunc === 'template'">
            <div class="flex items-center gap-2 mb-1">
                <FileText class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">保养模板</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div v-for="t in templates" :key="t.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        t.type }}</span><span class="text-[10px] text-primary font-bold">{{ t.cycle }} · {{ t.hours
                            }}h</span></div>
                    <div class="flex gap-1 flex-wrap"><span v-for="item in t.items" :key="item"
                            class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ item }}</span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'plan'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">保养计划</span>
                </div>
                <button @click="toast?.show('自动生成计划', 'success')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Calendar class="w-3.5 h-3.5" />自动生成
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">模板</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负责人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in plans" :key="p.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.station }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ p.tpl }}</td>
                            <td class="text-center px-2 py-2.5 text-info font-bold">{{ p.date }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.assignee }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="p.auto ? 'bg-info/10 text-info' : 'bg-surface text-dim'">{{ p.auto ? '自动' :
                                        '手动' }}</span></td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="p.status === '待执行' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                        p.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'record'">
            <div class="flex items-center gap-2 mb-1">
                <ClipboardList class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">保养记录</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时长</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">项目</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">配件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in records" :key="r.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.station }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.date }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ r.duration }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.operator }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ r.items }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ r.parts }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="r.result === '正常' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                        r.result }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
