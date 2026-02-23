<script setup lang="ts">
import { ref, computed } from 'vue'
import { Settings, Search, Plus, Pencil, Trash2, Droplets, Activity, Waves, FlaskConical, History } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const searchText = ref('')
const filterType = ref('all')

const points = ref([
    { id: 1, name: '芙蓉路雨量站', type: 'rainfall', region: '侯家塘街道', device: 'RG-2001', coords: '113.02, 28.14', installDate: '2023-05-10', status: 'online' },
    { id: 2, name: '韶山路DN600', type: 'flow', region: '圭塘街道', device: 'FM-3001', coords: '113.05, 28.15', installDate: '2023-06-15', status: 'online' },
    { id: 3, name: '劳动路DN400', type: 'level', region: '洞井街道', device: 'LG-4001', coords: '113.01, 28.17', installDate: '2023-07-20', status: 'warning' },
    { id: 4, name: '香樟路DN800', type: 'quality', region: '雨花亭街道', device: 'WQ-5001', coords: '113.04, 28.13', installDate: '2023-08-25', status: 'online' },
    { id: 5, name: '左家塘街道雨量站', type: 'rainfall', region: '左家塘街道', device: 'RG-2002', coords: '113.00, 28.10', installDate: '2023-09-01', status: 'online' },
    { id: 6, name: '黎托街道雨量站', type: 'rainfall', region: '黎托街道', device: 'RG-2003', coords: '113.08, 28.13', installDate: '2024-01-12', status: 'alarm' },
    { id: 7, name: '万家丽路DN300', type: 'level', region: '左家塘街道', device: 'LG-4002', coords: '113.01, 28.09', installDate: '2023-10-15', status: 'alarm' },
    { id: 8, name: '圭塘河泵站进水', type: 'flow', region: '雨花亭街道', device: 'FM-3002', coords: '113.04, 28.15', installDate: '2023-11-20', status: 'online' },
])

function getTypeLabel(t: string) { return t === 'rainfall' ? '雨量' : t === 'flow' ? '流量' : t === 'level' ? '水位' : '水质' }
function getTypeIcon(t: string) { return t === 'rainfall' ? Droplets : t === 'flow' ? Activity : t === 'level' ? Waves : FlaskConical }
function getStatusColor(s: string) { return s === 'online' ? 'text-success' : s === 'warning' ? 'text-warning' : 'text-danger' }
function getStatusText(s: string) { return s === 'online' ? '正常' : s === 'warning' ? '预警' : '报警' }

const filteredPoints = computed(() => {
    let list = points.value
    if (filterType.value !== 'all') list = list.filter(p => p.type === filterType.value)
    if (searchText.value) list = list.filter(p => p.name.includes(searchText.value) || p.device.includes(searchText.value))
    return list
})

// 新增
const showAddModal = ref(false)
const addForm = ref({ name: '', type: 'rainfall', region: '', device: '', coords: '' })
function openAdd() { addForm.value = { name: '', type: 'rainfall', region: '', device: '', coords: '' }; showAddModal.value = true }
function doAdd() {
    if (!addForm.value.name) { toast.value?.show('请输入点位名称', 'warning'); return }
    points.value.push({ id: Date.now(), ...addForm.value, installDate: new Date().toISOString().slice(0, 10), status: 'online' })
    showAddModal.value = false; toast.value?.show('新增成功', 'success')
}

// 编辑
const showEditModal = ref(false)
const editForm = ref<any>({})
function openEdit(p: any) { editForm.value = { ...p }; showEditModal.value = true }
function doEdit() {
    const idx = points.value.findIndex(i => i.id === editForm.value.id)
    if (idx >= 0) points.value[idx] = { ...editForm.value }
    showEditModal.value = false; toast.value?.show('编辑成功', 'success')
}

// 删除
const showDeleteModal = ref(false)
const deletingId = ref(0)
function confirmDel(id: number) { deletingId.value = id; showDeleteModal.value = true }
function doDel() { points.value = points.value.filter(i => i.id !== deletingId.value); showDeleteModal.value = false; toast.value?.show('删除成功', 'success') }

// 维护记录 (#27)
const showMaintModal = ref(false)
const maintPoint = ref<any>({})
const maintRecords = ref([
    { date: '2024-03-10', type: '校准', operator: '张工', desc: '年度校准合格' },
    { date: '2023-09-15', type: '维修', operator: '李工', desc: '更换传感器探头' },
    { date: '2023-05-10', type: '安装', operator: '王工', desc: '设备安装调试' },
])
function openMaint(p: any) { maintPoint.value = p; showMaintModal.value = true }
</script>

