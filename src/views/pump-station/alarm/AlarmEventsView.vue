<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, Search } from 'lucide-vue-next'

const filterStation = ref('全部')
const filterLevel = ref('全部')
const stationOptions = ['全部', '朝阳泵站', '西城泵站', '通州泵站', '丰台泵站']
const levelOptions = ['全部', '预警', '告警', '严重']

const events = ref([
    { id: 1, type: '水位超高', station: '通州泵站', device: '前池水位计', level: '告警', time: '2024-03-15 16:20', value: '3.6m', threshold: '3.5m', status: '处理中', count: 1 },
    { id: 2, type: '流量异常', station: '朝阳泵站', device: '进水流量计', level: '预警', time: '2024-03-15 14:30', value: '波动18%', threshold: '15%', status: '已处理', count: 3 },
    { id: 3, type: '水泵故障', station: '海淀泵站', device: '2号水泵', level: '严重', time: '2024-03-14 22:15', value: '异常停机', threshold: '-', status: '已闭环', count: 1 },
    { id: 4, type: '电机过温', station: '西城泵站', device: '主电机', level: '告警', time: '2024-03-14 09:30', value: '82°C', threshold: '80°C', status: '已处理', count: 2 },
    { id: 5, type: '格栅过载', station: '丰台泵站', device: '格栅除污机', level: '告警', time: '2024-03-13 11:20', value: '电流125%', threshold: '120%', status: '待处理', count: 1 },
    { id: 6, type: '配电异常', station: '通州泵站', device: '配电柜A', level: '预警', time: '2024-03-12 08:45', value: '电压偏差12%', threshold: '10%', status: '已处理', count: 1 },
])

const filteredEvents = computed(() => {
    return events.value.filter(e => (filterStation.value === '全部' || e.station === filterStation.value) && (filterLevel.value === '全部' || e.level === filterLevel.value))
})

const stats = computed(() => ({
    total: events.value.length,
    pending: events.value.filter(e => e.status === '待处理').length,
    processing: events.value.filter(e => e.status === '处理中').length,
    closed: events.value.filter(e => e.status === '已闭环' || e.status === '已处理').length,
}))

function levelClass(l: string) { return l === '严重' ? 'bg-danger/10 text-danger' : l === '告警' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
function statusClass(s: string) { return s === '已闭环' ? 'bg-success/10 text-success' : s === '已处理' ? 'bg-info/10 text-info' : s === '处理中' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger' }
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-4 gap-3">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-2xl font-bold text-default">{{ stats.total }}</p>
                <p class="text-[10px] text-dim">报警总数</p>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-2xl font-bold text-danger">{{ stats.pending }}</p>
                <p class="text-[10px] text-dim">待处理</p>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-2xl font-bold text-primary">{{ stats.processing }}</p>
                <p class="text-[10px] text-dim">处理中</p>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-2xl font-bold text-success">{{ stats.closed }}</p>
                <p class="text-[10px] text-dim">已处理/闭环</p>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Bell class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">报警事件列表</span>
            </div>
            <div class="flex items-center gap-2">
                <select v-model="filterStation"
                    class="text-[10px] px-2 py-1 rounded bg-surface border border-themed text-default outline-none">
                    <option v-for="s in stationOptions" :key="s">{{ s }}</option>
                </select>
                <select v-model="filterLevel"
                    class="text-[10px] px-2 py-1 rounded bg-surface border border-themed text-default outline-none">
                    <option v-for="l in levelOptions" :key="l">{{ l }}</option>
                </select>
                <div class="flex items-center gap-1 px-2 py-1 bg-surface rounded border border-themed">
                    <Search class="w-3 h-3 text-dim" /><input type="text" placeholder="搜索..."
                        class="bg-transparent outline-none text-[10px] text-default w-16" />
                </div>
            </div>
        </div>

        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">设备</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">实际值</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">阈值</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">汇聚</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="e in filteredEvents" :key="e.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2.5 text-default font-medium">{{ e.type }}</td>
                        <td class="text-center px-2 py-2.5 text-dim">{{ e.station }}</td>
                        <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ e.device }}</td>
                        <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="levelClass(e.level)">{{ e.level }}</span></td>
                        <td class="text-center px-2 py-2.5 text-danger font-bold">{{ e.value }}</td>
                        <td class="text-center px-2 py-2.5 text-dim">{{ e.threshold }}</td>
                        <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ e.time }}</td>
                        <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                :class="e.count > 1 ? 'bg-warning/10 text-warning' : 'bg-surface text-dim'">{{ e.count
                                }}次</span></td>
                        <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="statusClass(e.status)">{{ e.status }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
