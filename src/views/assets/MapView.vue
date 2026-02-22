<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, toLonLat } from 'ol/proj'
import ScaleLine from 'ol/control/ScaleLine'
import {
  Layers, MapPin, Maximize2, Minus as MinusIcon, Plus, Ruler, Search, X, Info,
  Crosshair, Camera, Bookmark, ChevronDown, ChevronRight,
  Map as MapIcon, Satellite, Moon, Flame, SlidersHorizontal, Database,
  Navigation, BookmarkPlus, Trash2, SquareSplitHorizontal
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const mapContainer = ref<HTMLElement>()
const mapContainer2 = ref<HTMLElement>()
let map: Map | null = null
let map2: Map | null = null

// ===================== 底图源 =====================
const baseMapTypes = [
  { key: 'normal', label: '标准', icon: MapIcon, url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}' },
  { key: 'satellite', label: '卫星', icon: Satellite, url: 'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}' },
  { key: 'dark', label: '暗色', icon: Moon, url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}' },
]
const activeBaseMap = ref('normal')

function createTileLayer(url: string) {
  return new TileLayer({ source: new XYZ({ url, crossOrigin: 'anonymous' }) })
}

function switchBaseMap(key: string) {
  activeBaseMap.value = key
  if (!map) return
  const bm = baseMapTypes.find(b => b.key === key)
  if (!bm) return
  const layers = map.getLayers()
  layers.setAt(0, createTileLayer(bm.url))
  toast.value?.show(`已切换至${bm.label}地图`, 'info')
}

// ===================== 专题图层 =====================
const layerGroups = ref([
  {
    name: '基础管网', expanded: true,
    layers: [
      { key: 'rainPipe', label: '雨水管网', color: '#3B82F6', visible: true, count: 1248, opacity: 1, desc: '雨水收集管网' },
      { key: 'sewagePipe', label: '污水管网', color: '#00D4AA', visible: true, count: 987, opacity: 1, desc: '污水输送管网' },
      { key: 'combinedPipe', label: '合流管网', color: '#FFB020', visible: true, count: 412, opacity: 1, desc: '雨污合流管网' },
      { key: 'outlet', label: '排放口', color: '#F97316', visible: true, count: 89, opacity: 1, desc: '各类排放口位置及状态' },
    ]
  },
  {
    name: '监测运维', expanded: true,
    layers: [
      { key: 'pump', label: '排水泵站', color: '#FF4757', visible: true, count: 18, opacity: 1, desc: '泵站设施位置及运行状态' },
      { key: 'monitor', label: '监测设备', color: '#8B5CF6', visible: true, count: 156, opacity: 1, desc: '雨量计、流量计等设备' },
      { key: 'patrol', label: '巡查养护', color: '#06B6D4', visible: false, count: 45, opacity: 1, desc: '巡查路线与养护范围' },
      { key: 'alarm', label: '警告预警', color: '#EF4444', visible: false, count: 23, opacity: 1, desc: '实时预警点位标注' },
    ]
  },
  {
    name: '问题管理', expanded: false,
    layers: [
      { key: 'defect', label: '管网缺陷', color: '#EF4444', visible: false, count: 67, opacity: 1, desc: '缺陷位置及等级' },
      { key: 'crossConn', label: '雨污混接', color: '#EC4899', visible: false, count: 34, opacity: 1, desc: '错混接溯源信息' },
      { key: 'intrusion', label: '外水入侵', color: '#14B8A6', visible: false, count: 21, opacity: 1, desc: '外水入渗区域标识' },
      { key: 'planning', label: '排水规划', color: '#6366F1', visible: false, count: 8, opacity: 1, desc: '新建管网及改造区域' },
    ]
  },
])

const allLayers = computed(() => layerGroups.value.flatMap(g => g.layers))
const visibleCount = computed(() => allLayers.value.filter(l => l.visible).length)

function toggleGroupAll(group: typeof layerGroups.value[0], val: boolean) {
  group.layers.forEach(l => l.visible = val)
}

// ===================== 面板控制 =====================
const showBaseMapPicker = ref(false)
const showBookmarkPanel = ref(false)
const activePanel = ref<'layers' | 'manage' | ''>('layers')

function openPanel(panel: 'layers' | 'manage') {
  activePanel.value = activePanel.value === panel ? '' : panel
}

// ===================== 搜索功能 =====================
const searchQuery = ref('')
const showSearchResults = ref(false)
const mockSearchResults = [
  { id: 1, name: 'PS-001234 朝阳路DN600-P05', type: '污水管', status: '正常', coord: [116.397, 39.909] },
  { id: 2, name: 'MH-003456 朝阳路检查井#34', type: '检查井', status: '轻微缺陷', coord: [116.401, 39.912] },
  { id: 3, name: 'BZ-01 朝阳路泵站', type: '泵站', status: '运行中', coord: [116.394, 39.907] },
  { id: 4, name: 'JC-012 民生路流量计', type: '监测设备', status: '在线', coord: [116.410, 39.915] },
  { id: 5, name: 'PF-003 东湖排放口', type: '排放口', status: '正常排放', coord: [116.385, 39.920] },
]
const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  return mockSearchResults.filter(r => r.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || r.type.includes(searchQuery.value))
})

