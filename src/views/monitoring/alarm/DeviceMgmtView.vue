<script setup lang="ts">
import { ref } from 'vue'
import { Search, Pencil, Trash2, Plus, CheckSquare } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const activeFunc = ref('info')
const funcTabs = [
    { key: 'info', label: '设备信息管理' },
    { key: 'query', label: '设备查询' },
    { key: 'batch', label: '批量修改' },
]

const devices = ref([
    { id: 'DEV-001', name: '压力式液位计', model: 'WL-500A', type: '液位计', sn: 'SN20230601', manufacturer: '海天仪器', area: '圭塘街道', point: '万家丽路DN300', installDate: '2023-06-15', status: 'online', selected: false },
    { id: 'DEV-002', name: '多普勒流量计', model: 'DF-800', type: '流量计', sn: 'SN20230602', manufacturer: '博锐仪表', area: '圭塘街道', point: '万家丽路DN300', installDate: '2023-06-15', status: 'online', selected: false },
    { id: 'DEV-003', name: 'COD在线分析仪', model: 'COD-3000', type: '水质计', sn: 'SN20230701', manufacturer: '哈希', area: '侯家塘街道', point: '侯家塘街道进水口', installDate: '2023-07-20', status: 'online', selected: false },
    { id: 'DEV-004', name: '翻斗式雨量计', model: 'JDZ-1', type: '雨量计', sn: 'SN20230801', manufacturer: '锦州阳光', area: '左家塘街道', point: '左家塘街道雨量站', installDate: '2023-08-10', status: 'online', selected: false },
    { id: 'DEV-005', name: '超声波液位计', model: 'UL-300', type: '液位计', sn: 'SN20230901', manufacturer: '西门子', area: '黎托街道', point: '黎托街道主干', installDate: '2023-09-01', status: 'offline', selected: false },
    { id: 'DEV-006', name: 'pH/SS多参数仪', model: 'MP-4500', type: '水质计', sn: 'SN20230702', manufacturer: '赛莱默', area: '侯家塘街道', point: '侯家塘街道进水口', installDate: '2023-07-20', status: 'warning', selected: false },
])

// 查询
const searchKeyword = ref('')
const typeFilter = ref('all')
const areaFilter = ref('all')
const statusFilterQ = ref('all')

// 批量修改
const batchField = ref('status')
const batchValue = ref('')
const selectAll = ref(false)
function toggleSelectAll() { selectAll.value = !selectAll.value; devices.value.forEach(d => d.selected = selectAll.value) }
function batchUpdate() {
    const selected = devices.value.filter(d => d.selected)
    if (selected.length === 0) { toast.value?.show('请先选择设备', 'warning'); return }
    toast.value?.show(`已批量修改 ${selected.length} 台设备的 ${batchField.value}`, 'success')
}

function getStatusColor(s: string) { return s === 'online' ? 'text-success' : s === 'offline' ? 'text-dim' : 'text-warning' }
function getStatusBg(s: string) { return s === 'online' ? 'bg-success/10' : s === 'offline' ? 'bg-surface' : 'bg-warning/10' }
function getStatusText(s: string) { return s === 'online' ? '在线' : s === 'offline' ? '离线' : '告警' }

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', type: '', model: '', area: '' })

