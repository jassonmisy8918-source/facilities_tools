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
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style'
import ScaleLine from 'ol/control/ScaleLine'
import {
    Circle, Spline, Square, FileEdit, Trash2, Merge,
    PaintBucket, Undo2, Redo2, AlertTriangle, Users,
    Plus, Minus as MinusIcon, Crosshair, MousePointerClick, Save
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 地图 =====================
const mapContainer = ref<HTMLElement>()
let map: Map | null = null
const editSource = new VectorSource()
let drawInteraction: Draw | null = null

const editStyle = new Style({
    fill: new Fill({ color: 'rgba(59,130,246,0.15)' }),
    stroke: new Stroke({ color: '#3B82F6', width: 2 }),
    image: new CircleStyle({ radius: 5, fill: new Fill({ color: '#3B82F6' }), stroke: new Stroke({ color: '#fff', width: 2 }) }),
})

// ===================== 编辑工具（9 个功能点）=====================
const editTools = [
    { key: 'node', label: '节点绘制', icon: Circle, desc: '创建检查井等点状要素', drawType: 'Point' as const },
    { key: 'line', label: '管线绘制', icon: Spline, desc: '创建管道线状要素', drawType: 'LineString' as const },
    { key: 'area', label: '区域绘制', icon: Square, desc: '绘制服务范围等面状要素', drawType: 'Polygon' as const },
    { key: 'attr', label: '属性编辑', icon: FileEdit, desc: '修改设施属性信息', drawType: null },
    { key: 'delete', label: '批量删除', icon: Trash2, desc: '移除多个选中要素', drawType: null },
    { key: 'merge', label: '批量合并', icon: Merge, desc: '合并同类要素', drawType: null },
    { key: 'fill', label: '批量属性填充', icon: PaintBucket, desc: '统一赋值属性', drawType: null },
]
const activeTool = ref('')

// ===================== 操作历史（撤销/重做）=====================
const operationHistory = ref([
    { id: 1, action: '添加节点', target: '检查井 MH-NEW-001', time: '10:23', canUndo: true },
    { id: 2, action: '绘制管线', target: '管段 PS-NEW-001', time: '10:25', canUndo: true },
    { id: 3, action: '属性编辑', target: 'MH-003456 材质修改', time: '10:28', canUndo: true },
    { id: 4, action: '批量填充', target: '12 个要素属性更新', time: '10:32', canUndo: true },
])
const undoneOps = ref<typeof operationHistory.value>([])

function undo() {
    if (operationHistory.value.length === 0) return
    const op = operationHistory.value.pop()!
    undoneOps.value.push(op)
    toast.value?.show(`已撤销：${op.action} - ${op.target}`, 'info')
}
function redo() {
    if (undoneOps.value.length === 0) return
    const op = undoneOps.value.pop()!
    operationHistory.value.push(op)
    toast.value?.show(`已重做：${op.action} - ${op.target}`, 'info')
}

// ===================== 编辑冲突 =====================
const conflicts = ref([
    { id: 1, user: '李四', feature: 'MH-003456', field: '井深', time: '10:30', resolved: false },
    { id: 2, user: '王五', feature: 'PS-001234', field: '材质', time: '10:35', resolved: false },
])
const onlineUsers = ref([
    { name: '张三（我）', status: 'editing', color: '#3B82F6' },
    { name: '李四', status: 'editing', color: '#00D4AA' },
    { name: '王五', status: 'viewing', color: '#FFB020' },
])

function resolveConflict(id: number) {
    const c = conflicts.value.find(c => c.id === id)
    if (c) { c.resolved = true; toast.value?.show('冲突已解决', 'success') }
}

// ===================== 属性编辑表单 =====================
const showAttrForm = ref(false)
const attrForm = ref({ name: '检查井 MH-003456', material: '球墨铸铁', depth: '2.5', district: '圭塘街道' })

// ===================== 工具切换 =====================
function selectTool(key: string) {
    if (drawInteraction && map) { map.removeInteraction(drawInteraction); drawInteraction = null }
    if (activeTool.value === key) { activeTool.value = ''; return }
    activeTool.value = key

    if (!map) return
    const tool = editTools.find(t => t.key === key)
    if (tool?.drawType) {
        drawInteraction = new Draw({ source: editSource, type: tool.drawType, style: editStyle })
        drawInteraction.on('drawend', () => {
            operationHistory.value.push({
                id: Date.now(), action: tool.label, target: `新建${tool.label}要素`,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), canUndo: true
            })
            undoneOps.value = []
            toast.value?.show(`${tool.label}完成`, 'success')
        })
        map.addInteraction(drawInteraction)
        toast.value?.show(`${tool.label}模式已开启`, 'info')
    } else if (key === 'attr') {
        showAttrForm.value = true
        toast.value?.show('点击地图要素编辑属性', 'info')
    } else {
        toast.value?.show(`${tool?.label}工具已激活`, 'info')
    }
}

