<script setup lang="ts">
import { ref } from 'vue'
import { ClipboardList, Plus, GitMerge, Bell, ArrowRight, CheckCircle } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const activeFunc = ref('events')
const funcTabs = [
    { key: 'events', label: '事件单管理', icon: ClipboardList },
    { key: 'merge', label: '报警归并', icon: GitMerge },
    { key: 'notify', label: '发送通知', icon: Bell },
    { key: 'process', label: '流程处置', icon: ArrowRight },
]

// 事件单
const events = ref([
    { id: 'EVT-001', alarm: '万家丽路水位超限', level: 'critical', createTime: '2024-03-15 14:25', assignee: '张伟', status: 'handling', priority: '高' },
    { id: 'EVT-002', alarm: '侯家塘街道COD超标', level: 'warning', createTime: '2024-03-15 13:50', assignee: '李明', status: 'handling', priority: '高' },
    { id: 'EVT-003', alarm: '劳动路水位预警', level: 'warning', createTime: '2024-03-15 12:35', assignee: '王强', status: 'completed', priority: '中' },
    { id: 'EVT-004', alarm: '左家塘街道降雨增大', level: 'info', createTime: '2024-03-15 11:25', assignee: '系统', status: 'closed', priority: '低' },
])

// 归并记录
const mergeRecords = ref([
    { id: 'MRG-001', count: 3, alarms: '万家丽路#06、劳动路#02、韶山路#01 水位超限', reason: '同一降雨事件导致多点位水位超限', time: '2024-03-15 14:30', operator: '系统' },
    { id: 'MRG-002', count: 2, alarms: '黎托街道、左家塘街道雨量站降雨超限', reason: '同一气象系统影响区域', time: '2024-03-15 08:50', operator: '系统' },
])

// 通知记录
const notifications = ref([
    { id: 'NTF-001', event: 'EVT-001', content: '【紧急】万家丽路水位超限，请立即处理', receiver: '张伟、运维组', channel: '短信+APP', time: '2024-03-15 14:26', status: 'sent' },
    { id: 'NTF-002', event: 'EVT-002', content: '【严重】侯家塘街道进水口COD超标，需关注', receiver: '李明、水质组', channel: 'APP', time: '2024-03-15 13:51', status: 'sent' },
    { id: 'NTF-003', event: 'EVT-003', content: '【预警】劳动路水位接近警戒值', receiver: '王强', channel: 'APP', time: '2024-03-15 12:36', status: 'read' },
])

// 流程处置
const processes = ref([
    {
        id: 'EVT-001', alarm: '万家丽路水位超限', steps: [
            { step: '报警触发', time: '14:23', status: 'done', desc: '水位2.35m超限' },
            { step: '自动创建事件单', time: '14:25', status: 'done', desc: '系统自动创建' },
            { step: '通知责任人', time: '14:26', status: 'done', desc: '短信+APP推送至张伟' },
            { step: '现场处置', time: '14:40', status: 'active', desc: '张伟已到达现场，正在排查' },
            { step: '处置完成', time: '', status: 'pending', desc: '等待处置反馈' },
            { step: '事件关闭', time: '', status: 'pending', desc: '确认恢复正常后关闭' },
        ]
    },
    {
        id: 'EVT-003', alarm: '劳动路水位预警', steps: [
            { step: '报警触发', time: '12:30', status: 'done', desc: '水位1.85m达预警值' },
            { step: '创建事件单', time: '12:35', status: 'done', desc: '人工创建' },
            { step: '通知责任人', time: '12:36', status: 'done', desc: 'APP推送至王强' },
            { step: '现场处置', time: '12:50', status: 'done', desc: '开启泵站加速排水' },
            { step: '处置完成', time: '13:05', status: 'done', desc: '水位回落至1.6m' },
            { step: '事件关闭', time: '13:10', status: 'done', desc: '确认恢复正常' },
        ]
    },
])

function getStatusText(s: string) { return s === 'handling' ? '处置中' : s === 'completed' ? '已完成' : '已关闭' }
function getStatusColor(s: string) { return s === 'handling' ? 'text-warning' : s === 'completed' ? 'text-success' : 'text-dim' }
function getStepColor(s: string) { return s === 'done' ? 'bg-success' : s === 'active' ? 'bg-primary animate-pulse' : 'bg-[#2A3F54]' }
function getStepText(s: string) { return s === 'done' ? 'text-success' : s === 'active' ? 'text-primary' : 'text-dim' }

function createEvent() { toast.value?.show('事件单创建成功', 'success') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                    class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="ft.icon" class="w-3 h-3" />{{ ft.label }}
                </button>
            </div>
            <button v-if="activeFunc === 'events'" @click="createEvent"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" />创建事件单
            </button>
        </div>

        <!-- 事件单 -->
        <div v-if="activeFunc === 'events'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">关联报警</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">优先级</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">创建时间</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">责任人</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="e in events" :key="e.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-primary font-mono">{{ e.id }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ e.alarm }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="e.priority === '高' ? 'text-danger bg-danger/10' : e.priority === '中' ? 'text-warning bg-warning/10' : 'text-info bg-info/10'">{{
                                e.priority }}</span></td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ e.createTime }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ e.assignee }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] font-medium"
                                :class="getStatusColor(e.status)">{{ getStatusText(e.status) }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 归并 -->
        <div v-if="activeFunc === 'merge'" class="space-y-3">
            <div v-for="m in mergeRecords" :key="m.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <GitMerge class="w-4 h-4 text-info" /><span class="text-xs font-bold text-default">{{ m.id
                            }}</span><span class="text-[10px] px-2 py-0.5 rounded bg-info/10 text-info font-medium">合并
                            {{ m.count }} 条</span>
                    </div>
                    <span class="text-[10px] text-dim">{{ m.time }} · {{ m.operator }}</span>
                </div>
                <p class="text-xs text-default mb-1">{{ m.alarms }}</p>
                <p class="text-[11px] text-dim">归并原因: {{ m.reason }}</p>
            </div>
        </div>

        <!-- 通知 -->
        <div v-if="activeFunc === 'notify'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">事件</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">通知内容</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">接收人</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">渠道</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">发送时间</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="n in notifications" :key="n.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-primary font-mono text-[10px]">{{ n.event }}</td>
                        <td class="px-4 py-2.5 text-default">{{ n.content }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ n.receiver }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ n.channel }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ n.time }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] font-medium"
                                :class="n.status === 'sent' ? 'text-info' : n.status === 'read' ? 'text-success' : 'text-dim'">{{
                                    n.status === 'sent' ? '已发送' : n.status === 'read' ? '已读' : '待发送' }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 流程处置 -->
        <div v-if="activeFunc === 'process'" class="space-y-4">
            <div v-for="p in processes" :key="p.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-2 mb-4">
                    <CheckCircle class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">{{ p.id
                        }} — {{ p.alarm }}</span>
                </div>
                <div class="relative pl-6">
                    <div class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#1E3348]"></div>
                    <div v-for="(s, i) in p.steps" :key="i" class="relative mb-4 last:mb-0">
                        <div class="absolute -left-[17px] top-1 w-3.5 h-3.5 rounded-full border-2 border-card"
                            :class="getStepColor(s.status)"></div>
                        <div class="ml-2">
                            <div class="flex items-center gap-2"><span class="text-xs font-medium"
                                    :class="getStepText(s.status)">{{ s.step }}</span><span v-if="s.time"
                                    class="text-[10px] text-dim">{{ s.time }}</span></div>
                            <p class="text-[11px] text-dim mt-0.5">{{ s.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastNotify ref="toast" />
    </div>
</template>
