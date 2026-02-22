<script setup lang="ts">
import { ref } from 'vue'
import { Navigation, AlertTriangle, Plus, Pencil, Trash2, Eye } from 'lucide-vue-next'

const activeFunc = ref('route')
const funcTabs = [
    { key: 'route', label: '巡查路线设置' },
    { key: 'key-points', label: '关键检查点' },
    { key: 'patrol-points', label: '巡查点管理' },
]

// 路线
const routes = ref([
    { id: 'RT-001', name: '朝阳区主干管网A线', area: '朝阳区', distance: '8.5km', points: 15, keyPoints: 3, estimateTime: '3.5小时', status: 'active' },
    { id: 'RT-002', name: '朝阳区主干管网B线', area: '朝阳区', distance: '6.2km', points: 12, keyPoints: 2, estimateTime: '2.5小时', status: 'active' },
    { id: 'RT-003', name: '西城区排口巡查线', area: '西城区', distance: '4.8km', points: 10, keyPoints: 4, estimateTime: '2小时', status: 'active' },
    { id: 'RT-004', name: '丰台区暴雨应急线', area: '丰台区', distance: '12km', points: 8, keyPoints: 6, estimateTime: '1.5小时(车巡)', status: 'standby' },
])

// 关键检查点
const keyCheckPoints = ref([
    { id: 'KP-001', name: '建设大道低洼段', type: '易涝点', risk: 'high', lat: 39.932, lng: 116.468, requirement: '检查排水口、集水井淤积、周边环境排水能力', lastIssue: '2024-02-20 轻度积水' },
    { id: 'KP-002', name: '民生路老旧管段', type: '老旧管段', risk: 'medium', lat: 39.928, lng: 116.455, requirement: '检查管壁裂缝、接缝渗漏、结构变形', lastIssue: '2024-01-15 轻微渗漏' },
    { id: 'KP-003', name: '西城区雨污混接点', type: '混接点', risk: 'high', lat: 39.925, lng: 116.352, requirement: '水质取样、检查混接管道、标记排查', lastIssue: '2024-03-01 混接确认' },
    { id: 'KP-004', name: '和平路泵站前池', type: '泵站前池', risk: 'medium', lat: 39.940, lng: 116.480, requirement: '检查格栅、水位、淤积深度、设备状态', lastIssue: '无异常' },
    { id: 'KP-005', name: '通州运河排口', type: '排口', risk: 'low', lat: 39.908, lng: 116.658, requirement: '外观检查、水质目测、淤积程度', lastIssue: '无异常' },
])

// 巡查点
const patrolPoints = ref([
    { id: 'PP-001', name: '建设大道MH-01', type: '检查井', facility: 'DN400雨水管', address: '建设大道100号', content: '井盖完好性/井内淤积/管壁状况', route: 'RT-001' },
    { id: 'PP-002', name: '建设大道MH-02', type: '检查井', facility: 'DN400雨水管', address: '建设大道200号', content: '井盖完好性/井内淤积/管壁状况', route: 'RT-001' },
    { id: 'PP-003', name: '民生路OUT-01', type: '排口', facility: 'DN600排口', address: '民生路河道段', content: '排口畅通/水质外观/周边环境', route: 'RT-001' },
    { id: 'PP-004', name: '西城区OUT-03', type: '排口', facility: 'DN800排口', address: '西城区清河段', content: '排口畅通/水质目测/淤积深度', route: 'RT-003' },
    { id: 'PP-005', name: '和平路PS-01', type: '泵站', facility: '和平路泵站', address: '和平路200号', content: '设备运行/水位/格栅/周边环境', route: 'RT-001' },
])

function getRiskColor(r: string) { return r === 'high' ? 'text-danger bg-danger/10' : r === 'medium' ? 'text-warning bg-warning/10' : 'text-info bg-info/10' }
function getRiskText(r: string) { return r === 'high' ? '高风险' : r === 'medium' ? '中风险' : '低风险' }
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
            <button
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" />新增
            </button>
        </div>

        <!-- 路线 -->
        <div v-if="activeFunc === 'route'" class="grid grid-cols-2 gap-3">
            <div v-for="r in routes" :key="r.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <Navigation class="w-4 h-4 text-primary" /><span class="text-xs font-bold text-default">{{
                            r.name }}</span>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                        :class="r.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                            r.status === 'active' ? '使用中' : '备用' }}</span>
                </div>
                <div class="grid grid-cols-2 gap-y-1 text-[10px] mb-3">
                    <div><span class="text-dim">区域: </span><span class="text-default">{{ r.area }}</span></div>
                    <div><span class="text-dim">里程: </span><span class="text-primary font-bold">{{ r.distance }}</span>
                    </div>
                    <div><span class="text-dim">巡查点: </span><span class="text-default">{{ r.points }}个</span></div>
                    <div><span class="text-dim">关键点: </span><span class="text-danger font-bold">{{ r.keyPoints
                    }}个</span></div>
                    <div class="col-span-2"><span class="text-dim">预计耗时: </span><span class="text-default">{{
                        r.estimateTime }}</span></div>
                </div>
                <div class="h-24 bg-surface rounded-lg flex items-center justify-center text-[10px] text-dim">📍 GIS
                    路线地图预览（需接入地图 SDK）</div>
                <div class="flex items-center gap-1 mt-3 pt-2 border-t border-themed/30">
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                        <Eye class="w-3 h-3 text-primary" />
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

        <!-- 关键检查点 -->
        <div v-if="activeFunc === 'key-points'" class="space-y-3">
            <div v-for="kp in keyCheckPoints" :key="kp.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                        <AlertTriangle class="w-4 h-4 mt-0.5 shrink-0"
                            :class="kp.risk === 'high' ? 'text-danger' : kp.risk === 'medium' ? 'text-warning' : 'text-info'" />
                        <div>
                            <div class="flex items-center gap-2 mb-1"><span class="text-xs font-bold text-default">{{
                                kp.name }}</span><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="getRiskColor(kp.risk)">{{ getRiskText(kp.risk) }}</span><span
                                    class="text-[10px] text-muted-themed">{{ kp.type }}</span></div>
                            <p class="text-[10px] text-default mb-1">检查要求: {{ kp.requirement }}</p>
                            <div class="flex items-center gap-3 text-[10px] text-dim"><span>坐标: {{ kp.lat }}, {{ kp.lng
                            }}</span><span>最近问题: {{ kp.lastIssue }}</span></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                        <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                            <Pencil class="w-3 h-3 text-dim" />
                        </button>
                        <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                            <Trash2 class="w-3 h-3 text-danger" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 巡查点管理 -->
        <div v-if="activeFunc === 'patrol-points'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">名称</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">关联设施</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">检查内容</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">所属路线</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pp in patrolPoints" :key="pp.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-primary font-mono">{{ pp.id }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ pp.name }}</td>
                        <td class="text-center px-4 py-2.5"><span
                                class="text-[10px] px-2 py-0.5 rounded bg-info/10 text-info font-medium">{{ pp.type
                                }}</span></td>
                        <td class="px-4 py-2.5 text-default">{{ pp.facility }}</td>
                        <td class="px-4 py-2.5 text-dim">{{ pp.content }}</td>
                        <td class="text-center px-4 py-2.5 text-primary font-mono text-[10px]">{{ pp.route }}</td>
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
    </div>
</template>
