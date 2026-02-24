<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, Search, Settings, Link, Cpu, Plus, Pencil, Trash2, Eye } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const activeFunc = ref('info')
const funcTabs = [
    { key: 'info', label: '信息管理', icon: MapPin },
    { key: 'query', label: '查询与详情', icon: Search },
    { key: 'metrics', label: '指标配置', icon: Settings },
    { key: 'factors', label: '关联因子', icon: Link },
    { key: 'devices', label: '关联设备', icon: Cpu },
]

// 监测点数据
const points = ref([
    { id: 'MP-001', name: '万家丽路DN300监测点', area: '圭塘街道', type: '水位', address: '万家丽路与劳动路交口东侧50m', lng: 113.050, lat: 28.150, status: 'online', devices: 2, factors: 3, createDate: '2023-06-15' },
    { id: 'MP-002', name: '侯家塘街道进水口监测点', area: '侯家塘街道', type: '水质', address: '侯家塘街道污水处理厂进水口', lng: 113.020, lat: 28.140, status: 'online', devices: 3, factors: 5, createDate: '2023-07-20' },
    { id: 'MP-003', name: '左家塘街道雨量监测点', area: '左家塘街道', type: '雨量', address: '左家塘街道气象站旁', lng: 113.01, lat: 28.098, status: 'online', devices: 1, factors: 2, createDate: '2023-08-10' },
    { id: 'MP-004', name: '黎托街道主干监测点', area: '黎托街道', type: '流量', address: '黎托街道花侯路DN600', lng: 113.07, lat: 28.138, status: 'offline', devices: 2, factors: 3, createDate: '2023-09-01' },
    { id: 'MP-005', name: '洞井街道排口监测点', area: '洞井街道', type: '水质', address: '洞井街道浏阳河排口', lng: 113.008, lat: 28.172, status: 'warning', devices: 2, factors: 4, createDate: '2023-10-05' },
])

// 查询条件
const searchKeyword = ref('')
const areaFilter = ref('all')
const typeFilter = ref('all')

const filteredPoints = computed(() => points.value.filter(p => {
    if (searchKeyword.value && !p.name.includes(searchKeyword.value) && !p.id.includes(searchKeyword.value) && !p.address.includes(searchKeyword.value)) return false
    if (areaFilter.value !== 'all' && p.area !== areaFilter.value) return false
    if (typeFilter.value !== 'all' && p.type !== typeFilter.value) return false
    return true
}))

// 详情
const showDetail = ref(false)
const detailPoint = ref<typeof points.value[0] | null>(null)
function viewDetail(p: typeof points.value[0]) { detailPoint.value = p; showDetail.value = true }

// 指标配置
const metricsConfig = ref([
    { pointId: 'MP-001', pointName: '万家丽路DN300', metrics: [{ name: '水位', unit: 'm', upper: 2.0, lower: 0.5, interval: 5 }, { name: '流速', unit: 'm/s', upper: 3.0, lower: 0, interval: 10 }] },
    { pointId: 'MP-002', pointName: '侯家塘街道进水口', metrics: [{ name: 'COD', unit: 'mg/L', upper: 40, lower: 0, interval: 30 }, { name: 'pH', unit: '', upper: 9, lower: 6, interval: 30 }, { name: 'SS', unit: 'mg/L', upper: 50, lower: 0, interval: 30 }, { name: '氨氮', unit: 'mg/L', upper: 8, lower: 0, interval: 60 }] },
    { pointId: 'MP-003', pointName: '左家塘街道雨量站', metrics: [{ name: '降雨量', unit: 'mm', upper: 999, lower: 0, interval: 5 }, { name: '降雨强度', unit: 'mm/h', upper: 50, lower: 0, interval: 5 }] },
])

// 关联因子
const factorLinks = ref([
    { pointId: 'MP-001', pointName: '万家丽路DN300', factors: [{ code: 'W01', name: '水位', category: '水文', method: '压力式', standard: 'GB/T 11826' }, { code: 'W02', name: '流速', category: '水文', method: '多普勒', standard: 'HJ/T 15' }, { code: 'W03', name: '流量', category: '水文', method: '面积流速法', standard: 'GB 50014' }] },
    { pointId: 'MP-002', pointName: '侯家塘街道进水口', factors: [{ code: 'Q01', name: 'COD', category: '水质', method: '重铬酸钾法', standard: 'HJ 828' }, { code: 'Q02', name: 'pH', category: '水质', method: '玻璃电极法', standard: 'GB 6920' }, { code: 'Q03', name: 'SS', category: '水质', method: '重量法', standard: 'GB 11901' }, { code: 'Q04', name: '氨氮', category: '水质', method: '纳氏试剂法', standard: 'HJ 535' }, { code: 'Q05', name: 'BOD5', category: '水质', method: '稀释接种法', standard: 'HJ 505' }] },
])

