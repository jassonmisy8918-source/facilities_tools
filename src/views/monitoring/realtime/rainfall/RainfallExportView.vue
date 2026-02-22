<script setup lang="ts">
import { ref } from 'vue'
import { Download, FileSpreadsheet, Filter, CheckCircle } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 导出条件 =====================
const selectedStation = ref('all')
const startDate = ref('2024-03-01')
const endDate = ref('2024-03-15')
const exportFormat = ref('xlsx')
const includeFields = ref({
    time: true, station: true, instantaneous: true, level: true, cumulative: true, duration: true,
})

const stations = ['全部站点', '和平路雨量站', '丰台区雨量站', '朝阳区雨量站', '海淀区雨量站', '通州区雨量站', '大兴区雨量站']
const formats = [
    { key: 'xlsx', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { key: 'csv', label: 'CSV (.csv)', icon: FileSpreadsheet },
]

const fields = [
    { key: 'time', label: '监测时间' },
    { key: 'station', label: '雨量站名称' },
    { key: 'instantaneous', label: '瞬时雨量' },
    { key: 'level', label: '降雨等级' },
    { key: 'cumulative', label: '累计雨量' },
    { key: 'duration', label: '降雨持续时长' },
]

// ===================== 导出历史 =====================
const exportHistory = ref([
    { id: 1, date: '2024-03-15 14:30', range: '2024-03-01 ~ 2024-03-15', station: '全部站点', format: 'xlsx', records: 1280, size: '256KB', status: 'done' },
    { id: 2, date: '2024-03-10 09:15', range: '2024-02-01 ~ 2024-02-28', station: '和平路雨量站', format: 'csv', records: 672, size: '128KB', status: 'done' },
    { id: 3, date: '2024-03-05 16:45', range: '2024-01-01 ~ 2024-01-31', station: '全部站点', format: 'xlsx', records: 2560, size: '512KB', status: 'done' },
])

function handleExport() {
    toast.value?.show(`正在导出 ${exportFormat.value.toUpperCase()} 格式数据...`, 'info')
}
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
            <!-- 导出设置 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <Filter class="w-4 h-4 text-primary" /> 导出条件设置
                    </h4>
                </div>
                <div class="p-4 space-y-4">
                    <!-- 站点选择 -->
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">雨量站</label>
                        <select v-model="selectedStation"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                            <option v-for="s in stations" :key="s" :value="s">{{ s }}</option>
                        </select>
                    </div>
                    <!-- 时间范围 -->
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">时间范围</label>
                        <div class="flex items-center gap-2">
                            <input v-model="startDate" type="date"
                                class="flex-1 bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                            <span class="text-xs text-dim">至</span>
                            <input v-model="endDate" type="date"
                                class="flex-1 bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                    <!-- 导出格式 -->
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">导出格式</label>
                        <div class="flex items-center gap-2">
                            <button v-for="f in formats" :key="f.key" @click="exportFormat = f.key"
                                class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border"
                                :class="exportFormat === f.key ? 'border-primary bg-primary/10 text-primary' : 'border-themed text-dim hover:text-default hover:bg-hover-themed'">
                                <component :is="f.icon" class="w-3.5 h-3.5" />
                                {{ f.label }}
                            </button>
                        </div>
                    </div>
                    <!-- 导出字段 -->
                    <div>
                        <label class="text-xs text-dim mb-1.5 block">导出字段</label>
                        <div class="grid grid-cols-3 gap-2">
                            <label v-for="field in fields" :key="field.key"
                                class="flex items-center gap-2 p-2 rounded-lg bg-surface cursor-pointer hover:bg-hover-themed transition-colors">
                                <input type="checkbox" v-model="includeFields[field.key as keyof typeof includeFields]"
                                    class="accent-primary w-3.5 h-3.5" />
                                <span class="text-xs text-default">{{ field.label }}</span>
                            </label>
                        </div>
                    </div>
                    <!-- 导出按钮 -->
                    <button @click="handleExport"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Download class="w-4 h-4" /> 开始导出
                    </button>
                </div>
            </div>

            <!-- 导出历史 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed">
                    <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                        <FileSpreadsheet class="w-4 h-4 text-info" /> 导出历史记录
                    </h4>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="h in exportHistory" :key="h.id" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-medium text-default">{{ h.station }}</span>
                            <div class="flex items-center gap-1">
                                <CheckCircle class="w-3 h-3 text-success" />
                                <span class="text-[10px] text-success">已完成</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-y-1 text-[10px]">
                            <div><span class="text-dim">导出时间: </span><span class="text-default">{{ h.date }}</span>
                            </div>
                            <div><span class="text-dim">数据范围: </span><span class="text-default">{{ h.range }}</span>
                            </div>
                            <div><span class="text-dim">记录数: </span><span class="text-default">{{
                                    h.records.toLocaleString() }}条</span></div>
                            <div><span class="text-dim">文件大小: </span><span class="text-default">{{ h.size }}</span>
                            </div>
                        </div>
                        <div class="mt-2">
                            <button class="text-[10px] text-primary hover:underline cursor-pointer">重新下载 (.{{ h.format
                                }})</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
