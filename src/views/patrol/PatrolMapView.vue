<script setup lang="ts">
import { ref, computed } from 'vue'
import { Layers, Navigation, Eye, EyeOff, Play, Pause } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('layers')
const funcTabs = [
    { key: 'layers', label: '图层管理' },
    { key: 'trajectory', label: '巡查轨迹' },
]

// 图层
const layers = ref([
    { id: 'lyr-01', name: '巡查路线', type: '线', color: '#3b82f6', visible: true, count: 4, desc: '所有已规划巡查路线' },
    { id: 'lyr-02', name: '巡查点', type: '点', color: '#22c55e', visible: true, count: 45, desc: '所有巡查检查点' },
    { id: 'lyr-03', name: '关键检查点', type: '点', color: '#ef4444', visible: true, count: 5, desc: '高风险关键检查点' },
    { id: 'lyr-04', name: '问题点位', type: '点', color: '#f59e0b', visible: true, count: 12, desc: '历史上报问题点位' },
    { id: 'lyr-05', name: '人员位置', type: '点', color: '#8b5cf6', visible: false, count: 6, desc: '巡查人员实时位置' },
    { id: 'lyr-06', name: '管网', type: '线', color: '#64748b', visible: false, count: 0, desc: '排水管网底图' },
])

// 轨迹
const trajectories = ref([
    { id: 'TRJ-001', worker: '张伟', order: 'WO-2024-001', date: '2024-03-15', route: '圭塘街道A线', startTime: '08:05', endTime: '12:30', distance: '7.2km', points: 320, deviation: 0, status: 'completed' },
    { id: 'TRJ-002', worker: '李明', order: 'WO-2024-002', date: '2024-03-15', route: '侯家塘街道排口线', startTime: '08:00', endTime: '', distance: '3.1km', points: 185, deviation: 1, status: 'active' },
    { id: 'TRJ-003', worker: '王强', order: 'WO-2024-005', date: '2024-03-10', route: '圭塘街道B线', startTime: '09:00', endTime: '11:00', distance: '4.5km', points: 210, deviation: 0, status: 'completed' },
])

const playingId = ref('')
function togglePlay(id: string) { playingId.value = playingId.value === id ? '' : id }

// 图层地图 markers（巡查点+关键检查点+问题点位）
const layerMarkers = computed(() => [
    { lng: 113.045, lat: 28.130, title: '巡查点 CP-01', label: 'CP-01' },
    { lng: 113.048, lat: 28.135, title: '巡查点 CP-02', label: 'CP-02' },
    { lng: 113.035, lat: 28.155, title: '关键点 KP-01', label: 'KP-01', color: '#ef4444' },
    { lng: 113.060, lat: 28.115, title: '问题点 IP-01', label: 'IP-01', color: '#f59e0b' },
    { lng: 113.025, lat: 28.148, title: '巡查点 CP-03', label: 'CP-03' },
    { lng: 113.050, lat: 28.100, title: '关键点 KP-02', label: 'KP-02', color: '#ef4444' },
])

// 轨迹回放 polylines
const trajectoryPolylines = computed(() => [
    { path: [[113.045, 28.130], [113.048, 28.133], [113.052, 28.136], [113.055, 28.138], [113.058, 28.135]] as [number, number][], color: '#3B82F6', weight: 4, label: '圈塘街道A线' },
    { path: [[113.025, 28.148], [113.028, 28.150], [113.031, 28.152], [113.034, 28.150]] as [number, number][], color: '#10B981', weight: 4, label: '侯家塘街道排口线' },
    { path: [[113.048, 28.133], [113.050, 28.130], [113.053, 28.128], [113.055, 28.125]] as [number, number][], color: '#8B5CF6', weight: 4, label: '圈塘街道B线' },
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

        <!-- 图层 -->
        <template v-if="activeFunc === 'layers'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <AMapView :markers="layerMarkers" :center="[113.045, 28.130]" :zoom="13" height="280px" />
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Layers class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">图层控制</span>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="l in layers" :key="l.id"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface">
                        <div class="flex items-center gap-3">
                            <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: l.color }"></div>
                            <div>
                                <p class="text-xs font-medium text-default">{{ l.name }} <span
                                        class="text-[10px] text-dim">({{ l.type }}{{ l.count ? ' · ' + l.count + '个' :
                                            '' }})</span></p>
                                <p class="text-[10px] text-dim">{{ l.desc }}</p>
                            </div>
                        </div>
                        <button @click="l.visible = !l.visible" class="p-1.5 rounded-md cursor-pointer"
                            :class="l.visible ? 'bg-primary/10 text-primary' : 'bg-surface text-dim'">
                            <component :is="l.visible ? Eye : EyeOff" class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <!-- 轨迹 -->
        <template v-if="activeFunc === 'trajectory'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <AMapView :polylines="trajectoryPolylines" :center="[113.045, 28.135]" :zoom="13" height="280px" />
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Navigation class="w-4 h-4 text-info" /><span
                        class="text-sm font-semibold text-default">巡查轨迹记录</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">巡查员</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">工单</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">时段</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">里程</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">轨迹点</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">偏离</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">回放</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in trajectories" :key="t.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ t.worker }}</td>
                            <td class="px-4 py-2.5 text-primary font-mono text-[10px]">{{ t.order }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ t.date }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ t.startTime }}{{ t.endTime ? '-' +
                                t.endTime : '-进行中' }}</td>
                            <td class="text-center px-4 py-2.5 text-primary font-bold">{{ t.distance }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ t.points }}</td>
                            <td class="text-center px-4 py-2.5"><span
                                    :class="t.deviation > 0 ? 'text-danger font-bold' : 'text-success'">{{ t.deviation >
                                        0 ? t.deviation + '次' : '无' }}</span></td>
                            <td class="text-center px-4 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="t.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'">{{
                                        t.status === 'active' ? '进行中' : '已完成' }}</span></td>
                            <td class="text-center px-4 py-2.5"><button @click="togglePlay(t.id)"
                                    class="p-1 rounded cursor-pointer"
                                    :class="playingId === t.id ? 'bg-primary/10 text-primary' : 'hover:bg-hover-themed text-dim'">
                                    <component :is="playingId === t.id ? Pause : Play" class="w-3.5 h-3.5" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
