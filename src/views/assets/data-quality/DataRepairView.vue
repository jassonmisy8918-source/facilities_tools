<script setup lang="ts">
import { ref } from 'vue'
import {
    Layers, Unlink, Unplug, GitBranch, PenLine,
    RotateCcw, History, PlayCircle, CheckCircle, Clock, ArrowLeft
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 修复工具（7 个功能点）=====================
const repairTools = [
    { key: 'conflict', label: '图形冲突调整', icon: Layers, desc: '智能处理要素重叠、交叉等冲突', auto: true },
    { key: 'reconnect', label: '断连管线自动修复', icon: Unlink, desc: '自动连接存在微小间隙的相邻管线', auto: true },
    { key: 'isolated', label: '孤立要素自动处理', icon: Unplug, desc: '将孤立井/管关联至主干管网', auto: true },
    { key: 'topology', label: '拓扑一致性自动修正', icon: GitBranch, desc: '批量修复管线节点连接错误', auto: true },
    { key: 'manual', label: '手动图形编辑工具集', icon: PenLine, desc: '绘图、移动、裁剪、延伸等工具', auto: false },
    { key: 'rollback', label: '修复过程记录与回滚', icon: RotateCcw, desc: '记录操作步骤，支持回滚', auto: false },
    { key: 'version', label: '数据版本回溯', icon: History, desc: '按时间点回溯至历史版本', auto: false },
]
const activeTool = ref('')

// ===================== 修复任务队列 =====================
const repairTasks = ref([
    { id: 1, type: '图形冲突', target: '朝阳区 管段重叠 12 处', status: 'completed', time: '2024-03-15 09:45', fixed: 12 },
    { id: 2, type: '断连管线', target: '海淀区 断连管线 8 段', status: 'completed', time: '2024-03-15 10:12', fixed: 7 },
    { id: 3, type: '孤立要素', target: '西城区 孤立检查井 5 座', status: 'running', time: '2024-03-15 11:00', fixed: 3 },
    { id: 4, type: '拓扑修正', target: '全域 节点连接错误 23 处', status: 'pending', time: '-', fixed: 0 },
])

// ===================== 版本历史 =====================
const versionHistory = ref([
    { version: 'v2024.03.15.002', time: '2024-03-15 10:30', author: '张三', changes: '修复朝阳区管网拓扑 +12', type: 'auto' },
    { version: 'v2024.03.15.001', time: '2024-03-15 09:50', author: '系统', changes: '批量修复图形冲突 +12', type: 'auto' },
    { version: 'v2024.03.14.003', time: '2024-03-14 16:20', author: '李四', changes: '手动编辑海淀区管线 +3', type: 'manual' },
    { version: 'v2024.03.14.002', time: '2024-03-14 14:30', author: '系统', changes: '断连管线自动修复 +7', type: 'auto' },
    { version: 'v2024.03.14.001', time: '2024-03-14 10:00', author: '王五', changes: '孤立设施关联 +5', type: 'manual' },
])

function runRepairTool(key: string) {
    activeTool.value = key
    const tool = repairTools.find(t => t.key === key)
    if (tool?.auto) {
        toast.value?.show(`${tool.label}执行中...`, 'info')
    } else {
        toast.value?.show(`${tool?.label}工具已激活`, 'info')
    }
}

function getStatusClass(s: string) {
    if (s === 'completed') return 'bg-success/15 text-success'
    if (s === 'running') return 'bg-primary/15 text-primary'
    return 'bg-surface text-dim'
}
function getStatusText(s: string) {
    if (s === 'completed') return '已完成'
    if (s === 'running') return '执行中'
    return '待执行'
}

function rollbackVersion(v: string) { toast.value?.show(`正在回滚至 ${v}...`, 'warning') }
</script>

<template>
    <div class="space-y-4">
        <!-- 修复工具卡片 -->
        <div class="grid grid-cols-4 gap-3">
            <button v-for="tool in repairTools.slice(0, 4)" :key="tool.key" @click="runRepairTool(tool.key)"
                class="bg-card border rounded-xl p-3 shadow-themed text-left transition-all cursor-pointer"
                :class="activeTool === tool.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
                <div class="flex items-center gap-2 mb-2">
                    <div class="p-1.5 rounded-lg" :class="activeTool === tool.key ? 'bg-primary/20' : 'bg-surface'">
                        <component :is="tool.icon" class="w-4 h-4"
                            :class="activeTool === tool.key ? 'text-primary' : 'text-dim'" />
                    </div>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-success/15 text-success">自动</span>
                </div>
                <p class="text-xs font-medium" :class="activeTool === tool.key ? 'text-primary' : 'text-default'">{{
                    tool.label }}</p>
                <p class="text-[10px] text-muted-themed mt-0.5">{{ tool.desc }}</p>
            </button>
        </div>
        <div class="grid grid-cols-3 gap-3">
            <button v-for="tool in repairTools.slice(4)" :key="tool.key" @click="runRepairTool(tool.key)"
                class="bg-card border rounded-xl p-3 shadow-themed text-left transition-all cursor-pointer"
                :class="activeTool === tool.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
                <div class="flex items-center gap-2 mb-2">
                    <div class="p-1.5 rounded-lg" :class="activeTool === tool.key ? 'bg-primary/20' : 'bg-surface'">
                        <component :is="tool.icon" class="w-4 h-4"
                            :class="activeTool === tool.key ? 'text-primary' : 'text-dim'" />
                    </div>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-info/15 text-info">手动</span>
                </div>
                <p class="text-xs font-medium" :class="activeTool === tool.key ? 'text-primary' : 'text-default'">{{
                    tool.label }}</p>
                <p class="text-[10px] text-muted-themed mt-0.5">{{ tool.desc }}</p>
            </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- 修复任务队列 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-1.5">
                        <PlayCircle class="w-4 h-4 text-primary" />修复任务
                    </h3>
                    <span class="text-[10px] text-muted-themed">{{ repairTasks.length }} 个任务</span>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="task in repairTasks" :key="task.id"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                                :class="task.status === 'running' ? 'bg-primary/15' : task.status === 'completed' ? 'bg-success/15' : 'bg-surface'">
                                <CheckCircle v-if="task.status === 'completed'" class="w-4 h-4 text-success" />
                                <PlayCircle v-else-if="task.status === 'running'"
                                    class="w-4 h-4 text-primary animate-pulse" />
                                <Clock v-else class="w-4 h-4 text-dim" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-default">{{ task.type }}</p>
                                <p class="text-[10px] text-muted-themed">{{ task.target }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(task.status)">{{
                                getStatusText(task.status) }}</span>
                            <p class="text-[10px] text-dim mt-1">修复 {{ task.fixed }} 项</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 版本历史 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-1.5">
                        <History class="w-4 h-4 text-primary" />数据版本回溯
                    </h3>
                </div>
                <div class="p-3 space-y-1">
                    <div v-for="v in versionHistory" :key="v.version"
                        class="flex items-center justify-between p-2.5 rounded-lg bg-surface hover:bg-hover-themed transition-colors group">
                        <div class="flex items-center gap-3">
                            <div class="w-1 h-8 rounded-full" :class="v.type === 'auto' ? 'bg-primary' : 'bg-warning'">
                            </div>
                            <div>
                                <p class="text-xs font-mono text-default">{{ v.version }}</p>
                                <p class="text-[10px] text-muted-themed">{{ v.changes }}</p>
                                <div class="flex items-center gap-2 text-[10px] text-dim mt-0.5">
                                    <span>{{ v.author }}</span>
                                    <span>{{ v.time }}</span>
                                </div>
                            </div>
                        </div>
                        <button @click="rollbackVersion(v.version)"
                            class="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-warning hover:text-warning/80 transition-all cursor-pointer">
                            <ArrowLeft class="w-3 h-3" />回滚
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
