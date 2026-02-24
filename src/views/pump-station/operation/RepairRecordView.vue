<script setup lang="ts">
import { ref, computed } from 'vue'
import { Archive, Calendar, Filter, Search } from 'lucide-vue-next'

const activeFunc = ref('lifecycle')
const funcTabs = [
    { key: 'lifecycle', label: '全生命周期' },
    { key: 'query', label: '多维查询' },
]

const queryType = ref('time')
const queryOptions = [
    { key: 'time', label: '按时间' },
    { key: 'type', label: '按类型' },
    { key: 'device', label: '按设备' },
]

const lifecycleRecords = ref([
    {
        id: 1, device: '1号水泵', station: '雨花泵站', installDate: '2020-03-15', totalRepairs: 8, lastRepair: '2024-03-10', status: '运行', repairs: [
            { date: '2024-03-10', type: '计划保养', desc: '更换轴承、密封检查', duration: '3.5h', cost: 2800 },
            { date: '2023-12-05', type: '故障维修', desc: '叶轮磨损更换', duration: '6h', cost: 5200 },
            { date: '2023-08-20', type: '计划保养', desc: '润滑保养、振动检测', duration: '2h', cost: 500 },
        ]
    },
    {
        id: 2, device: '主电机', station: '侯家塘泵站', installDate: '2021-06-20', totalRepairs: 4, lastRepair: '2023-12-20', status: '运行', repairs: [
            { date: '2023-12-20', type: '计划保养', desc: '绝缘测量、风扇清洁', duration: '2h', cost: 300 },
            { date: '2023-06-15', type: '故障维修', desc: '轴承过热更换', duration: '4h', cost: 1800 },
        ]
    },
    {
        id: 3, device: '格栅机', station: '左家塘泵站', installDate: '2022-01-05', totalRepairs: 6, lastRepair: '2024-03-14', status: '运行', repairs: [
            { date: '2024-03-14', type: '故障维修', desc: '链条断裂更换', duration: '3h', cost: 3500 },
            { date: '2024-02-15', type: '计划保养', desc: '齿耙清洗、润滑', duration: '2.5h', cost: 400 },
        ]
    },
])

const selectedDevice = ref<typeof lifecycleRecords.value[0] | null>(null)

const allRecords = ref([
    { device: '1号水泵', station: '雨花泵站', date: '2024-03-10', type: '计划保养', desc: '更换轴承', duration: '3.5h', cost: 2800 },
    { device: '格栅机', station: '左家塘泵站', date: '2024-03-14', type: '故障维修', desc: '链条更换', duration: '3h', cost: 3500 },
    { device: '主电机', station: '侯家塘泵站', date: '2023-12-20', type: '计划保养', desc: '绝缘测量', duration: '2h', cost: 300 },
    { device: '1号水泵', station: '雨花泵站', date: '2023-12-05', type: '故障维修', desc: '叶轮更换', duration: '6h', cost: 5200 },
    { device: '主电机', station: '侯家塘泵站', date: '2023-06-15', type: '故障维修', desc: '轴承更换', duration: '4h', cost: 1800 },
])

const searchText = ref('')
const startDate = ref('')
const endDate = ref('')

const filteredRecords = computed(() => allRecords.value.filter(r => {
    if (searchText.value && !r.device.includes(searchText.value) && !r.station.includes(searchText.value) && !r.desc.includes(searchText.value)) return false
    if (queryType.value === 'type') return true // 按类型分组展示时不过滤
    if (startDate.value && r.date < startDate.value) return false
    if (endDate.value && r.date > endDate.value + ' 23:59') return false
    if (queryType.value === 'device' && searchText.value && !r.device.includes(searchText.value)) return false
    return true
}))
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'lifecycle'">
            <div class="flex items-center gap-2 mb-1">
                <Archive class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">设备维修档案</span>
            </div>
            <div class="grid grid-cols-3 gap-3 mb-3">
                <div v-for="d in lifecycleRecords" :key="d.id" @click="selectedDevice = d"
                    class="bg-card border rounded-xl shadow-themed p-4 cursor-pointer transition-colors"
                    :class="selectedDevice?.id === d.id ? 'border-primary bg-primary/5' : 'border-themed hover:bg-hover-themed'">
                    <div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-default">{{
                        d.device }}</span><span
                            class="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success">{{ d.status }}</span>
                    </div>
                    <div class="text-[10px] text-dim space-y-0.5">
                        <p>{{ d.station }} · 安装: {{ d.installDate }}</p>
                        <p>累计维修: <span class="text-primary font-bold">{{ d.totalRepairs }}</span> 次 · 最近: {{
                            d.lastRepair }}</p>
                    </div>
                </div>
            </div>
            <div v-if="selectedDevice" class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed"><span class="text-xs font-bold text-default">{{
                    selectedDevice.device }} 维修记录</span></div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">类型</th>
                            <th class="text-left px-2 py-2 text-dim font-medium">内容</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">时长</th>
                            <th class="text-center px-2 py-2 text-dim font-medium">费用</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(r, i) in selectedDevice.repairs" :key="i" class="border-b border-themed/30">
                            <td class="text-center px-3 py-2 text-dim">{{ r.date }}</td>
                            <td class="text-center px-2 py-2"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="r.type === '故障维修' ? 'bg-danger/10 text-danger' : 'bg-info/10 text-info'">{{
                                        r.type }}</span></td>
                            <td class="px-2 py-2 text-default">{{ r.desc }}</td>
                            <td class="text-center px-2 py-2 text-primary font-bold">{{ r.duration }}</td>
                            <td class="text-center px-2 py-2 text-warning">¥{{ r.cost }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'query'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Filter class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">多维查询</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex gap-1"><button v-for="q in queryOptions" :key="q.key" @click="queryType = q.key"
                            class="px-2 py-1 rounded text-[10px] cursor-pointer"
                            :class="queryType === q.key ? 'bg-primary text-white' : 'bg-surface text-dim hover:text-default'">{{
                                q.label }}</button></div>
                    <div class="flex items-center gap-1 px-2 py-1 bg-surface rounded border border-themed">
                        <Search class="w-3 h-3 text-dim" /><input v-model="searchText" type="text" placeholder="搜索..."
                            class="bg-transparent outline-none text-[10px] text-default w-20" />
                    </div>
                </div>
            </div>
            <div v-if="queryType === 'time'" class="flex items-center gap-2 text-[10px]">
                <Calendar class="w-3.5 h-3.5 text-dim" /><input v-model="startDate" type="date"
                    class="px-2 py-1 bg-surface border border-themed rounded text-default outline-none" /><span
                    class="text-dim">至</span><input v-model="endDate" type="date"
                    class="px-2 py-1 bg-surface border border-themed rounded text-default outline-none" />
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">内容</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时长</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">费用</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(r, i) in filteredRecords" :key="i"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.station }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.date }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="r.type === '故障维修' ? 'bg-danger/10 text-danger' : 'bg-info/10 text-info'">{{
                                        r.type }}</span></td>
                            <td class="px-2 py-2.5 text-default">{{ r.desc }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ r.duration }}</td>
                            <td class="text-center px-2 py-2.5 text-warning">¥{{ r.cost }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
