<script setup lang="ts">
import { ref } from 'vue'
import { Waves, Gauge, Wifi, FileText } from 'lucide-vue-next'
const activeFunc = ref('level')
const funcTabs = [
    { key: 'level', label: '实时水位' },
    { key: 'flow', label: '实时流量' },
    { key: 'remote', label: '远程调节' },
    { key: 'log', label: '调度日志' },
]

const levelData = ref([
    { station: '韶山路节点A', level: 2.85, max: 3.5, utilization: 81.4, trend: '上升', alert: true },
    { station: '洞井浏阳河节点', level: 1.65, max: 3.0, utilization: 55.0, trend: '稳定', alert: false },
    { station: '黎托街道运河节点', level: 3.20, max: 3.5, utilization: 91.4, trend: '上升', alert: true },
    { station: '左家塘南路节点', level: 1.20, max: 2.5, utilization: 48.0, trend: '下降', alert: false },
    { station: '侯家塘节点B', level: 2.10, max: 3.0, utilization: 70.0, trend: '稳定', alert: false },
])

const flowData = ref([
    { pipe: '主干管A(雨花)', flow: 12500, capacity: 15000, velocity: 1.8, trend: '上升' },
    { pipe: '主干管B(洞井)', flow: 6800, capacity: 12000, velocity: 1.2, trend: '稳定' },
    { pipe: '分支管C(黎托街道)', flow: 7200, capacity: 8000, velocity: 2.1, trend: '上升' },
    { pipe: '主干管D(左家塘)', flow: 5500, capacity: 10000, velocity: 1.0, trend: '下降' },
])

const remoteDevices = ref([
    { device: '雨花泵站-1号泵', type: '水泵', status: '运行中', speed: 85, power: 45.2, control: true },
    { device: '雨花泵站-2号泵', type: '水泵', status: '待机', speed: 0, power: 0, control: true },
    { device: '黎托街道闸门-A', type: '闸门', status: '开启', speed: 100, power: 0, control: true },
    { device: '洞井调蓄池', type: '调蓄', status: '蓄水中', speed: 65, power: 12.5, control: true },
    { device: '左家塘闸门-B', type: '闸门', status: '半开', speed: 50, power: 0, control: true },
])

const dispatchLogs = ref([
    { time: '2024-03-15 10:30', type: '自动', action: '启动雨花泵站-2号泵, 频率50Hz', operator: '系统', trigger: '水位超限', result: '成功' },
    { time: '2024-03-15 10:25', type: '自动', action: '黎托街道闸门-A开度调至80%', operator: '系统', trigger: '流量超负荷', result: '成功' },
    { time: '2024-03-15 09:00', type: '手动', action: '洞井调蓄池启动蓄水', operator: '王工', trigger: '预警降雨', result: '成功' },
    { time: '2024-03-14 22:30', type: '自动', action: '全管网切换雨天调度策略', operator: '系统', trigger: '降雨>10mm', result: '成功' },
    { time: '2024-03-14 18:00', type: '手动', action: '左家塘闸门-B开度调至50%', operator: '赵工', trigger: '均衡负荷', result: '成功' },
])
</script>

<template>
    <div class="space-y-4">

        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'level'">
            <div class="flex items-center gap-2 mb-1">
                <Waves class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">实时水位监测</span>
            </div>
            <div class="grid grid-cols-5 gap-3 mb-3">
                <div v-for="l in levelData" :key="l.station"
                    class="bg-card border border-themed rounded-xl shadow-themed p-3 text-center"
                    :class="l.alert ? 'border-danger/50' : ''">
                    <p class="text-[10px] text-default font-medium mb-1 truncate">{{ l.station }}</p>
                    <p class="text-xl font-bold"
                        :class="l.utilization >= 85 ? 'text-danger' : l.utilization >= 70 ? 'text-warning' : 'text-success'">
                        {{ l.level }}m</p>
                    <div class="w-full h-1.5 bg-surface rounded-full mt-1 overflow-hidden">
                        <div class="h-full rounded-full"
                            :class="l.utilization >= 85 ? 'bg-danger' : l.utilization >= 70 ? 'bg-warning' : 'bg-success'"
                            :style="{ width: l.utilization + '%' }"></div>
                    </div>
                    <p class="text-[10px] text-dim mt-1">{{ l.utilization }}% · {{ l.trend }}</p>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'flow'">
            <div class="flex items-center gap-2 mb-1">
                <Gauge class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">实时流量监测</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">当前流量(m³/h)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设计容量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负荷率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">流速(m/s)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">趋势</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="f in flowData" :key="f.pipe" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ f.pipe }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ f.flow.toLocaleString() }}
                            </td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ f.capacity.toLocaleString() }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center justify-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="f.flow / f.capacity >= 0.9 ? 'bg-danger' : f.flow / f.capacity >= 0.75 ? 'bg-warning' : 'bg-success'"
                                            :style="{ width: (f.flow / f.capacity * 100) + '%' }"></div>
                                    </div><span class="text-[10px] font-bold"
                                        :class="f.flow / f.capacity >= 0.9 ? 'text-danger' : f.flow / f.capacity >= 0.75 ? 'text-warning' : 'text-success'">{{
                                            (f.flow / f.capacity * 100).toFixed(1) }}%</span>
                                </div>
                            </td>
                            <td class="text-center px-2 py-2.5 text-default">{{ f.velocity }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px]"
                                    :class="f.trend === '上升' ? 'text-danger' : f.trend === '下降' ? 'text-success' : 'text-dim'">{{
                                        f.trend }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'remote'">
            <div class="flex items-center gap-2 mb-1">
                <Wifi class="w-4 h-4 text-success" /><span class="text-sm font-semibold text-default">远程调节管理</span>
            </div>
            <div class="grid grid-cols-5 gap-3">
                <div v-for="d in remoteDevices" :key="d.device"
                    class="bg-card border border-themed rounded-xl shadow-themed p-3 text-center">
                    <p class="text-[10px] text-default font-medium mb-1 truncate">{{ d.device }}</p>
                    <p class="text-[10px] px-1.5 py-0.5 rounded mb-1 inline-block"
                        :class="d.type === '水泵' ? 'bg-primary/10 text-primary' : d.type === '闸门' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">
                        {{ d.type }}</p>
                    <p class="text-lg font-bold"
                        :class="d.status === '运行中' || d.status === '开启' || d.status === '蓄水中' ? 'text-success' : d.status === '半开' ? 'text-warning' : 'text-dim'">
                        {{ d.speed }}%</p>
                    <p class="text-[10px] text-dim">{{ d.status }}</p>
                    <button v-if="d.power > 0" class="text-[10px] text-primary mt-1">{{ d.power }}kW</button>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'log'">
            <div class="flex items-center gap-2 mb-1">
                <FileText class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">调度指令日志</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">操作内容</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">执行人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">触发原因</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(l, i) in dispatchLogs" :key="i"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ l.time }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="l.type === '自动' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'">{{
                                        l.type }}</span></td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ l.action }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ l.operator }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ l.trigger }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-success/10 text-success">{{
                                        l.result }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
