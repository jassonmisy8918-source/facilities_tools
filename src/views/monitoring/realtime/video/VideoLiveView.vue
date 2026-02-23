<script setup lang="ts">
import { ref } from 'vue'
import { Video, Maximize2, Grid3x3, Grid2x2 } from 'lucide-vue-next'

const layout = ref<'2x2' | '3x3'>('2x2')

const cameras = ref([
    { id: 1, name: '韶山路泵站', online: true, region: '圭塘街道' },
    { id: 2, name: '圭塘河排放口', online: true, region: '雨花亭街道' },
    { id: 3, name: '芙蓉路节点', online: false, region: '侯家塘街道' },
    { id: 4, name: '劳动路截流井', online: true, region: '洞井街道' },
    { id: 5, name: '左家塘街道泵站', online: true, region: '左家塘街道' },
    { id: 6, name: '黎托街道排口', online: false, region: '黎托街道' },
    { id: 7, name: '侯家塘区监测站', online: true, region: '侯家塘区' },
    { id: 8, name: '侯家塘区泵站', online: true, region: '侯家塘区' },
    { id: 9, name: '侯家塘区排口', online: true, region: '侯家塘区' },
])

const displayCams = ref(cameras.value.slice(0, 4))
const selectedCam = ref('')

function setLayout(l: '2x2' | '3x3') {
    layout.value = l
    displayCams.value = cameras.value.slice(0, l === '2x2' ? 4 : 9)
}
</script>

<template>
    <div class="space-y-4">
        <!-- 操作栏 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <Video class="w-4 h-4 text-primary" />
                <span class="text-sm font-semibold text-default">实时监控画面</span>
                <span class="text-xs text-muted-themed">({{cameras.filter(c => c.online).length}}路在线)</span>
            </div>
            <div class="flex items-center gap-2">
                <select v-model="selectedCam"
                    class="bg-input border border-themed rounded-lg px-2 py-1 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="">全部区域</option>
                    <option v-for="cam in cameras" :key="cam.id" :value="cam.id">{{ cam.name }}</option>
                </select>
                <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5">
                    <button @click="setLayout('2x2')" class="p-1.5 rounded transition-colors cursor-pointer"
                        :class="layout === '2x2' ? 'bg-primary text-white' : 'text-dim hover:text-default'">
                        <Grid2x2 class="w-3.5 h-3.5" />
                    </button>
                    <button @click="setLayout('3x3')" class="p-1.5 rounded transition-colors cursor-pointer"
                        :class="layout === '3x3' ? 'bg-primary text-white' : 'text-dim hover:text-default'">
                        <Grid3x3 class="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>

        <!-- 视频网格 -->
        <div :class="layout === '2x2' ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-3 gap-2'">
            <div v-for="cam in displayCams" :key="cam.id"
                class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="aspect-video bg-[#0a1929] flex items-center justify-center relative">
                    <div v-if="cam.online" class="text-center text-muted-themed">
                        <Video class="w-10 h-10 mx-auto opacity-20 mb-1" />
                        <p class="text-[10px]">实时画面</p>
                    </div>
                    <div v-else class="text-center text-danger/50">
                        <Video class="w-10 h-10 mx-auto opacity-20 mb-1" />
                        <p class="text-[10px]">设备离线</p>
                    </div>
                    <button
                        class="absolute top-2 right-2 p-1 rounded bg-black/30 hover:bg-black/50 transition-colors cursor-pointer">
                        <Maximize2 class="w-3 h-3 text-white" />
                    </button>
                </div>
                <div class="flex items-center justify-between px-3 py-2 border-t border-themed">
                    <div>
                        <p class="text-xs font-medium text-default">{{ cam.name }}</p>
                        <p class="text-[10px] text-dim">{{ cam.region }}</p>
                    </div>
                    <span class="flex items-center gap-1 text-[10px]"
                        :class="cam.online ? 'text-success' : 'text-danger'">
                        <span class="w-1.5 h-1.5 rounded-full" :class="cam.online ? 'bg-success' : 'bg-danger'"></span>
                        {{ cam.online ? '在线' : '离线' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
