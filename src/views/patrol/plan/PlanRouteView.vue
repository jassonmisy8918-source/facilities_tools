<script setup lang="ts">
import { ref } from 'vue'
import { Navigation, AlertTriangle, Plus, Pencil, Trash2, Eye } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('route')
const funcTabs = [
    { key: 'route', label: '巡查路线设置' },
    { key: 'key-points', label: '关键检查点' },
    { key: 'patrol-points', label: '巡查点管理' },
]

// 路线
const routes = ref([
    { id: 'RT-001', name: '圭塘街道主干管网A线', area: '圭塘街道', distance: '8.5km', points: 15, keyPoints: 3, estimateTime: '3.5小时', status: 'active', color: '#3B82F6', path: [[113.025, 28.135], [113.030, 28.138], [113.035, 28.142], [113.040, 28.145], [113.045, 28.148], [113.050, 28.150]] as [number, number][] },
    { id: 'RT-002', name: '圭塘街道主干管网B线', area: '圭塘街道', distance: '6.2km', points: 12, keyPoints: 2, estimateTime: '2.5小时', status: 'active', color: '#00D4AA', path: [[113.032, 28.130], [113.036, 28.134], [113.040, 28.138], [113.044, 28.141], [113.048, 28.144]] as [number, number][] },
    { id: 'RT-003', name: '侯家塘街道排口巡查线', area: '侯家塘街道', distance: '4.8km', points: 10, keyPoints: 4, estimateTime: '2小时', status: 'active', color: '#FFB020', path: [[113.015, 28.140], [113.018, 28.143], [113.022, 28.146], [113.025, 28.148], [113.028, 28.150]] as [number, number][] },
    { id: 'RT-004', name: '左家塘街道暴雨应急线', area: '左家塘街道', distance: '12km', points: 8, keyPoints: 6, estimateTime: '1.5小时(车巡)', status: 'standby', color: '#F97316', path: [[113.010, 28.125], [113.018, 28.130], [113.025, 28.135], [113.032, 28.140], [113.040, 28.145], [113.048, 28.150], [113.055, 28.155]] as [number, number][] },
])

function getRoutePolyline(r: typeof routes.value[0]) {
    return [{ path: r.path, color: r.color, label: r.name.slice(-3) }]
}

// 关键检查点
const keyCheckPoints = ref([
    { id: 'KP-001', name: '万家丽路低洼段', type: '易涝点', risk: 'high', lat: 28.150, lng: 113.050, requirement: '检查排水口、集水井淤积、周边环境排水能力', lastIssue: '2024-02-20 轻度积水' },
    { id: 'KP-002', name: '劳动路老旧管段', type: '老旧管段', risk: 'medium', lat: 28.148, lng: 113.04, requirement: '检查管壁裂缝、接缝渗漏、结构变形', lastIssue: '2024-01-15 轻微渗漏' },
    { id: 'KP-003', name: '侯家塘街道雨污混接点', type: '混接点', risk: 'high', lat: 28.140, lng: 113.020, requirement: '水质取样、检查混接管道、标记排查', lastIssue: '2024-03-01 混接确认' },
    { id: 'KP-004', name: '芙蓉路泵站前池', type: '泵站前池', risk: 'medium', lat: 28.160, lng: 113.060, requirement: '检查格栅、水位、淤积深度、设备状态', lastIssue: '无异常' },
    { id: 'KP-005', name: '浏阳河排口', type: '排口', risk: 'low', lat: 28.138, lng: 113.07, requirement: '外观检查、水质目测、淤积程度', lastIssue: '无异常' },
])

// 巡查点
const patrolPoints = ref([
    { id: 'PP-001', name: '万家丽路MH-01', type: '检查井', facility: 'DN400雨水管', address: '万家丽路100号', content: '井盖完好性/井内淤积/管壁状况', route: 'RT-001' },
    { id: 'PP-002', name: '万家丽路MH-02', type: '检查井', facility: 'DN400雨水管', address: '万家丽路200号', content: '井盖完好性/井内淤积/管壁状况', route: 'RT-001' },
    { id: 'PP-003', name: '劳动路OUT-01', type: '排口', facility: 'DN600排口', address: '劳动路河道段', content: '排口畅通/水质外观/周边环境', route: 'RT-001' },
    { id: 'PP-004', name: '侯家塘街道OUT-03', type: '排口', facility: 'DN800排口', address: '侯家塘街道浏阳河段', content: '排口畅通/水质目测/淤积深度', route: 'RT-003' },
    { id: 'PP-005', name: '芙蓉路PS-01', type: '泵站', facility: '芙蓉路泵站', address: '芙蓉路200号', content: '设备运行/水位/格栅/周边环境', route: 'RT-001' },
])

function getRiskColor(r: string) { return r === 'high' ? 'text-danger bg-danger/10' : r === 'medium' ? 'text-warning bg-warning/10' : 'text-info bg-info/10' }
function getRiskText(r: string) { return r === 'high' ? '高风险' : r === 'medium' ? '中风险' : '低风险' }

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', area: '', distance: '', estimateTime: '' })
const toast = ref<InstanceType<typeof ToastNotify>>()
function openAdd() { addForm.value = { name: '', area: '', distance: '', estimateTime: '' }; showAddModal.value = true }
function doAdd() { showAddModal.value = false; toast.value?.show('新增成功', 'success') }
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
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer" @click="openAdd()">
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
                <AMapView :polylines="getRoutePolyline(r)" height="120px" :zoom="14"
                    :center="[r.path[Math.floor(r.path.length / 2)]![0], r.path[Math.floor(r.path.length / 2)]![1]]" />
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
    <!-- 新增弹窗 -->
    <ModalDialog :show="showAddModal" title="新增巡查路线" @close="showAddModal = false" @confirm="doAdd">
        <div class="space-y-3">
            <div>
                <label class="text-[10px] text-dim block mb-1">路线名称</label>
                <input v-model="addForm.name" type="text" placeholder="请输入路线名称"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">区域</label>
                <input v-model="addForm.area" type="text" placeholder="请选择区域"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">里程</label>
                <input v-model="addForm.distance" type="text" placeholder="如 8.5km"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">预计耗时</label>
                <input v-model="addForm.estimateTime" type="text" placeholder="如 3.5小时"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
        </div>
    </ModalDialog>
        <ToastNotify ref="toast" />
    </div>
</template>
