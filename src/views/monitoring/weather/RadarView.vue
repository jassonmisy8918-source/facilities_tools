<script setup lang="ts">
import { ref } from 'vue'
import { Radar, Play, Pause, SkipBack, SkipForward, Clock, Layers } from 'lucide-vue-next'

const isPlaying = ref(false)
const currentFrame = ref(8)
const totalFrames = 12

const radarInfo = ref({
    updateTime: '2024-03-15 14:30',
    mode: '组合反射率',
    range: '250km',
    station: '长沙雨花站',
    elevation: '0.5°',
})

const modes = ['组合反射率', '径向速度', '回波顶高', '垂直液态含水量']
const selectedMode = ref('组合反射率')

// 色标图例
const colorScale = [
    { color: '#00ECEC', label: '5', desc: '弱' },
    { color: '#01A0F6', label: '15', desc: '' },
    { color: '#0000F6', label: '20', desc: '轻度' },
    { color: '#00FF00', label: '30', desc: '中等' },
    { color: '#00C800', label: '35', desc: '' },
    { color: '#008E00', label: '40', desc: '强' },
    { color: '#FFFF00', label: '45', desc: '' },
    { color: '#E7C000', label: '50', desc: '很强' },
    { color: '#FF9000', label: '55', desc: '' },
    { color: '#FF0000', label: '60', desc: '极强' },
    { color: '#D60000', label: '65', desc: '' },
    { color: '#C00000', label: '70+', desc: '剧烈' },
]

// 最近回波动态
const recentEchoes = ref([
    { time: '14:30', direction: '东北→西南', speed: '35km/h', intensity: '中等', trend: '增强' },
    { time: '14:00', direction: '东北→西南', speed: '32km/h', intensity: '轻度', trend: '稳定' },
    { time: '13:30', direction: '东→西', speed: '28km/h', intensity: '轻度', trend: '减弱' },
    { time: '13:00', direction: '东→西', speed: '30km/h', intensity: '弱', trend: '稳定' },
])

function togglePlay() { isPlaying.value = !isPlaying.value }
function prevFrame() { if (currentFrame.value > 0) currentFrame.value-- }
function nextFrame() { if (currentFrame.value < totalFrames - 1) currentFrame.value++ }
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
            <!-- 雷达回波图 -->
            <div class="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Radar class="w-4 h-4 text-primary" /> 气象雷达回波图
                    </h4>
                    <div class="flex items-center gap-2">
                        <select v-model="selectedMode"
                            class="bg-input border border-themed rounded-lg px-2 py-1 text-xs text-default focus:outline-none focus:border-primary">
                            <option v-for="m in modes" :key="m" :value="m">{{ m }}</option>
                        </select>
                    </div>
                </div>
                <!-- 雷达图显示区 -->
                <div class="aspect-4/3 bg-[#0a1929] flex items-center justify-center relative">
                    <div class="text-center text-muted-themed">
                        <Radar class="w-16 h-16 mx-auto opacity-20 mb-3" />
                        <p class="text-sm">雷达回波图</p>
                        <p class="text-[10px] mt-1">{{ radarInfo.station }} · {{ selectedMode }}</p>
                    </div>
                    <!-- 色标 -->
                    <div class="absolute right-3 top-3 bottom-3 flex flex-col items-center justify-center gap-0">
                        <span class="text-[8px] text-muted-themed mb-1">dBZ</span>
                        <div v-for="c in colorScale" :key="c.label" class="flex items-center gap-1">
                            <div class="w-3 h-3" :style="{ backgroundColor: c.color }"></div>
                            <span class="text-[8px] text-muted-themed w-5 text-right">{{ c.label }}</span>
                        </div>
                    </div>
                </div>
                <!-- 播放控制 -->
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
                        <div class="h-full bg-primary rounded-full transition-all"
                            :style="{ width: ((currentFrame + 1) / totalFrames * 100) + '%' }"></div>
                    </div>
                    <span class="text-[10px] text-dim">{{ currentFrame + 1 }}/{{ totalFrames }}</span>
                </div>
            </div>

            <!-- 右侧信息面板 -->
            <div class="space-y-4">
                <!-- 雷达参数 -->
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
                        <Layers class="w-4 h-4 text-info" /> 雷达参数
                    </h4>
                    <div class="space-y-2.5 text-xs">
                        <div class="flex justify-between"><span class="text-dim">雷达站</span><span class="text-default">{{
                                radarInfo.station }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">扫描模式</span><span
                                class="text-default">{{ radarInfo.mode }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">检测范围</span><span
                                class="text-default">{{ radarInfo.range }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">仰角</span><span class="text-default">{{
                                radarInfo.elevation }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">更新时间</span><span
                                class="text-primary">{{ radarInfo.updateTime }}</span></div>
                    </div>
                </div>

                <!-- 回波动态 -->
                <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <div class="px-4 py-3 border-b border-themed">
                        <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                            <Clock class="w-4 h-4 text-warning" /> 回波移动趋势
                        </h4>
                    </div>
                    <div class="p-3 space-y-2">
                        <div v-for="e in recentEchoes" :key="e.time" class="p-2.5 rounded-lg bg-surface text-xs">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-dim">{{ e.time }}</span>
                                <span class="font-medium"
                                    :class="e.trend === '增强' ? 'text-danger' : e.trend === '减弱' ? 'text-success' : 'text-default'">{{
                                    e.trend }}</span>
                            </div>
                            <div class="flex items-center gap-3 text-[10px] text-muted-themed">
                                <span>方向: {{ e.direction }}</span>
                                <span>速度: {{ e.speed }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
