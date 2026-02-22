<script setup lang="ts">
import { ref } from 'vue'
import { Bookmark, Plus, Pencil, Trash2, Play } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const templates = ref([
    { id: 1, name: '日常雨量巡检', type: 'rainfall', stations: '全部雨量站', timeRange: '24小时', metrics: '瞬时/累计', creator: '张工', createDate: '2024-03-10' },
    { id: 2, name: '汛期流量监控', type: 'flow', stations: '朝阳路、东湖泵站', timeRange: '7天', metrics: '流量/流速', creator: '李工', createDate: '2024-03-08' },
    { id: 3, name: '水质超标排查', type: 'quality', stations: '全部水质站', timeRange: '30天', metrics: 'COD/pH/SS', creator: '系统', createDate: '2024-03-05' },
    { id: 4, name: '重点点位水位监控', type: 'level', stations: '民生路、建设大道', timeRange: '实时', metrics: '水位', creator: '王工', createDate: '2024-03-01' },
    { id: 5, name: '月度综合报表', type: 'all', stations: '全部站点', timeRange: '30天', metrics: '全部指标', creator: '系统', createDate: '2024-02-28' },
])

function getTypeLabel(t: string) { return t === 'rainfall' ? '雨量' : t === 'flow' ? '流量' : t === 'level' ? '水位' : t === 'quality' ? '水质' : '综合' }
function getTypeColor(t: string) { return t === 'rainfall' ? 'text-info bg-info/10' : t === 'flow' ? 'text-primary bg-primary/10' : t === 'level' ? 'text-warning bg-warning/10' : t === 'quality' ? 'text-success bg-success/10' : 'text-dim bg-surface' }

function runTemplate(name: string) { toast.value?.show(`正在执行模板: ${name}`, 'info') }
</script>

<template>
    <div class="space-y-4">
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Bookmark class="w-4 h-4 text-primary" />
                    <span class="text-sm font-semibold text-default">查询模板管理</span>
                    <span class="text-xs text-muted-themed">({{ templates.length }})</span>
                </div>
                <button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Plus class="w-3.5 h-3.5" /> 新建模板
                </button>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">模板名称</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">监测站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">时间范围</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">指标</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">创建人</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">创建日期</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in templates" :key="t.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ t.name }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="getTypeColor(t.type)">{{ getTypeLabel(t.type) }}</span></td>
                        <td class="px-4 py-2.5 text-default">{{ t.stations }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ t.timeRange }}</td>
                        <td class="px-4 py-2.5 text-dim">{{ t.metrics }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ t.creator }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ t.createDate }}</td>
                        <td class="text-center px-4 py-2.5">
                            <div class="flex items-center justify-center gap-1.5">
                                <button @click="runTemplate(t.name)"
                                    class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"
                                    title="执行">
                                    <Play class="w-3 h-3 text-primary" />
                                </button>
                                <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"
                                    title="编辑">
                                    <Pencil class="w-3 h-3 text-dim" />
                                </button>
                                <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"
                                    title="删除">
                                    <Trash2 class="w-3 h-3 text-danger" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ToastNotify ref="toast" />
    </div>
</template>
