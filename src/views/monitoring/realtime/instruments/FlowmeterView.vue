<script setup lang="ts">
import { ref } from 'vue'
import { Activity, Radio, AlertTriangle, Wrench, Bell } from 'lucide-vue-next'

const activeFunc = ref('status')
const funcTabs = [
    { key: 'status', label: '运行信息', icon: Radio },
    { key: 'fault', label: '故障信息', icon: AlertTriangle },
    { key: 'alarm', label: '触发预警', icon: Bell },
    { key: 'maintenance', label: '维护管理', icon: Wrench },
]

const devices = ref([
    { id: 'FM-3001', name: '韶山路DN600', location: '圭塘街道', value: 342, unit: 'm³/h', battery: 92, signal: '良好', online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'FM-3002', name: '圭塘河泵站进水', location: '雨花亭街道', value: 518, unit: 'm³/h', battery: 88, signal: '良好', online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'FM-3003', name: '左家塘路DN500', location: '左家塘街道', value: 267, unit: 'm³/h', battery: 76, signal: '良好', online: true, lastUpdate: '2024-03-15 14:29' },
    { id: 'FM-3004', name: '洞井路DN400', location: '洞井街道', value: 198, unit: 'm³/h', battery: 55, signal: '一般', online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'FM-3005', name: '侯家塘街道DN300', location: '侯家塘街道', value: 0, unit: 'm³/h', battery: 20, signal: '差', online: false, lastUpdate: '2024-03-15 08:45' },
])

const faults = ref([
    { id: 'F101', device: 'FM-3005', name: '侯家塘街道DN300', type: '传感器故障', time: '2024-03-15 08:45', status: '未修复', desc: '流量传感器数据异常' },
    { id: 'F102', device: 'FM-3004', name: '洞井路DN400', type: '信号弱', time: '2024-03-14 16:20', status: '处理中', desc: '通信信号持续偏弱' },
])

const alarms = ref([
    { id: 'A101', device: 'FM-3002', name: '圭塘河泵站进水', type: '流量超限', value: '518m³/h', threshold: '500m³/h', time: '2024-03-15 13:00', level: 'medium' },
    { id: 'A102', device: 'FM-3005', name: '侯家塘街道DN300', type: '设备离线', value: '-', threshold: '-', time: '2024-03-15 08:45', level: 'high' },
])

const maintenances = ref([
    { id: 'M101', device: 'FM-3001', name: '韶山路DN600', type: '定期校准', date: '2024-03-12', operator: '赵工', result: '合格', next: '2024-06-12' },
    { id: 'M102', device: 'FM-3003', name: '左家塘路DN500', type: '巡检', date: '2024-03-05', operator: '张工', result: '正常', next: '2024-04-05' },
])

function getAlarmLevelColor(l: string) { return l === 'high' ? 'text-danger' : l === 'medium' ? 'text-warning' : 'text-info' }
function getAlarmLevelBg(l: string) { return l === 'high' ? 'bg-danger/10' : l === 'medium' ? 'bg-warning/10' : 'bg-info/10' }
function getAlarmLevelText(l: string) { return l === 'high' ? '高' : l === 'medium' ? '中' : '低' }
function getFaultStatusColor(s: string) { return s === '已修复' ? 'text-success' : s === '处理中' ? 'text-warning' : 'text-danger' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Activity class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-semibold text-default">流量计管理</h3>
                <span class="text-xs text-muted-themed">({{ devices.length }}台)</span>
            </div>
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                    class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="ft.icon" class="w-3 h-3" />{{ ft.label }}
                </button>
            </div>
        </div>

        <div v-if="activeFunc === 'status'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">设备编号</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">站点名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">流量(m³/h)</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">电量</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">信号</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">最后更新</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in devices" :key="d.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-dim font-mono">{{ d.id }}</td>
                            <td class="px-4 py-2.5 text-default font-medium">{{ d.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ d.location }}</td>
                            <td class="text-center px-4 py-2.5 text-default font-bold">{{ d.value }}</td>
                            <td class="text-center px-4 py-2.5"><span
                                    :class="d.battery < 30 ? 'text-danger' : d.battery < 60 ? 'text-warning' : 'text-success'">{{
                                        d.battery }}%</span></td>
                            <td class="text-center px-4 py-2.5 text-default">{{ d.signal }}</td>
                            <td class="text-center px-4 py-2.5"><span
                                    class="flex items-center justify-center gap-1"><span
                                        class="w-1.5 h-1.5 rounded-full"
                                        :class="d.online ? 'bg-success' : 'bg-danger'"></span><span
                                        :class="d.online ? 'text-success' : 'text-danger'">{{ d.online ? '在线' : '离线'
                                        }}</span></span></td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ d.lastUpdate }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="activeFunc === 'fault'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed"><span class="text-sm font-semibold text-default">故障记录</span>
            </div>
            <div class="p-3 space-y-2">
                <div v-for="f in faults" :key="f.id" class="p-3 rounded-lg bg-surface">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-2">
                            <AlertTriangle class="w-3.5 h-3.5"
                                :class="f.status === '未修复' ? 'text-danger' : 'text-warning'" /><span
                                class="text-xs font-medium text-default">{{ f.name }}</span><span
                                class="text-[10px] text-dim font-mono">{{ f.device }}</span>
                        </div>
                        <span class="text-[10px] font-medium" :class="getFaultStatusColor(f.status)">{{ f.status
                        }}</span>
                    </div>
                    <p class="text-xs text-default ml-5.5">{{ f.type }}: {{ f.desc }}</p>
                    <p class="text-[10px] text-muted-themed ml-5.5 mt-1">{{ f.time }}</p>
                </div>
            </div>
        </div>

        <div v-if="activeFunc === 'alarm'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">预警类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">监测值</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">阈值</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">级别</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in alarms" :key="a.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ a.name }}</td>
                            <td class="px-4 py-2.5 text-default">{{ a.type }}</td>
                            <td class="text-center px-4 py-2.5 text-default font-bold">{{ a.value }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ a.threshold }}</td>
                            <td class="text-center px-4 py-2.5"><span
                                    class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="[getAlarmLevelColor(a.level), getAlarmLevelBg(a.level)]">{{
                                        getAlarmLevelText(a.level) }}</span></td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ a.time }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="activeFunc === 'maintenance'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">结果</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">下次维护</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in maintenances" :key="m.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ m.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ m.type }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ m.date }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ m.operator }}</td>
                            <td class="text-center px-4 py-2.5"><span class="text-[10px] font-medium"
                                    :class="m.result === '合格' || m.result === '正常' ? 'text-success' : 'text-warning'">{{
                                        m.result }}</span></td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ m.next }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