function handleSearch() {
  showSearchResults.value = searchQuery.value.length > 0
}

function locateResult(r: typeof mockSearchResults[0]) {
  showSearchResults.value = false
  searchQuery.value = r.name
  if (map) {
    map.getView().animate({ center: fromLonLat(r.coord), zoom: 17, duration: 600 })
  }
  toast.value?.show(`已定位至 ${r.name}`, 'success')
}

// ===================== 点选弹窗 =====================
const showInfoPopup = ref(true)
const popupInfo = ref({
  name: '朝阳路DN600 P05-P06段', code: 'PS-001234', type: '污水管',
  material: 'HDPE', diameter: 'DN600', length: '128.5m', status: '正常', buildYear: '2018',
})

// ===================== 工具栏 =====================
const activeTool = ref('')
function toggleTool(tool: string) {
  activeTool.value = activeTool.value === tool ? '' : tool
  if (activeTool.value) {
    const labels: Record<string, string> = {
      measure: '测量模式已开启，点击地图测距', area: '面积测量模式',
      flow: '管网流向动态展示已开启', '3d': '三维视图需加载三维地形数据'
    }
    toast.value?.show(labels[activeTool.value] || '', 'info')
  }
}

// 放大
function zoomIn() { map?.getView().animate({ zoom: (map.getView().getZoom() || 13) + 1, duration: 250 }) }
// 缩小
function zoomOut() { map?.getView().animate({ zoom: (map.getView().getZoom() || 13) - 1, duration: 250 }) }
// 全局视图
function resetView() {
  map?.getView().animate({ center: fromLonLat([116.397428, 39.90923]), zoom: 13, duration: 500 })
  toast.value?.show('已恢复全局视图', 'info')
}
// 截图导出
function exportScreenshot() {
  if (!map) return
  map.once('rendercomplete', () => {
    const canvas = document.querySelector('.ol-layer canvas') as HTMLCanvasElement
    if (canvas) {
      const link = document.createElement('a')
      link.download = `设施一张图_${new Date().toLocaleDateString()}.png`
      link.href = canvas.toDataURL()
      link.click()
      toast.value?.show('地图截图已导出', 'success')
    }
  })
  map.renderSync()
}

// ===================== 书签管理 =====================
interface Bookmark { id: number; name: string; center: number[]; zoom: number; time: string }
const bookmarks = ref<Bookmark[]>([
  { id: 1, name: '朝阳路泵站区域', center: [116.397, 39.909], zoom: 16, time: '03-15 14:20' },
  { id: 2, name: '东湖排放口', center: [116.385, 39.920], zoom: 17, time: '03-14 09:10' },
])
const newBookmarkName = ref('')

