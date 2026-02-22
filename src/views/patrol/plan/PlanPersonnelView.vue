<script setup lang="ts">
import { ref } from 'vue'
import { Users, Calendar, Plus, Pencil, Trash2 } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'
const activeFunc = ref('personnel')
const funcTabs = [
    { key: 'personnel', label: '人员信息管理' },
    { key: 'schedule', label: '排班管理' },
]

// 人员
const personnel = ref([
    { id: 'PS-001', name: '张伟', team: 'A班', role: '巡查组长', phone: '138****1001', cert: '管道工/中级', skills: '管网巡检/CCTV操作', status: 'active' },
    { id: 'PS-002', name: '李明', team: 'A班', role: '巡查员', phone: '138****1002', cert: '管道工/初级', skills: '管网巡检/数据记录', status: 'active' },
    { id: 'PS-003', name: '王强', team: 'B班', role: '巡查组长', phone: '138****1003', cert: '管道工/高级', skills: '管网巡检/应急处置/CCTV', status: 'active' },
    { id: 'PS-004', name: '赵刚', team: 'B班', role: '巡查员', phone: '138****1004', cert: '管道工/初级', skills: '管网巡检', status: 'on_leave' },
    { id: 'PS-005', name: '刘芳', team: 'C班', role: '巡查组长', phone: '138****1005', cert: '管道工/中级', skills: '水质检测/管网巡检', status: 'active' },
    { id: 'PS-006', name: '陈亮', team: 'C班', role: '巡查员', phone: '138****1006', cert: '管道工/初级', skills: '管网巡检/排口检查', status: 'active' },
])

// 排班
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const schedules = ref([
    { team: 'A班', members: '张伟、李明', days: [true, true, true, false, false, true, false], shift: '白班 08:00-17:00' },
    { team: 'B班', members: '王强、赵刚', days: [false, false, true, true, true, false, true], shift: '白班 08:00-17:00' },
    { team: 'C班', members: '刘芳、陈亮', days: [true, false, false, true, true, true, false], shift: '白班 08:00-17:00' },
    { team: '应急组', members: '张伟、王强', days: [false, false, false, false, false, false, false], shift: '轮值 24小时待命' },
])

const adjustments = ref([
    { id: 'ADJ-001', from: '赵刚(B班)', to: '陈亮(C班)', date: '2024-03-15', reason: '赵刚请假，陈亮顶班', operator: '王主管', time: '2024-03-14 16:00' },
    { id: 'ADJ-002', from: '李明(A班)', to: '刘芳(C班)', date: '2024-03-10', reason: '李明培训，刘芳顶班', operator: '张主管', time: '2024-03-09 09:00' },
])

function getStatusColor(s: string) { return s === 'active' ? 'text-success' : s === 'on_leave' ? 'text-warning' : 'text-dim' }
function getStatusText(s: string) { return s === 'active' ? '在岗' : s === 'on_leave' ? '请假' : '离岗' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                    class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                        ft.label }}</button>
            </div>
            <button v-if="activeFunc === 'personnel'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" />新增人员
            </button>
        </div>

        <!-- 人员 -->
        <div v-if="activeFunc === 'personnel'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">巡查人员台账</span>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">工号</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">姓名</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">班组</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">岗位</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">资质</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">技能</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in personnel" :key="p.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-primary font-mono">{{ p.id }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ p.name }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ p.team }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ p.role }}</td>
                        <td class="px-4 py-2.5 text-default">{{ p.cert }}</td>
                        <td class="px-4 py-2.5 text-dim">{{ p.skills }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] font-medium"
                                :class="getStatusColor(p.status)">{{ getStatusText(p.status) }}</span></td>
                        <td class="text-center px-4 py-2.5">
                            <div class="flex items-center justify-center gap-1"><button
                                    class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Pencil class="w-3 h-3 text-dim" />
                                </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Trash2 class="w-3 h-3 text-danger" />
                                </button></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 排班 -->
        <template v-if="activeFunc === 'schedule'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">本周排班表</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">班组</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">成员</th>
                            <th v-for="d in weekDays" :key="d" class="text-center px-2 py-2.5 text-dim font-medium">{{ d
                            }}</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">班次</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in schedules" :key="s.team"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-bold">{{ s.team }}</td>
                            <td class="px-4 py-2.5 text-default">{{ s.members }}</td>
                            <td v-for="(d, i) in s.days" :key="i" class="text-center px-2 py-2.5"><span
                                    class="w-5 h-5 rounded-full inline-flex items-center justify-center text-[8px] font-bold"
                                    :class="d ? 'bg-primary text-white' : 'bg-surface text-dim'">{{ d ? '✓' : '—'
                                    }}</span></td>
                            <td class="px-4 py-2.5 text-dim">{{ s.shift }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <span class="text-xs font-semibold text-default">调班/换班记录</span>
                    <button class="text-[10px] text-primary hover:underline cursor-pointer">+ 新增调班</button>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="a in adjustments" :key="a.id"
                        class="p-3 rounded-lg bg-surface flex items-center justify-between">
                        <div class="text-[10px]"><span class="text-default font-medium">{{ a.from }}</span><span
                                class="text-dim mx-1.5">→</span><span class="text-default font-medium">{{ a.to
                                }}</span><span class="text-dim ml-2">{{ a.date }}</span></div>
                        <div class="text-[10px] text-dim">{{ a.reason }} · {{ a.operator }}</div>
                    </div>
                </div>
            </div>
        </template>
        <ToastNotify ref="toast" />
    </div>
</template>
