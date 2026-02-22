<script setup lang="ts">
import { ref } from 'vue'
import { FlaskConical, Radio, AlertTriangle, Wrench, Bell } from 'lucide-vue-next'

const activeFunc = ref('status')
const funcTabs = [
    { key: 'status', label: '运行信息', icon: Radio },
    { key: 'fault', label: '故障信息', icon: AlertTriangle },
    { key: 'alarm', label: '触发预警', icon: Bell },
    { key: 'maintenance', label: '维护管理', icon: Wrench },
]

const devices = ref([
    { id: 'WQ-5001', name: '新华街DN800', location: '东城区', cod: 28, ph: 7.2, ss: 35, online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'WQ-5002', name: '西城区进水口', location: '西城区', cod: 45, ph: 6.8, ss: 58, online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'WQ-5003', name: '朝阳区排口', location: '朝阳区', cod: 22, ph: 7.1, ss: 30, online: true, lastUpdate: '2024-03-15 14:29' },
    { id: 'WQ-5004', name: '丰台区污水厂', location: '丰台区', cod: 18, ph: 7.0, ss: 25, online: true, lastUpdate: '2024-03-15 14:30' },
    { id: 'WQ-5005', name: '通州区河道', location: '通州区', cod: 0, ph: 0, ss: 0, online: false, lastUpdate: '2024-03-14 18:00' },
])

const faults = ref([
    { id: 'F301', device: 'WQ-5005', name: '通州区河道', type: '传感器损坏', time: '2024-03-14 18:00', status: '未修复', desc: 'COD传感器读数异常' },
])

const alarms = ref([
    { id: 'A301', device: 'WQ-5002', name: '西城区进水口', type: 'COD超标', value: '45mg/L', threshold: '40mg/L', time: '2024-03-15 13:30', level: 'medium' },
    { id: 'A302', device: 'WQ-5005', name: '通州区河道', type: '设备离线', value: '-', threshold: '-', time: '2024-03-14 18:00', level: 'high' },
])

const maintenances = ref([
    { id: 'M301', device: 'WQ-5001', name: '新华街DN800', type: '试剂更换', date: '2024-03-10', operator: '陈工', result: '完成', next: '2024-04-10' },
    { id: 'M302', device: 'WQ-5003', name: '朝阳区排口', type: '校准', date: '2024-03-05', operator: '张工', result: '合格', next: '2024-06-05' },
])

function alarmColor(l: string) { return l === 'high' ? 'text-danger' : l === 'medium' ? 'text-warning' : 'text-info' }
function alarmBg(l: string) { return l === 'high' ? 'bg-danger/10' : l === 'medium' ? 'bg-warning/10' : 'bg-info/10' }
function alarmText(l: string) { return l === 'high' ? '高' : l === 'medium' ? '中' : '低' }
function faultColor(s: string) { return s === '已修复' ? 'text-success' : s === '处理中' ? 'text-warning' : 'text-danger' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <FlaskConical class="w-5 h-5 text-primary" />
                <h3 class="text-sm font-semibold text-default">水质计管理</h3><span class="text-xs text-muted-themed">({{
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
                        <th class="text-center px-4 py-2.5 text-dim font-medium">COD(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">pH</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">SS(mg/L)</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">更新</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in devices" :key="d.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-dim font-mono">{{ d.id }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.name }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.location }}</td>
                        <td class="text-center px-4 py-2.5 font-bold"
                            :class="d.cod > 40 ? 'text-danger' : 'text-default'">{{ d.cod }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.ph }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.ss }}</td>
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
                                :class="[alarmColor(a.level), alarmBg(a.level)]">{{ alarmText(a.level) }}</span></td>
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