function saveBookmark() {
  if (!map || !newBookmarkName.value) return
  const view = map.getView()
  const center = toLonLat(view.getCenter() || [0, 0])
  bookmarks.value.push({
    id: Date.now(), name: newBookmarkName.value,
    center, zoom: view.getZoom() || 13,
    time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  })
  newBookmarkName.value = ''
  toast.value?.show('书签已保存', 'success')
}

function loadBookmark(bm: Bookmark) {
  map?.getView().animate({ center: fromLonLat(bm.center), zoom: bm.zoom, duration: 500 })
  toast.value?.show(`已跳转至「${bm.name}」`, 'info')
}

function deleteBookmark(id: number) {
  bookmarks.value = bookmarks.value.filter(b => b.id !== id)
  toast.value?.show('书签已删除', 'success')
}

// ===================== 多视窗 =====================
const dualView = ref(false)
function toggleDualView() {
  dualView.value = !dualView.value
  if (dualView.value) {
    nextTick(() => {
      if (mapContainer2.value && !map2) {
        map2 = new Map({
          target: mapContainer2.value,
          layers: [createTileLayer(baseMapTypes[1]!.url)],
          view: new View({ center: fromLonLat([116.397428, 39.90923]), zoom: 15 })
        })
      }
      map?.updateSize()
      map2?.updateSize()
    })
    toast.value?.show('多视窗对比已开启', 'info')
  } else {
    if (map2) { map2.setTarget(undefined); map2 = null }
    nextTick(() => map?.updateSize())
  }
}

// ===================== 图层元数据弹窗 =====================
const showMetadata = ref(false)
const metadataLayer = ref<typeof allLayers.value[0] | null>(null)
function openMetadata(layer: typeof allLayers.value[0]) {
  metadataLayer.value = layer
  showMetadata.value = true
}

// ===================== 热力图 =====================
const heatmapOn = ref(false)
function toggleHeatmap() {
  heatmapOn.value = !heatmapOn.value
  toast.value?.show(heatmapOn.value ? '热力图已叠加' : '热力图已关闭', 'info')
}

// ===================== 统计概览 =====================
const facilityStats = ref([
  { label: '管道总长', value: '2,847', unit: 'km' },
  { label: '检查井', value: '12,456', unit: '座' },
  { label: '雨水口', value: '8,234', unit: '个' },
  { label: '泵站', value: '18', unit: '座' },
  { label: '排放口', value: '89', unit: '个' },
  { label: '监测设备', value: '156', unit: '台' },
])

// ===================== 初始化 =====================
onMounted(() => {
  if (mapContainer.value) {
    map = new Map({
      target: mapContainer.value,
      layers: [createTileLayer(baseMapTypes[0]!.url)],
      view: new View({ center: fromLonLat([116.397428, 39.90923]), zoom: 13 }),
      controls: []
    })
    map.addControl(new ScaleLine({ units: 'metric' }))
  }
})

onUnmounted(() => {
  map?.setTarget(undefined); map = null
  map2?.setTarget(undefined); map2 = null
})
</script>

