<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, Radio, AlertTriangle, GitMerge, Droplets, Navigation, Waves, Bell, Building2, Users, TrendingUp, HardDrive, Wrench, BarChart3 } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'

const activeLayer = ref('facilities')
const layerTabs = [
    { key: 'facilities', label: '排水设施', icon: Map },
    { key: 'devices', label: '监测设备', icon: Radio },
    { key: 'defects', label: '设施缺陷', icon: AlertTriangle },
    { key: 'cross', label: '错混接', icon: GitMerge },
    { key: 'intrusion', label: '外水入侵', icon: Droplets },
    { key: 'outlet', label: '排放口', icon: Navigation },
    { key: 'patrol', label: '巡查养护', icon: Wrench },
    { key: 'alarm', label: '警告预警', icon: Bell },
    { key: 'plan', label: '排水规划', icon: Building2 },
    { key: 'users', label: '排水户', icon: Users },
    { key: 'highlevel', label: '高水位管段', icon: Waves },
    { key: 'collapse', label: '塌陷风险', icon: TrendingUp },
    { key: 'construction', label: '施工排水', icon: HardDrive },
]

const facilityMarkers = ref([
    { lng: 113.03, lat: 28.13, title: '韶山路泵站', label: '泵站 · 运行中', color: '' },
    { lng: 113.02, lat: 28.17, title: '洞井浏阳河污水厂', label: '污水厂 · 12万m³/日' },
    { lng: 113.07, lat: 28.13, title: '浏阳河闸门', label: '闸门 · 开启' },
    { lng: 113.03, lat: 28.10, title: '左家塘排放口A', label: '排放口 · 正常' },
    { lng: 113.04, lat: 28.15, title: '雨花截流井', label: '截流井 · 截流中' },
])
const deviceMarkers = ref([
    { lng: 113.04, lat: 28.14, title: '雨量计-CD01', label: '雨量 · 在线 · 0mm' },
    { lng: 113.02, lat: 28.16, title: '流量计-HD03', label: '流量 · 在线 · 520m³/h' },
    { lng: 113.08, lat: 28.13, title: '液位计-TZ02', label: '水位 · 在线 · 2.8m' },
    { lng: 113.03, lat: 28.09, title: '水质监测-FT01', label: '水质 · COD:180' },
])
const defectMarkers = ref([
    { lng: 113.05, lat: 28.14, title: '功能缺陷-淤积', label: '淤积 · 中等', color: 'red' },
    { lng: 113.03, lat: 28.17, title: '结构缺陷-破裂', label: '破裂 · 严重', color: 'red' },
    { lng: 113.05, lat: 28.12, title: '功能缺陷-堵塞', label: '堵塞 · 轻微' },
])
const crossMarkers = ref([
    { lng: 113.04, lat: 28.15, title: '混接点A', label: '雨混污 · 严重', color: 'red' },
    { lng: 113.02, lat: 28.15, title: '混接点B', label: '污混雨 · 中度' },
    { lng: 113.04, lat: 28.11, title: '混接点C', label: '雨混污 · 轻微' },
])
const intrusionMarkers = ref([
    { lng: 113.04, lat: 28.15, title: '入侵点1', label: '地下水 · 大量', color: 'red' },
    { lng: 113.03, lat: 28.16, title: '入侵点2', label: '河水 · 少量' },
])
const outletMarkers = ref([
    { lng: 113.04, lat: 28.13, title: '雨水口A', label: '雨水口 · 正常' },
    { lng: 113.04, lat: 28.10, title: '溢流口B', label: '溢流口 · 超标', color: 'red' },
    { lng: 113.05, lat: 28.14, title: '排放口C', label: '排放口 · 正常' },
])
const alarmMarkers = ref([
    { lng: 113.04, lat: 28.15, title: '雨量告警', label: '雨量超限 · 红色', color: 'red' },
    { lng: 113.02, lat: 28.17, title: '水位告警', label: '水位超标 · 橙色', color: 'red' },
    { lng: 113.07, lat: 28.13, title: '泵站告警', label: '设备故障 · 黄色' },
])
const planMarkers = ref([
    { lng: 113.06, lat: 28.15, title: '新建管网A', label: '规划 · 2025年' },
    { lng: 113.05, lat: 28.15, title: '改造区域B', label: '改造 · 进行中' },
    { lng: 113.06, lat: 28.11, title: '未来泵站C', label: '规划 · 2026年' },
])
const userMarkers = ref([
    { lng: 113.05, lat: 28.15, title: '雨花工业园', label: 'A类 · 重点 · 800m³/日' },
    { lng: 113.02, lat: 28.17, title: '雨花科技大厦', label: 'B类 · 一般 · 120m³/日' },
])
const highLevelMarkers = ref([
    { lng: 113.05, lat: 28.13, title: '高水位管段A', label: '水位率 91% · 高风险', color: 'red' },
    { lng: 113.02, lat: 28.15, title: '高水位管段B', label: '水位率 75% · 中风险' },
])
const collapseMarkers = ref([
    { lng: 113.04, lat: 28.14, title: '高风险区A', label: '塌陷风险 · 高', color: 'red' },
    { lng: 113.03, lat: 28.15, title: '中风险区B', label: '塌陷风险 · 中' },
])
const constructionMarkers = ref([
    { lng: 113.05, lat: 28.13, title: '施工点1', label: '临时排水 · 合规' },
    { lng: 113.03, lat: 28.17, title: '施工点2', label: '临时排水 · 超标', color: 'red' },
])