// 关联设备
const deviceLinks = ref([
    { pointId: 'MP-001', pointName: '万家丽路DN300', devices: [{ sn: 'DEV-2023-0601', name: '压力式液位计', model: 'WL-500A', manufacturer: '海天仪器', installDate: '2023-06-15', status: 'online' }, { sn: 'DEV-2023-0602', name: '多普勒流量计', model: 'DF-800', manufacturer: '博锐仪表', installDate: '2023-06-15', status: 'online' }] },
    { pointId: 'MP-002', pointName: '侯家塘街道进水口', devices: [{ sn: 'DEV-2023-0701', name: 'COD在线分析仪', model: 'COD-3000', manufacturer: '哈希', installDate: '2023-07-20', status: 'online' }, { sn: 'DEV-2023-0702', name: 'pH/SS多参数仪', model: 'MP-4500', manufacturer: '赛莱默', installDate: '2023-07-20', status: 'online' }, { sn: 'DEV-2023-0703', name: '氨氮分析仪', model: 'NH3-200', manufacturer: '哈希', installDate: '2023-07-20', status: 'warning' }] },
])

function getStatusColor(s: string) { return s === 'online' ? 'text-success' : s === 'offline' ? 'text-dim' : 'text-warning' }
function getStatusBg(s: string) { return s === 'online' ? 'bg-success/10' : s === 'offline' ? 'bg-surface' : 'bg-warning/10' }
function getStatusText(s: string) { return s === 'online' ? '在线' : s === 'offline' ? '离线' : '告警' }
function getStatusDot(s: string) { return s === 'online' ? 'bg-success' : s === 'offline' ? 'bg-gray-400' : 'bg-warning' }

// 新增弹窗
const toast = ref<InstanceType<typeof ToastNotify>>()
const showAddModal = ref(false)
const addForm = ref({ name: '', area: '', type: '', address: '' })

function openAdd() { addForm.value = { name: '', area: '', type: '', address: '' }; showAddModal.value = true }
function doAdd() { showAddModal.value = false; toast.value?.show('新增成功', 'success') }
</script>

