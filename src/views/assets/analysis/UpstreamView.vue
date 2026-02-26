<script setup lang="ts">
import { ref } from 'vue'
import {
    ArrowDownUp, Play, Pause, MapPin, Navigation,
    ChevronRight
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 上下游影响范围 =====================
const selectedPoint = ref('MH-A012')
const analysisDirection = ref<'upstream' | 'downstream' | 'both'>('both')

const impactResults = ref([
    { direction: '上游', wellCount: 18, pipeLength: '2,340m', area: '1.2 km²', wells: ['MH-A001', 'MH-A003', 'MH-A005', 'MH-A007'] },
    { direction: '下游', wellCount: 12, pipeLength: '1,560m', area: '0.8 km²', wells: ['MH-A015', 'MH-A018', 'MH-A020', 'OUT-003'] },
])

function runAnalysis() {
    toast.value?.show(`以 ${selectedPoint.value} 为中心，分析${analysisDirection.value === 'both' ? '上下游' : analysisDirection.value === 'upstream' ? '上游' : '下游'}影响范围`, 'info')
}

// ===================== 流向动画 =====================
const isPlaying = ref(false)
const flowSpeed = ref(2)

const flowPaths = ref([
    { id: 1, name: '主排水路径 A', from: 'MH-A001', to: 'OUT-003', nodes: 22, length: '3,900m', status: '正常' },
    { id: 2, name: '主排水路径 B', from: 'MH-B001', to: 'OUT-005', nodes: 18, length: '2,850m', status: '正常' },
    { id: 3, name: '支路 C-1', from: 'MH-C001', to: 'MH-A012', nodes: 8, length: '960m', status: '缓慢' },
    { id: 4, name: '支路 D-2', from: 'MH-D001', to: 'MH-B008', nodes: 6, length: '720m', status: '堵塞' },
])

function toggleFlow() {
    isPlaying.value = !isPlaying.value
    toast.value?.show(isPlaying.value ? '流向动画已开始' : '流向动画已暂停', 'info')
}
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
            <!-- 影响范围分析 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                        <ArrowDownUp class="w-4 h-4 text-primary" />上下游影响范围分析
                    </h3>
                    <a href="https://adabibi.com/demo/drainage/analysis/upstream" target="_blank"
                        class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-light transition-colors cursor-pointer no-underline">
                        <MapPin class="w-3.5 h-3.5" />地图查看
                    </a>
                </div>
                <div class="p-4 space-y-3">
                    <!-- 参数设置 -->
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="text-[10px] text-dim mb-1 block">分析起点</label>
                            <div class="flex items-center gap-1">
                                <input v-model="selectedPoint" type="text"
                                    class="flex-1 bg-input border border-themed rounded-lg px-2.5 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                                <button
                                    class="p-1.5 bg-surface rounded-lg hover:bg-hover-themed transition-colors cursor-pointer">
                                    <MapPin class="w-3.5 h-3.5 text-primary" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] text-dim mb-1 block">分析方向</label>
                            <div class="flex gap-0.5">
                                <button
                                    v-for="d in [{ k: 'upstream', l: '上游' }, { k: 'downstream', l: '下游' }, { k: 'both', l: '双向' }]"
                                    :key="d.k" @click="analysisDirection = d.k as any"
                                    class="flex-1 py-1.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                                    :class="analysisDirection === d.k ? 'bg-primary text-white' : 'bg-surface text-dim hover:bg-hover-themed'">{{
                                        d.l }}</button>
                            </div>
                        </div>
                    </div>
                    <button @click="runAnalysis"
                        class="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Navigation class="w-3.5 h-3.5" />开始分析
                    </button>

                    <!-- 结果卡片 -->
                    <div class="space-y-2">
                        <div v-for="r in impactResults" :key="r.direction" class="p-3 rounded-lg bg-surface">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-medium text-default flex items-center gap-1">
                                    <ChevronRight class="w-3 h-3" :class="r.direction === '上游' ? 'rotate-180' : ''" />{{
                                        r.direction }}影响
                                </span>
                            </div>
                            <div class="grid grid-cols-3 gap-2 text-[10px] mb-2">
                                <div><span class="text-dim">影响井数</span>
                                    <p class="text-default font-bold text-sm">{{ r.wellCount }}</p>
                                </div>
                                <div><span class="text-dim">管线长度</span>
                                    <p class="text-default font-bold text-sm">{{ r.pipeLength }}</p>
                                </div>
                                <div><span class="text-dim">影响面积</span>
                                    <p class="text-default font-bold text-sm">{{ r.area }}</p>
                                </div>
                            </div>
                            <div class="flex gap-1 flex-wrap">
                                <span v-for="w in r.wells" :key="w"
                                    class="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono">{{ w
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 流向动画模拟 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Navigation class="w-4 h-4 text-primary" />流向动画模拟
                    </h3>
                    <div class="flex items-center gap-2">
                        <div class="flex items-center gap-1 text-[10px] text-dim">
                            <span>速度</span>
                            <input v-model="flowSpeed" type="range" min="1" max="5" class="w-16 accent-primary" />
                            <span>{{ flowSpeed }}x</span>
                        </div>
                        <button @click="toggleFlow"
                            class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            :class="isPlaying ? 'bg-warning/15 text-warning' : 'bg-primary text-white'">
                            <Play v-if="!isPlaying" class="w-3.5 h-3.5" />
                            <Pause v-else class="w-3.5 h-3.5" />
                            {{ isPlaying ? '暂停' : '播放' }}
                        </button>
                    </div>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="fp in flowPaths" :key="fp.id" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-default">{{ fp.name }}</span>
                            <span class="text-[10px] px-2 py-0.5 rounded-md"
                                :class="fp.status === '正常' ? 'bg-success/15 text-success' : fp.status === '缓慢' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'">{{
                                    fp.status }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-muted-themed">
                            <span class="font-mono text-primary">{{ fp.from }}</span>
                            <ChevronRight class="w-3 h-3" />
                            <span class="font-mono text-primary">{{ fp.to }}</span>
                        </div>
                        <div class="flex items-center gap-4 mt-1 text-[10px] text-dim">
                            <span>{{ fp.nodes }} 个节点</span>
                            <span>{{ fp.length }}</span>
                        </div>
                        <!-- 流向指示条 -->
                        <div class="mt-2 h-1 bg-surface rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all"
                                :class="fp.status === '正常' ? 'bg-primary' : fp.status === '缓慢' ? 'bg-warning' : 'bg-danger'"
                                :style="{ width: isPlaying ? '100%' : '0%', transition: isPlaying ? `width ${6 / flowSpeed}s linear` : 'none' }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
