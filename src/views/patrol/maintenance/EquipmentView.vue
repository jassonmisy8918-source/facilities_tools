<script setup lang="ts">
import { ref } from 'vue'
import { Car, Search as SearchIcon, QrCode, Wrench, TrendingUp, AlertTriangle, Calendar, Trash2, Plus, Pencil, Eye, Download } from 'lucide-vue-next'

const activeFunc = ref('vehicles')
const funcTabs = [
    { key: 'vehicles', label: '车辆设备' },
    { key: 'instruments', label: '检测仪器' },
    { key: 'qrcode', label: '二维码/扫描' },
    { key: 'maintain', label: '保养维修' },
    { key: 'stats', label: '统计分析' },
    { key: 'plan', label: '维护计划' },
    { key: 'scrap', label: '报废管理' },
]

const vehicles = ref([
    { id: 'VH-001', name: '高压清洗车-01', type: '清洗车', plate: '京A-12345', model: '东风DFL-5160', status: 'working', mileage: '45000km', nextMaint: '2024-04-01' },
    { id: 'VH-002', name: 'CCTV检测车-01', type: '检测车', plate: '京A-12346', model: '依维柯NJ-6600', status: 'idle', mileage: '32000km', nextMaint: '2024-05-15' },
    { id: 'VH-003', name: '抢修车-01', type: '抢修车', plate: '京A-12347', model: '江铃JX-5040', status: 'repair', mileage: '68000km', nextMaint: '2024-03-20' },
])

const instruments = ref([
    { id: 'INS-001', name: 'CCTV管道检测机器人', type: '检测设备', model: 'RoboCam-200', sn: 'RC2024001', status: 'active', calibDate: '2024-02-01', value: '28万' },
    { id: 'INS-002', name: '便携式气体检测仪', type: '安全设备', model: 'GD-4000', sn: 'GD2024002', status: 'active', calibDate: '2024-01-15', value: '1.5万' },
    { id: 'INS-003', name: '电磁流速仪', type: '测量设备', model: 'FV-300', sn: 'FV2024003', status: 'maintenance', calibDate: '2024-03-01', value: '3.2万' },
])

const maintRecords = ref([
    { id: 'MR-001', device: '高压清洗车-01', type: '定期保养', date: '2024-03-01', content: '更换机油、滤芯，检查水泵', parts: '机油5L/机滤×1', cost: 850, worker: '车间张师傅' },
    { id: 'MR-002', device: '抢修车-01', type: '故障维修', date: '2024-03-10', content: '液压系统漏油维修', parts: '液压管×2/密封圈×4', cost: 2200, worker: '4S店' },
])

const statsData = ref({
    usage: [
        { device: '高压清洗车-01', totalHours: 320, workHours: 256, rate: 80 },
        { device: 'CCTV检测车-01', totalHours: 320, workHours: 192, rate: 60 },
        { device: '抢修车-01', totalHours: 320, workHours: 96, rate: 30 },
    ],
    faults: [
        { device: '抢修车-01', faultCount: 3, downtime: '48h', mtbf: '106天' },
        { device: '高压清洗车-01', faultCount: 1, downtime: '8h', mtbf: '320天' },
        { device: 'CCTV检测车-01', faultCount: 0, downtime: '0h', mtbf: '—' },
    ]
})

const scrapItems = ref([
    { id: 'SC-001', device: '泥浆泵-03', reason: '电机烧毁，维修不经济', applyDate: '2024-03-01', applicant: '李主管', status: 'approved', originalValue: '1.2万', residualValue: '800元' },
])