<template>
    <div class="space-y-4">
        <!-- 功能Tab -->
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                <component :is="ft.icon" class="w-3 h-3" />{{ ft.label }}
            </button>
        </div>

        <!-- 信息管理 -->
        <template v-if="activeFunc === 'info'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <MapPin class="w-4 h-4 text-primary" /><span
                            class="text-sm font-semibold text-default">监测点台账</span><span
                            class="text-xs text-muted-themed">({{ points.length }})</span>
                    </div>
                    <button
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"
                        @click="openAdd()">
                        <Plus class="w-3.5 h-3.5" />新增监测点
                    </button>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">设备数</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">因子数</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">创建日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in points" :key="p.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-primary font-mono">{{ p.id }}</td>
                            <td class="px-4 py-2.5 text-default font-medium">{{ p.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.area }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.type }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.devices }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.factors }}</td>
                            <td class="text-center px-4 py-2.5"><span
                                    class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="[getStatusColor(p.status), getStatusBg(p.status)]">{{
                                        getStatusText(p.status) }}</span></td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ p.createDate }}</td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center justify-center gap-1"><button @click="viewDetail(p)"
                                        class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                        <Eye class="w-3 h-3 text-primary" />
                                    </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                        <Pencil class="w-3 h-3 text-dim" />
                                    </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                        <Trash2 class="w-3 h-3 text-danger" />
                                    </button></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 查询与详情 -->
        <template v-if="activeFunc === 'query'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3 flex-wrap">
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                        v-model="searchKeyword" placeholder="搜索监测点..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                </div>
                <select v-model="areaFilter"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部区域</option>
                    <option>圭塘街道</option>
                    <option>侯家塘街道</option>
                    <option>左家塘街道</option>
                    <option>黎托街道</option>
                    <option>洞井街道</option>
                </select>
                <select v-model="typeFilter"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部类型</option>
                    <option>水位</option>
                    <option>流量</option>
                    <option>水质</option>
                    <option>雨量</option>
                </select>
                <button
                    class="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Search class="w-3.5 h-3.5 inline mr-1" />查询
                </button>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div v-for="p in filteredPoints" :key="p.id" @click="viewDetail(p)"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 hover:shadow-themed-md transition-shadow cursor-pointer">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-default">{{ p.name }}</span>
                        <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full"
                                :class="getStatusDot(p.status)"></span><span class="text-[10px]"
                                :class="getStatusColor(p.status)">{{ getStatusText(p.status) }}</span></span>
                    </div>
                    <div class="grid grid-cols-2 gap-y-1 text-[10px]">
                        <div><span class="text-dim">编号: </span><span class="text-primary font-mono">{{ p.id }}</span>
                        </div>
                        <div><span class="text-dim">类型: </span><span class="text-default">{{ p.type }}</span></div>
                        <div><span class="text-dim">区域: </span><span class="text-default">{{ p.area }}</span></div>
                        <div><span class="text-dim">设备: </span><span class="text-default">{{ p.devices }}台</span></div>
                    </div>
                    <p class="text-[10px] text-dim mt-2 truncate">{{ p.address }}</p>
                </div>
            </div>
        </template>

        <!-- 指标配置 -->
        <template v-if="activeFunc === 'metrics'">
            <div v-for="mc in metricsConfig" :key="mc.pointId"
                class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Settings class="w-4 h-4 text-info" /><span class="text-xs font-bold text-default">{{
                            mc.pointName }}</span><span class="text-[10px] text-primary font-mono">{{ mc.pointId
                            }}</span>
                    </div>
                    <button class="text-[10px] text-primary hover:underline cursor-pointer">+ 添加指标</button>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2 text-dim font-medium">指标名称</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">单位</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">上限</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">下限</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">采集间隔(min)</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="m in mc.metrics" :key="m.name"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2 text-default font-medium">{{ m.name }}</td>
                            <td class="text-center px-4 py-2 text-default">{{ m.unit || '—' }}</td>
                            <td class="text-center px-4 py-2 text-danger">{{ m.upper }}</td>
                            <td class="text-center px-4 py-2 text-success">{{ m.lower }}</td>
                            <td class="text-center px-4 py-2 text-default">{{ m.interval }}</td>
                            <td class="text-center px-4 py-2">
                                <div class="flex items-center justify-center gap-1"><button
                                        class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                        <Pencil class="w-3 h-3 text-dim" />
                                    </button><button class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                        <Trash2 class="w-3 h-3 text-danger" />
                                    </button></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 关联因子 -->
        <template v-if="activeFunc === 'factors'">
            <div v-for="fl in factorLinks" :key="fl.pointId"
                class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Link class="w-4 h-4 text-warning" /><span class="text-xs font-bold text-default">{{
                            fl.pointName }}</span><span class="text-[10px] text-primary font-mono">{{ fl.pointId
                            }}</span>
                    </div>
                    <button class="text-[10px] text-primary hover:underline cursor-pointer">+ 关联因子</button>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2 text-dim font-medium">因子代码</th>
                            <th class="text-left px-4 py-2 text-dim font-medium">因子名称</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">类别</th>
                            <th class="text-left px-4 py-2 text-dim font-medium">监测方法</th>
                            <th class="text-left px-4 py-2 text-dim font-medium">执行标准</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="f in fl.factors" :key="f.code"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2 text-primary font-mono">{{ f.code }}</td>
                            <td class="px-4 py-2 text-default font-medium">{{ f.name }}</td>
                            <td class="text-center px-4 py-2"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="f.category === '水质' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'">{{
                                        f.category }}</span></td>
                            <td class="px-4 py-2 text-default">{{ f.method }}</td>
                            <td class="px-4 py-2 text-dim">{{ f.standard }}</td>
                            <td class="text-center px-4 py-2"><button
                                    class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                    <Trash2 class="w-3 h-3 text-danger" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 关联设备 -->
        <template v-if="activeFunc === 'devices'">
            <div v-for="dl in deviceLinks" :key="dl.pointId"
                class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Cpu class="w-4 h-4 text-primary" /><span class="text-xs font-bold text-default">{{ dl.pointName
                        }}</span><span class="text-[10px] text-primary font-mono">{{ dl.pointId }}</span>
                    </div>
                    <button class="text-[10px] text-primary hover:underline cursor-pointer">+ 绑定设备</button>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2 text-dim font-medium">设备序号</th>
                            <th class="text-left px-4 py-2 text-dim font-medium">设备名称</th>
                            <th class="text-left px-4 py-2 text-dim font-medium">型号</th>
                            <th class="text-left px-4 py-2 text-dim font-medium">厂商</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">安装日期</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in dl.devices" :key="d.sn"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2 text-primary font-mono text-[10px]">{{ d.sn }}</td>
                            <td class="px-4 py-2 text-default font-medium">{{ d.name }}</td>
                            <td class="px-4 py-2 text-default">{{ d.model }}</td>
                            <td class="px-4 py-2 text-default">{{ d.manufacturer }}</td>
                            <td class="text-center px-4 py-2 text-dim">{{ d.installDate }}</td>
                            <td class="text-center px-4 py-2"><span class="flex items-center justify-center gap-1"><span
                                        class="w-1.5 h-1.5 rounded-full" :class="getStatusDot(d.status)"></span><span
                                        class="text-[10px]" :class="getStatusColor(d.status)">{{ getStatusText(d.status)
                                        }}</span></span></td>
                            <td class="text-center px-4 py-2"><button
                                    class="p-0.5 rounded hover:bg-hover-themed cursor-pointer">
                                    <Trash2 class="w-3 h-3 text-danger" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 详情弹窗 -->
        <ModalDialog :show="showDetail" title="监测点详情" @close="showDetail = false" @confirm="showDetail = false">
            <div v-if="detailPoint" class="space-y-3 text-xs">
                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">编号</p>
                        <p class="text-default font-bold mt-0.5">{{ detailPoint.id }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">名称</p>
                        <p class="text-default font-bold mt-0.5">{{ detailPoint.name }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">区域</p>
                        <p class="text-default mt-0.5">{{ detailPoint.area }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">类型</p>
                        <p class="text-default mt-0.5">{{ detailPoint.type }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">经度</p>
                        <p class="text-default mt-0.5">{{ detailPoint.lng }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">纬度</p>
                        <p class="text-default mt-0.5">{{ detailPoint.lat }}</p>
                    </div>
                    <div class="col-span-2 p-3 rounded-lg bg-surface">
                        <p class="text-dim">地址</p>
                        <p class="text-default mt-0.5">{{ detailPoint.address }}</p>
                    </div>
                </div>
                <div class="flex gap-4 text-center">
                    <div class="flex-1 p-3 rounded-lg bg-surface">
                        <p class="text-xl font-bold text-primary">{{ detailPoint.devices }}</p>
                        <p class="text-dim mt-0.5">关联设备</p>
                    </div>
                    <div class="flex-1 p-3 rounded-lg bg-surface">
                        <p class="text-xl font-bold text-info">{{ detailPoint.factors }}</p>
                        <p class="text-dim mt-0.5">监测因子</p>
                    </div>
                    <div class="flex-1 p-3 rounded-lg bg-surface">
                        <p class="text-xl font-bold" :class="getStatusColor(detailPoint.status)">{{
                            getStatusText(detailPoint.status) }}</p>
                        <p class="text-dim mt-0.5">运行状态</p>
                    </div>
                </div>
            </div>
        </ModalDialog>
        <!-- 新增弹窗 -->
        <ModalDialog :show="showAddModal" title="新增监测点" @close="showAddModal = false" @confirm="doAdd">
            <div class="space-y-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">监测点名称</label>
                    <input v-model="addForm.name" type="text" placeholder="请输入名称"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">区域</label>
                    <input v-model="addForm.area" type="text" placeholder="请选择区域"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">监测类型</label>
                    <input v-model="addForm.type" type="text" placeholder="水位/流量/水质/雨量"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">地址</label>
                    <input v-model="addForm.address" type="text" placeholder="请输入详细地址"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
            </div>
        </ModalDialog>

        <ToastNotify ref="toast" />
    </div>
</template>
