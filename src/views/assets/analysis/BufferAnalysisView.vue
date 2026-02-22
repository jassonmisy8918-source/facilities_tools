<script setup lang="ts">
import { ref } from 'vue'
import { Circle, SlidersHorizontal, PlayCircle, MapPin } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 缓冲分析参数 =====================
const targetType = ref('pipe')
const targetTypes = [
    { key: 'pipe', label: '管道' },
    { key: 'well', label: '检查井' },
    { key: 'pump', label: '泵站' },
    { key: 'outlet', label: '排放口' },
]
const bufferDistance = ref(50)
const selectedTarget = ref('PS-001234')

// ===================== 分析结果 =====================
const bufferResults = ref([
    { target: 'PS-001234', distance: '50m', buildings: 12, roads: 3, facilities: 5, area: '7,854 m²' },
    { target: 'MH-A003', distance: '30m', buildings: 4, roads: 1, facilities: 2, area: '2,827 m²' },
    { target: '泵站 PS-001', distance: '100m', buildings: 28, roads: 6, facilities: 15, area: '31,416 m²' },
])

const detailItems = ref([
    { type: '建筑物', name: '朝阳大厦', distance: '12m', impact: '高' },
    { type: '建筑物', name: '国贸公寓', distance: '35m', impact: '中' },
    { type: '道路', name: '建国路', distance: '8m', impact: '高' },
    { type: '道路', name: '光华路', distance: '42m', impact: '低' },
    { type: '管线', name: '燃气管道 GAS-045', distance: '5m', impact: '高' },
    { type: '管线', name: '电力管道 PWR-023', distance: '18m', impact: '中' },
])

function runBufferAnalysis() {
    toast.value?.show(`对 ${selectedTarget.value} 创建 ${bufferDistance.value}m 缓冲区分析`, 'info')
}
</script>

<template>
    <div class="space-y-4">
        <!-- 参数设置 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                    <SlidersHorizontal class="w-4 h-4 text-primary" />缓冲分析参数
                </h3>
            </div>
            <div class="grid grid-cols-4 gap-3">
                <div>
                    <label class="text-[10px] text-dim mb-1 block">目标类型</label>
                    <div class="flex gap-0.5">
                        <button v-for="t in targetTypes" :key="t.key" @click="targetType = t.key"
                            class="flex-1 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                            :class="targetType === t.key ? 'bg-primary text-white' : 'bg-surface text-dim hover:bg-hover-themed'">{{
                            t.label }}</button>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] text-dim mb-1 block">目标编号</label>
                    <input v-model="selectedTarget" type="text"
                        class="w-full bg-input border border-themed rounded-lg px-2.5 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim mb-1 block">缓冲距离: {{ bufferDistance }}m</label>
                    <input v-model="bufferDistance" type="range" min="10" max="200" step="10"
                        class="w-full accent-primary mt-1" />
                </div>
                <div class="flex items-end">
                    <button @click="runBufferAnalysis"
                        class="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <PlayCircle class="w-3.5 h-3.5" />生成缓冲区
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- 缓冲结果 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Circle class="w-4 h-4 text-primary" />缓冲区统计
                    </h3>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="r in bufferResults" :key="r.target" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-medium text-default font-mono">{{ r.target }}</span>
                            <span class="text-[10px] text-primary font-medium">{{ r.distance }} 缓冲</span>
                        </div>
                        <div class="grid grid-cols-4 gap-2 text-[10px]">
                            <div><span class="text-dim block">建筑</span><span class="text-default font-bold">{{
                                    r.buildings }}</span></div>
                            <div><span class="text-dim block">道路</span><span class="text-default font-bold">{{ r.roads
                                    }}</span></div>
                            <div><span class="text-dim block">设施</span><span class="text-default font-bold">{{
                                    r.facilities }}</span></div>
                            <div><span class="text-dim block">面积</span><span class="text-default font-bold">{{ r.area
                                    }}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 影响详情 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                        <MapPin class="w-4 h-4 text-primary" />影响范围详情
                    </h3>
                </div>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-3 py-2 text-xs font-semibold text-dim bg-surface">类型</th>
                            <th class="text-left px-3 py-2 text-xs font-semibold text-dim bg-surface">名称</th>
                            <th class="text-left px-3 py-2 text-xs font-semibold text-dim bg-surface">距离</th>
                            <th class="text-left px-3 py-2 text-xs font-semibold text-dim bg-surface">影响</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in detailItems" :key="item.name"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2 text-xs text-dim">{{ item.type }}</td>
                            <td class="px-3 py-2 text-xs text-default">{{ item.name }}</td>
                            <td class="px-3 py-2 text-xs text-primary font-mono">{{ item.distance }}</td>
                            <td class="px-3 py-2">
                                <span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="item.impact === '高' ? 'bg-danger/15 text-danger' : item.impact === '中' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'">{{
                                    item.impact }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
