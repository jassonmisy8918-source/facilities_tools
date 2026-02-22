<script setup lang="ts">
import { ref } from 'vue'
import { HardDrive, Settings, AlertTriangle, Database } from 'lucide-vue-next'

const storageConfig = ref({
    retentionDays: 30,
    storagePath: '/data/video_storage',
    maxCapacity: 10,
    autoClean: true,
})

const storageStats = ref([
    { name: '存储服务器 A', total: 4096, used: 3276, unit: 'GB', cameras: 3 },
    { name: '存储服务器 B', total: 4096, used: 2458, unit: 'GB', cameras: 3 },
    { name: '备份服务器', total: 2048, used: 512, unit: 'GB', cameras: 0 },
])

function getUsagePercent(used: number, total: number) { return Math.round(used / total * 100) }
function getUsageColor(percent: number) { return percent > 85 ? 'bg-danger' : percent > 60 ? 'bg-warning' : 'bg-success' }
function getUsageTextColor(percent: number) { return percent > 85 ? 'text-danger' : percent > 60 ? 'text-warning' : 'text-success' }
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
            <!-- 存储配置 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Settings class="w-4 h-4 text-primary" /> 存储配置
                    </h4>
                </div>
                <div class="p-4 space-y-4">
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">存储周期（天）</label>
                        <input v-model="storageConfig.retentionDays" type="number"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">存储路径</label>
                        <input v-model="storageConfig.storagePath" type="text"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">最大存储容量（TB）</label>
                        <input v-model="storageConfig.maxCapacity" type="number"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-default">自动清理过期录像</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="storageConfig.autoClean" class="sr-only peer" />
                            <div
                                class="w-9 h-5 bg-surface rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary">
                            </div>
                        </label>
                    </div>
                    <button
                        class="w-full py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">保存配置</button>
                </div>
            </div>

            <!-- 存储空间监控 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Database class="w-4 h-4 text-info" /> 存储空间监控
                    </h4>
                </div>
                <div class="p-4 space-y-4">
                    <div v-for="s in storageStats" :key="s.name" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <HardDrive class="w-4 h-4 text-dim" />
                                <span class="text-xs font-medium text-default">{{ s.name }}</span>
                            </div>
                            <span class="text-xs font-bold"
                                :class="getUsageTextColor(getUsagePercent(s.used, s.total))">{{ getUsagePercent(s.used,
                                s.total) }}%</span>
                        </div>
                        <div class="w-full h-2 bg-[#1E3348] rounded-full overflow-hidden mb-1.5">
                            <div class="h-full rounded-full transition-all"
                                :class="getUsageColor(getUsagePercent(s.used, s.total))"
                                :style="{ width: getUsagePercent(s.used, s.total) + '%' }"></div>
                        </div>
                        <div class="flex items-center justify-between text-[10px] text-muted-themed">
                            <span>已用 {{ s.used }}{{ s.unit }} / {{ s.total }}{{ s.unit }}</span>
                            <span>{{ s.cameras }}路摄像头</span>
                        </div>
                        <div v-if="getUsagePercent(s.used, s.total) > 85"
                            class="flex items-center gap-1 mt-2 text-[10px] text-danger">
                            <AlertTriangle class="w-3 h-3" /> 存储空间即将不足，请及时清理
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
