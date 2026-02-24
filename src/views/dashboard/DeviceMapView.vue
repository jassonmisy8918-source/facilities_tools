<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { Radio, Move, Eye, EyeOff, Palette, MonitorPlay } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'

const activeTab = ref<'map' | 'density' | 'config'>('map')

// ===== 设备数据 =====
const deviceTypes = ref([
    { key: 'rain', label: '雨量设备', color: '#3B82F6', visible: true },
    { key: 'flow', label: '流量设备', color: '#10B981', visible: true },
    { key: 'level', label: '水位设备', color: '#F59E0B', visible: true },
    { key: 'quality', label: '水质设备', color: '#8B5CF6', visible: true },
])

const devices: Record<string, { lng: number; lat: number; title: string; info: Record<string, string> }[]> = {
    rain: [
        { lng: 113.030, lat: 28.155, title: 'RG-001 芙蓉路雨量站', info: { 编号: 'RG-001', 位置: '芙蓉路350号', 型号: 'SL-3', 状态: '在线', 当前雨量: '0.0mm/h', 累计雨量: '15.2mm', 采样周期: '5min', 安装日期: '2022-06-15' } },
        { lng: 113.045, lat: 28.142, title: 'RG-005 韶山路雨量站', info: { 编号: 'RG-005', 位置: '韶山路120号', 型号: 'SL-3', 状态: '在线', 当前雨量: '0.0mm/h', 累计雨量: '14.8mm', 采样周期: '5min', 安装日期: '2022-08-20' } },
        { lng: 113.062, lat: 28.118, title: 'RG-009 黎托路雨量站', info: { 编号: 'RG-009', 位置: '黎托路50号', 型号: 'SL-5', 状态: '在线', 当前雨量: '0.0mm/h', 累计雨量: '16.1mm', 采样周期: '5min', 安装日期: '2023-01-10' } },
    ],
    flow: [
        { lng: 113.038, lat: 28.145, title: 'FM-001 圭塘河主管流量计', info: { 编号: 'FM-001', 位置: '圭塘河路', 型号: 'MAG-5100W', 管径: 'DN800', 状态: '在线', 瞬时流量: '1250m³/h', 累计流量: '28500m³', 安装日期: '2021-11-20' } },
        { lng: 113.050, lat: 28.132, title: 'FM-008 劳动路流量计', info: { 编号: 'FM-008', 位置: '劳动路80号', 型号: 'MAG-3100', 管径: 'DN600', 状态: '在线', 瞬时流量: '680m³/h', 累计流量: '15200m³', 安装日期: '2022-03-15' } },
        { lng: 113.028, lat: 28.150, title: 'FM-012 侯家塘流量计', info: { 编号: 'FM-012', 位置: '侯家塘路', 型号: 'MAG-5100W', 管径: 'DN1000', 状态: '离线', 瞬时流量: '-', 累计流量: '32100m³', 安装日期: '2021-08-10' } },
    ],
    level: [
        { lng: 113.042, lat: 28.138, title: 'LG-003 万家丽路液位计', info: { 编号: 'LG-003', 位置: '万家丽路200号', 型号: 'UL-300', 状态: '在线', 当前液位: '1.85m', 报警液位: '3.0m', 安装日期: '2022-05-08' } },
        { lng: 113.055, lat: 28.128, title: 'LG-007 圭塘泵站液位计', info: { 编号: 'LG-007', 位置: '圭塘泵站', 型号: 'UL-500', 状态: '在线', 当前液位: '2.10m', 报警液位: '4.0m', 安装日期: '2021-12-01' } },
    ],
    quality: [
        { lng: 113.033, lat: 28.150, title: 'WQ-001 浏阳河排口水质', info: { 编号: 'WQ-001', 位置: '浏阳河排口', 型号: 'WQM-9000', 状态: '在线', COD: '28mg/L', NH3N: '1.2mg/L', pH: '7.2', SS: '15mg/L', 安装日期: '2022-09-15' } },
        { lng: 113.048, lat: 28.135, title: 'WQ-005 圭塘河水质', info: { 编号: 'WQ-005', 位置: '圭塘河排口', 型号: 'WQM-9000', 状态: '预警', COD: '45mg/L', NH3N: '3.8mg/L', pH: '6.8', SS: '28mg/L', 安装日期: '2023-02-20' } },
    ],
}

const visibleMarkers = computed(() => {
    const result: { lng: number; lat: number; title: string; label?: string; color?: string }[] = []
    deviceTypes.value.forEach(dt => {
        if (!dt.visible) return
            ; (devices[dt.key] || []).forEach(d => result.push({ lng: d.lng, lat: d.lat, title: d.title, label: d.title, color: dt.color }))
    })
    return result
})