function getStatusColor(s: string) { return s === 'working' || s === 'active' ? 'text-success' : s === 'idle' ? 'text-info' : s === 'repair' || s === 'maintenance' ? 'text-warning' : 'text-dim' }
function getStatusText(s: string) { return s === 'working' || s === 'active' ? '使用中' : s === 'idle' ? '空闲' : s === 'repair' || s === 'maintenance' ? '维修中' : '停用' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <!-- 车辆 -->
        <div v-if="activeFunc === 'vehicles'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Car class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">巡查车辆台账</span>
                </div><button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />新增
                </button>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">名称</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">类型</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">车牌</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">里程</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">下次保养</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">状态</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="v in vehicles" :key="v.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2 text-primary font-mono text-[10px]">{{ v.id }}</td>
                        <td class="px-3 py-2 text-default font-medium">{{ v.name }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ v.type }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ v.plate }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ v.mileage }}</td>
                        <td class="text-center px-2 py-2 text-dim">{{ v.nextMaint }}</td>
                        <td class="text-center px-2 py-2"><span class="text-[10px] font-medium"
                                :class="getStatusColor(v.status)">{{ getStatusText(v.status) }}</span></td>
                        <td class="text-center px-2 py-2">
                            <div class="flex justify-center gap-1"><button
                                    class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                    <Eye class="w-3 h-3 text-primary" />
                                </button><button class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                    <Pencil class="w-3 h-3 text-dim" />
                                </button></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 仪器 -->
        <div v-if="activeFunc === 'instruments'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <SearchIcon class="w-4 h-4 text-info" /><span
                        class="text-sm font-semibold text-default">检测仪器台账</span>
                </div><button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />新增
                </button>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">名称</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">型号</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">序列号</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">校准日</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">价值</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="i in instruments" :key="i.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2 text-primary font-mono text-[10px]">{{ i.id }}</td>
                        <td class="px-3 py-2 text-default font-medium">{{ i.name }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ i.model }}</td>
                        <td class="text-center px-2 py-2 text-dim font-mono text-[10px]">{{ i.sn }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ i.calibDate }}</td>
                        <td class="text-center px-2 py-2 text-primary font-bold">{{ i.value }}</td>
                        <td class="text-center px-2 py-2"><span class="text-[10px] font-medium"
                                :class="getStatusColor(i.status)">{{ getStatusText(i.status) }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 二维码 -->
        <div v-if="activeFunc === 'qrcode'" class="grid grid-cols-3 gap-3">
            <div v-for="v in [...vehicles, ...instruments]" :key="v.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                <div class="w-20 h-20 mx-auto bg-surface rounded-lg flex items-center justify-center mb-2">
                    <QrCode class="w-10 h-10 text-dim" />
                </div>
                <p class="text-xs font-bold text-default">{{ v.name }}</p>
                <p class="text-[10px] text-primary font-mono">{{ v.id }}</p>
                <button
                    class="mt-2 px-3 py-1 bg-primary/10 text-primary rounded text-[10px] font-medium hover:bg-primary/20 cursor-pointer">打印标签</button>
            </div>
        </div>

        <!-- 保养维修 -->
        <div v-if="activeFunc === 'maintain'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Wrench class="w-4 h-4 text-warning" /><span
                        class="text-sm font-semibold text-default">保养维修记录</span>
                </div>
                <div class="flex gap-2"><button
                        class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                        <Plus class="w-3.5 h-3.5" />新增
                    </button><button
                        class="flex items-center gap-1 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed cursor-pointer">
                        <Download class="w-3.5 h-3.5" />导出
                    </button></div>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2 text-dim font-medium">编号</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">设备</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">类型</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">日期</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">内容</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">费用</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">执行</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in maintRecords" :key="r.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2 text-primary font-mono text-[10px]">{{ r.id }}</td>
                        <td class="px-3 py-2 text-default font-medium">{{ r.device }}</td>
                        <td class="text-center px-2 py-2"><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="r.type === '故障维修' ? 'bg-danger/10 text-danger' : 'bg-info/10 text-info'">{{
                                r.type }}</span></td>
                        <td class="text-center px-2 py-2 text-default">{{ r.date }}</td>
                        <td class="px-3 py-2 text-dim">{{ r.content }}</td>
                        <td class="text-center px-2 py-2 text-primary font-bold">¥{{ r.cost }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ r.worker }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 统计 -->
        <template v-if="activeFunc === 'stats'">
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <TrendingUp class="w-4 h-4 text-primary" /><span
                            class="text-xs font-bold text-default">设备使用率</span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="u in statsData.usage" :key="u.device" class="flex items-center gap-2"><span
                                class="text-[10px] text-default w-28 shrink-0 truncate">{{ u.device }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full"
                                    :class="u.rate >= 70 ? 'bg-success' : u.rate >= 50 ? 'bg-warning' : 'bg-danger'"
                                    :style="{ width: u.rate + '%' }"></div>
                            </div><span class="text-[10px] text-dim w-8 text-right">{{ u.rate }}%</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <AlertTriangle class="w-4 h-4 text-warning" /><span
                            class="text-xs font-bold text-default">设备故障率</span>
                    </div>
                    <div class="space-y-2">
                        <div v-for="f in statsData.faults" :key="f.device">
                            <div class="flex items-center justify-between text-[10px]"><span class="text-default">{{
                                    f.device }}</span><span class="font-bold"
                                    :class="f.faultCount > 2 ? 'text-danger' : f.faultCount > 0 ? 'text-warning' : 'text-success'">{{
                                    f.faultCount }}次</span></div>
                            <div class="text-[10px] text-dim">停机: {{ f.downtime }} · MTBF: {{ f.mtbf }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 维护计划 + 故障预测 -->
        <div v-if="activeFunc === 'plan'" class="space-y-3">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-2 mb-2">
                    <Calendar class="w-4 h-4 text-primary" /><span
                        class="text-xs font-bold text-default">自动生成维护计划</span>
                </div>
                <p class="text-[10px] text-dim">根据设备使用情况和维护记录，系统自动推荐维护计划。</p>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-2 mb-2">
                    <AlertTriangle class="w-4 h-4 text-warning" /><span
                        class="text-xs font-bold text-default">故障预测</span>
                </div>
                <p class="text-[10px] text-dim">基于运行数据和历史故障，预测潜在故障风险。</p>
                <div class="mt-2 p-2 rounded bg-warning/10 text-[10px] text-warning">⚠ 抢修车-01 液压系统近3月故障3次，建议提前更换液压泵总成。
                </div>
            </div>
        </div>

        <!-- 报废 -->
        <div v-if="activeFunc === 'scrap'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Trash2 class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">设备报废管理</span>
                </div><button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-danger/10 text-danger rounded-lg text-xs font-medium hover:bg-danger/20 cursor-pointer">申请报废</button>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2 text-dim font-medium">设备</th>
                        <th class="text-left px-3 py-2 text-dim font-medium">报废原因</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">原值</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">残值</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">申请人</th>
                        <th class="text-center px-2 py-2 text-dim font-medium">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="s in scrapItems" :key="s.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2 text-default font-medium">{{ s.device }}</td>
                        <td class="px-3 py-2 text-dim">{{ s.reason }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ s.originalValue }}</td>
                        <td class="text-center px-2 py-2 text-primary">{{ s.residualValue }}</td>
                        <td class="text-center px-2 py-2 text-default">{{ s.applicant }}</td>
                        <td class="text-center px-2 py-2"><span
                                class="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">已批准</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
