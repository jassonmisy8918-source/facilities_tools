<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Plus, Download, Settings, RefreshCw } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const reportType = ref('daily')
const reportTypes = [{ key: 'daily', label: '日报' }, { key: 'weekly', label: '周报' }, { key: 'monthly', label: '月报' }, { key: 'quarterly', label: '季报' }, { key: 'special', label: '专项' }]

const reports = ref([
    { id: 'RPT-001', name: '2024年3月日处理量报表', type: '日报', date: '2024-03-15', creator: '系统', status: 'completed', format: 'Excel', size: '256KB' },
    { id: 'RPT-002', name: '2024年Q1水质监测报告', type: '季报', date: '2024-03-10', creator: '张工', status: 'completed', format: 'PDF', size: '1.2MB' },
    { id: 'RPT-003', name: '2024年2月BOD/COD分析', type: '月报', date: '2024-03-01', creator: '系统', status: 'completed', format: 'Excel', size: '512KB' },
    { id: 'RPT-004', name: '暴雨事件应急监测报告', type: '专项', date: '2024-02-28', creator: '李工', status: 'completed', format: 'PDF', size: '2.1MB' },
    { id: 'RPT-005', name: '2024年3月流量异常分析', type: '专项', date: '2024-03-14', creator: '系统', status: 'generating', format: 'Excel', size: '—' },
    { id: 'RPT-006', name: '2024年第12周运行周报', type: '周报', date: '2024-03-17', creator: '系统', status: 'completed', format: 'PDF', size: '890KB' },
])

// 模板
const templates = ref([
    { id: 1, name: '日运行报表模板', type: '日报', metrics: '流量/水位/水质', auto: true },
    { id: 2, name: '月度综合分析模板', type: '月报', metrics: '全部指标+统计分析', auto: true },
    { id: 3, name: '水质超标报告模板', type: '专项', metrics: 'COD/pH/SS/氨氮', auto: false },
])

function handleGenerate() { toast.value?.show('报表生成中，请稍等...', 'info') }
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
            <!-- 报表生成 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Settings class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">生成报表</span>
                </div>
                <div class="p-4 space-y-3">
                    <div><label class="text-xs text-dim mb-1 block">报表类型</label>
                        <div class="flex flex-wrap gap-1">
                            <button v-for="t in reportTypes" :key="t.key" @click="reportType = t.key"
                                class="px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer"
                                :class="reportType === t.key ? 'bg-primary text-white' : 'bg-surface text-dim hover:text-default'">{{
                                t.label }}</button>
                        </div>
                    </div>
                    <div><label class="text-xs text-dim mb-1 block">报表名称</label><input
                            class="w-full bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary"
                            placeholder="自动生成或自定义" /></div>
                    <div><label class="text-xs text-dim mb-1 block">数据范围</label>
                        <div class="flex items-center gap-1.5"><input type="date" value="2024-03-01"
                                class="flex-1 bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" /><span
                                class="text-xs text-dim">至</span><input type="date" value="2024-03-15"
                                class="flex-1 bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                    <button @click="handleGenerate"
                        class="w-full py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                        <Plus class="w-3.5 h-3.5" />生成报表
                    </button>
                </div>
                <div class="px-4 py-3 border-t border-themed">
                    <p class="text-[10px] text-dim mb-2">报表模板</p>
                    <div class="space-y-1.5">
                        <div v-for="t in templates" :key="t.id"
                            class="p-2 rounded-lg bg-surface text-[10px] flex items-center justify-between">
                            <div>
                                <p class="text-default font-medium">{{ t.name }}</p>
                                <p class="text-dim mt-0.5">{{ t.type }} · {{ t.metrics }}</p>
                            </div>
                            <span v-if="t.auto" class="text-success text-[9px]">自动</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 报表列表 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <FileText class="w-4 h-4 text-primary" /><span
                            class="text-sm font-semibold text-default">已生成报表</span><span
                            class="text-xs text-muted-themed">({{ reports.length }})</span>
                    </div>
                    <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                        <RefreshCw class="w-3.5 h-3.5 text-dim" />
                    </button>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">报表名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">格式</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">大小</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">创建日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in reports" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-primary font-mono">{{ r.id }}</td>
                            <td class="px-4 py-2.5 text-default font-medium">{{ r.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ r.type }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ r.format }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ r.size }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ r.date }}</td>
                            <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded"
                                    :class="r.status === 'completed' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'">{{
                                        r.status === 'completed' ? '已生成' : '生成中' }}</span></td>
                            <td class="text-center px-4 py-2.5"><button v-if="r.status === 'completed'"
                                    class="text-[10px] text-primary hover:underline cursor-pointer flex items-center gap-0.5 mx-auto">
                                    <Download class="w-3 h-3" />下载
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <ToastNotify ref="toast" />
    </div>
</template>
