<script setup lang="ts">
import { ref } from 'vue'
import { Cloud, Play, Pause, SkipBack, SkipForward, Layers, Eye } from 'lucide-vue-next'

const isPlaying = ref(false)
const currentFrame = ref(5)
const totalFrames = 10

const cloudTypes = ['可见光', '红外', '水汽']
const selectedType = ref('可见光')

const satelliteInfo = ref({
    satellite: '风云4号B星',
    channel: '可见光通道',
    resolution: '500m',
    updateTime: '2024-03-15 14:15',
    coverage: '东亚区域',
})

// 云层分析结果
const cloudAnalysis = ref([
    { region: '华北地区', coverage: 75, type: '层积云', thickness: '中厚', movement: '东南移动', speed: '25km/h' },
    { region: '华东沿海', coverage: 90, type: '积雨云', thickness: '厚', movement: '西南移动', speed: '18km/h' },
    { region: '华南地区', coverage: 45, type: '卷云', thickness: '薄', movement: '东移', speed: '40km/h' },
    { region: '西北内陆', coverage: 20, type: '高积云', thickness: '薄', movement: '偏东移动', speed: '30km/h' },
])

function togglePlay() { isPlaying.value = !isPlaying.value }
function prevFrame() { if (currentFrame.value > 0) currentFrame.value-- }
function nextFrame() { if (currentFrame.value < totalFrames - 1) currentFrame.value++ }
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
            <!-- 云图展示区 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Cloud class="w-4 h-4 text-info" /> 卫星云图
                    </h4>
                    <div class="flex items-center gap-1.5">
                        <button v-for="ct in cloudTypes" :key="ct" @click="selectedType = ct"
                            class="px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                            :class="selectedType === ct ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                            {{ ct }}
                        </button>
                    </div>
                </div>
                <!-- 云图显示区 -->
                <div class="aspect-4/3 bg-[#0a1929] flex items-center justify-center">
                    <div class="text-center text-muted-themed">
                        <Cloud class="w-16 h-16 mx-auto opacity-20 mb-3" />
                        <p class="text-sm">{{ selectedType }}卫星云图</p>
                        <p class="text-[10px] mt-1">{{ satelliteInfo.satellite }} · {{ satelliteInfo.coverage }}</p>
                    </div>
                </div>
                <!-- 时间轴控制 -->
                <div class="px-4 py-2.5 border-t border-themed flex items-center gap-3">
                    <div class="flex items-center gap-1.5">
                        <button @click="prevFrame"
                            class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                            <SkipBack class="w-3.5 h-3.5 text-dim" />
                        </button>
                        <button @click="togglePlay"
                            class="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                            <component :is="isPlaying ? Pause : Play" class="w-4 h-4" />
                        </button>
                        <button @click="nextFrame"
                            class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                            <SkipForward class="w-3.5 h-3.5 text-dim" />
                        </button>
                    </div>
                    <div class="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div class="h-full bg-info rounded-full transition-all"
                            :style="{ width: ((currentFrame + 1) / totalFrames * 100) + '%' }"></div>
                    </div>
                    <span class="text-[10px] text-dim">{{ currentFrame + 1 }}/{{ totalFrames }}</span>
                </div>
            </div>

            <!-- 右侧信息面板 -->
            <div class="space-y-4">
                <!-- 卫星参数 -->
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
                        <Layers class="w-4 h-4 text-info" /> 卫星参数
                    </h4>
                    <div class="space-y-2.5 text-xs">
                        <div class="flex justify-between"><span class="text-dim">卫星</span><span class="text-default">{{
                                satelliteInfo.satellite }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">通道</span><span class="text-default">{{
                                satelliteInfo.channel }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">分辨率</span><span class="text-default">{{
                                satelliteInfo.resolution }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">覆盖区域</span><span
                                class="text-default">{{ satelliteInfo.coverage }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">更新时间</span><span
                                class="text-primary">{{ satelliteInfo.updateTime }}</span></div>
                    </div>
                </div>

                <!-- 云层分析 -->
                <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <div class="px-4 py-3 border-b border-themed">
                        <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                            <Eye class="w-4 h-4 text-warning" /> 云层分析
                        </h4>
                    </div>
                    <div class="p-3 space-y-2">
                        <div v-for="c in cloudAnalysis" :key="c.region" class="p-2.5 rounded-lg bg-surface text-xs">
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-default font-medium">{{ c.region }}</span>
                                <span class="text-dim">云量 {{ c.coverage }}%</span>
                            </div>
                            <div class="w-full h-1.5 bg-[#1E3348] rounded-full overflow-hidden mb-2">
                                <div class="h-full rounded-full transition-all"
                                    :class="c.coverage > 70 ? 'bg-warning' : c.coverage > 40 ? 'bg-info' : 'bg-success'"
                                    :style="{ width: c.coverage + '%' }"></div>
                            </div>
                            <div class="flex items-center gap-3 text-[10px] text-muted-themed">
                                <span>{{ c.type }}</span>
                                <span>{{ c.thickness }}</span>
                                <span>{{ c.movement }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