const showDetail = ref(false)
const detailTitle = ref('')
const detailInfo = ref<Record<string, string>>({})
function viewDevice(title: string) {
    for (const key of Object.keys(devices)) {
        const found = devices[key]?.find(d => d.title === title)
        if (found) { detailTitle.value = found.title; detailInfo.value = found.info; showDetail.value = true; return }
    }
}

// ===== 热力图（密度展示） =====
const AMAP_KEY = '2831a4407f599a6815d9fa2608676c9e'
const AMAP_SECURITY_CODE = '01051b2c2a2b850b592d80160a115710'
const heatmapRef = ref<HTMLDivElement>()
let heatmapInstance: any = null

function generateHeatPoints() {
    const pts: { lng: number; lat: number; count: number }[] = []
    Object.values(devices).flat().forEach(d => {
        for (let i = 0; i < 5; i++) {
            pts.push({ lng: d.lng + (Math.random() - 0.5) * 0.01, lat: d.lat + (Math.random() - 0.5) * 0.008, count: 80 + Math.random() * 20 })
        }
    })
    return pts
}

async function initHeatmap() {
    if (!heatmapRef.value || heatmapInstance) return
    try {
        if (!(window as any).AMap) {
            if (AMAP_SECURITY_CODE) (window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script'); s.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
                s.onload = () => resolve(); s.onerror = () => reject(); document.head.appendChild(s)
            })
        }
        const AMap = (window as any).AMap
        heatmapInstance = new AMap.Map(heatmapRef.value, { zoom: 14, center: [113.042, 28.138], mapStyle: 'amap://styles/normal', resizeEnable: true })
        AMap.plugin(['AMap.HeatMap'], () => {
            const heatmap = new AMap.HeatMap(heatmapInstance, { radius: 35, opacity: [0, 0.8], gradient: { 0.2: '#0033FF', 0.4: '#00BFFF', 0.6: '#7CFC00', 0.8: '#FFD700', 1.0: '#FF4500' } })
            heatmap.setDataSet({ data: generateHeatPoints(), max: 100 })
        })
    } catch (e) { console.error('Heatmap failed:', e) }
}

watch(activeTab, async (val) => { if (val === 'density') { await nextTick(); initHeatmap() } })
onBeforeUnmount(() => { if (heatmapInstance) { heatmapInstance.destroy(); heatmapInstance = null } })

