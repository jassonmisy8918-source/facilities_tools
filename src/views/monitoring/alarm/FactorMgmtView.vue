<script setup lang="ts">
import { ref, computed } from 'vue'
import { FlaskConical, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const activeFunc = ref('maintain')
const funcTabs = [
    { key: 'maintain', label: '因子信息维护' },
    { key: 'status', label: '状态管理' },
    { key: 'view', label: '因子查看' },
]

const factors = ref([
    { id: 'F001', code: 'W01', name: '水位', category: '水文', unit: 'm', standard: 'GB/T 11826', method: '压力式', enabled: true, desc: '水体的液面高度' },
    { id: 'F002', code: 'W02', name: '流速', category: '水文', unit: 'm/s', standard: 'HJ/T 15', method: '多普勒', enabled: true, desc: '水流速度' },
    { id: 'F003', code: 'W03', name: '流量', category: '水文', unit: 'm³/h', standard: 'GB 50014', method: '面积流速法', enabled: true, desc: '单位时间通过的水量' },
    { id: 'F004', code: 'Q01', name: 'COD', category: '水质', unit: 'mg/L', standard: 'HJ 828', method: '重铬酸钾法', enabled: true, desc: '化学需氧量' },
    { id: 'F005', code: 'Q02', name: 'pH', category: '水质', unit: '', standard: 'GB 6920', method: '玻璃电极法', enabled: true, desc: '酸碱度' },
    { id: 'F006', code: 'Q03', name: 'SS', category: '水质', unit: 'mg/L', standard: 'GB 11901', method: '重量法', enabled: true, desc: '悬浮物浓度' },
    { id: 'F007', code: 'Q04', name: '氨氮', category: '水质', unit: 'mg/L', standard: 'HJ 535', method: '纳氏试剂法', enabled: true, desc: '氨态氮含量' },
    { id: 'F008', code: 'Q05', name: 'BOD5', category: '水质', unit: 'mg/L', standard: 'HJ 505', method: '稀释接种法', enabled: false, desc: '五日生化需氧量' },
    { id: 'F009', code: 'R01', name: '降雨量', category: '气象', unit: 'mm', standard: 'QX/T 51', method: '翻斗式', enabled: true, desc: '降水累计量' },
    { id: 'F010', code: 'R02', name: '降雨强度', category: '气象', unit: 'mm/h', standard: 'QX/T 51', method: '翻斗式', enabled: true, desc: '单位时间降水量' },
])

const searchKeyword = ref('')
const categoryFilter = ref('all')

const filteredFactors = computed(() => factors.value.filter(f => {
    if (searchKeyword.value && !f.name.includes(searchKeyword.value) && !f.code.includes(searchKeyword.value) && !f.desc.includes(searchKeyword.value)) return false
    if (categoryFilter.value !== 'all' && f.category !== categoryFilter.value) return false
    return true
}))

function toggleFactor(f: typeof factors.value[0]) {
    f.enabled = !f.enabled
    toast.value?.show(`因子 "${f.name}" 已${f.enabled ? '启用' : '停用'}`, f.enabled ? 'success' : 'warning')
}

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', unit: '', range: '', threshold: '' })

function openAdd() { addForm.value = { name: '', unit: '', range: '', threshold: '' }; showAddModal.value = true }
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
            <button v-if="activeFunc === 'maintain'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"
                @click="openAdd()">
                <Plus class="w-3.5 h-3.5" />新增因子
            </button>
        </div>

        <!-- 信息维护 -->
        <div v-if="activeFunc === 'maintain'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">代码</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">名称</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">类别</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">单位</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">监测方法</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">执行标准</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">说明</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="f in factors" :key="f.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-primary font-mono">{{ f.code }}</td>
                        <td class="px-4 py-2.5 text-default font-medium">{{ f.name }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="f.category === '水质' ? 'bg-success/10 text-success' : f.category === '水文' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{
                                    f.category }}</span></td>
                        <td class="text-center px-4 py-2.5 text-default">{{ f.unit || '—' }}</td>
                        <td class="px-4 py-2.5 text-default">{{ f.method }}</td>
                        <td class="px-4 py-2.5 text-dim">{{ f.standard }}</td>
                        <td class="px-4 py-2.5 text-dim">{{ f.desc }}</td>
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

        <!-- 状态管理 -->
        <div v-if="activeFunc === 'status'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                <FlaskConical class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">监测因子状态管理</span>
                <span class="text-xs text-muted-themed ml-auto">启用: {{factors.filter(f => f.enabled).length}} / {{
                    factors.length }}</span>
            </div>
            <div class="p-4 grid grid-cols-2 gap-3">
                <div v-for="f in factors" :key="f.id"
                    class="flex items-center justify-between p-3 rounded-lg bg-surface">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                            :class="f.category === '水质' ? 'bg-success/10 text-success' : f.category === '水文' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{
                                f.category }}</span>
                        <div>
                            <p class="text-xs font-medium text-default">{{ f.name }} <span
                                    class="text-dim font-mono">({{ f.code }})</span></p>
                            <p class="text-[10px] text-dim">{{ f.unit ? f.unit + ' · ' : '' }}{{ f.method }}</p>
                        </div>
                    </div>
                    <button @click="toggleFactor(f)" class="cursor-pointer">
                        <component :is="f.enabled ? ToggleRight : ToggleLeft" class="w-6 h-6"
                            :class="f.enabled ? 'text-success' : 'text-dim'" />
                    </button>
                </div>
            </div>
        </div>

        <!-- 因子查看 -->
        <template v-if="activeFunc === 'view'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3">
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                        v-model="searchKeyword" placeholder="搜索因子..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                </div>
                <select v-model="categoryFilter"
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option value="all">全部类别</option>
                    <option>水文</option>
                    <option>水质</option>
                    <option>气象</option>
                </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div v-for="f in filteredFactors" :key="f.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-default">{{ f.name }}</span>
                            <span class="text-[10px] text-primary font-mono">{{ f.code }}</span>
                        </div>
                        <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full"
                                :class="f.enabled ? 'bg-success' : 'bg-gray-400'"></span><span class="text-[10px]"
                                :class="f.enabled ? 'text-success' : 'text-dim'">{{ f.enabled ? '启用' : '停用'
                                }}</span></span>
                    </div>
                    <div class="grid grid-cols-2 gap-y-1 text-[10px]">
                        <div><span class="text-dim">类别: </span><span class="text-default">{{ f.category }}</span></div>
                        <div><span class="text-dim">单位: </span><span class="text-default">{{ f.unit || '—' }}</span>
                        </div>
                        <div><span class="text-dim">方法: </span><span class="text-default">{{ f.method }}</span></div>
                        <div><span class="text-dim">标准: </span><span class="text-default">{{ f.standard }}</span></div>
                    </div>
                    <p class="text-[10px] text-dim mt-2">{{ f.desc }}</p>
                </div>
            </div>
        </template>
        <!-- 新增弹窗 -->
        <ModalDialog :show="showAddModal" title="新增监测因子" @close="showAddModal = false" @confirm="doAdd">
            <div class="space-y-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">因子名称</label>
                    <input v-model="addForm.name" type="text" placeholder="请输入因子名称"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">单位</label>
                    <input v-model="addForm.unit" type="text" placeholder="mg/L、m、mm/h"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">量程范围</label>
                    <input v-model="addForm.range" type="text" placeholder="如 0-10m"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">报警阈值</label>
                    <input v-model="addForm.threshold" type="text" placeholder="请输入阈值"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
            </div>
        </ModalDialog>

        <ToastNotify ref="toast" />
    </div>
</template>