<template>
    <div class="space-y-4">
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <Settings class="w-4 h-4 text-primary" />
                    <span class="text-sm font-semibold text-default">点位信息管理</span>
                    <div class="flex items-center gap-0.5 bg-surface rounded-md p-0.5 ml-2">
                        <button v-for="t in ['all', 'rainfall', 'flow', 'level', 'quality']" :key="t"
                            @click="filterType = t"
                            class="px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer"
                            :class="filterType === t ? 'bg-primary text-white' : 'text-dim hover:text-default'">
                            {{ t === 'all' ? '全部' : getTypeLabel(t) }}
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class="relative">
                        <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input v-model="searchText" type="text" placeholder="搜索点位..."
                            class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                    </div>
                    <button @click="openAdd()"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Plus class="w-3.5 h-3.5" /> 新增点位
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">点位名称</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">设备编号</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">坐标</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">安装日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in filteredPoints" :key="p.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">
                                <div class="flex items-center gap-1.5">
                                    <component :is="getTypeIcon(p.type)" class="w-3.5 h-3.5 text-primary" />
                                    {{ p.name }}
                                </div>
                            </td>
                            <td class="text-center px-4 py-2.5 text-default">{{ getTypeLabel(p.type) }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ p.region }}</td>
                            <td class="px-4 py-2.5 text-dim font-mono">{{ p.device }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ p.coords }}</td>
                            <td class="text-center px-4 py-2.5 text-dim">{{ p.installDate }}</td>
                            <td class="text-center px-4 py-2.5">
                                <span class="text-[10px] font-medium" :class="getStatusColor(p.status)">{{
                                    getStatusText(p.status) }}</span>
                            </td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center justify-center gap-1.5">
                                    <button @click="openEdit(p)"
                                        class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"
                                        title="编辑">
                                        <Pencil class="w-3 h-3 text-dim" />
                                    </button>
                                    <button @click="openMaint(p)"
                                        class="p-1 rounded hover:bg-success/10 transition-colors cursor-pointer"
                                        title="维护记录">
                                        <History class="w-3 h-3 text-success" />
                                    </button>
                                    <button @click="confirmDel(p.id)"
                                        class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"
                                        title="删除">
                                        <Trash2 class="w-3 h-3 text-danger" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 新增弹窗 -->
    <ModalDialog :show="showAddModal" title="新增监测点位" @close="showAddModal = false" @confirm="doAdd">
        <div class="space-y-3">
            <div><label class="text-[10px] text-dim block mb-1">点位名称 <span class="text-danger">*</span></label><input
                    v-model="addForm.name"
                    class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div><label class="text-[10px] text-dim block mb-1">类型</label><select v-model="addForm.type"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default">
                        <option value="rainfall">雨量</option>
                        <option value="flow">流量</option>
                        <option value="level">水位</option>
                        <option value="quality">水质</option>
                    </select></div>
                <div><label class="text-[10px] text-dim block mb-1">区域</label><input v-model="addForm.region"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" /></div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div><label class="text-[10px] text-dim block mb-1">设备编号</label><input v-model="addForm.device"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" /></div>
                <div><label class="text-[10px] text-dim block mb-1">坐标</label><input v-model="addForm.coords"
                        placeholder="lng, lat"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" /></div>
            </div>
        </div>
    </ModalDialog>

    <!-- 编辑弹窗 -->
    <ModalDialog :show="showEditModal" :title="'编辑 ' + (editForm.name || '')" @close="showEditModal = false"
        @confirm="doEdit">
        <div class="space-y-3">
            <div><label class="text-[10px] text-dim block mb-1">点位名称</label><input v-model="editForm.name"
                    class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div><label class="text-[10px] text-dim block mb-1">区域</label><input v-model="editForm.region"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" /></div>
                <div><label class="text-[10px] text-dim block mb-1">设备编号</label><input v-model="editForm.device"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" /></div>
            </div>
            <div><label class="text-[10px] text-dim block mb-1">坐标</label><input v-model="editForm.coords"
                    class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" /></div>
        </div>
    </ModalDialog>

    <!-- 删除确认 -->
    <ModalDialog :show="showDeleteModal" title="确认删除" @close="showDeleteModal = false" @confirm="doDel">
        <p class="text-xs text-dim">确定要删除该监测点位吗？此操作不可撤销。</p>
    </ModalDialog>

    <!-- 维护记录弹窗 -->
    <ModalDialog :show="showMaintModal" :title="'维护记录 · ' + (maintPoint.name || '')" width="480px"
        @close="showMaintModal = false" @confirm="showMaintModal = false">
        <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs mb-2"><span class="text-dim">设备:</span><span
                    class="text-primary font-mono">{{ maintPoint.device }}</span><span
                    class="text-dim ml-2">状态:</span><span class="font-medium"
                    :class="getStatusColor(maintPoint.status)">{{ getStatusText(maintPoint.status) }}</span></div>
            <div v-for="(r, idx) in maintRecords" :key="idx" class="flex gap-3">
                <div class="flex flex-col items-center">
                    <div class="w-2.5 h-2.5 rounded-full bg-primary z-10"></div>
                    <div v-if="idx < maintRecords.length - 1" class="w-0.5 flex-1 bg-primary/20"></div>
                </div>
                <div class="pb-3 flex-1">
                    <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ r.type
                    }}</span><span class="text-[10px] text-dim">{{ r.date }}</span></div>
                    <p class="text-[10px] text-dim">{{ r.operator }} · {{ r.desc }}</p>
                </div>
            </div>
        </div>
    </ModalDialog>

    <ToastNotify ref="toast" />
</template>