// ===== 配置面板 =====
const configPanels = ref([
    { id: 1, name: '设备状态面板', x: 0, y: 0, w: 2, h: 1, bg: '#3B82F6', fontSize: 12, visible: true, source: '实时数据' },
    { id: 2, name: '告警统计面板', x: 2, y: 0, w: 2, h: 1, bg: '#EF4444', fontSize: 12, visible: true, source: '实时数据' },
    { id: 3, name: '水质监测面板', x: 0, y: 1, w: 2, h: 1, bg: '#8B5CF6', fontSize: 12, visible: true, source: '历史数据' },
    { id: 4, name: '流量趋势面板', x: 2, y: 1, w: 2, h: 1, bg: '#10B981', fontSize: 12, visible: true, source: '实时数据' },
])
const showPreview = ref(false)
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Radio class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">监测设备一张图</span>
            </div>
            <div class="flex items-center gap-0.5 bg-surface rounded-lg p-0.5">
                <button @click="activeTab = 'map'"
                    class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                    :class="activeTab === 'map' ? 'bg-primary text-white' : 'text-dim'">
                    <Eye class="w-3 h-3" />设备位置
                </button>
                <button @click="activeTab = 'density'"
                    class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                    :class="activeTab === 'density' ? 'bg-primary text-white' : 'text-dim'">
                    <Radio class="w-3 h-3" />分布密度
                </button>
                <button @click="activeTab = 'config'"
                    class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                    :class="activeTab === 'config' ? 'bg-primary text-white' : 'text-dim'">
                    <Palette class="w-3 h-3" />页面配置
                </button>
            </div>
        </div>

        <!-- 设备位置 -->
        <template v-if="activeTab === 'map'">
            <div class="flex items-center gap-1 mb-1">
                <button v-for="dt in deviceTypes" :key="dt.key" @click="dt.visible = !dt.visible"
                    class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                    :class="dt.visible ? 'bg-primary/10 text-primary' : 'bg-surface text-dim'">
                    <component :is="dt.visible ? Eye : EyeOff" class="w-3 h-3" />
                    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: dt.color }"></span>{{ dt.label }}
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <AMapView :markers="visibleMarkers" :center="[113.042, 28.138]" :zoom="14" height="380px" />
            </div>
            <div class="grid grid-cols-4 gap-3">
                <div v-for="dt in deviceTypes" :key="dt.key"
                    class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <div class="w-3 h-3 rounded-full mx-auto mb-1" :style="{ backgroundColor: dt.color }"></div>
                    <p class="text-xl font-bold text-default">{{ (devices[dt.key] || []).length }}</p>
                    <p class="text-[10px] text-dim">{{ dt.label }}</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="dt in deviceTypes" :key="dt.key">
                            <tr v-for="d in devices[dt.key]" :key="d.title"
                                class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                                <td class="px-3 py-2"><span
                                        class="text-[9px] px-1.5 py-0.5 rounded font-medium text-white"
                                        :style="{ backgroundColor: dt.color }">{{ dt.label }}</span></td>
                                <td class="px-3 py-2 text-default font-medium">{{ d.title }}</td>
                                <td class="text-center px-2 py-2"><span
                                        class="text-[9px] px-1.5 py-0.5 rounded font-medium"
                                        :class="d.info['状态'] === '在线' ? 'bg-success/10 text-success' : d.info['状态'] === '预警' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'">{{
                                            d.info['状态'] }}</span></td>
                                <td class="text-center px-2 py-2"><button @click="viewDevice(d.title)"
                                        class="text-primary text-[10px] cursor-pointer hover:underline">详情</button></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 分布密度热力图 -->
        <template v-if="activeTab === 'density'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div ref="heatmapRef" class="w-full rounded-lg" style="height: 400px;"></div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
                <p class="text-xs font-semibold text-default mb-2">密度说明</p>
                <div class="flex items-center gap-2">
                    <div class="flex-1 h-3 rounded-full"
                        style="background: linear-gradient(to right, #0033FF, #00BFFF, #7CFC00, #FFD700, #FF4500)">
                    </div>
                    <div class="flex justify-between text-[9px] text-dim w-24">
                        <span>低</span><span>中</span><span>高</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- 页面配置（拖拽/样式/数据源/预览） -->
        <template v-if="activeTab === 'config'">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-default">面板配置</span>
                <button @click="showPreview = true"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium cursor-pointer hover:bg-primary-light transition-colors">
                    <MonitorPlay class="w-3.5 h-3.5" />预览
                </button>
            </div>
            <div class="space-y-2">
                <div v-for="p in configPanels" :key="p.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-3">
                        <Move class="w-3.5 h-3.5 text-dim cursor-move shrink-0" />
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-default">{{ p.name }}</span>
                                <span class="text-[9px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ p.source }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 shrink-0 text-[10px]">
                            <div class="flex items-center gap-1">
                                <span class="text-dim">颜色:</span>
                                <input type="color" v-model="p.bg" class="w-5 h-5 border-0 rounded cursor-pointer" />
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="text-dim">字号:</span>
                                <input v-model.number="p.fontSize" type="number" min="10" max="24"
                                    class="w-10 bg-input border border-themed rounded px-1.5 py-0.5 text-center text-default focus:outline-none focus:border-primary" />
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="text-dim">数据:</span>
                                <select v-model="p.source"
                                    class="bg-input border border-themed rounded px-1.5 py-0.5 text-default focus:outline-none focus:border-primary">
                                    <option>实时数据</option>
                                    <option>历史数据</option>
                                </select>
                            </div>
                            <label class="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" v-model="p.visible" class="w-3 h-3 accent-primary" />
                                <span :class="p.visible ? 'text-success' : 'text-danger'">{{ p.visible ? '显示' : '隐藏'
                                    }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 预览弹窗 -->
        <ModalDialog :show="showPreview" title="页面预览" width="700px" @close="showPreview = false"
            @confirm="showPreview = false">
            <div class="grid grid-cols-2 gap-3">
                <div v-for="p in configPanels.filter(pp => pp.visible)" :key="p.id"
                    class="rounded-xl p-4 text-white text-center"
                    :style="{ backgroundColor: p.bg, fontSize: p.fontSize + 'px' }">
                    <p class="font-bold">{{ p.name }}</p>
                    <p class="text-sm opacity-80 mt-1">{{ p.source }}</p>
                </div>
            </div>
        </ModalDialog>

        <ModalDialog :show="showDetail" :title="detailTitle" @close="showDetail = false" @confirm="showDetail = false">
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div v-for="(v, k) in detailInfo" :key="k" class="p-2.5 rounded-lg bg-surface">
                    <p class="text-dim text-[10px]">{{ k }}</p>
                    <p class="text-default font-medium mt-0.5">{{ v }}</p>
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