<template>
  <div class="space-y-4">
    <!-- 统计概览 -->
    <div class="grid grid-cols-6 gap-3">
      <div v-for="stat in facilityStats" :key="stat.label"
        class="bg-card border border-themed rounded-lg p-3 shadow-themed flex items-center gap-3">
        <MapPin class="w-5 h-5 text-primary shrink-0" />
        <div>
          <p class="text-xs text-dim">{{ stat.label }}</p>
          <p class="text-lg font-bold text-default">{{ stat.value }} <span
              class="text-xs text-muted-themed font-normal">{{ stat.unit }}</span></p>
        </div>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="relative bg-card border border-themed rounded-xl shadow-themed overflow-hidden"
      style="height: calc(100vh - 240px);">

      <!-- 地图容器 -->
      <div class="flex w-full h-full">
        <div ref="mapContainer" class="h-full" :class="dualView ? 'w-1/2 border-r border-themed' : 'w-full'"></div>
        <div v-if="dualView" ref="mapContainer2" class="w-1/2 h-full"></div>
      </div>

      <!-- 多视窗标签 -->
      <div v-if="dualView" class="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <span class="px-2 py-1 bg-primary/90 text-white text-[10px] rounded-md font-medium">视窗 A · 标准地图</span>
        <span class="px-2 py-1 bg-info/90 text-white text-[10px] rounded-md font-medium">视窗 B · 卫星影像</span>
      </div>

      <!-- 搜索栏 -->
      <div class="absolute top-3 left-3 z-10 w-72">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
          <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="搜索设施编号/名称/类型..."
            class="w-full pl-9 pr-4 py-2 bg-card border border-themed rounded-lg text-sm text-default placeholder-(--text-muted) focus:outline-none focus:border-primary shadow-themed" />
        </div>
        <div v-show="showSearchResults && filteredResults.length > 0"
          class="mt-1 bg-card border border-themed rounded-lg shadow-themed overflow-hidden max-h-60 overflow-y-auto">
          <button v-for="r in filteredResults" :key="r.id" @click="locateResult(r)"
            class="w-full text-left px-3 py-2.5 border-b border-themed/50 last:border-0 hover:bg-hover-themed transition-colors cursor-pointer">
            <p class="text-xs font-medium text-default">{{ r.name }}</p>
            <p class="text-[10px] text-muted-themed">{{ r.type }} · {{ r.status }}</p>
          </button>
        </div>
      </div>

      <!-- ==================== 右侧面板区 ==================== -->

      <!-- 面板 Tab 按钮 -->
      <div class="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button @click="openPanel('layers')" title="专题图层"
          class="p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer"
          :class="activePanel === 'layers' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
          <Layers class="w-4 h-4" :class="activePanel === 'layers' ? 'text-primary' : 'text-default'" />
        </button>
        <button @click="openPanel('manage')" title="图层管理"
          class="p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer"
          :class="activePanel === 'manage' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
          <SlidersHorizontal class="w-4 h-4" :class="activePanel === 'manage' ? 'text-primary' : 'text-default'" />
        </button>
      </div>

      <!-- 专题图层面板 -->
      <div v-show="activePanel === 'layers'"
        class="absolute top-3 right-14 w-60 bg-card border border-themed rounded-xl shadow-themed p-3 z-10 max-h-[calc(100%-24px)] overflow-y-auto">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-1.5">
            <Layers class="w-4 h-4 text-primary" />
            <span class="text-xs font-semibold text-default">专题图层</span>
          </div>
          <span class="text-[10px] text-muted-themed">{{ visibleCount }}/{{ allLayers.length }} 已启用</span>
        </div>

        <div v-for="group in layerGroups" :key="group.name" class="mb-2 last:mb-0">
          <!-- 分组头 -->
          <button @click="group.expanded = !group.expanded"
            class="flex items-center gap-1.5 w-full py-1.5 text-[11px] font-semibold text-dim hover:text-default transition-colors cursor-pointer">
            <ChevronDown v-if="group.expanded" class="w-3 h-3" />
            <ChevronRight v-else class="w-3 h-3" />
            {{ group.name }}
            <span class="ml-auto flex gap-1">
              <button @click.stop="toggleGroupAll(group, true)"
                class="text-[9px] text-primary hover:underline cursor-pointer">全选</button>
              <button @click.stop="toggleGroupAll(group, false)"
                class="text-[9px] text-muted-themed hover:underline cursor-pointer">清空</button>
            </span>
          </button>
          <!-- 图层列表 -->
          <div v-show="group.expanded" class="space-y-0.5 ml-1">
            <label v-for="layer in group.layers" :key="layer.key"
              class="flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed transition-colors cursor-pointer group">
              <input type="checkbox" v-model="layer.visible"
                class="w-3.5 h-3.5 rounded accent-primary cursor-pointer" />
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: layer.color }"></span>
              <span class="text-xs text-default flex-1">{{ layer.label }}</span>
              <span class="text-[10px] text-muted-themed">{{ layer.count }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 图层管理面板 -->
      <div v-show="activePanel === 'manage'"
        class="absolute top-3 right-14 w-64 bg-card border border-themed rounded-xl shadow-themed p-3 z-10 max-h-[calc(100%-24px)] overflow-y-auto">
        <div class="flex items-center gap-1.5 mb-3">
          <SlidersHorizontal class="w-4 h-4 text-primary" />
          <span class="text-xs font-semibold text-default">图层管理</span>
        </div>

        <!-- 底图切换 -->
        <div class="mb-3">
          <p class="text-[10px] text-dim mb-1.5 font-semibold">底图切换</p>
          <div class="grid grid-cols-3 gap-1.5">
            <button v-for="bm in baseMapTypes" :key="bm.key" @click="switchBaseMap(bm.key)"
              class="flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors cursor-pointer"
              :class="activeBaseMap === bm.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
              <component :is="bm.icon" class="w-4 h-4"
                :class="activeBaseMap === bm.key ? 'text-primary' : 'text-dim'" />
              <span class="text-[10px]" :class="activeBaseMap === bm.key ? 'text-primary font-medium' : 'text-dim'">{{
                bm.label }}</span>
            </button>
          </div>
        </div>

        <!-- 热力图 -->
        <div class="mb-3 flex items-center justify-between p-2 rounded-lg bg-surface">
          <div class="flex items-center gap-1.5">
            <Flame class="w-3.5 h-3.5 text-warning" />
            <span class="text-xs text-default">热力图叠加</span>
          </div>
          <button @click="toggleHeatmap()" class="w-8 h-4.5 rounded-full transition-colors cursor-pointer relative"
            :class="heatmapOn ? 'bg-primary' : 'bg-surface border border-themed'">
            <span class="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all"
              :class="heatmapOn ? 'left-4' : 'left-0.5'"></span>
          </button>
        </div>

        <!-- 图层透明度 -->
        <div class="mb-3">
          <p class="text-[10px] text-dim mb-1.5 font-semibold">图层透明度</p>
          <div class="space-y-1.5 max-h-40 overflow-y-auto">
            <div v-for="layer in allLayers.filter(l => l.visible)" :key="layer.key"
              class="flex items-center gap-2 p-1.5 rounded-md bg-surface">
              <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: layer.color }"></span>
              <span class="text-[10px] text-default flex-1 truncate">{{ layer.label }}</span>
              <input type="range" min="0" max="100" :value="layer.opacity * 100"
                @input="layer.opacity = Number(($event.target as HTMLInputElement).value) / 100"
                class="w-16 h-1 accent-primary cursor-pointer" />
              <span class="text-[9px] text-muted-themed w-6 text-right">{{ Math.round(layer.opacity * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- 图层元数据 & 数据量 -->
        <div>
          <p class="text-[10px] text-dim mb-1.5 font-semibold">图层信息</p>
          <div class="space-y-1">
            <button v-for="layer in allLayers" :key="layer.key" @click="openMetadata(layer)"
              class="w-full flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed transition-colors cursor-pointer text-left">
              <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: layer.color }"></span>
              <span class="text-[10px] text-default flex-1 truncate">{{ layer.label }}</span>
              <Database class="w-3 h-3 text-muted-themed" />
              <span class="text-[9px] text-muted-themed">{{ layer.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 点选信息弹窗 -->
      <div v-if="showInfoPopup"
        class="absolute bottom-16 left-1/2 -translate-x-1/2 w-72 bg-card border border-themed rounded-xl shadow-themed z-10 overflow-hidden">
        <div class="flex items-center justify-between px-3 py-2 border-b border-themed bg-surface">
          <div class="flex items-center gap-1.5">
            <Info class="w-3.5 h-3.5 text-primary" />
            <span class="text-xs font-semibold text-default">设施信息</span>
          </div>
          <button @click="showInfoPopup = false"
            class="text-muted-themed hover:text-default transition-colors cursor-pointer">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
        <div class="p-3 space-y-1.5 text-xs">
          <div class="flex justify-between"><span class="text-dim">名称</span><span class="text-default font-medium">{{
            popupInfo.name }}</span></div>
          <div class="flex justify-between"><span class="text-dim">编号</span><span class="text-primary font-mono">{{
            popupInfo.code }}</span></div>
          <div class="flex justify-between"><span class="text-dim">类型</span><span class="text-default">{{ popupInfo.type
              }}</span></div>
          <div class="flex justify-between"><span class="text-dim">材质</span><span class="text-default">{{
            popupInfo.material }}</span></div>
          <div class="flex justify-between"><span class="text-dim">管径</span><span class="text-default">{{
            popupInfo.diameter }}</span></div>
          <div class="flex justify-between"><span class="text-dim">长度</span><span class="text-default">{{
            popupInfo.length }}</span></div>
          <div class="flex justify-between"><span class="text-dim">建设年份</span><span class="text-default">{{
            popupInfo.buildYear }}</span></div>
          <div class="flex justify-between"><span class="text-dim">状态</span><span class="text-success">{{
            popupInfo.status }}</span></div>
        </div>
      </div>

      <!-- ==================== 左下工具栏 ==================== -->
      <div class="absolute bottom-3 left-3 z-10 flex items-end gap-1">
        <!-- 底图快捷切换 -->
        <div class="relative">
          <button @click="showBaseMapPicker = !showBaseMapPicker"
            class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
            <MapIcon class="w-4 h-4 text-default" />
          </button>
          <div v-show="showBaseMapPicker"
            class="absolute bottom-10 left-0 bg-card border border-themed rounded-lg shadow-themed p-2 flex gap-1.5">
            <button v-for="bm in baseMapTypes" :key="bm.key" @click="switchBaseMap(bm.key); showBaseMapPicker = false"
              class="flex flex-col items-center gap-0.5 p-1.5 rounded-md transition-colors cursor-pointer w-14"
              :class="activeBaseMap === bm.key ? 'bg-primary/15' : 'hover:bg-hover-themed'">
              <component :is="bm.icon" class="w-4 h-4"
                :class="activeBaseMap === bm.key ? 'text-primary' : 'text-dim'" />
              <span class="text-[9px]" :class="activeBaseMap === bm.key ? 'text-primary' : 'text-dim'">{{ bm.label
                }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== 右下工具栏 ==================== -->
      <div class="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
        <!-- 书签 -->
        <div class="relative">
          <button @click="showBookmarkPanel = !showBookmarkPanel" title="地图书签"
            class="p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer"
            :class="showBookmarkPanel ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
            <Bookmark class="w-4 h-4" :class="showBookmarkPanel ? 'text-primary' : 'text-default'" />
          </button>
          <div v-show="showBookmarkPanel"
            class="absolute bottom-10 right-0 w-56 bg-card border border-themed rounded-xl shadow-themed p-3 z-10">
            <div class="flex items-center gap-1.5 mb-2">
              <Bookmark class="w-3.5 h-3.5 text-primary" />
              <span class="text-xs font-semibold text-default">地图书签</span>
            </div>
            <!-- 保存书签 -->
            <div class="flex gap-1 mb-2">
              <input v-model="newBookmarkName" type="text" placeholder="输入书签名..."
                class="flex-1 px-2 py-1.5 bg-input border border-themed rounded-md text-[10px] text-default focus:outline-none focus:border-primary" />
              <button @click="saveBookmark"
                class="p-1.5 bg-primary text-white rounded-md hover:bg-primary-light transition-colors cursor-pointer">
                <BookmarkPlus class="w-3 h-3" />
              </button>
            </div>
            <!-- 书签列表 -->
            <div class="space-y-1 max-h-32 overflow-y-auto">
              <div v-for="bm in bookmarks" :key="bm.id"
                class="flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed transition-colors group">
                <button @click="loadBookmark(bm)" class="flex-1 text-left cursor-pointer">
                  <p class="text-[10px] font-medium text-default">{{ bm.name }}</p>
                  <p class="text-[9px] text-muted-themed">{{ bm.time }}</p>
                </button>
                <button @click="deleteBookmark(bm.id)"
                  class="opacity-0 group-hover:opacity-100 text-muted-themed hover:text-danger transition-all cursor-pointer">
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
              <p v-if="bookmarks.length === 0" class="text-[10px] text-muted-themed text-center py-2">暂无书签</p>
            </div>
          </div>
        </div>

        <!-- 截图 -->
        <button @click="exportScreenshot" title="地图截图"
          class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <Camera class="w-4 h-4 text-default" />
        </button>
        <!-- 多视窗 -->
        <button @click="toggleDualView" title="多视窗对比"
          class="p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer"
          :class="dualView ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
          <SquareSplitHorizontal class="w-4 h-4" :class="dualView ? 'text-primary' : 'text-default'" />
        </button>
        <!-- 流向 -->
        <button @click="toggleTool('flow')" title="管网流向"
          class="p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer"
          :class="activeTool === 'flow' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
          <Navigation class="w-4 h-4" :class="activeTool === 'flow' ? 'text-primary' : 'text-default'" />
        </button>
        <!-- 测量 -->
        <button @click="toggleTool('measure')" title="测量标注"
          class="p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer"
          :class="activeTool === 'measure' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
          <Ruler class="w-4 h-4" :class="activeTool === 'measure' ? 'text-primary' : 'text-default'" />
        </button>
        <!-- 定位 -->
        <button @click="resetView" title="全局视图"
          class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <Crosshair class="w-4 h-4 text-default" />
        </button>
        <!-- 放大 -->
        <button @click="zoomIn" title="放大"
          class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <Plus class="w-4 h-4 text-default" />
        </button>
        <!-- 缩小 -->
        <button @click="zoomOut" title="缩小"
          class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <MinusIcon class="w-4 h-4 text-default" />
        </button>
        <!-- 全屏 -->
        <button @click="resetView" title="全屏适配"
          class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <Maximize2 class="w-4 h-4 text-default" />
        </button>
      </div>

      <!-- 图层元数据弹窗 -->
      <ModalDialog :show="showMetadata" title="图层元数据" @close="showMetadata = false" @confirm="showMetadata = false">
        <div v-if="metadataLayer" class="space-y-2 text-xs">
          <div class="flex items-center gap-2 mb-2">
            <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: metadataLayer.color }"></span>
            <span class="font-semibold text-default">{{ metadataLayer.label }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="p-2 rounded-lg bg-surface">
              <p class="text-dim text-[10px]">描述</p>
              <p class="text-default">{{ metadataLayer.desc }}</p>
            </div>
            <div class="p-2 rounded-lg bg-surface">
              <p class="text-dim text-[10px]">要素数量</p>
              <p class="text-default font-bold">{{ metadataLayer.count.toLocaleString() }}</p>
            </div>
            <div class="p-2 rounded-lg bg-surface">
              <p class="text-dim text-[10px]">坐标系</p>
              <p class="text-default">CGCS2000 / EPSG:4490</p>
            </div>
            <div class="p-2 rounded-lg bg-surface">
              <p class="text-dim text-[10px]">数据来源</p>
              <p class="text-default">排水设施普查</p>
            </div>
            <div class="p-2 rounded-lg bg-surface">
              <p class="text-dim text-[10px]">更新时间</p>
              <p class="text-default">2024-03-15</p>
            </div>
            <div class="p-2 rounded-lg bg-surface">
              <p class="text-dim text-[10px]">数据格式</p>
              <p class="text-default">GeoJSON</p>
            </div>
          </div>
        </div>
      </ModalDialog>

      <ToastNotify ref="toast" />
    </div>
  </div>
</template>
