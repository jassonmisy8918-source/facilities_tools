<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Download } from 'lucide-vue-next'

const levelFilter = ref('all')
const statusFilter = ref('all')
const startDate = ref('2024-03-01')
const endDate = ref('2024-03-15')
const searchKeyword = ref('')

const historyAlarms = ref([
    { id: 'ALM-20240315-001', level: 'critical', title: '万家丽路DN300水位超限', location: '监测点#06', type: '水位超限', time: '2024-03-15 14:23', resolveTime: '2024-03-15 15:10', status: 'resolved', handler: '张工', duration: '47min' },
    { id: 'ALM-20240315-002', level: 'warning', title: '侯家塘街道进水口COD超标', location: 'WQ-302', type: '水质超标', time: '2024-03-15 13:45', resolveTime: '2024-03-15 14:30', status: 'resolved', handler: '李工', duration: '45min' },
    { id: 'ALM-20240315-003', level: 'warning', title: '劳动路DN400水位预警', location: '监测点#02', type: '水位超限', time: '2024-03-15 12:30', resolveTime: '2024-03-15 13:05', status: 'resolved', handler: '王工', duration: '35min' },
    { id: 'ALM-20240315-004', level: 'info', title: '左家塘街道降雨量增加', location: 'RG-051', type: '雨量预警', time: '2024-03-15 11:20', resolveTime: '2024-03-15 11:30', status: 'false_alarm', handler: '李工', duration: '10min' },
    { id: 'ALM-20240314-001', level: 'critical', title: '黎托街道主干水位超限', location: '监测点#08', type: '水位超限', time: '2024-03-14 20:15', resolveTime: '2024-03-14 21:30', status: 'resolved', handler: '赵工', duration: '1h15min' },
    { id: 'ALM-20240314-002', level: 'warning', title: '洞井街道雨量超限', location: 'RG-2005', type: '雨量预警', time: '2024-03-14 18:00', resolveTime: '2024-03-14 19:20', status: 'resolved', handler: '张工', duration: '1h20min' },
    { id: 'ALM-20240313-001', level: 'info', title: '圭塘河泵站流量波动', location: 'FM-3002', type: '流量异常', time: '2024-03-13 16:30', resolveTime: '2024-03-13 16:45', status: 'false_alarm', handler: '系统', duration: '15min' },
    { id: 'ALM-20240312-001', level: 'warning', title: '韶山路流量超限', location: 'FM-201', type: '流量异常', time: '2024-03-12 14:20', resolveTime: '2024-03-12 15:50', status: 'resolved', handler: '王工', duration: '1h30min' },
])

const filteredAlarms = computed(() => historyAlarms.value.filter(a => {
    if (levelFilter.value !== 'all' && a.level !== levelFilter.value) return false
    if (statusFilter.value !== 'all' && a.status !== statusFilter.value) return false
    if (searchKeyword.value && !a.title.includes(searchKeyword.value) && !a.id.includes(searchKeyword.value)) return false
    return true
}))

const stats = computed(() => ({
    total: historyAlarms.value.length,
    resolved: historyAlarms.value.filter(a => a.status === 'resolved').length,
    falseAlarm: historyAlarms.value.filter(a => a.status === 'false_alarm').length,
    critical: historyAlarms.value.filter(a => a.level === 'critical').length,
}))

function getLevelClass(l: string) { return l === 'critical' ? 'text-danger bg-danger/10' : l === 'warning' ? 'text-warning bg-warning/10' : l === 'info' ? 'text-info bg-info/10' : 'text-dim bg-surface' }
function getLevelText(l: string) { return l === 'critical' ? '紧急' : l === 'warning' ? '严重' : l === 'info' ? '一般' : '提示' }
</script>

<template>
    <div class="space-y-4">
        <!-- 统计 -->
        <div class="grid grid-cols-4 gap-3">
            <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                <p class="text-2xl font-bold text-default">{{ stats.total }}</p>
                <p class="text-[10px] text-dim mt-0.5">总报警数</p>
            </div>
            <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                <p class="text-2xl font-bold text-success">{{ stats.resolved }}</p>
                <p class="text-[10px] text-dim mt-0.5">已处置</p>
            </div>
            <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                <p class="text-2xl font-bold text-warning">{{ stats.falseAlarm }}</p>
                <p class="text-[10px] text-dim mt-0.5">误报</p>
            </div>
            <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                <p class="text-2xl font-bold text-danger">{{ stats.critical }}</p>
                <p class="text-[10px] text-dim mt-0.5">紧急报警</p>
            </div>
        </div>

        <!-- 查询条件 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3 flex-wrap">
            <div class="relative">
                <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                    v-model="searchKeyword" type="text" placeholder="搜索报警信息..."
                    class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
            </div>
            <select v-model="levelFilter"
                class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                <option value="all">全部等级</option>
                <option value="critical">紧急</option>
                <option value="warning">严重</option>
                <option value="info">一般</option>
            </select>
            <select v-model="statusFilter"
                class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                <option value="all">全部状态</option>
                <option value="resolved">已处置</option>
                <option value="false_alarm">误报</option>
            </select>
            <div class="flex items-center gap-1.5 text-xs"><input v-model="startDate" type="date"
                    class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" /><span
                    class="text-dim">至</span><input v-model="endDate" type="date"
                    class="bg-input border border-themed rounded-lg px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <button
                class="flex items-center gap-1 px-3 py-1.5 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                <Download class="w-3 h-3" /> 导出
            </button>
        </div>

        <!-- 表格 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">等级</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">报警标题</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">发生时间</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">解除时间</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">持续</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">处理人</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="a in filteredAlarms" :key="a.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-primary font-mono text-[10px]">{{ a.id }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="getLevelClass(a.level)">{{ getLevelText(a.level) }}</span></td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ a.title }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ a.type }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ a.time }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ a.resolveTime }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ a.duration }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ a.handler }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] font-medium"
                                :class="a.status === 'resolved' ? 'text-success' : 'text-warning'">{{ a.status ===
                                    'resolved' ? '已处置' : '误报' }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
