<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Pencil, Trash2, Download, Printer, BarChart3, FileText } from 'lucide-vue-next'

const activeFunc = ref('templates')
const funcTabs = [
    { key: 'templates', label: '工单模板' },
    { key: 'reports', label: '统计报告' },
]

// 模板
const templates = ref([
    { id: 'WT-001', name: '主干管网例行巡查工单', type: '例行', scope: '主干管网', points: 15, items: 12, estimateTime: '3.5小时', usedCount: 32, lastUsed: '2024-03-01' },
    { id: 'WT-002', name: '排口月度巡查工单', type: '例行', scope: '排口设施', points: 10, items: 8, estimateTime: '2小时', usedCount: 24, lastUsed: '2024-03-01' },
    { id: 'WT-003', name: '暴雨应急巡查工单', type: '应急', scope: '低洼/泵站', points: 8, items: 6, estimateTime: '1.5小时', usedCount: 5, lastUsed: '2024-03-15' },
    { id: 'WT-004', name: '管线异常排查工单', type: '临时', scope: '指定区域', points: 5, items: 10, estimateTime: '2小时', usedCount: 12, lastUsed: '2024-03-14' },
    { id: 'WT-005', name: '问题复查确认工单', type: '复查', scope: '整改点位', points: 3, items: 5, estimateTime: '1小时', usedCount: 18, lastUsed: '2024-03-10' },
])

// 报告
const reports = ref([
    { period: '2024年3月', total: 28, completed: 22, completionRate: 78.6, avgTime: '2.8小时', overdue: 2, overdueRate: 7.1, issues: 8, critical: 1 },
    { period: '2024年2月', total: 25, completed: 24, completionRate: 96.0, avgTime: '2.5小时', overdue: 1, overdueRate: 4.0, issues: 5, critical: 0 },
    { period: '2024年1月', total: 20, completed: 20, completionRate: 100.0, avgTime: '2.3小时', overdue: 0, overdueRate: 0, issues: 3, critical: 0 },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <!-- 模板 -->
        <div v-if="activeFunc === 'templates'" class="grid grid-cols-2 gap-3">
            <div v-for="t in templates" :key="t.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        t.name }}</span><span
                        class="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{{ t.type
                        }}</span></div>
                <div class="grid grid-cols-2 gap-y-1 text-[10px] mb-3">
                    <div><span class="text-dim">范围: </span><span class="text-default">{{ t.scope }}</span></div>
                    <div><span class="text-dim">巡查点: </span><span class="text-default">{{ t.points }}个</span></div>
                    <div><span class="text-dim">检查项: </span><span class="text-default">{{ t.items }}项</span></div>
                    <div><span class="text-dim">预计耗时: </span><span class="text-default">{{ t.estimateTime }}</span>
                    </div>
                    <div><span class="text-dim">使用次数: </span><span class="text-primary font-bold">{{ t.usedCount
                            }}</span></div>
                    <div><span class="text-dim">最近使用: </span><span class="text-default">{{ t.lastUsed }}</span></div>
                </div>
                <div class="flex items-center gap-1 pt-2 border-t border-themed/30">
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer" title="使用模板">
                        <Copy class="w-3 h-3 text-primary" />
                    </button>
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                        <Pencil class="w-3 h-3 text-dim" />
                    </button>
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                        <Trash2 class="w-3 h-3 text-danger" />
                    </button>
                </div>
            </div>
        </div>

        <!-- 统计报告 -->
        <template v-if="activeFunc === 'reports'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <BarChart3 class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">工单统计报告</span>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        class="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed transition-colors cursor-pointer">
                        <Download class="w-3.5 h-3.5" />导出
                    </button>
                    <button
                        class="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed transition-colors cursor-pointer">
                        <Printer class="w-3.5 h-3.5" />打印
                    </button>
                </div>
            </div>
            <div class="space-y-3">
                <div v-for="r in reports" :key="r.period"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <FileText class="w-4 h-4 text-info" /><span class="text-xs font-bold text-default">{{
                                r.period }} 工单统计</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 gap-3 mb-3">
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-default">{{ r.total }}</p>
                            <p class="text-[10px] text-dim">总工单</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-success">{{ r.completed }}</p>
                            <p class="text-[10px] text-dim">已完成</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold"
                                :class="r.completionRate >= 90 ? 'text-success' : r.completionRate >= 70 ? 'text-warning' : 'text-danger'">
                                {{ r.completionRate }}%</p>
                            <p class="text-[10px] text-dim">完成率</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-info">{{ r.avgTime }}</p>
                            <p class="text-[10px] text-dim">平均耗时</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-4 gap-3">
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold" :class="r.overdue > 0 ? 'text-danger' : 'text-success'">{{
                                r.overdue }}</p>
                            <p class="text-[10px] text-dim">超时工单</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold" :class="r.overdueRate > 5 ? 'text-danger' : 'text-success'">{{
                                r.overdueRate }}%</p>
                            <p class="text-[10px] text-dim">超时率</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold text-warning">{{ r.issues }}</p>
                            <p class="text-[10px] text-dim">上报问题</p>
                        </div>
                        <div class="p-3 rounded-lg bg-surface text-center">
                            <p class="text-lg font-bold" :class="r.critical > 0 ? 'text-danger' : 'text-success'">{{
                                r.critical }}</p>
                            <p class="text-[10px] text-dim">严重问题</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
