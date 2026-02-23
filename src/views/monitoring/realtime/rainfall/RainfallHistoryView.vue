<script setup lang="ts">
import { ref } from 'vue'
import { Clock, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-vue-next'

// ===================== 筛选条件 =====================
const selectedStation = ref('all')
const startDate = ref('2024-03-01')
const endDate = ref('2024-03-15')
const stations = ['全部站点', '芙蓉路雨量站', '左家塘街道雨量站', '圭塘街道雨量站', '洞井街道雨量站', '黎托街道雨量站', '侯家塘区雨量站']

// ===================== 历史数据 =====================
const currentPage = ref(1)
const totalPages = 5

const historyData = ref([
    { date: '2024-03-15 14:00', station: '芙蓉路雨量站', value: 3.2, level: '小雨', cumulative: 28.5, duration: '6h' },
    { date: '2024-03-15 13:00', station: '左家塘街道雨量站', value: 8.5, level: '大雨', cumulative: 45.2, duration: '8h' },
    { date: '2024-03-15 12:00', station: '黎托街道雨量站', value: 12.6, level: '大雨', cumulative: 68.4, duration: '10h' },
    { date: '2024-03-14 20:00', station: '圭塘街道雨量站', value: 2.1, level: '小雨', cumulative: 15.8, duration: '4h' },
    { date: '2024-03-14 16:00', station: '洞井街道雨量站', value: 0.8, level: '小雨', cumulative: 5.2, duration: '3h' },
    { date: '2024-03-13 22:00', station: '侯家塘区雨量站', value: 5.6, level: '中雨', cumulative: 32.1, duration: '7h' },
    { date: '2024-03-13 18:00', station: '芙蓉路雨量站', value: 16.2, level: '暴雨', cumulative: 85.6, duration: '5h' },
    { date: '2024-03-12 08:00', station: '左家塘街道雨量站', value: 4.3, level: '中雨', cumulative: 22.4, duration: '6h' },
])

function getLevelColor(level: string) {
    return level === '暴雨' ? 'text-danger' : level === '大雨' ? 'text-warning' : level === '中雨' ? 'text-info' : 'text-success'
}
function getLevelBg(level: string) {
    return level === '暴雨' ? 'bg-danger/10' : level === '大雨' ? 'bg-warning/10' : level === '中雨' ? 'bg-info/10' : 'bg-success/10'
}

function handleSearch() { /* 查询 */ }
</script>

<template>
    <div class="space-y-4">
        <!-- 筛选条件 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center gap-3 flex-wrap">
                <Filter class="w-4 h-4 text-primary shrink-0" />
                <select v-model="selectedStation"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option v-for="s in stations" :key="s" :value="s">{{ s }}</option>
                </select>
                <div class="flex items-center gap-1.5 text-xs">
                    <span class="text-dim">时间:</span>
                    <input v-model="startDate" type="date"
                        class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                    <span class="text-dim">至</span>
                    <input v-model="endDate" type="date"
                        class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <button @click="handleSearch"
                    class="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Search class="w-3.5 h-3.5" /> 查询
                </button>
            </div>
        </div>

        <!-- 数据表格 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                    <Clock class="w-4 h-4 text-primary" /> 降雨历史数据
                </h4>
                <span class="text-[10px] text-muted-themed">共 {{ historyData.length * totalPages }} 条记录</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">雨量站</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">瞬时雨量(mm/h)</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">降雨等级</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">累计雨量(mm)</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">持续时长</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in historyData" :key="d.date + d.station"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-dim">{{ d.date }}</td>
                            <td class="px-4 py-2.5 text-default font-medium">{{ d.station }}</td>
                            <td class="text-center px-4 py-2.5 text-default font-bold">{{ d.value }}</td>
                            <td class="text-center px-4 py-2.5">
                                <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="[getLevelColor(d.level), getLevelBg(d.level)]">{{ d.level }}</span>
                            </td>
                            <td class="text-center px-4 py-2.5 text-default">{{ d.cumulative }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ d.duration }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 分页 -->
            <div class="px-4 py-3 border-t border-themed flex items-center justify-between">
                <span class="text-[10px] text-muted-themed">第 {{ currentPage }} / {{ totalPages }} 页</span>
                <div class="flex items-center gap-1">
                    <button @click="currentPage = Math.max(1, currentPage - 1)"
                        class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"
                        :disabled="currentPage === 1">
                        <ChevronLeft class="w-4 h-4" :class="currentPage === 1 ? 'text-muted-themed' : 'text-dim'" />
                    </button>
                    <button v-for="p in totalPages" :key="p" @click="currentPage = p"
                        class="w-6 h-6 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        :class="currentPage === p ? 'bg-primary text-white' : 'text-dim hover:bg-hover-themed'">
                        {{ p }}
                    </button>
                    <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                        class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"
                        :disabled="currentPage === totalPages">
                        <ChevronRight class="w-4 h-4"
                            :class="currentPage === totalPages ? 'text-muted-themed' : 'text-dim'" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
