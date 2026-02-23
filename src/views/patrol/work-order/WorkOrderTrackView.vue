<script setup lang="ts">
import { ref, computed } from 'vue'
import { Navigation, Radio, TrendingUp } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('track')
const funcTabs = [
    { key: 'track', label: '工单跟踪' },
    { key: 'location', label: '实时位置' },
    { key: 'progress', label: '进度可视化' },
]

// 跟踪
const trackOrders = ref([
    {
        id: 'WO-2024-001', title: '万家丽路主干管网季度巡查', assignee: '张伟', progress: 65, totalPoints: 15, donePoints: 10, currentPoint: '万家丽路MH-11', lastUpdate: '10:25', status: 'inspecting', timeline: [
            { time: '08:05', action: '出发', detail: '从公司出发' },
            { time: '08:30', action: '开始巡查', detail: '到达万家丽路MH-01' },
            { time: '09:15', action: '发现问题', detail: 'MH-05井盖松动，已拍照上报' },
            { time: '10:25', action: '巡查中', detail: '正在检查MH-11' },
        ]
    },
    {
        id: 'WO-2024-002', title: '侯家塘街道排口月度巡查', assignee: '李明', progress: 40, totalPoints: 10, donePoints: 4, currentPoint: '侯家塘街道OUT-05', lastUpdate: '10:10', status: 'inspecting', timeline: [
            { time: '08:00', action: '出发', detail: '从公司出发' },
            { time: '08:45', action: '开始巡查', detail: '到达侯家塘街道OUT-01' },
            { time: '10:10', action: '巡查中', detail: '正在检查OUT-05' },
        ]
    },
])

// 位置
const liveLocations = ref([
    { name: '张伟', team: 'A班', order: 'WO-2024-001', lat: 28.150, lng: 113.050, speed: '步行', lastUpdate: '10:25:30', battery: 85 },
    { name: '李明', team: 'A班', order: 'WO-2024-002', lat: 28.140, lng: 113.020, speed: '步行', lastUpdate: '10:10:15', battery: 72 },
    { name: '王强', team: 'B班', order: '', lat: 28.160, lng: 113.060, speed: '静止', lastUpdate: '10:20:00', battery: 90 },
])

// 进度
const progressData = ref({
    overview: { total: 5, active: 2, completed: 1, overdue: 0, completionRate: 78 },
    byArea: [
        { area: '圭塘街道', total: 2, done: 1, rate: 65 },
        { area: '侯家塘街道', total: 1, done: 0, rate: 40 },
        { area: '左家塘街道', total: 1, done: 0, rate: 0 },
        { area: '黎托街道', total: 1, done: 0, rate: 0 },
    ],
    byType: [
        { type: '例行', count: 2, done: 0, rate: 52 },
        { type: '应急', count: 1, done: 0, rate: 0 },
        { type: '临时', count: 1, done: 0, rate: 0 },
        { type: '复查', count: 1, done: 1, rate: 100 },
    ],
})

