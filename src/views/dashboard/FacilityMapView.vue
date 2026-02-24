<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, Eye, EyeOff } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'

const layers = ref([
    { key: 'well', label: '检查井', color: '#3B82F6', visible: true },
    { key: 'pump', label: '泵站', color: '#F59E0B', visible: true },
    { key: 'plant', label: '污水厂', color: '#10B981', visible: true },
    { key: 'outlet', label: '排放口', color: '#EF4444', visible: true },
])

const facilityData: Record<string, { lng: number; lat: number; title: string; info: Record<string, string> }[]> = {
    well: [
        { lng: 113.035, lat: 28.145, title: 'MH-01 万家丽路', info: { 编号: 'MH-01', 位置: '万家丽路200号', 类型: '雨水检查井', 管径: 'DN400', 材质: '钢筋混凝土', 井深: '3.2m', 状态: '正常' } },
        { lng: 113.042, lat: 28.138, title: 'MH-05 韶山路', info: { 编号: 'MH-05', 位置: '韶山路120号', 类型: '污水检查井', 管径: 'DN600', 材质: '钢筋混凝土', 井深: '4.5m', 状态: '松动' } },
        { lng: 113.050, lat: 28.132, title: 'MH-11 劳动路', info: { 编号: 'MH-11', 位置: '劳动路80号', 类型: '雨水检查井', 管径: 'DN300', 材质: 'PVC', 井深: '2.8m', 状态: '正常' } },
        { lng: 113.028, lat: 28.152, title: 'MH-18 芙蓉路', info: { 编号: 'MH-18', 位置: '芙蓉路350号', 类型: '合流检查井', 管径: 'DN800', 材质: '钢筋混凝土', 井深: '5.0m', 状态: '正常' } },
        { lng: 113.058, lat: 28.125, title: 'MH-22 黎托路', info: { 编号: 'MH-22', 位置: '黎托路55号', 类型: '雨水检查井', 管径: 'DN400', 材质: 'HDPE', 井深: '3.0m', 状态: '正常' } },
    ],
    pump: [
        { lng: 113.038, lat: 28.142, title: '圭塘河泵站', info: { 名称: '圭塘河泵站', 设计流量: '5.0万m³/d', 泵组数: '4台', 扬程: '12m', 建设年份: '2018', 状态: '运行中' } },
        { lng: 113.055, lat: 28.128, title: '万家丽泵站', info: { 名称: '万家丽泵站', 设计流量: '3.5万m³/d', 泵组数: '3台', 扬程: '10m', 建设年份: '2020', 状态: '运行中' } },
        { lng: 113.025, lat: 28.148, title: '侯家塘泵站', info: { 名称: '侯家塘泵站', 设计流量: '2.0万m³/d', 泵组数: '2台', 扬程: '8m', 建设年份: '2015', 状态: '维护中' } },
    ],
    plant: [
        { lng: 113.065, lat: 28.115, title: '雨花污水处理厂', info: { 名称: '雨花污水处理厂', 设计规模: '15万m³/d', 处理工艺: 'A²/O+MBR', 出水标准: '一级A', 进水COD: '280mg/L', 出水COD: '28mg/L', 状态: '运行中' } },
        { lng: 113.045, lat: 28.158, title: '左家塘净水厂', info: { 名称: '左家塘净水厂', 设计规模: '8万m³/d', 处理工艺: 'AAO', 出水标准: '一级B', 进水COD: '320mg/L', 出水COD: '35mg/L', 状态: '运行中' } },
    ],
    outlet: [
        { lng: 113.033, lat: 28.150, title: 'OUT-01 浏阳河排口', info: { 编号: 'OUT-01', 位置: '浏阳河左岸', 类型: '雨水排口', 管径: 'DN1200', 受纳水体: '浏阳河', 水质: '达标' } },
        { lng: 113.048, lat: 28.135, title: 'OUT-05 圭塘河排口', info: { 编号: 'OUT-05', 位置: '圭塘河右岸', 类型: '污水排口', 管径: 'DN800', 受纳水体: '圭塘河', 水质: '预警' } },
        { lng: 113.060, lat: 28.120, title: 'OUT-09 黎托排口', info: { 编号: 'OUT-09', 位置: '黎托街道', 类型: '溢流排口', 管径: 'DN600', 受纳水体: '浏阳河', 水质: '达标' } },
    ],
}

const pipePolylines = [
    { path: [[113.028, 28.152], [113.035, 28.145], [113.042, 28.138], [113.050, 28.132], [113.058, 28.125]] as [number, number][], color: '#3B82F6', weight: 3, label: '主干管' },
    { path: [[113.035, 28.145], [113.038, 28.142], [113.048, 28.135]] as [number, number][], color: '#8B5CF6', weight: 2, label: '支管' },
]

const visibleMarkers = computed(() => {
    const result: { lng: number; lat: number; title: string; label?: string; color?: string }[] = []
    layers.value.forEach(layer => {
        if (!layer.visible) return
        const items = facilityData[layer.key] || []
        items.forEach(item => result.push({ lng: item.lng, lat: item.lat, title: item.title, label: item.title, color: layer.color }))
    })
    return result
})

const showDetail = ref(false)
const detailTitle = ref('')
const detailInfo = ref<Record<string, string>>({})

function onMarkerClick(title: string) {
    for (const key of Object.keys(facilityData)) {
        const found = facilityData[key]?.find(f => f.title === title)
        if (found) { detailTitle.value = found.title; detailInfo.value = found.info; showDetail.value = true; return }
    }
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">排水设施一张图</span>
            </div>
            <div class="flex items-center gap-2">
                <button v-for="l in layers" :key="l.key" @click="l.visible = !l.visible"
                    class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                    :class="l.visible ? 'bg-primary/10 text-primary' : 'bg-surface text-dim'">
                    <component :is="l.visible ? Eye : EyeOff" class="w-3 h-3" />
                    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: l.color }"></span>
                    {{ l.label }}
                </button>
            </div>
        </div>
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <AMapView :markers="visibleMarkers" :polylines="pipePolylines" :center="[113.042, 28.138]" :zoom="14"
                height="400px" />
        </div>
        <!-- 图例统计 -->
        <div class="grid grid-cols-4 gap-3">
            <div v-for="l in layers" :key="l.key"
                class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                <div class="w-3 h-3 rounded-full mx-auto mb-1" :style="{ backgroundColor: l.color }"></div>
                <p class="text-xl font-bold text-default">{{ (facilityData[l.key] || []).length }}</p>
                <p class="text-[10px] text-dim">{{ l.label }}</p>
            </div>
        </div>
        <!-- 设施列表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-left px-3 py-2.5 text-dim font-medium">名称</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">坐标</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="l in layers" :key="l.key">
                        <tr v-for="f in facilityData[l.key]" :key="f.title"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2"><span class="text-[9px] px-1.5 py-0.5 rounded font-medium text-white"
                                    :style="{ backgroundColor: l.color }">{{ l.label }}</span></td>
                            <td class="px-3 py-2 text-default font-medium">{{ f.title }}</td>
                            <td class="text-center px-2 py-2 text-dim text-[10px] font-mono">{{ f.lng.toFixed(3) }}, {{
                                f.lat.toFixed(3) }}</td>
                            <td class="text-center px-2 py-2"><button @click="onMarkerClick(f.title)"
                                    class="text-primary text-[10px] cursor-pointer hover:underline">查看详情</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
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