const markersMap: Record<string, any> = {
    facilities: facilityMarkers, devices: deviceMarkers, defects: defectMarkers,
    cross: crossMarkers, intrusion: intrusionMarkers, outlet: outletMarkers,
    patrol: facilityMarkers, alarm: alarmMarkers, plan: planMarkers,
    users: userMarkers, highlevel: highLevelMarkers, collapse: collapseMarkers,
    construction: constructionMarkers,
}

const layerDescriptions: Record<string, { title: string; desc: string; items: string[] }> = {
    facilities: { title: '排水设施一张图', desc: '整合展示排水户、管网、泵站、污水厂、闸门、排放口、截流井等全域设施分布', items: ['排水户展示', '管网布局', '泵站运行状态', '污水厂定位', '闸门启闭', '排放口分布', '截流井状态'] },
    devices: { title: '监测设备一张图', desc: '展示雨量/流量/水位/水质四类监测设备分布与在线状态', items: ['雨量计', '流量计', '液位计', '水质监测'] },
    defects: { title: '设施缺陷一张图', desc: '标注管网功能性与结构性缺陷分布、等级及普查成果', items: ['功能缺陷(淤积/堵塞)', '结构缺陷(破裂/变形)', '普查成果'] },
    cross: { title: '错混接一张图', desc: '精准标注雨污错混接点位，按类型/程度分级渲染', items: ['空间分布', '类型分类渲染', '程度分级', '详情查询'] },
    intrusion: { title: '外水入侵一张图', desc: '动态标识外水入侵点位，按来源/入侵量分级渲染', items: ['空间分布', '来源分类', '入侵量分级', '详情查询'] },
    outlet: { title: '排放口一张图', desc: '展示排放口分布，按类型标注，超标预警高亮', items: ['空间分布', '类型分类', '超标预警', '详情查询'] },
    patrol: { title: '巡查养护一张图', desc: '展示规划/执行路线与巡查养护内容完成情况', items: ['规划路线', '执行路线', '规划内容', '养护内容'] },
    alarm: { title: '警告预警一张图', desc: '汇聚雨量/流量/水位/水质/内涝/污水厂/泵站告警', items: ['雨量告警', '流量告警', '水位告警', '水质告警', '内涝模拟', '污水厂告警', '泵站告警'] },
    plan: { title: '排水规划一张图', desc: '加载新建管网/改造区域/未来泵站布局规划图层', items: ['新建管网', '改造区域', '未来泵站', '叠加对比'] },
    users: { title: '排水户一张图', desc: '展示排水户分布、分级渲染、统计看板与管网联动', items: ['空间分布', '分级渲染', '统计看板', '管网联动', '监测关联', '档案详情'] },
    highlevel: { title: '高水位管段一张图', desc: '动态标识高水位运行管段，分级展示风险与影响范围', items: ['动态标识', '风险分级', '关联分析', '影响范围', '详情查询'] },
    collapse: { title: '地面塌陷风险一张图', desc: '综合评估塌陷风险，分区可视化与防控指引', items: ['综合评估', '等级分区', '关联分析', '防控指引', '详情钻取'] },
    construction: { title: '施工排水一张图', desc: '展示施工工地临时排水点位、许可、监测与合规监控', items: ['点位展示', '许可关联', '监测实时', '合规预警', '影响评估', '巡查记录'] },
}

// 点击详情弹窗 (#43-46, #47, #50)
const showDetailPopup = ref(false)
const detailInfo = ref<any>(null)

// 排水户分层渲染 (#48)
const userFilterType = ref('all')
const userCategories = [
    { key: 'all', label: '全部', color: '#3B82F6' },
    { key: 'industrial', label: '工业', color: '#EF4444' },
    { key: 'commercial', label: '商业', color: '#F97316' },
    { key: 'residential', label: '居民', color: '#10B981' },
]

// 统计分析 (#49, #51)
const showStatsPanel = ref(false)
const layerStats = computed(() => {
    if (activeLayer.value === 'users') return [
        { label: '工业户', value: 28, pct: 35, color: '#EF4444' },
        { label: '商业户', value: 32, pct: 40, color: '#F97316' },
        { label: '居民户', value: 20, pct: 25, color: '#10B981' },
    ]
    if (activeLayer.value === 'devices') return [
        { label: '雨量计', value: 45, pct: 29, color: '#3B82F6' },
        { label: '流量计', value: 38, pct: 24, color: '#00D4AA' },
        { label: '液位计', value: 42, pct: 27, color: '#FFB020' },
        { label: '水质站', value: 31, pct: 20, color: '#8B5CF6' },
    ]
    return []
})