function saveAttrs() {
    operationHistory.value.push({
        id: Date.now(), action: '属性编辑', target: attrForm.value.name,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), canUndo: true
    })
    showAttrForm.value = false
    toast.value?.show('属性已保存', 'success')
}

function zoomIn() { map?.getView().animate({ zoom: (map.getView().getZoom() || 13) + 1, duration: 250 }) }
function zoomOut() { map?.getView().animate({ zoom: (map.getView().getZoom() || 13) - 1, duration: 250 }) }
function resetView() { map?.getView().animate({ center: fromLonLat([113.032549, 28.141]), zoom: 14, duration: 500 }) }

function saveAll() { toast.value?.show('所有编辑已保存', 'success') }

// ===================== 初始化 =====================
onMounted(() => {
    if (mapContainer.value) {
        map = new Map({
            target: mapContainer.value,
            layers: [
                new TileLayer({ source: new XYZ({ url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', crossOrigin: 'anonymous' }) }),
                new VectorLayer({ source: editSource, style: editStyle }),
            ],
            view: new View({ center: fromLonLat([113.032549, 28.141]), zoom: 14 }),
            controls: [],
        })
        map.addControl(new ScaleLine({ units: 'metric' }))
    }
})
onUnmounted(() => {
    if (drawInteraction && map) { map.removeInteraction(drawInteraction) }
    map?.setTarget(undefined); map = null
})
</script>

<template>
    <div class="space-y-4">
        <!-- 编辑工具栏 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                    <button v-for="tool in editTools" :key="tool.key" @click="selectTool(tool.key)" :title="tool.desc"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                        :class="activeTool === tool.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                        <component :is="tool.icon" class="w-3.5 h-3.5" />{{ tool.label }}
                    </button>
                </div>
                <div class="flex items-center gap-1.5 border-l border-themed pl-3">
                    <button @click="undo" title="撤销"
                        class="p-1.5 rounded-lg text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"
                        :class="{ 'opacity-30 cursor-not-allowed': operationHistory.length === 0 }">
                        <Undo2 class="w-4 h-4" />
                    </button>
                    <button @click="redo" title="重做"
                        class="p-1.5 rounded-lg text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"
                        :class="{ 'opacity-30 cursor-not-allowed': undoneOps.length === 0 }">
                        <Redo2 class="w-4 h-4" />
                    </button>
                    <button @click="saveAll"
                        class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Save class="w-3.5 h-3.5" />保存
                    </button>
                </div>
            </div>
        </div>

        <div class="flex gap-4" style="height: calc(100vh - 300px);">
            <!-- 地图区域 -->
            <div class="flex-1 relative bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div ref="mapContainer" class="w-full h-full"></div>

                <!-- 提示 -->
                <div v-if="activeTool"
                    class="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-card/90 backdrop-blur border border-themed rounded-lg shadow-themed">
                    <div class="flex items-center gap-2">
                        <MousePointerClick class="w-4 h-4 text-primary" />
                        <span class="text-xs text-default">{{editTools.find(t => t.key === activeTool)?.desc}}</span>
                    </div>
                </div>

                <!-- 缩放控制 -->
                <div class="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
                    <button @click="resetView"
                        class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
                        <Crosshair class="w-4 h-4 text-default" />
                    </button>
                    <button @click="zoomIn"
                        class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
                        <Plus class="w-4 h-4 text-default" />
                    </button>
                    <button @click="zoomOut"
                        class="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
                        <MinusIcon class="w-4 h-4 text-default" />
                    </button>
                </div>
            </div>

            <!-- 右侧面板 -->
            <div class="w-72 flex flex-col gap-3">
                <!-- 在线用户 -->
                <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
                    <h4 class="text-xs font-semibold text-default mb-2 flex items-center gap-1.5">
                        <Users class="w-3.5 h-3.5 text-primary" />在线协同 <span
                            class="text-[10px] text-muted-themed font-normal">{{ onlineUsers.length }} 人</span>
                    </h4>
                    <div class="space-y-1">
                        <div v-for="user in onlineUsers" :key="user.name" class="flex items-center gap-2 py-1">
                            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: user.color }"></span>
                            <span class="text-xs text-default flex-1">{{ user.name }}</span>
                            <span class="text-[10px]"
                                :class="user.status === 'editing' ? 'text-success' : 'text-dim'">{{ user.status ===
                                'editing' ? '编辑中' : '查看' }}</span>
                        </div>
                    </div>
                </div>

                <!-- 编辑冲突 -->
                <div v-if="conflicts.some(c => !c.resolved)"
                    class="bg-card border border-warning/30 rounded-xl shadow-themed p-3">
                    <h4 class="text-xs font-semibold text-warning mb-2 flex items-center gap-1.5">
                        <AlertTriangle class="w-3.5 h-3.5" />编辑冲突
                    </h4>
                    <div class="space-y-1.5">
                        <div v-for="c in conflicts.filter(c => !c.resolved)" :key="c.id"
                            class="p-2 rounded-lg bg-warning/5 border border-warning/20">
                            <p class="text-xs text-default">{{ c.user }} 正在编辑 <span class="font-mono text-primary">{{
                                    c.feature }}</span></p>
                            <p class="text-[10px] text-muted-themed">字段：{{ c.field }} · {{ c.time }}</p>
                            <button @click="resolveConflict(c.id)"
                                class="mt-1 text-[10px] text-warning hover:underline cursor-pointer">解决冲突</button>
                        </div>
                    </div>
                </div>

                <!-- 属性编辑 -->
                <div v-if="showAttrForm" class="bg-card border border-primary/30 rounded-xl shadow-themed p-3">
                    <h4 class="text-xs font-semibold text-default mb-2 flex items-center gap-1.5">
                        <FileEdit class="w-3.5 h-3.5 text-primary" />属性编辑
                    </h4>
                    <div class="space-y-2 text-xs">
                        <div><label class="text-dim block mb-0.5">名称</label>
                            <input v-model="attrForm.name"
                                class="w-full bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                        </div>
                        <div><label class="text-dim block mb-0.5">材质</label>
                            <input v-model="attrForm.material"
                                class="w-full bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                        </div>
                        <div><label class="text-dim block mb-0.5">井深(m)</label>
                            <input v-model="attrForm.depth"
                                class="w-full bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                        </div>
                        <div><label class="text-dim block mb-0.5">区域</label>
                            <input v-model="attrForm.district"
                                class="w-full bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                        </div>
                        <button @click="saveAttrs"
                            class="w-full px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">保存属性</button>
                    </div>
                </div>

                <!-- 操作历史 -->
                <div class="bg-card border border-themed rounded-xl shadow-themed flex-1 overflow-hidden flex flex-col">
                    <div class="px-3 py-2.5 border-b border-themed">
                        <h4 class="text-xs font-semibold text-default">操作历史</h4>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2 space-y-1">
                        <div v-for="op in [...operationHistory].reverse()" :key="op.id"
                            class="flex items-center justify-between p-2 rounded-lg bg-surface text-xs">
                            <div>
                                <p class="text-default">{{ op.action }}</p>
                                <p class="text-[10px] text-muted-themed">{{ op.target }}</p>
                            </div>
                            <span class="text-[10px] text-dim">{{ op.time }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
