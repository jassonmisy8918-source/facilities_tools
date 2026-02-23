<script setup lang="ts">
import { ref, onBeforeUnmount, watch, nextTick } from 'vue'
import { Clock, Navigation, AlertTriangle, Users } from 'lucide-vue-next'

const activeFunc = ref('overview')
const funcTabs = [
    { key: 'overview', label: '任务总览' },
    { key: 'time', label: '工时与里程' },
    { key: 'issues', label: '问题统计' },
    { key: 'efficiency', label: '效率评估' },
    { key: 'coverage', label: '覆盖分析' },
]

// AMap 热力图
const AMAP_KEY = '2831a4407f599a6815d9fa2608676c9e'
const AMAP_SECURITY_CODE = '01051b2c2a2b850b592d80160a115710'
const heatmapContainer = ref<HTMLDivElement>()
let mapInstance: any = null

function loadAMapSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).AMap) { resolve(); return }
        if (AMAP_SECURITY_CODE) {
            (window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }
        }
        const existing = document.getElementById('amap-sdk')
        if (existing) { existing.addEventListener('load', () => resolve()); existing.addEventListener('error', () => reject()); return }
        const script = document.createElement('script')
        script.id = 'amap-sdk'
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('AMap SDK load failed'))
        document.head.appendChild(script)
    })
}

// 基于覆盖率数据生成热力点
function generateHeatData() {
    const areaCoords: Record<string, [number, number]> = {
        '圭塘街道': [113.045, 28.130],
        '侯家塘街道': [113.025, 28.148],
        '左家塘街道': [113.035, 28.155],
        '黎托街道': [113.060, 28.115],
        '欢乐街道': [113.050, 28.100],
        '洞井街道': [113.070, 28.095],
    }
    const heatData: { lng: number; lat: number; count: number }[] = []
    coverageData.value.forEach(c => {
        const base = areaCoords[c.area]
        if (!base) return
        // 在区域中心周围播撞多个点
        const density = Math.round(c.rate / 5)
        for (let i = 0; i < density; i++) {
            heatData.push({
                lng: base[0] + (Math.random() - 0.5) * 0.02,
                lat: base[1] + (Math.random() - 0.5) * 0.015,
                count: c.rate
            })
        }
    })
    return heatData
}

async function initHeatmap() {
    if (!heatmapContainer.value || mapInstance) return
    try {
        await loadAMapSDK()
        const AMap = (window as any).AMap
        mapInstance = new AMap.Map(heatmapContainer.value, {
            zoom: 13,
            center: [113.045, 28.130],
            mapStyle: 'amap://styles/normal',
            resizeEnable: true,
        })
        AMap.plugin(['AMap.HeatMap', 'AMap.Scale'], () => {
            mapInstance.addControl(new AMap.Scale())
            const heatData = generateHeatData()
            const heatmap = new AMap.HeatMap(mapInstance, {
                radius: 30,
                opacity: [0, 0.8],
                gradient: {
                    0.2: '#0033FF',
                    0.4: '#00BFFF',
                    0.6: '#7CFC00',
                    0.8: '#FFD700',
                    1.0: '#FF4500',
                },
            })
            heatmap.setDataSet({
                data: heatData.map(d => ({ lng: d.lng, lat: d.lat, count: d.count })),
                max: 100,
            })
        })
    } catch (e) {
        console.error('Heatmap init failed:', e)
    }
}

watch(() => activeFunc.value, async (val) => {
    if (val === 'coverage') {
        await nextTick()
        initHeatmap()
    }
})

onBeforeUnmount(() => {
    if (mapInstance) { mapInstance.destroy(); mapInstance = null }
})

// 任务统计
const taskStats = ref({
    total: 128, completed: 105, incomplete: 23, completionRate: 82.0,
    byArea: [
        { area: '圭塘街道', total: 42, completed: 38, rate: 90.5 },
        { area: '侯家塘街道', total: 30, completed: 27, rate: 90.0 },
        { area: '左家塘街道', total: 28, completed: 20, rate: 71.4 },
        { area: '黎托街道', total: 18, completed: 12, rate: 66.7 },
        { area: '洞井街道', total: 10, completed: 8, rate: 80.0 },
    ],
    byType: [
        { type: '例行巡查', total: 80, completed: 72, rate: 90.0 },
        { type: '专项巡查', total: 20, completed: 18, rate: 90.0 },
        { type: '应急巡查', total: 15, completed: 10, rate: 66.7 },
        { type: '复查', total: 13, completed: 5, rate: 38.5 },
    ],
    incompleteReasons: [
        { reason: '人员请假', count: 8 },
        { reason: '天气原因', count: 6 },
        { reason: '设备故障', count: 5 },
        { reason: '计划调整', count: 4 },
    ]
})

