<script setup lang="ts">
import { ref } from 'vue'
import { Waves, Radio, AlertTriangle, Wrench, Bell } from 'lucide-vue-next'

const activeFunc = ref('status')
const funcTabs = [
    { key: 'status', label: '运行信息', icon: Radio },
    { key: 'fault', label: '故障信息', icon: AlertTriangle },
    { key: 'alarm', label: '触发预警', icon: Bell },
    { key: 'maintenance', label: '维护管理', icon: Wrench },
]

const devices = ref([
    { id: 'LG-4001', name: '民生路DN400', location: '海淀区', value: 1.85, battery: 78, online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'LG-4002', name: '建设大道DN300', location: '丰台区', value: 2.35, battery: 65, online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'LG-4003', name: '朝阳路DN600', location: '朝阳区', value: 1.52, battery: 90, online: true, lastUpdate: '2024-03-15 14:29' },
    { id: 'LG-4004', name: '通州区主干', location: '通州区', value: 2.10, battery: 40, online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'LG-4005', name: '西城区截流井', location: '西城区', value: 0, battery: 10, online: false, lastUpdate: '2024-03-15 06:20' },
])

const faults = ref([
    { id: 'F201', device: 'LG-4005', name: '西城区截流井', type: '设备断电', time: '2024-03-15 06:20', status: '未修复', desc: '设备电源异常断电' },
])

const alarms = ref([
    { id: 'A201', device: 'LG-4002', name: '建设大道DN300', type: '水位超限', value: '2.35m', threshold: '2.0m', time: '2024-03-15 12:45', level: 'high' },
    { id: 'A202', device: 'LG-4005', name: '西城区截流井', type: '设备离线', value: '-', threshold: '-', time: '2024-03-15 06:20', level: 'high' },
])

const maintenances = ref([
    { id: 'M201', device: 'LG-4001', name: '民生路DN400', type: '定期校准', date: '2024-03-08', operator: '刘工', result: '合格', next: '2024-06-08' },
])

function getAlarmColor(l: string) { return l === 'high' ? 'text-danger' : l === 'medium' ? 'text-warning' : 'text-info' }
function getAlarmBg(l: string) { return l === 'high' ? 'bg-danger/10' : l === 'medium' ? 'bg-warning/10' : 'bg-info/10' }
function getAlarmText(l: string) { return l === 'high' ? '高' : l === 'medium' ? '中' : '低' }
function faultColor(s: string) { return s === '已修复' ? 'text-success' : s === '处理中' ? 'text-warning' : 'text-danger' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Waves class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-semibold text-default">液位计管理</h3><span class="text-xs text-muted-themed">({{
                    devices.length }}台)</span>
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
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">水位(m)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">电量</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">更新时间</th>
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
                        <td class="text-center px-4 py-2.5"><span class="flex items-center justify-center gap-1"><span
                                    class="w-1.5 h-1.5 rounded-full"
                                    :class="d.online ? 'bg-success' : 'bg-danger'"></span><span
                                    :class="d.online ? 'text-success' : 'text-danger'">{{ d.online ? '在线' : '离线'
                                    }}</span></span></td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ d.lastUpdate }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="activeFunc === 'fault'" class="bg-card border border-themed rounded-xl shadow-themed p-3 space-y-2">
            <div v-for="f in faults" :key="f.id" class="p-3 rounded-lg bg-surface">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-2">
                        <AlertTriangle class="w-3.5 h-3.5 text-danger" /><span
                            class="text-xs font-medium text-default">{{ f.name }}</span>
                    </div><span class="text-[10px] font-medium" :class="faultColor(f.status)">{{ f.status }}</span>
                </div>
                <p class="text-xs text-default ml-5.5">{{ f.type }}: {{ f.desc }}</p>
                <p class="text-[10px] text-muted-themed ml-5.5 mt-1">{{ f.time }}</p>
            </div>
        </div>

        <div v-if="activeFunc === 'alarm'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">值</th>
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
                        <td class="text-center px-4 py-2.5 font-bold text-default">{{ a.value }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ a.threshold }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="[getAlarmColor(a.level), getAlarmBg(a.level)]">{{ getAlarmText(a.level)
                                }}</span></td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ a.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="activeFunc === 'maintenance'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">站点</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">日期</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">人员</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">结果</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">下次</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="m in maintenances" :key="m.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ m.name }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ m.type }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ m.date }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ m.operator }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] font-medium text-success">{{
                                m.result }}</span></td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ m.next }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