// 设备密度展示模式 (#51)
const densityMode = ref<'marker' | 'heatmap' | 'cluster'>('marker')
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto flex-1">
                <button v-for="lt in layerTabs" :key="lt.key" @click="activeLayer = lt.key"
                    class="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                    :class="activeLayer === lt.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="lt.icon" class="w-3 h-3" />{{ lt.label }}
                </button>
            </div>
            <button @click="showStatsPanel = !showStatsPanel"
                class="ml-2 flex items-center gap-1 px-2.5 py-1.5 bg-card border border-themed rounded-lg text-[10px] text-dim hover:text-default cursor-pointer">
                <BarChart3 class="w-3 h-3" />统计
            </button>
        </div>

        <!-- 排水户分层渲染切换 -->
        <div v-if="activeLayer === 'users'" class="flex items-center gap-2">
            <span class="text-[10px] text-dim">分层:</span>
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="uc in userCategories" :key="uc.key" @click="userFilterType = uc.key"
                    class="px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors"
                    :class="userFilterType === uc.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    {{ uc.label }}
                </button>
            </div>
        </div>

        <!-- 设备密度模式切换 -->
        <div v-if="activeLayer === 'devices'" class="flex items-center gap-2">
            <span class="text-[10px] text-dim">展示模式:</span>
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button
                    v-for="dm in [{ key: 'marker', label: '标记点' }, { key: 'heatmap', label: '热力图' }, { key: 'cluster', label: '聚合' }]"
                    :key="dm.key" @click="densityMode = dm.key as any"
                    class="px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors"
                    :class="densityMode === dm.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    {{ dm.label }}
                </button>
            </div>
        </div>

        <div class="grid grid-cols-4 gap-3">
            <div class="col-span-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
                    <AMapView :markers="markersMap[activeLayer]?.value ?? []" height="420px" />
                </div>
            </div>
            <div class="col-span-1 space-y-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <h3 class="text-sm font-bold text-default mb-1">{{ layerDescriptions[activeLayer]?.title }}</h3>
                    <p class="text-[10px] text-dim mb-3">{{ layerDescriptions[activeLayer]?.desc }}</p>
                    <div class="space-y-1">
                        <div v-for="item in layerDescriptions[activeLayer]?.items" :key="item"
                            class="flex items-center gap-2 text-[10px]">
                            <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            <span class="text-default">{{ item }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-2">图层统计</span>
                    <div class="space-y-1.5 text-[10px]">
                        <div class="flex justify-between"><span class="text-dim">标注点数</span><span
                                class="text-primary font-bold">{{ markersMap[activeLayer]?.value?.length ?? 0 }}</span>
                        </div>
                        <div class="flex justify-between"><span class="text-dim">告警点数</span><span
                                class="text-danger font-bold">{{markersMap[activeLayer]?.value?.filter((m: any) =>
                                    m.color === 'red').length ?? 0}}</span></div>
                    </div>
                </div>

                <!-- 统计分析面板 -->
                <div v-if="showStatsPanel && layerStats.length > 0"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-2">分类统计</span>
                    <div class="space-y-2">
                        <div v-for="s in layerStats" :key="s.label" class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: s.color }"></span>
                            <span class="text-[10px] text-default flex-1">{{ s.label }}</span>
                            <span class="text-[10px] text-dim">{{ s.value }}个</span>
                            <div class="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full"
                                    :style="{ width: s.pct + '%', backgroundColor: s.color }">
                                </div>
                            </div>
                            <span class="text-[10px] font-bold" :style="{ color: s.color }">{{ s.pct }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 点击详情弹窗 -->
        <ModalDialog :show="showDetailPopup" :title="detailInfo?.title || '详情'" width="400px"
            @close="showDetailPopup = false" @confirm="showDetailPopup = false">
            <div v-if="detailInfo" class="space-y-2 text-xs">
                <div class="grid grid-cols-2 gap-2">
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">名称</p>
                        <p class="text-default font-medium">{{ detailInfo.title }}</p>
                    </div>
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">信息</p>
                        <p class="text-default">{{ detailInfo.label }}</p>
                    </div>
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">经度</p>
                        <p class="text-default font-mono">{{ detailInfo.lng }}</p>
                    </div>
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">纬度</p>
                        <p class="text-default font-mono">{{ detailInfo.lat }}</p>
                    </div>
                </div>
                <div class="p-2 rounded-lg bg-surface">
                    <p class="text-[10px] text-dim">所属图层</p>
                    <p class="text-default">{{ layerDescriptions[activeLayer]?.title }}</p>
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
