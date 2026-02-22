<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Search, Plus, Pencil, Trash2, Droplets, Activity, Waves, FlaskConical } from 'lucide-vue-next'

const searchText = ref('')
const filterType = ref('all')

const points = ref([
    { id: 1, name: '和平路雨量站', type: 'rainfall', region: '西城区', device: 'RG-2001', coords: '116.38, 39.92', installDate: '2023-05-10', status: 'online' },
    { id: 2, name: '朝阳路DN600', type: 'flow', region: '朝阳区', device: 'FM-3001', coords: '116.43, 39.93', installDate: '2023-06-15', status: 'online' },
    { id: 3, name: '民生路DN400', type: 'level', region: '海淀区', device: 'LG-4001', coords: '116.30, 39.96', installDate: '2023-07-20', status: 'warning' },
    { id: 4, name: '新华街DN800', type: 'quality', region: '东城区', device: 'WQ-5001', coords: '116.41, 39.91', installDate: '2023-08-25', status: 'online' },
    { id: 5, name: '丰台区雨量站', type: 'rainfall', region: '丰台区', device: 'RG-2002', coords: '116.29, 39.86', installDate: '2023-09-01', status: 'online' },
    { id: 6, name: '通州区雨量站', type: 'rainfall', region: '通州区', device: 'RG-2003', coords: '116.66, 39.91', installDate: '2024-01-12', status: 'alarm' },
    { id: 7, name: '建设大道DN300', type: 'level', region: '丰台区', device: 'LG-4002', coords: '116.31, 39.85', installDate: '2023-10-15', status: 'alarm' },
    { id: 8, name: '东湖泵站进水', type: 'flow', region: '东城区', device: 'FM-3002', coords: '116.42, 39.93', installDate: '2023-11-20', status: 'online' },
])

function getTypeLabel(t: string) { return t === 'rainfall' ? '雨量' : t === 'flow' ? '流量' : t === 'level' ? '水位' : '水质' }
function getTypeIcon(t: string) { return t === 'rainfall' ? Droplets : t === 'flow' ? Activity : t === 'level' ? Waves : FlaskConical }
function getStatusColor(s: string) { return s === 'online' ? 'text-success' : s === 'warning' ? 'text-warning' : 'text-danger' }
function getStatusText(s: string) { return s === 'online' ? '正常' : s === 'warning' ? '预警' : '报警' }
</script>

<template>
    <div class="space-y-4">
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <Settings class="w-4 h-4 text-primary" />
                    <span class="text-sm font-semibold text-default">点位信息管理</span>
                    <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5 ml-2">
                        <button v-for="t in ['all', 'rainfall', 'flow', 'level', 'quality']" :key="t"
                            @click="filterType = t"
                            class="px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer"
                            :class="filterType === t ? 'bg-primary text-white' : 'text-dim hover:text-default'">
                            {{ t === 'all' ? '全部' : getTypeLabel(t) }}
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="relative">
                        <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input v-model="searchText" type="text" placeholder="搜索点位..."
                            class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                    </div>
                    <button
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Plus class="w-3.5 h-3.5" /> 新增点位
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">点位名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">设备编号</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">坐标</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">安装日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in points" :key="p.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">
                                <div class="flex items-center gap-1.5">
                                    <component :is="getTypeIcon(p.type)" class="w-3.5 h-3.5 text-primary" />
                                    {{ p.name }}
                                </div>
                            </td>
                            <td class="text-center px-4 py-2.5 text-default">{{ getTypeLabel(p.type) }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.region }}</td>
                            <td class="px-4 py-2.5 text-dim font-mono">{{ p.device }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ p.coords }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ p.installDate }}</td>
                            <td class="text-center px-4 py-2.5">
                                <span class="text-[10px] font-medium" :class="getStatusColor(p.status)">{{
                                    getStatusText(p.status) }}</span>
                            </td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center justify-center gap-1.5">
                                    <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                                        <Pencil class="w-3 h-3 text-dim" />
                                    </button>
                                    <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                                        <Trash2 class="w-3 h-3 text-danger" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
