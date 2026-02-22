<script setup lang="ts">
import { ref } from 'vue'
import { RotateCcw, Video, Play, Calendar, Search } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const selectedCamera = ref('朝阳路泵站')
const playbackDate = ref('2024-03-15')
const startTime = ref('08:00')
const endTime = ref('12:00')
const playbackSpeed = ref('1x')

const cameras = ['朝阳路泵站', '东湖排放口', '和平路节点', '民生路截流井', '丰台区泵站', '通州区排口']
const speeds = ['0.5x', '1x', '2x', '4x', '8x']

// 回放记录
const recordings = ref([
    { id: 1, camera: '朝阳路泵站', date: '2024-03-15', start: '00:00', end: '23:59', duration: '24h', size: '12.8GB', status: '完整' },
    { id: 2, camera: '东湖排放口', date: '2024-03-15', start: '00:00', end: '23:59', duration: '24h', size: '15.2GB', status: '完整' },
    { id: 3, camera: '和平路节点', date: '2024-03-15', start: '06:30', end: '18:45', duration: '12h15m', size: '6.1GB', status: '部分' },
    { id: 4, camera: '民生路截流井', date: '2024-03-14', start: '00:00', end: '23:59', duration: '24h', size: '11.5GB', status: '完整' },
])

function handlePlayback() { toast.value?.show(`正在回放: ${selectedCamera.value} ${playbackDate.value} ${startTime.value}-${endTime.value}`, 'info') }
</script>

<template>
    <div class="space-y-4">
        <!-- 回放控制 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center gap-3 flex-wrap">
                <RotateCcw class="w-4 h-4 text-primary shrink-0" />
                <select v-model="selectedCamera"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option v-for="c in cameras" :key="c" :value="c">{{ c }}</option>
                </select>
                <input v-model="playbackDate" type="date"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                <div class="flex items-center gap-1 text-xs">
                    <input v-model="startTime" type="time"
                        class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary w-24" />
                    <span class="text-dim">~</span>
                    <input v-model="endTime" type="time"
                        class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary w-24" />
                </div>
                <select v-model="playbackSpeed"
                    class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option v-for="s in speeds" :key="s" :value="s">{{ s }}</option>
                </select>
                <button @click="handlePlayback"
                    class="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Play class="w-3.5 h-3.5" /> 开始回放
                </button>
            </div>
        </div>

        <!-- 回放画面 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="aspect-video bg-[#0a1929] flex items-center justify-center">
                <div class="text-center text-muted-themed">
                    <Video class="w-16 h-16 mx-auto opacity-20 mb-3" />
                    <p class="text-sm">{{ selectedCamera }} 录像回放</p>
                    <p class="text-[10px] mt-1">{{ playbackDate }} {{ startTime }} - {{ endTime }}</p>
                </div>
            </div>
        </div>

        <!-- 录像记录列表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-info" /> 录像记录
                </h4>
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="搜索录像..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1 text-[11px] text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-40" />
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">摄像头</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">时间段</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">时长</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">大小</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in recordings" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ r.camera }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ r.date }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ r.start }} - {{ r.end }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ r.duration }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ r.size }}</td>
                            <td class="text-center px-4 py-2.5">
                                <span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="r.status === '完整' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                    r.status }}</span>
                            </td>
                            <td class="text-center px-4 py-2.5">
                                <button class="text-[10px] text-primary hover:underline cursor-pointer">回放</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
