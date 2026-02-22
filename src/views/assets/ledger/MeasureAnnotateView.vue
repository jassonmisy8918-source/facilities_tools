<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import { Draw } from 'ol/interaction'
import { getLength, getArea } from 'ol/sphere'
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style'
import { LineString, Polygon } from 'ol/geom'
import ScaleLine from 'ol/control/ScaleLine'
import {
    Ruler, PenSquare, Type, ArrowUpRight, Trash2, Download, Plus, Minus as MinusIcon,
    Crosshair, MousePointerClick, Eye, EyeOff
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 地图 =====================
const mapContainer = ref<HTMLElement>()
let map: Map | null = null

const measureSource = new VectorSource()
const annotateSource = new VectorSource()
let drawInteraction: Draw | null = null

const measureStyle = new Style({
    fill: new Fill({ color: 'rgba(59,130,246,0.15)' }),
    stroke: new Stroke({ color: '#3B82F6', width: 2, lineDash: [8, 4] }),
    image: new CircleStyle({ radius: 5, fill: new Fill({ color: '#3B82F6' }), stroke: new Stroke({ color: '#fff', width: 2 }) }),
})

const annotateStyle = new Style({
    stroke: new Stroke({ color: '#FF4757', width: 2 }),
    image: new CircleStyle({ radius: 4, fill: new Fill({ color: '#FF4757' }) }),
})

// ===================== 工具状态 =====================
const tools = [
    { key: 'distance', label: '距离测量', icon: Ruler, desc: '点击地图绘制折线，测量两点或多点间距离' },
    { key: 'area', label: '面积测量', icon: PenSquare, desc: '点击地图绘制多边形，测量封闭区域面积' },
    { key: 'text', label: '文本标注', icon: Type, desc: '点击地图添加文字标注说明' },
    { key: 'arrow', label: '箭头标注', icon: ArrowUpRight, desc: '绘制方向性箭头标注' },
]
const activeTool = ref('')

// ===================== 测量结果 =====================
interface MeasureRecord {
    id: number; type: string; value: string; time: string; visible: boolean
}
const measureRecords = ref<MeasureRecord[]>([])
let nextId = 1

// ===================== 标注列表 =====================
interface AnnotateRecord {
    id: number; type: string; content: string; time: string; visible: boolean
}
const annotateRecords = ref<AnnotateRecord[]>([])

// ===================== 文本标注弹窗 =====================
const showTextInput = ref(false)
const textInput = ref('')
const pendingTextCoord = ref<number[]>([])

// ===================== 工具切换 =====================
function selectTool(key: string) {
    // 移除旧交互
    if (drawInteraction && map) {
        map.removeInteraction(drawInteraction)
        drawInteraction = null
    }

    if (activeTool.value === key) {
        activeTool.value = ''
        return
    }

    activeTool.value = key

    if (!map) return

    if (key === 'distance') {
        drawInteraction = new Draw({ source: measureSource, type: 'LineString', style: measureStyle })
        drawInteraction.on('drawend', (e) => {
            const geom = e.feature.getGeometry() as LineString
            const length = getLength(geom)
            const formatted = length > 1000 ? (length / 1000).toFixed(2) + ' km' : length.toFixed(1) + ' m'
            measureRecords.value.push({
                id: nextId++, type: '距离', value: formatted,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                visible: true,
            })
            toast.value?.show(`测量距离：${formatted}`, 'success')
        })
        map.addInteraction(drawInteraction)
        toast.value?.show('距离测量模式：点击地图绘制折线，双击结束', 'info')
    }

    if (key === 'area') {
        drawInteraction = new Draw({ source: measureSource, type: 'Polygon', style: measureStyle })
        drawInteraction.on('drawend', (e) => {
            const geom = e.feature.getGeometry() as Polygon
            const area = getArea(geom)
            const formatted = area > 10000 ? (area / 10000).toFixed(2) + ' 万m²' : area.toFixed(1) + ' m²'
            measureRecords.value.push({
                id: nextId++, type: '面积', value: formatted,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                visible: true,
            })
            toast.value?.show(`测量面积：${formatted}`, 'success')
        })
        map.addInteraction(drawInteraction)
        toast.value?.show('面积测量模式：点击地图绘制多边形，双击结束', 'info')
    }

    if (key === 'text') {
        drawInteraction = new Draw({ source: annotateSource, type: 'Point' })
        drawInteraction.on('drawend', (e) => {
            const coord = (e.feature.getGeometry() as any).getCoordinates()
            pendingTextCoord.value = coord
            showTextInput.value = true
            // 移除临时点，等用户输入文本后再添加带样式的
            annotateSource.removeFeature(e.feature)
        })
        map.addInteraction(drawInteraction)
        toast.value?.show('文本标注模式：点击地图选择标注位置', 'info')
    }

    if (key === 'arrow') {
        drawInteraction = new Draw({ source: annotateSource, type: 'LineString', maxPoints: 2, style: annotateStyle })
        drawInteraction.on('drawend', (e) => {
            e.feature.setStyle(new Style({
                stroke: new Stroke({ color: '#FF4757', width: 3 }),
                image: new CircleStyle({ radius: 4, fill: new Fill({ color: '#FF4757' }) }),
            }))
            annotateRecords.value.push({
                id: nextId++, type: '箭头', content: '方向标注',
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                visible: true,
            })
            toast.value?.show('箭头标注已添加', 'success')
        })
        map.addInteraction(drawInteraction)
        toast.value?.show('箭头标注模式：点击起点和终点', 'info')
    }
}

function confirmText() {
    if (!textInput.value.trim()) { toast.value?.show('请输入标注内容', 'warning'); return }
    // 添加文本标注 feature (这里简化处理，实际项目中会创建 Feature 并设置 style)
    annotateRecords.value.push({
        id: nextId++, type: '文本', content: textInput.value,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        visible: true,
    })
    showTextInput.value = false
    textInput.value = ''
    toast.value?.show('文本标注已添加', 'success')
}

function deleteMeasure(id: number) {
    measureRecords.value = measureRecords.value.filter(r => r.id !== id)
    toast.value?.show('已删除测量记录', 'success')
}

function deleteAnnotate(id: number) {
    annotateRecords.value = annotateRecords.value.filter(r => r.id !== id)
    toast.value?.show('已删除标注', 'success')
}

function clearAll() {
    measureSource.clear()
    annotateSource.clear()
    measureRecords.value = []
    annotateRecords.value = []
    if (drawInteraction && map) { map.removeInteraction(drawInteraction); drawInteraction = null }
    activeTool.value = ''
    toast.value?.show('已清除所有测量与标注', 'success')
}

function handleExport() { toast.value?.show('标注数据导出中...', 'info') }

function zoomIn() { map?.getView().animate({ zoom: (map.getView().getZoom() || 13) + 1, duration: 250 }) }
function zoomOut() { map?.getView().animate({ zoom: (map.getView().getZoom() || 13) - 1, duration: 250 }) }
function resetView() { map?.getView().animate({ center: fromLonLat([116.397428, 39.90923]), zoom: 14, duration: 500 }) }

// ===================== 初始化 =====================
onMounted(() => {
    if (mapContainer.value) {
        map = new Map({
            target: mapContainer.value,
            layers: [
                new TileLayer({
                    source: new XYZ({ url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' })
                }),
                new VectorLayer({ source: measureSource, style: measureStyle }),
                new VectorLayer({ source: annotateSource, style: annotateStyle }),
            ],
            view: new View({ center: fromLonLat([116.397428, 39.90923]), zoom: 14 }),
            controls: [],
        })
        map.addControl(new ScaleLine({ units: 'metric' }))
    }
})

onUnmounted(() => {
    if (drawInteraction && map) { map.removeInteraction(drawInteraction) }
    map?.setTarget(undefined)
    map = null
})
</script>

<template>
    <div class="space-y-4">
        <!-- 工具选择 -->
        <div class="grid grid-cols-4 gap-3">
            <button v-for="tool in tools" :key="tool.key" @click="selectTool(tool.key)"
                class="bg-card border rounded-xl p-3 shadow-themed flex items-center gap-3 transition-all cursor-pointer"
                :class="activeTool === tool.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'">
                <div class="p-2 rounded-lg" :class="activeTool === tool.key ? 'bg-primary/20' : 'bg-surface'">
                    <component :is="tool.icon" class="w-4 h-4"
                        :class="activeTool === tool.key ? 'text-primary' : 'text-dim'" />
                </div>
                <div class="text-left min-w-0">
                    <p class="text-xs font-medium" :class="activeTool === tool.key ? 'text-primary' : 'text-default'">
                        {{ tool.label }}
                    </p>
                    <p class="text-[10px] text-muted-themed truncate">{{ tool.desc }}</p>
                </div>
            </button>
        </div>

        <div class="flex gap-4" style="height: calc(100vh - 260px);">
            <!-- 地图区域 -->
            <div class="flex-1 relative bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div ref="mapContainer" class="w-full h-full"></div>

                <!-- 地图右下工具 -->
                <div class="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
                    <button @click="resetView" title="重置视图"
                        class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
                        <Crosshair class="w-4 h-4 text-default" />
                    </button>
                    <button @click="zoomIn" title="放大"
                        class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
                        <Plus class="w-4 h-4 text-default" />
                    </button>
                    <button @click="zoomOut" title="缩小"
                        class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
                        <MinusIcon class="w-4 h-4 text-default" />
                    </button>
                </div>

                <!-- 操作提示 -->
                <div v-if="activeTool"
                    class="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-card/90 backdrop-blur border border-themed rounded-lg shadow-themed">
                    <div class="flex items-center gap-2">
                        <MousePointerClick class="w-4 h-4 text-primary" />
                        <span class="text-xs text-default">{{tools.find(t => t.key === activeTool)?.desc}}</span>
                    </div>
                </div>
            </div>

            <!-- 右侧面板 -->
            <div class="w-72 flex flex-col gap-3">
                <!-- 操作按钮 -->
                <div class="flex gap-2">
                    <button @click="clearAll"
                        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer">
                        <Trash2 class="w-3.5 h-3.5" /> 清除全部
                    </button>
                    <button @click="handleExport"
                        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Download class="w-3.5 h-3.5" /> 导出
                    </button>
                </div>

                <!-- 测量结果 -->
                <div class="bg-card border border-themed rounded-xl shadow-themed flex-1 overflow-hidden flex flex-col">
                    <div class="px-3 py-2.5 border-b border-themed flex items-center justify-between">
                        <h3 class="text-xs font-semibold text-default flex items-center gap-1.5">
                            <Ruler class="w-3.5 h-3.5 text-primary" /> 测量结果
                        </h3>
                        <span class="text-[10px] text-muted-themed">{{ measureRecords.length }} 条</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2 space-y-1">
                        <div v-for="record in measureRecords" :key="record.id"
                            class="flex items-center justify-between p-2 rounded-lg bg-surface group hover:bg-hover-themed transition-colors">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="record.type === '距离' ? 'bg-primary/15 text-primary' : 'bg-info/15 text-info'">
                                    {{ record.type }}
                                </span>
                                <span class="text-xs font-medium text-default">{{ record.value }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="text-[10px] text-muted-themed">{{ record.time }}</span>
                                <button @click="record.visible = !record.visible"
                                    class="p-0.5 text-muted-themed hover:text-default transition-colors cursor-pointer">
                                    <Eye v-if="record.visible" class="w-3 h-3" />
                                    <EyeOff v-else class="w-3 h-3" />
                                </button>
                                <button @click="deleteMeasure(record.id)"
                                    class="p-0.5 text-muted-themed hover:text-danger opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                    <Trash2 class="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        <p v-if="!measureRecords.length" class="text-center text-[10px] text-muted-themed py-4">
                            暂无测量记录
                        </p>
                    </div>
                </div>

                <!-- 标注列表 -->
                <div class="bg-card border border-themed rounded-xl shadow-themed flex-1 overflow-hidden flex flex-col">
                    <div class="px-3 py-2.5 border-b border-themed flex items-center justify-between">
                        <h3 class="text-xs font-semibold text-default flex items-center gap-1.5">
                            <Type class="w-3.5 h-3.5 text-primary" /> 标注管理
                        </h3>
                        <span class="text-[10px] text-muted-themed">{{ annotateRecords.length }} 条</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2 space-y-1">
                        <div v-for="record in annotateRecords" :key="record.id"
                            class="flex items-center justify-between p-2 rounded-lg bg-surface group hover:bg-hover-themed transition-colors">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="record.type === '文本' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'">
                                    {{ record.type }}
                                </span>
                                <span class="text-xs text-default truncate">{{ record.content }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="text-[10px] text-muted-themed">{{ record.time }}</span>
                                <button @click="deleteAnnotate(record.id)"
                                    class="p-0.5 text-muted-themed hover:text-danger opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                    <Trash2 class="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                        <p v-if="!annotateRecords.length" class="text-center text-[10px] text-muted-themed py-4">
                            暂无标注
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 文本标注弹窗 -->
        <Teleport to="body">
            <div v-if="showTextInput" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 w-80">
                    <h3 class="text-sm font-semibold text-default mb-3">输入标注内容</h3>
                    <textarea v-model="textInput" rows="3" placeholder="请输入标注文字..."
                        class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary resize-none"
                        autofocus></textarea>
                    <div class="flex justify-end gap-2 mt-3">
                        <button @click="showTextInput = false; textInput = ''"
                            class="px-3 py-1.5 bg-card border border-themed rounded-lg text-xs text-dim hover:bg-hover-themed transition-colors cursor-pointer">
                            取消
                        </button>
                        <button @click="confirmText"
                            class="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                            确认
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <ToastNotify ref="toast" />
    </div>
</template>
