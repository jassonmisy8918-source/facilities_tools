<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import { Layers, MapPin, Maximize2, Minus as MinusIcon, Plus, Ruler, Search, X, Info } from 'lucide-vue-next'

const mapContainer = ref<HTMLElement>()
let map: Map | null = null

// 9种专题图层 —— 对应需求 9.1.6.4.1 的13种一张图缩减为核心9种
const layerFilters = ref([
  { key: 'rainPipe', label: '雨水管网', color: '#3B82F6', visible: true, count: 1248 },
  { key: 'sewagePipe', label: '污水管网', color: '#00D4AA', visible: true, count: 987 },
  { key: 'combinedPipe', label: '合流管网', color: '#FFB020', visible: true, count: 412 },
  { key: 'pump', label: '排水泵站', color: '#FF4757', visible: true, count: 18 },
  { key: 'monitor', label: '监测设备', color: '#8B5CF6', visible: true, count: 156 },
  { key: 'outlet', label: '排放口', color: '#F97316', visible: true, count: 89 },
  { key: 'defect', label: '管网缺陷', color: '#EF4444', visible: false, count: 67 },
  { key: 'crossConn', label: '雨污混接', color: '#EC4899', visible: false, count: 34 },
  { key: 'intrusion', label: '外水入侵', color: '#14B8A6', visible: false, count: 21 },
])

const showLayerPanel = ref(true)

// 搜索功能
const searchQuery = ref('')
const showSearchResults = ref(false)
const mockSearchResults = [
  { id: 1, name: 'PS-001234 朝阳路DN600-P05', type: '污水管', status: '正常' },
  { id: 2, name: 'MH-003456 朝阳路检查井#34', type: '检查井', status: '轻微缺陷' },
  { id: 3, name: 'BZ-01 朝阳路泵站', type: '泵站', status: '运行中' },
]

function handleSearch() {
  if (searchQuery.value.length > 0) showSearchResults.value = true
  else showSearchResults.value = false
}

// 点选弹窗
const showInfoPopup = ref(true)
const popupInfo = ref({
  name: '朝阳路DN600 P05-P06段',
  code: 'PS-001234',
  type: '污水管',
  material: 'HDPE',
  diameter: 'DN600',
  length: '128.5m',
  status: '正常',
  buildYear: '2018',
})

// 测量工具
const activeTool = ref('')
function toggleTool(tool: string) {
  activeTool.value = activeTool.value === tool ? '' : tool
}

const facilityStats = ref([
  { label: '管道总长', value: '2,847', unit: 'km' },
  { label: '检查井', value: '12,456', unit: '座' },
  { label: '雨水口', value: '8,234', unit: '个' },
  { label: '泵站', value: '18', unit: '座' },
  { label: '排放口', value: '89', unit: '个' },
  { label: '监测设备', value: '156', unit: '台' },
])

onMounted(() => {
  if (mapContainer.value) {
    map = new Map({
      target: mapContainer.value,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([116.397428, 39.90923]),
        zoom: 13
      })
    })
  }
})

onUnmounted(() => {
  if (map) {
    map.setTarget(undefined)
    map = null
  }
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
      <!-- OpenLayers 地图 -->
      <div ref="mapContainer" class="w-full h-full"></div>

      <!-- 搜索栏 -->
      <div class="absolute top-3 left-3 z-10 w-72">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
          <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="搜索设施编号/名称..."
            class="w-full pl-9 pr-4 py-2 bg-card/95 backdrop-blur-md border border-themed rounded-lg text-sm text-default placeholder-[var(--text-muted)] focus:outline-none focus:border-primary shadow-themed" />
        </div>
        <!-- 搜索结果 -->
        <div v-show="showSearchResults"
          class="mt-1 bg-card/95 backdrop-blur-md border border-themed rounded-lg shadow-themed-lg overflow-hidden">
          <button v-for="r in mockSearchResults" :key="r.id" @click="showSearchResults = false; searchQuery = ''"
            class="w-full text-left px-3 py-2.5 border-b border-themed/50 last:border-0 hover:bg-hover-themed transition-colors cursor-pointer">
            <p class="text-xs font-medium text-default">{{ r.name }}</p>
            <p class="text-[10px] text-muted-themed">{{ r.type }} · {{ r.status }}</p>
          </button>
        </div>
      </div>

      <!-- 图层面板 -->
      <div v-show="showLayerPanel"
        class="absolute top-3 right-3 w-52 bg-card/95 backdrop-blur-md border border-themed rounded-xl shadow-themed-lg p-3 z-10">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-1.5">
            <Layers class="w-4 h-4 text-primary" />
            <span class="text-xs font-semibold text-default">图层控制</span>
          </div>
          <button @click="showLayerPanel = false"
            class="text-muted-themed hover:text-default transition-colors cursor-pointer">
            <MinusIcon class="w-3.5 h-3.5" />
          </button>
        </div>
        <div class="space-y-1">
          <label v-for="layer in layerFilters" :key="layer.key"
            class="flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed transition-colors cursor-pointer">
            <input type="checkbox" v-model="layer.visible" class="w-3.5 h-3.5 rounded accent-primary" />
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: layer.color }"></span>
            <span class="text-xs text-default flex-1">{{ layer.label }}</span>
            <span class="text-[10px] text-muted-themed">{{ layer.count }}</span>
          </label>
        </div>
      </div>

      <!-- 图层开关按钮 (面板关闭时显示) -->
      <button v-show="!showLayerPanel" @click="showLayerPanel = true"
        class="absolute top-3 right-3 p-2 bg-card/95 backdrop-blur-md border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors z-10 cursor-pointer">
        <Layers class="w-4 h-4 text-primary" />
      </button>

      <!-- 点选信息弹窗 -->
      <div v-if="showInfoPopup"
        class="absolute bottom-16 left-1/2 -translate-x-1/2 w-72 bg-card/95 backdrop-blur-md border border-themed rounded-xl shadow-themed-lg z-10 overflow-hidden">
        <div class="flex items-center justify-between px-3 py-2 border-b border-themed bg-surface/50">
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

      <!-- 地图工具栏 -->
      <div class="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
        <button @click="toggleTool('measure')"
          class="p-2 bg-card/95 backdrop-blur-md border rounded-lg shadow-themed transition-colors cursor-pointer"
          :class="activeTool === 'measure' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
          <Ruler class="w-4 h-4" :class="activeTool === 'measure' ? 'text-primary' : 'text-default'" />
        </button>
        <button
          class="p-2 bg-card/95 backdrop-blur-md border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <Plus class="w-4 h-4 text-default" />
        </button>
        <button
          class="p-2 bg-card/95 backdrop-blur-md border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <MinusIcon class="w-4 h-4 text-default" />
        </button>
        <button
          class="p-2 bg-card/95 backdrop-blur-md border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
          <Maximize2 class="w-4 h-4 text-default" />
        </button>
      </div>
    </div>
  </div>
</template>
