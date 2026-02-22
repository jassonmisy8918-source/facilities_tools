<script setup lang="ts">
import { ref } from 'vue'
import { Droplets, Radio, AlertTriangle, Wrench, Search, Bell } from 'lucide-vue-next'

// ===================== 内部功能 Tab =====================
const activeFunc = ref('status')
const funcTabs = [
    { key: 'status', label: '运行信息', icon: Radio },
    { key: 'fault', label: '故障信息', icon: AlertTriangle },
    { key: 'alarm', label: '触发预警', icon: Bell },
    { key: 'maintenance', label: '维护管理', icon: Wrench },
]

// ===================== 运行信息 =====================
const devices = ref([
    { id: 'RG-2001', name: '和平路雨量站', location: '西城区', value: 3.2, battery: 85, signal: '良好', online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'RG-2002', name: '丰台区雨量站', location: '丰台区', value: 8.5, battery: 72, signal: '良好', online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'RG-2003', name: '通州区雨量站', location: '通州区', value: 12.6, battery: 45, signal: '一般', online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'RG-2004', name: '朝阳区雨量站', location: '朝阳区', value: 1.8, battery: 90, signal: '良好', online: true, lastUpdate: '2024-03-15 14:29' },
    { id: 'RG-2005', name: '海淀区雨量站', location: '海淀区', value: 0, battery: 15, signal: '差', online: false, lastUpdate: '2024-03-15 10:15' },
    { id: 'RG-2006', name: '大兴区雨量站', location: '大兴区', value: 5.3, battery: 68, signal: '良好', online: true, lastUpdate: '2024-03-15 14:30' },
])

// ===================== 故障信息 =====================
const faults = ref([
    { id: 'F001', device: 'RG-2005', name: '海淀区雨量站', type: '通信故障', time: '2024-03-15 10:15', status: '未修复', desc: '设备无法连接通信网络' },
    { id: 'F002', device: 'RG-2003', name: '通州区雨量站', type: '电池低电量', time: '2024-03-14 08:30', status: '处理中', desc: '电池电量低于50%告警阈值' },
    { id: 'F003', device: 'RG-2001', name: '和平路雨量站', type: '翻斗卡滞', time: '2024-03-10 16:20', status: '已修复', desc: '翻斗机构异物卡滞' },
])

// ===================== 预警记录 =====================
const alarms = ref([
    { id: 'A001', device: 'RG-2003', name: '通州区雨量站', type: '降雨量超限', value: '12.6mm/h', threshold: '10mm/h', time: '2024-03-15 13:45', level: 'high' },
    { id: 'A002', device: 'RG-2002', name: '丰台区雨量站', type: '降雨量超限', value: '8.5mm/h', threshold: '8mm/h', time: '2024-03-15 12:30', level: 'medium' },
    { id: 'A003', device: 'RG-2005', name: '海淀区雨量站', type: '设备离线', value: '-', threshold: '-', time: '2024-03-15 10:15', level: 'high' },
    { id: 'A004', device: 'RG-2003', name: '通州区雨量站', type: '电池低电量', value: '45%', threshold: '50%', time: '2024-03-14 08:30', level: 'low' },
])

// ===================== 维护记录 =====================
const maintenances = ref([
    { id: 'M001', device: 'RG-2001', name: '和平路雨量站', type: '定期校准', date: '2024-03-10', operator: '张工', result: '合格', next: '2024-06-10' },
    { id: 'M002', device: 'RG-2003', name: '通州区雨量站', type: '更换电池', date: '2024-03-08', operator: '李工', result: '完成', next: '2024-09-08' },
    { id: 'M003', device: 'RG-2005', name: '海淀区雨量站', type: '故障维修', date: '2024-03-05', operator: '王工', result: '待复检', next: '2024-03-20' },
    { id: 'M004', device: 'RG-2004', name: '朝阳区雨量站', type: '巡检', date: '2024-03-01', operator: '张工', result: '正常', next: '2024-04-01' },
])

function getAlarmLevelColor(l: string) { return l === 'high' ? 'text-danger' : l === 'medium' ? 'text-warning' : 'text-info' }
function getAlarmLevelBg(l: string) { return l === 'high' ? 'bg-danger/10' : l === 'medium' ? 'bg-warning/10' : 'bg-info/10' }
function getAlarmLevelText(l: string) { return l === 'high' ? '高' : l === 'medium' ? '中' : '低' }
function getFaultStatusColor(s: string) { return s === '已修复' ? 'text-success' : s === '处理中' ? 'text-warning' : 'text-danger' }
</script>

<template>
    <div class="space-y-4">
        <!-- 仪器标题 + 功能 Tab -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Droplets class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-semibold text-default">雨量计管理</h3>
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

        <!-- 运行信息 -->
        <div v-if="activeFunc === 'status'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">设备编号</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">站点名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">当前值(mm/h)</th>
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
                            <td class="text-center px-4 py-2.5">
                                <span
                                    :class="d.battery < 30 ? 'text-danger' : d.battery < 60 ? 'text-warning' : 'text-success'">{{
                                    d.battery }}%</span>
                            </td>
                            <td class="text-center px-4 py-2.5 text-default">{{ d.signal }}</td>
                            <td class="text-center px-4 py-2.5">
                                <span class="flex items-center justify-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full"
                                        :class="d.online ? 'bg-success' : 'bg-danger'"></span>
                                    <span :class="d.online ? 'text-success' : 'text-danger'">{{ d.online ? '在线' : '离线'
                                        }}</span>
                                </span>
                            </td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ d.lastUpdate }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 故障信息 -->
        <div v-if="activeFunc === 'fault'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <span class="text-sm font-semibold text-default">故障记录</span>
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="搜索故障..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1 text-[11px] text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-40" />
                </div>
            </div>
            <div class="p-3 space-y-2">
                <div v-for="f in faults" :key="f.id" class="p-3 rounded-lg bg-surface">
                    <div class="flex items-center justify-between mb-1.5">
                        <div class="flex items-center gap-2">
                            <AlertTriangle class="w-3.5 h-3.5"
                                :class="f.status === '未修复' ? 'text-danger' : f.status === '处理中' ? 'text-warning' : 'text-success'" />
                            <span class="text-xs font-medium text-default">{{ f.name }}</span>
                            <span class="text-[10px] text-dim font-mono">{{ f.device }}</span>
                        </div>
                        <span class="text-[10px] font-medium" :class="getFaultStatusColor(f.status)">{{ f.status
                            }}</span>
                    </div>
                    <p class="text-xs text-default ml-5.5">{{ f.type }}: {{ f.desc }}</p>
                    <p class="text-[10px] text-muted-themed ml-5.5 mt-1">发生时间: {{ f.time }}</p>
                </div>
            </div>
        </div>

        <!-- 触发预警 -->
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
                            <td class="text-center px-4 py-2.5">
                                <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="[getAlarmLevelColor(a.level), getAlarmLevelBg(a.level)]">{{
                                    getAlarmLevelText(a.level) }}</span>
                            </td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ a.time }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 维护管理 -->
        <div v-if="activeFunc === 'maintenance'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">维护类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">维护日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">维护人员</th>
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
                            <td class="text-center px-4 py-2.5">
                                <span class="text-[10px] font-medium"
                                    :class="m.result === '合格' || m.result === '完成' || m.result === '正常' ? 'text-success' : 'text-warning'">{{
                                    m.result }}</span>
                            </td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ m.next }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
