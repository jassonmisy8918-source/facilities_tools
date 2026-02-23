<script setup lang="ts">
import { ref } from 'vue'
import {
    Crosshair, MapPin, Navigation, Search, GitBranch, Filter, Globe, Clock,
    ChevronRight, LocateFixed, Building2, School, Hospital, Landmark,
    Upload, Play, Pause, SkipBack, SkipForward, Download
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 查询模式 Tab =====================
const queryModes = [
    { key: 'coord', label: '坐标定位', icon: Crosshair, desc: '输入经纬度坐标快速定位' },
    { key: 'place', label: '地名定位', icon: MapPin, desc: '根据地名关键词定位区域' },
    { key: 'poi', label: '兴趣点定位', icon: Building2, desc: '按类型定位周边设施' },
    { key: 'keyword', label: '关键字搜索', icon: Search, desc: '按设施名称/编号搜索' },
    { key: 'spatial', label: '空间关系查询', icon: GitBranch, desc: '查询设施间空间关系' },
    { key: 'compound', label: '复合查询', icon: Filter, desc: '多条件组合筛选' },
    { key: 'geocode', label: '地理编码批量查询', icon: Globe, desc: '批量地址转坐标' },
    { key: 'history', label: '历史轨迹回放', icon: Clock, desc: '回放定位历史与轨迹' },
]
const activeMode = ref('coord')

// ===================== 坐标定位 =====================
const coordForm = ref({ lng: '113.032549', lat: '28.1410' })
const coordResult = ref<{ name: string; distance: string; type: string }[]>([])
function doCoordLocate() {
    if (!coordForm.value.lng || !coordForm.value.lat) { toast.value?.show('请输入完整坐标', 'warning'); return }
    coordResult.value = [
        { name: '韶山路检查井#34', distance: '25m', type: '检查井' },
        { name: 'PS-001234 管段', distance: '48m', type: '排水管网' },
        { name: '韶山路雨水口#12', distance: '67m', type: '雨水口' },
    ]
    toast.value?.show(`已定位至 (${coordForm.value.lng}, ${coordForm.value.lat})`, 'success')
}

// ===================== 地名定位 =====================
const placeName = ref('')
const placeResults = ref<{ name: string; address: string; district: string }[]>([])
function doPlaceSearch() {
    if (!placeName.value) { toast.value?.show('请输入地名', 'warning'); return }
    placeResults.value = [
        { name: '圭塘街道', address: '长沙市圭塘街道', district: '圭塘街道' },
        { name: '圭塘河生态公园', address: '长沙市圭塘街道圭塘河生态公园南路1号', district: '圭塘街道' },
        { name: '雨花亭', address: '长沙市雨花亭街道雨花亭内大街', district: '雨花亭街道' },
    ]
    toast.value?.show(`找到 ${placeResults.value.length} 个结果`, 'success')
}

// ===================== 兴趣点定位 =====================
const poiTypes = [
    { key: 'school', label: '学校', icon: School, count: 12 },
    { key: 'hospital', label: '医院', icon: Hospital, count: 8 },
    { key: 'landmark', label: '地标建筑', icon: Landmark, count: 15 },
    { key: 'building', label: '商业综合体', icon: Building2, count: 23 },
]
const selectedPoiType = ref('school')
const poiRadius = ref('500')
const poiResults = ref<{ name: string; distance: string; address: string }[]>([])
function doPoiSearch() {
    poiResults.value = [
        { name: '雨花外国语学校', distance: '120m', address: '圭塘街道慧忠北里203号' },
        { name: '雅礼中学雨花校区', distance: '350m', address: '圭塘街道香樟路2号' },
        { name: '雨花实验小学', distance: '480m', address: '圭塘街道幸福一村四巷36号' },
    ]
    toast.value?.show(`半径${poiRadius.value}m内找到 ${poiResults.value.length} 个${poiTypes.find(p => p.key === selectedPoiType.value)?.label}`, 'success')
}

// ===================== 关键字搜索 =====================
const keyword = ref('')
const keywordResults = ref<{ code: string; name: string; type: string; status: string; district: string }[]>([])
function doKeywordSearch() {
    if (!keyword.value) { toast.value?.show('请输入关键词', 'warning'); return }
    keywordResults.value = [
        { code: 'PS-001234', name: '韶山路DN600管段', type: '排水管网', status: '正常', district: '圭塘街道' },
        { code: 'MH-003456', name: '韶山路检查井#34', type: '检查井', status: '正常', district: '圭塘街道' },
        { code: 'BZ-01', name: '韶山路排水泵站', type: '泵站', status: '运行中', district: '圭塘街道' },
        { code: 'RI-000012', name: '韶山路雨水口#12', type: '雨水口', status: '正常', district: '圭塘街道' },
        { code: 'DV-000056', name: '韶山路流量计#03', type: '监测设备', status: '在线', district: '圭塘街道' },
    ]
    toast.value?.show(`搜索到 ${keywordResults.value.length} 条结果`, 'success')
}

// ===================== 空间关系查询 =====================
const spatialType = ref('adjacent')
const spatialTarget = ref('')
const spatialRadius = ref('100')
const spatialResults = ref<{ name: string; relation: string; distance: string; type: string }[]>([])
function doSpatialQuery() {
    spatialResults.value = [
        { name: '检查井 MH-003457', relation: '相邻', distance: '15m', type: '检查井' },
        { name: '管段 PS-001235', relation: '连接', distance: '0m', type: '排水管网' },
        { name: '雨水口 RI-000013', relation: '相邻', distance: '32m', type: '雨水口' },
        { name: '阀门 VL-000008', relation: '包含', distance: '5m', type: '阀门' },
    ]
    toast.value?.show(`查询到 ${spatialResults.value.length} 条空间关系`, 'success')
}

// ===================== 复合查询 =====================
const compoundForm = ref({ type: '', status: '', district: '', yearFrom: '', yearTo: '' })
const facilityTypes = ['排水管网', '检查井', '雨水口', '排水户', '泵站', '污水厂', '闸门', '截留设施', '溢流堰', '阀门', '排放口', '监测设备']
const statusOptions = ['正常', '轻微缺陷', '需维修', '已停用']
const districtOptions = ['圭塘街道', '洞井街道', '侯家塘街道', '雨花亭街道', '左家塘街道']
const compoundResults = ref<{ code: string; name: string; type: string; status: string; district: string; year: string }[]>([])
function doCompoundQuery() {
    compoundResults.value = [
        { code: 'PS-000045', name: '洞井街道DN400管段', type: '排水管网', status: '正常', district: '洞井街道', year: '2020' },
        { code: 'PS-000078', name: '洞井街道DN600管段', type: '排水管网', status: '轻微缺陷', district: '洞井街道', year: '2019' },
        { code: 'MH-001234', name: '洞井街道检查井#78', type: '检查井', status: '正常', district: '洞井街道', year: '2021' },
    ]
    toast.value?.show(`复合查询命中 ${compoundResults.value.length} 条`, 'success')
}
function resetCompound() { compoundForm.value = { type: '', status: '', district: '', yearFrom: '', yearTo: '' }; compoundResults.value = [] }

// ===================== 地理编码批量查询 =====================
const batchInput = ref('长沙市圭塘街道韶山路10号\n长沙市洞井街道韶山路1号\n长沙市侯家塘街道芙蓉路7号')
const batchResults = ref<{ address: string; lng: string; lat: string; status: string }[]>([])
function doBatchGeocode() {
    const lines = batchInput.value.trim().split('\n').filter(l => l.trim())
    if (lines.length === 0) { toast.value?.show('请输入地址', 'warning'); return }
    batchResults.value = lines.map((addr, i) => ({
        address: addr.trim(),
        lng: (113.03 + i * 0.02).toFixed(6),
        lat: (28.13 + i * 0.01).toFixed(6),
        status: i === 1 ? '模糊匹配' : '精确匹配',
    }))
    toast.value?.show(`批量编码完成，共 ${batchResults.value.length} 条`, 'success')
}

// ===================== 历史轨迹回放 =====================
const historyRecords = ref([
    { id: 1, time: '2024-03-15 09:23', action: '坐标定位', target: '(113.032, 28.141)', user: '张三' },
    { id: 2, time: '2024-03-15 09:35', action: '关键字搜索', target: 'PS-001234', user: '张三' },
    { id: 3, time: '2024-03-15 10:12', action: '地名定位', target: '圭塘河生态公园', user: '李四' },
    { id: 4, time: '2024-03-15 10:45', action: '兴趣点定位', target: '学校 · 500m', user: '张三' },
    { id: 5, time: '2024-03-15 11:20', action: '复合查询', target: '洞井街道 · 排水管网', user: '王五' },
    { id: 6, time: '2024-03-15 14:08', action: '空间关系查询', target: 'MH-003456', user: '李四' },
])
const isPlaying = ref(false)
const playIndex = ref(0)
function togglePlay() {
    isPlaying.value = !isPlaying.value
    toast.value?.show(isPlaying.value ? '开始回放' : '已暂停', 'info')
}
function stepForward() { if (playIndex.value < historyRecords.value.length - 1) playIndex.value++ }
function stepBack() { if (playIndex.value > 0) playIndex.value-- }

// ===================== 通用 =====================
function getStatusClass(s: string) {
    if (['正常', '运行中', '在线', '精确匹配'].includes(s)) return 'bg-success/15 text-success'
    if (['轻微缺陷', '模糊匹配'].includes(s)) return 'bg-warning/15 text-warning'
    return 'bg-danger/15 text-danger'
}
</script>

<template>
    <div class="space-y-4">
        <!-- 查询模式选择 -->
        <div class="grid grid-cols-4 gap-3">
            <button v-for="mode in queryModes" :key="mode.key" @click="activeMode = mode.key"
                class="bg-card border rounded-xl p-3 shadow-themed flex items-center gap-3 transition-all cursor-pointer"
                :class="activeMode === mode.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
                <div class="p-2 rounded-lg" :class="activeMode === mode.key ? 'bg-primary/20' : 'bg-surface'">
                    <component :is="mode.icon" class="w-4 h-4"
                        :class="activeMode === mode.key ? 'text-primary' : 'text-dim'" />
                </div>
                <div class="text-left min-w-0">
                    <p class="text-xs font-medium" :class="activeMode === mode.key ? 'text-primary' : 'text-default'">{{
                        mode.label }}</p>
                    <p class="text-[10px] text-muted-themed truncate">{{ mode.desc }}</p>
                </div>
            </button>
        </div>

        <!-- ==================== 坐标定位 ==================== -->
        <div v-if="activeMode === 'coord'" class="grid grid-cols-3 gap-4">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-4 flex items-center gap-2">
                    <Crosshair class="w-4 h-4 text-primary" />坐标定位
                </h3>
                <div class="space-y-3">
                    <div>
                        <label class="text-xs text-dim mb-1 block">经度 (Longitude)</label>
                        <input v-model="coordForm.lng" type="text" placeholder="如 113.032549"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1 block">纬度 (Latitude)</label>
                        <input v-model="coordForm.lat" type="text" placeholder="如 28.1410"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <button @click="doCoordLocate"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <LocateFixed class="w-3.5 h-3.5" /> 定位
                    </button>
                </div>
            </div>
            <!-- 结果 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default">周边设施</h3>
                    <span class="text-[10px] text-muted-themed">{{ coordResult.length }} 个结果</span>
                </div>
                <div v-if="coordResult.length" class="p-3 space-y-2">
                    <div v-for="(item, i) in coordResult" :key="i"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-hover-themed transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                                <MapPin class="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-default">{{ item.name }}</p>
                                <p class="text-[10px] text-muted-themed">{{ item.type }}</p>
                            </div>
                        </div>
                        <span class="text-xs text-primary font-mono">{{ item.distance }}</span>
                    </div>
                </div>
                <div v-else class="p-8 text-center">
                    <Crosshair class="w-8 h-8 text-muted-themed mx-auto mb-2" />
                    <p class="text-xs text-muted-themed">输入坐标后点击定位查看周边设施</p>
                </div>
            </div>
        </div>

        <!-- ==================== 地名定位 ==================== -->
        <div v-if="activeMode === 'place'" class="grid grid-cols-3 gap-4">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-4 flex items-center gap-2">
                    <MapPin class="w-4 h-4 text-primary" />地名定位
                </h3>
                <div class="space-y-3">
                    <div>
                        <label class="text-xs text-dim mb-1 block">地名关键词</label>
                        <input v-model="placeName" type="text" placeholder="如 雨花、中关村..."
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <button @click="doPlaceSearch"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Search class="w-3.5 h-3.5" /> 搜索
                    </button>
                </div>
            </div>
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default">搜索结果</h3>
                </div>
                <div v-if="placeResults.length" class="p-3 space-y-2">
                    <button v-for="(item, i) in placeResults" :key="i"
                        class="w-full flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-hover-themed transition-colors text-left cursor-pointer">
                        <div class="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                            <Navigation class="w-4 h-4 text-primary" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-medium text-default">{{ item.name }}</p>
                            <p class="text-[10px] text-muted-themed truncate">{{ item.address }}</p>
                        </div>
                        <span class="text-[10px] px-2 py-0.5 rounded-md bg-info/15 text-info">{{ item.district }}</span>
                        <ChevronRight class="w-3.5 h-3.5 text-muted-themed" />
                    </button>
                </div>
                <div v-else class="p-8 text-center">
                    <MapPin class="w-8 h-8 text-muted-themed mx-auto mb-2" />
                    <p class="text-xs text-muted-themed">输入地名后搜索</p>
                </div>
            </div>
        </div>

        <!-- ==================== 兴趣点定位 ==================== -->
        <div v-if="activeMode === 'poi'" class="grid grid-cols-3 gap-4">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-4 flex items-center gap-2">
                    <Building2 class="w-4 h-4 text-primary" />兴趣点定位
                </h3>
                <div class="space-y-3">
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">兴趣点类型</label>
                        <div class="grid grid-cols-2 gap-1.5">
                            <button v-for="pt in poiTypes" :key="pt.key" @click="selectedPoiType = pt.key"
                                class="flex items-center gap-1.5 p-2 rounded-lg border text-xs transition-colors cursor-pointer"
                                :class="selectedPoiType === pt.key ? 'border-primary bg-primary/10 text-primary' : 'border-themed text-dim hover:bg-hover-themed'">
                                <component :is="pt.icon" class="w-3.5 h-3.5" />
                                {{ pt.label }}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1 block">搜索半径 (m)</label>
                        <input v-model="poiRadius" type="number" placeholder="500"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <button @click="doPoiSearch"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Search class="w-3.5 h-3.5" /> 搜索周边
                    </button>
                </div>
            </div>
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default">周边兴趣点</h3>
                </div>
                <div v-if="poiResults.length" class="p-3 space-y-2">
                    <div v-for="(item, i) in poiResults" :key="i"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-hover-themed transition-colors">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-info/15 flex items-center justify-center">
                                <component :is="poiTypes.find(p => p.key === selectedPoiType)?.icon || Building2"
                                    class="w-4 h-4 text-info" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-default">{{ item.name }}</p>
                                <p class="text-[10px] text-muted-themed">{{ item.address }}</p>
                            </div>
                        </div>
                        <span class="text-xs text-primary font-mono">{{ item.distance }}</span>
                    </div>
                </div>
                <div v-else class="p-8 text-center">
                    <Building2 class="w-8 h-8 text-muted-themed mx-auto mb-2" />
                    <p class="text-xs text-muted-themed">选择类型后搜索周边兴趣点</p>
                </div>
            </div>
        </div>

        <!-- ==================== 关键字搜索 ==================== -->
        <div v-if="activeMode === 'keyword'" class="space-y-4">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-3">
                    <div class="relative flex-1">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
                        <input v-model="keyword" type="text" placeholder="输入设施名称、编号、类型..."
                            class="w-full pl-9 pr-4 py-2.5 bg-input border border-themed rounded-lg text-sm text-default placeholder-(--text-muted) focus:outline-none focus:border-primary transition-colors"
                            @keyup.enter="doKeywordSearch" />
                    </div>
                    <button @click="doKeywordSearch"
                        class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Search class="w-3.5 h-3.5" /> 搜索
                    </button>
                </div>
            </div>
            <div v-if="keywordResults.length"
                class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">名称</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">区域</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in keywordResults" :key="item.code"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ item.code }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ item.name }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ item.type }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ item.district }}</td>
                            <td class="px-4 py-2.5 text-xs">
                                <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(item.status)">{{
                                    item.status }}</span>
                            </td>
                            <td class="px-4 py-2.5 text-xs">
                                <button class="text-primary hover:underline text-xs cursor-pointer">定位</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ==================== 空间关系查询 ==================== -->
        <div v-if="activeMode === 'spatial'" class="grid grid-cols-3 gap-4">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-4 flex items-center gap-2">
                    <GitBranch class="w-4 h-4 text-primary" />空间关系查询
                </h3>
                <div class="space-y-3">
                    <div>
                        <label class="text-xs text-dim mb-1 block">目标设施编号</label>
                        <input v-model="spatialTarget" type="text" placeholder="如 MH-003456"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">关系类型</label>
                        <div class="flex gap-1.5">
                            <button
                                v-for="t in [{ key: 'adjacent', label: '相邻' }, { key: 'contain', label: '包含' }, { key: 'connect', label: '连接' }]"
                                :key="t.key" @click="spatialType = t.key"
                                class="flex-1 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer text-center"
                                :class="spatialType === t.key ? 'border-primary bg-primary/10 text-primary' : 'border-themed text-dim hover:bg-hover-themed'">
                                {{ t.label }}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1 block">搜索半径 (m)</label>
                        <input v-model="spatialRadius" type="number"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <button @click="doSpatialQuery"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <GitBranch class="w-3.5 h-3.5" /> 查询
                    </button>
                </div>
            </div>
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default">空间关系结果</h3>
                </div>
                <div v-if="spatialResults.length" class="p-3 space-y-2">
                    <div v-for="(item, i) in spatialResults" :key="i"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                                <GitBranch class="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p class="text-xs font-medium text-default">{{ item.name }}</p>
                                <p class="text-[10px] text-muted-themed">{{ item.type }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-[10px] px-2 py-0.5 rounded-md bg-info/15 text-info">{{ item.relation
                                }}</span>
                            <span class="text-xs font-mono text-dim">{{ item.distance }}</span>
                        </div>
                    </div>
                </div>
                <div v-else class="p-8 text-center">
                    <GitBranch class="w-8 h-8 text-muted-themed mx-auto mb-2" />
                    <p class="text-xs text-muted-themed">输入设施编号后查询空间关系</p>
                </div>
            </div>
        </div>

        <!-- ==================== 复合查询 ==================== -->
        <div v-if="activeMode === 'compound'" class="space-y-4">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-4 flex items-center gap-2">
                    <Filter class="w-4 h-4 text-primary" />复合查询条件
                </h3>
                <div class="grid grid-cols-5 gap-3">
                    <div>
                        <label class="text-xs text-dim mb-1 block">设施类型</label>
                        <select v-model="compoundForm.type"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                            <option value="">全部类型</option>
                            <option v-for="t in facilityTypes" :key="t">{{ t }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1 block">状态</label>
                        <select v-model="compoundForm.status"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                            <option value="">全部状态</option>
                            <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1 block">区域</label>
                        <select v-model="compoundForm.district"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                            <option value="">全部区域</option>
                            <option v-for="d in districtOptions" :key="d">{{ d }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1 block">建设年份</label>
                        <div class="flex gap-1">
                            <input v-model="compoundForm.yearFrom" type="text" placeholder="起始"
                                class="w-full bg-input border border-themed rounded-lg px-2 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                            <input v-model="compoundForm.yearTo" type="text" placeholder="结束"
                                class="w-full bg-input border border-themed rounded-lg px-2 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                    <div class="flex items-end gap-2">
                        <button @click="doCompoundQuery"
                            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                            <Search class="w-3.5 h-3.5" /> 查询
                        </button>
                        <button @click="resetCompound"
                            class="px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:bg-hover-themed transition-colors cursor-pointer">
                            重置
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="compoundResults.length"
                class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">名称</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">区域</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">建设年份</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in compoundResults" :key="item.code"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ item.code }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ item.name }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ item.type }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ item.district }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ item.year }}</td>
                            <td class="px-4 py-2.5 text-xs">
                                <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(item.status)">{{
                                    item.status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ==================== 地理编码批量查询 ==================== -->
        <div v-if="activeMode === 'geocode'" class="grid grid-cols-2 gap-4">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
                    <Globe class="w-4 h-4 text-primary" />批量地址输入
                </h3>
                <textarea v-model="batchInput" rows="8" placeholder="每行输入一个地址..."
                    class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary resize-none font-mono"></textarea>
                <div class="flex gap-2 mt-3">
                    <button @click="doBatchGeocode"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Globe class="w-3.5 h-3.5" /> 开始编码
                    </button>
                    <button
                        class="flex items-center gap-1.5 px-3 py-2.5 bg-card border border-themed rounded-lg text-xs text-dim hover:bg-hover-themed transition-colors cursor-pointer">
                        <Upload class="w-3.5 h-3.5" /> 导入文件
                    </button>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default">编码结果</h3>
                    <button v-if="batchResults.length"
                        class="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                        <Download class="w-3 h-3" /> 导出
                    </button>
                </div>
                <div v-if="batchResults.length" class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-themed">
                                <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">地址</th>
                                <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">经度</th>
                                <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">纬度</th>
                                <th class="text-left px-4 py-2 text-xs font-semibold text-dim bg-surface">匹配</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in batchResults" :key="i"
                                class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                                <td class="px-4 py-2 text-xs text-default max-w-48 truncate">{{ item.address }}</td>
                                <td class="px-4 py-2 text-xs font-mono text-dim">{{ item.lng }}</td>
                                <td class="px-4 py-2 text-xs font-mono text-dim">{{ item.lat }}</td>
                                <td class="px-4 py-2 text-xs">
                                    <span class="text-[10px] px-2 py-0.5 rounded-md"
                                        :class="getStatusClass(item.status)">{{ item.status }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="p-8 text-center">
                    <Globe class="w-8 h-8 text-muted-themed mx-auto mb-2" />
                    <p class="text-xs text-muted-themed">输入地址后开始编码</p>
                </div>
            </div>
        </div>

        <!-- ==================== 历史轨迹回放 ==================== -->
        <div v-if="activeMode === 'history'" class="space-y-4">
            <!-- 播放控制 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Clock class="w-4 h-4 text-primary" />轨迹回放控制
                    </h3>
                    <div class="flex items-center gap-2">
                        <button @click="stepBack"
                            class="p-1.5 bg-surface border border-themed rounded-lg hover:bg-hover-themed transition-colors cursor-pointer">
                            <SkipBack class="w-3.5 h-3.5 text-default" />
                        </button>
                        <button @click="togglePlay" class="p-2 rounded-lg transition-colors cursor-pointer"
                            :class="isPlaying ? 'bg-warning/20 text-warning' : 'bg-primary text-white'">
                            <Play v-if="!isPlaying" class="w-4 h-4" />
                            <Pause v-else class="w-4 h-4" />
                        </button>
                        <button @click="stepForward"
                            class="p-1.5 bg-surface border border-themed rounded-lg hover:bg-hover-themed transition-colors cursor-pointer">
                            <SkipForward class="w-3.5 h-3.5 text-default" />
                        </button>
                        <span class="text-xs text-muted-themed ml-2">{{ playIndex + 1 }} / {{ historyRecords.length
                            }}</span>
                    </div>
                </div>
                <!-- 进度条 -->
                <div class="mt-3 flex items-center gap-2">
                    <span class="text-[10px] text-muted-themed w-16">{{ historyRecords[0]?.time.split(' ')[1] }}</span>
                    <div class="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div class="h-full bg-primary rounded-full transition-all"
                            :style="{ width: ((playIndex + 1) / historyRecords.length * 100) + '%' }"></div>
                    </div>
                    <span class="text-[10px] text-muted-themed w-16 text-right">{{ historyRecords[historyRecords.length
                        - 1]?.time.split(' ')[1] }}</span>
                </div>
            </div>
            <!-- 历史记录 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default">定位操作历史</h3>
                </div>
                <div class="p-3 space-y-1">
                    <div v-for="(item, i) in historyRecords" :key="item.id"
                        class="flex items-center gap-3 p-3 rounded-lg transition-colors"
                        :class="i === playIndex ? 'bg-primary/10 border border-primary/30' : 'bg-surface hover:bg-hover-themed'">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                            :class="i === playIndex ? 'bg-primary/20' : 'bg-surface'">
                            <Clock class="w-4 h-4" :class="i === playIndex ? 'text-primary' : 'text-dim'" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-medium" :class="i === playIndex ? 'text-primary' : 'text-default'">{{
                                item.action }}</p>
                            <p class="text-[10px] text-muted-themed">{{ item.target }}</p>
                        </div>
                        <span class="text-[10px] text-muted-themed">{{ item.user }}</span>
                        <span class="text-[10px] text-muted-themed">{{ item.time }}</span>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