// 实时位置 markers
const locationMarkers = computed(() =>
    liveLocations.value.map(l => ({
        lng: l.lng, lat: l.lat,
        title: l.name,
        label: `${l.name} (${l.order || '空闲'})`,
    }))
)
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 工单跟踪 -->
        <template v-if="activeFunc === 'track'">
            <div v-for="o in trackOrders" :key="o.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-3">
                    <div>
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ o.title
                                }}</span><span class="text-[10px] text-primary font-mono">{{ o.id }}</span></div>
                        <div class="text-[10px] text-dim mt-0.5">执行人: {{ o.assignee }} · 当前: {{ o.currentPoint }} · 更新于
                            {{ o.lastUpdate }}</div>
                    </div>
                    <div class="flex items-center gap-2"><span class="text-xs font-bold text-primary">{{ o.donePoints
                            }}/{{ o.totalPoints }}</span><span class="text-[10px] text-dim">巡查点</span></div>
                </div>
                <div class="h-2 bg-surface rounded-full overflow-hidden mb-3">
                    <div class="h-full bg-primary rounded-full transition-all" :style="{ width: o.progress + '%' }">
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="flex flex-col items-center gap-0" v-for="(_t, i) in o.timeline" :key="i">
                        <div class="w-2 h-2 rounded-full shrink-0"
                            :class="i === o.timeline.length - 1 ? 'bg-primary animate-pulse' : 'bg-success'"></div>
                        <div v-if="i < o.timeline.length - 1" class="w-0.5 h-6 bg-themed/30"></div>
                    </div>
                    <div class="flex-1 space-y-2">
                        <div v-for="(t, i) in o.timeline" :key="i" class="flex items-start gap-2"
                            :class="i === o.timeline.length - 1 ? '' : 'pb-2'">
                            <span class="text-[10px] text-dim w-10 shrink-0 pt-0.5">{{ t.time }}</span>
                            <div>
                                <p class="text-[10px] font-medium"
                                    :class="i === o.timeline.length - 1 ? 'text-primary' : 'text-default'">{{ t.action
                                    }}</p>
                                <p class="text-[10px] text-dim">{{ t.detail }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 实时位置 -->
        <template v-if="activeFunc === 'location'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <AMapView :markers="locationMarkers" :center="[113.045, 28.150]" :zoom="14" height="280px" />
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div v-for="l in liveLocations" :key="l.name"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <Radio class="w-3.5 h-3.5" :class="l.order ? 'text-success animate-pulse' : 'text-dim'" />
                            <span class="text-xs font-bold text-default">{{ l.name }}</span><span
                                class="text-[10px] text-dim">{{ l.team }}</span>
                        </div>
                        <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                            :class="l.order ? 'bg-success/10 text-success' : 'bg-surface text-dim'">{{ l.order ? '作业中' :
                                '待命' }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-y-1 text-[10px]">
                        <div><span class="text-dim">工单: </span><span class="text-primary font-mono">{{ l.order || '—'
                                }}</span></div>
                        <div><span class="text-dim">状态: </span><span class="text-default">{{ l.speed }}</span></div>
                        <div><span class="text-dim">坐标: </span><span class="text-default">{{ l.lat }}, {{ l.lng
                                }}</span></div>
                        <div><span class="text-dim">电量: </span><span
                                :class="l.battery > 50 ? 'text-success' : 'text-warning'" class="font-bold">{{ l.battery
                                }}%</span></div>
                    </div>
                    <p class="text-[10px] text-dim mt-1">更新: {{ l.lastUpdate }}</p>
                </div>
            </div>
        </template>

        <!-- 进度可视化 -->
        <template v-if="activeFunc === 'progress'">
            <div class="grid grid-cols-5 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ progressData.overview.total }}</p>
                    <p class="text-[10px] text-dim">总工单</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{ progressData.overview.active }}</p>
                    <p class="text-[10px] text-dim">执行中</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{ progressData.overview.completed }}</p>
                    <p class="text-[10px] text-dim">已完成</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-danger">{{ progressData.overview.overdue }}</p>
                    <p class="text-[10px] text-dim">超时</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{ progressData.overview.completionRate }}%</p>
                    <p class="text-[10px] text-dim">完成率</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <Navigation class="w-4 h-4 text-primary" /><span
                            class="text-xs font-semibold text-default">按区域进度</span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="a in progressData.byArea" :key="a.area" class="flex items-center gap-2">
                            <span class="text-[10px] text-default w-14 shrink-0">{{ a.area }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full transition-all"
                                    :style="{ width: a.rate + '%' }"></div>
                            </div>
                            <span class="text-[10px] text-dim w-8 text-right">{{ a.rate }}%</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <TrendingUp class="w-4 h-4 text-info" /><span
                            class="text-xs font-semibold text-default">按类型进度</span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="t in progressData.byType" :key="t.type" class="flex items-center gap-2">
                            <span class="text-[10px] text-default w-10 shrink-0">{{ t.type }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all"
                                    :class="t.rate === 100 ? 'bg-success' : 'bg-info'" :style="{ width: t.rate + '%' }">
                                </div>
                            </div>
                            <span class="text-[10px] text-dim w-12 text-right">{{ t.done }}/{{ t.count }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