// 工时里程
const timeStats = ref({
    totalHours: 856, avgHoursPerTask: 6.7,
    byPerson: [
        { name: '张伟', hours: 220, tasks: 32, avgHours: 6.9, mileage: '85km' },
        { name: '李明', hours: 195, tasks: 28, avgHours: 7.0, mileage: '72km' },
        { name: '王强', hours: 180, tasks: 25, avgHours: 7.2, mileage: '68km' },
        { name: '赵刚', hours: 130, tasks: 18, avgHours: 7.2, mileage: '52km' },
        { name: '刘芳', hours: 131, tasks: 20, avgHours: 6.6, mileage: '55km' },
    ],
    totalMileage: '332km',
    byArea: [
        { area: '圭塘街道', mileage: '120km' },
        { area: '侯家塘街道', mileage: '85km' },
        { area: '左家塘街道', mileage: '72km' },
        { area: '黎托街道', mileage: '55km' },
    ]
})

// 问题统计
const issueStats = ref({
    total: 45,
    byType: [
        { type: '井盖问题', count: 12, pct: 26.7 },
        { type: '管道破损', count: 10, pct: 22.2 },
        { type: '排口堵塞', count: 8, pct: 17.8 },
        { type: '淤积严重', count: 7, pct: 15.6 },
        { type: '混接问题', count: 5, pct: 11.1 },
        { type: '其他', count: 3, pct: 6.7 },
    ],
    byArea: [
        { area: '圭塘街道', count: 15 },
        { area: '侯家塘街道', count: 12 },
        { area: '左家塘街道', count: 10 },
        { area: '黎托街道', count: 5 },
        { area: '洞井街道', count: 3 },
    ]
})

// 效率评估
const efficiencyData = ref([
    { name: '张伟', tasks: 32, hours: 220, issues: 12, score: 95, rank: 1 },
    { name: '王强', tasks: 25, hours: 180, issues: 10, score: 92, rank: 2 },
    { name: '刘芳', tasks: 20, hours: 131, issues: 8, score: 90, rank: 3 },
    { name: '李明', tasks: 28, hours: 195, issues: 9, score: 88, rank: 4 },
    { name: '赵刚', tasks: 18, hours: 130, issues: 6, score: 78, rank: 5 },
])