function openAdd() { addForm.value = { name: '', type: '', model: '', area: '' }; showAddModal.value = true }
function doAdd() { showAddModal.value = false; toast.value?.show('新增成功', 'success') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                    class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                        ft.label }}</button>
            </div>
            <button v-if="activeFunc === 'info'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer" @click="openAdd()">
                <Plus class="w-3.5 h-3.5" />新增设备
            </button>
        </div>

        <!-- 设备信息管理 -->
        <div v-if="activeFunc === 'info'" class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">名称</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">型号</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">厂商</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">安装点位</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">安装日期</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in devices" :key="d.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-primary font-mono">{{ d.id }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.name }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.model }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.type }}</td>
                        <td class="px-4 py-2.5 text-default">{{ d.manufacturer }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.point }}</td>
                        <td class="text-center px-4 py-2.5 text-dim">{{ d.installDate }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="[getStatusColor(d.status), getStatusBg(d.status)]">{{ getStatusText(d.status)
                                }}</span></td>
                        <td class="text-center px-4 py-2.5">
                            <div class="flex items-center justify-center gap-1"><button
                                    class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Pencil class="w-3 h-3 text-dim" />
                                </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Trash2 class="w-3 h-3 text-danger" />
                                </button></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 设备查询 -->
        <template v-if="activeFunc === 'query'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3 flex-wrap">
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                        v-model="searchKeyword" placeholder="设备名称/编号..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                </div>
                <select v-model="typeFilter"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部类型</option>
                    <option>液位计</option>
                    <option>流量计</option>
                    <option>水质计</option>
                    <option>雨量计</option>
                </select>
                <select v-model="areaFilter"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部区域</option>
                    <option>圭塘街道</option>
                    <option>侯家塘街道</option>
                    <option>左家塘街道</option>
                    <option>黎托街道</option>
                </select>
                <select v-model="statusFilterQ"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部状态</option>
                    <option value="online">在线</option>
                    <option value="offline">离线</option>
                    <option value="warning">告警</option>
                </select>
                <button
                    class="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">查询</button>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div v-for="d in devices" :key="d.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 hover:shadow-themed-md transition-shadow">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-default">{{ d.name }}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                            :class="[getStatusColor(d.status), getStatusBg(d.status)]">{{ getStatusText(d.status)
                            }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-y-1 text-[10px]">
                        <div><span class="text-dim">编号: </span><span class="text-primary font-mono">{{ d.id }}</span>
                        </div>
                        <div><span class="text-dim">型号: </span><span class="text-default">{{ d.model }}</span></div>
                        <div><span class="text-dim">类型: </span><span class="text-default">{{ d.type }}</span></div>
                        <div><span class="text-dim">厂商: </span><span class="text-default">{{ d.manufacturer }}</span>
                        </div>
                        <div><span class="text-dim">SN: </span><span class="text-default font-mono">{{ d.sn }}</span>
                        </div>
                        <div><span class="text-dim">安装: </span><span class="text-default">{{ d.installDate }}</span>
                        </div>
                    </div>
                    <p class="text-[10px] text-dim mt-2">📍 {{ d.point }}</p>
                </div>
            </div>
        </template>

        <!-- 批量修改 -->
        <template v-if="activeFunc === 'batch'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3">
                <button @click="toggleSelectAll"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed transition-colors cursor-pointer">
                    <CheckSquare class="w-3.5 h-3.5" />{{ selectAll ? '取消全选' : '全选' }}
                </button>
                <select v-model="batchField"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="status">状态</option>
                    <option value="area">区域</option>
                    <option value="type">类型</option>
                </select>
                <input v-model="batchValue" placeholder="修改为..."
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-36" />
                <button @click="batchUpdate"
                    class="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">批量修改</button>
                <span class="text-[10px] text-dim">已选 {{devices.filter(d => d.selected).length}} / {{ devices.length
                }}</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium w-10"><input type="checkbox"
                                    v-model="selectAll" @change="toggleSelectAll" class="accent-primary" /></th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">型号</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in devices" :key="d.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors"
                            :class="d.selected ? 'bg-primary/5' : ''">
                            <td class="text-center px-3 py-2.5"><input type="checkbox" v-model="d.selected"
                                    class="accent-primary" /></td>
                            <td class="px-4 py-2.5 text-primary font-mono">{{ d.id }}</td>
                            <td class="px-4 py-2.5 text-default font-medium">{{ d.name }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ d.model }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ d.type }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ d.area }}</td>
                            <td class="text-center px-4 py-2.5"><span
                                    class="text-[10px] px-2 py-0.5 rounded font-medium"
                                    :class="[getStatusColor(d.status), getStatusBg(d.status)]">{{
                                        getStatusText(d.status) }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    <!-- 新增弹窗 -->
    <ModalDialog :show="showAddModal" title="新增监测设备" @close="showAddModal = false" @confirm="doAdd">
        <div class="space-y-3">
            <div>
                <label class="text-[10px] text-dim block mb-1">设备名称</label>
                <input v-model="addForm.name" type="text" placeholder="请输入设备名称"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">设备类型</label>
                <input v-model="addForm.type" type="text" placeholder="雨量计/流量计/液位计"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">型号</label>
                <input v-model="addForm.model" type="text" placeholder="请输入设备型号"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">安装区域</label>
                <input v-model="addForm.area" type="text" placeholder="请选择区域"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
        </div>
    </ModalDialog>
    
        <ToastNotify ref="toast" />
    </div>
</template>