// 覆盖
const coverageData = ref([
    { area: '圭塘街道', totalPipeline: '120km', covered: '108km', rate: 90, lastPatrol: '2024-03-15' },
    { area: '侯家塘街道', totalPipeline: '85km', covered: '72km', rate: 85, lastPatrol: '2024-03-14' },
    { area: '左家塘街道', totalPipeline: '95km', covered: '57km', rate: 60, lastPatrol: '2024-03-12' },
    { area: '黎托街道', totalPipeline: '110km', covered: '55km', rate: 50, lastPatrol: '2024-03-10' },
    { area: '洞井街道', totalPipeline: '75km', covered: '30km', rate: 40, lastPatrol: '2024-03-08' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 任务总览 -->
        <template v-if="activeFunc === 'overview'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-3xl font-bold text-default">{{ taskStats.total }}</p>
                    <p class="text-[10px] text-dim mt-1">任务总数</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-3xl font-bold text-success">{{ taskStats.completed }}</p>
                    <p class="text-[10px] text-dim mt-1">已完成</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-3xl font-bold text-danger">{{ taskStats.incomplete }}</p>
                    <p class="text-[10px] text-dim mt-1">未完成</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-3xl font-bold text-primary">{{ taskStats.completionRate }}%</p>
                    <p class="text-[10px] text-dim mt-1">完成率</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default mb-3 block">按区域统计</span>
                    <div class="space-y-2">
                        <div v-for="a in taskStats.byArea" :key="a.area" class="flex items-center gap-2">
                            <span class="text-[10px] text-default w-14 shrink-0">{{ a.area }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full"
                                    :class="a.rate >= 80 ? 'bg-success' : a.rate >= 60 ? 'bg-warning' : 'bg-danger'"
                                    :style="{ width: a.rate + '%' }"></div>
                            </div>
                            <span class="text-[10px] text-dim w-20 text-right">{{ a.completed }}/{{ a.total }} ({{
                                a.rate }}%)</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default mb-3 block">按类型统计</span>
                    <div class="space-y-2">
                        <div v-for="t in taskStats.byType" :key="t.type" class="flex items-center gap-2">
                            <span class="text-[10px] text-default w-16 shrink-0">{{ t.type }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full"
                                    :class="t.rate >= 80 ? 'bg-success' : t.rate >= 60 ? 'bg-warning' : 'bg-danger'"
                                    :style="{ width: t.rate + '%' }"></div>
                            </div>
                            <span class="text-[10px] text-dim w-20 text-right">{{ t.completed }}/{{ t.total }} ({{
                                t.rate }}%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <span class="text-xs font-bold text-default mb-2 block">未完成原因分析</span>
                <div class="flex gap-4">
                    <div v-for="r in taskStats.incompleteReasons" :key="r.reason"
                        class="flex-1 p-3 rounded-lg bg-surface text-center">
                        <p class="text-lg font-bold text-warning">{{ r.count }}</p>
                        <p class="text-[10px] text-dim">{{ r.reason }}</p>
                    </div>
                </div>
            </div>
        </template>

        <!-- 工时里程 -->
        <template v-if="activeFunc === 'time'">
            <div class="grid grid-cols-3 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{ timeStats.totalHours }}<span
                            class="text-xs text-dim">h</span></p>
                    <p class="text-[10px] text-dim">总工时</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{ timeStats.avgHoursPerTask }}<span
                            class="text-xs text-dim">h</span></p>
                    <p class="text-[10px] text-dim">平均工时/任务</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{ timeStats.totalMileage }}</p>
                    <p class="text-[10px] text-dim">总里程</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Clock class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">个人工时与里程</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">姓名</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">任务数</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">总工时</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">平均工时</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">里程</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">工时占比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in timeStats.byPerson" :key="p.name"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ p.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.tasks }}</td>
                            <td class="text-center px-4 py-2.5 text-primary font-bold">{{ p.hours }}h</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.avgHours }}h</td>
                            <td class="text-center px-4 py-2.5 text-info font-bold">{{ p.mileage }}</td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center gap-1">
                                    <div class="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full bg-primary rounded-full"
                                            :style="{ width: (p.hours / timeStats.totalHours * 100) + '%' }"></div>
                                    </div><span class="text-[10px] text-dim w-8">{{ (p.hours / timeStats.totalHours *
                                        100).toFixed(0) }}%</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 问题统计 -->
        <template v-if="activeFunc === 'issues'">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-3xl font-bold text-warning">{{ issueStats.total }}</p>
                <p class="text-[10px] text-dim">发现问题总数</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <AlertTriangle class="w-4 h-4 text-warning" /><span
                            class="text-xs font-bold text-default">按类型分布</span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="t in issueStats.byType" :key="t.type" class="flex items-center gap-2">
                            <span class="text-[10px] text-default w-16 shrink-0">{{ t.type }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-warning rounded-full" :style="{ width: t.pct + '%' }"></div>
                            </div>
                            <span class="text-[10px] text-dim w-14 text-right">{{ t.count }} ({{ t.pct }}%)</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <Navigation class="w-4 h-4 text-info" /><span
                            class="text-xs font-bold text-default">按区域分布</span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="a in issueStats.byArea" :key="a.area" class="flex items-center gap-2">
                            <span class="text-[10px] text-default w-14 shrink-0">{{ a.area }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-info rounded-full"
                                    :style="{ width: (a.count / issueStats.total * 100) + '%' }"></div>
                            </div>
                            <span class="text-[10px] text-dim w-8 text-right">{{ a.count }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 效率评估 -->
        <template v-if="activeFunc === 'efficiency'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Users class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">巡查人员工作效率排名</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">排名</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">姓名</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">完成任务</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">工作时长</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">发现问题</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">效率得分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="e in efficiencyData" :key="e.name"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="text-center px-3 py-2.5"><span class="text-xs font-bold"
                                    :class="e.rank <= 3 ? 'text-primary' : 'text-dim'">{{ e.rank <= 3 ? ['🥇', '🥈'
                                        , '🥉'][e.rank - 1] : '#' + e.rank }}</span>
                            </td>
                            <td class="px-4 py-2.5 text-default font-medium">{{ e.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ e.tasks }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ e.hours }}h</td>
                            <td class="text-center px-4 py-2.5 text-warning">{{ e.issues }}</td>
                            <td class="text-center px-4 py-2.5"><span class="text-sm font-bold"
                                    :class="e.score >= 90 ? 'text-success' : e.score >= 80 ? 'text-warning' : 'text-danger'">{{
                                        e.score }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 覆盖分析 -->
        <template v-if="activeFunc === 'coverage'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div ref="heatmapContainer" class="w-full rounded-lg" style="height: 340px;"></div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">管网总长</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">已覆盖</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">覆盖率</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">最近巡查</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in coverageData" :key="c.area"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ c.area }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ c.totalPipeline }}</td>
                            <td class="text-center px-4 py-2.5 text-primary font-bold">{{ c.covered }}</td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center gap-1 justify-center">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="c.rate >= 80 ? 'bg-success' : c.rate >= 50 ? 'bg-warning' : 'bg-danger'"
                                            :style="{ width: c.rate + '%' }"></div>
                                    </div><span class="text-[10px] font-bold"
                                        :class="c.rate >= 80 ? 'text-success' : c.rate >= 50 ? 'text-warning' : 'text-danger'">{{
                                            c.rate }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ c.lastPatrol }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
