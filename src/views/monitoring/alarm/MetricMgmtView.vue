<script setup lang="ts">
import { ref } from 'vue'
import { BarChart3, Plus, Pencil, Trash2, Bell, FolderTree, Database } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const activeFunc = ref('groups')
const funcTabs = [
    { key: 'groups', label: '指标分组管理', icon: FolderTree },
    { key: 'items', label: '数据项管理', icon: Database },
    { key: 'alarm', label: '报警策略管理', icon: Bell },
]

// 分组
const groups = ref([
    { id: 'GRP-01', name: '水文监测', desc: '水位、流速、流量等水文指标', count: 3, scene: '管网/河道', status: 'active' },
    { id: 'GRP-02', name: '水质监测', desc: 'COD、pH、SS、氨氮等水质指标', count: 5, scene: '排口/处理厂', status: 'active' },
    { id: 'GRP-03', name: '气象监测', desc: '降雨量、降雨强度等气象指标', count: 2, scene: '气象站', status: 'active' },
    { id: 'GRP-04', name: '设备运行', desc: '设备电压、电流、运行时长等', count: 4, scene: '全部站点', status: 'active' },
    { id: 'GRP-05', name: '污水处理', desc: 'BOD负荷、处理量、削减率等', count: 3, scene: '处理厂', status: 'inactive' },
])

// 数据项
const dataItems = ref([
    { id: 'DI-001', metric: '水位', source: '压力式传感器', format: 'float(2)', unit: 'm', frequency: '5min', storage: '原始值+5分钟均值', group: '水文监测' },
    { id: 'DI-002', metric: '流速', source: '多普勒传感器', format: 'float(2)', unit: 'm/s', frequency: '10min', storage: '原始值+小时均值', group: '水文监测' },
    { id: 'DI-003', metric: '流量', source: '计算(面积×流速)', format: 'float(1)', unit: 'm³/h', frequency: '10min', storage: '原始值+日累计', group: '水文监测' },
    { id: 'DI-004', metric: 'COD', source: 'COD在线分析仪', format: 'float(1)', unit: 'mg/L', frequency: '30min', storage: '原始值+日均值', group: '水质监测' },
    { id: 'DI-005', metric: 'pH', source: 'pH电极', format: 'float(1)', unit: '', frequency: '30min', storage: '原始值+小时均值', group: '水质监测' },
    { id: 'DI-006', metric: '降雨量', source: '翻斗计数', format: 'float(1)', unit: 'mm', frequency: '5min', storage: '原始值+小时/日累计', group: '气象监测' },
])

// 报警策略
const alarmStrategies = ref([
    { id: 'AS-001', metric: '水位', level1: { threshold: 1.8, label: '预警', color: 'warning', notify: 'APP' }, level2: { threshold: 2.0, label: '报警', color: 'danger', notify: 'APP+短信' }, level3: { threshold: 2.5, label: '紧急', color: 'danger', notify: 'APP+短信+电话' }, enabled: true },
    { id: 'AS-002', metric: 'COD', level1: { threshold: 35, label: '预警', color: 'warning', notify: 'APP' }, level2: { threshold: 40, label: '超标', color: 'danger', notify: 'APP+短信' }, level3: { threshold: 60, label: '严重超标', color: 'danger', notify: 'APP+短信+电话' }, enabled: true },
    { id: 'AS-003', metric: '流量', level1: { threshold: 450, label: '偏高', color: 'warning', notify: 'APP' }, level2: { threshold: 500, label: '报警', color: 'danger', notify: 'APP+短信' }, level3: { threshold: 600, label: '紧急', color: 'danger', notify: 'APP+短信+电话' }, enabled: true },
    { id: 'AS-004', metric: '降雨强度', level1: { threshold: 8, label: '中雨', color: 'info', notify: 'APP' }, level2: { threshold: 16, label: '大雨', color: 'warning', notify: 'APP+短信' }, level3: { threshold: 32, label: '暴雨', color: 'danger', notify: 'APP+短信+电话' }, enabled: true },
    { id: 'AS-005', metric: 'pH', level1: { threshold: 8.5, label: '偏碱', color: 'warning', notify: 'APP' }, level2: { threshold: 9, label: '超标', color: 'danger', notify: 'APP+短信' }, level3: { threshold: 10, label: '严重', color: 'danger', notify: 'APP+短信+电话' }, enabled: false },
])

function toggleStrategy(s: typeof alarmStrategies.value[0]) {
    s.enabled = !s.enabled
    toast.value?.show(`"${s.metric}" 报警策略已${s.enabled ? '启用' : '停用'}`, s.enabled ? 'success' : 'warning')
}

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', desc: '' })

function openAdd() { addForm.value = { name: '', desc: '' }; showAddModal.value = true }
function doAdd() { showAddModal.value = false; toast.value?.show('新增成功', 'success') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                    class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="ft.icon" class="w-3 h-3" />{{ ft.label }}
                </button>
            </div>
            <button v-if="activeFunc === 'groups'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer" @click="openAdd()">
                <Plus class="w-3.5 h-3.5" />新增分组
            </button>
            <button v-if="activeFunc === 'alarm'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" />新增策略
            </button>
        </div>

        <!-- 指标分组 -->
        <div v-if="activeFunc === 'groups'" class="grid grid-cols-3 gap-3">
            <div v-for="g in groups" :key="g.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-default">{{ g.name }}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                        :class="g.status === 'active' ? 'bg-success/10 text-success' : 'bg-surface text-dim'">{{
                            g.status === 'active' ? '启用' : '停用' }}</span>
                </div>
                <p class="text-[10px] text-dim mb-2">{{ g.desc }}</p>
                <div class="flex items-center justify-between text-[10px]">
                    <div><span class="text-dim">指标数: </span><span class="text-primary font-bold">{{ g.count }}</span>
                    </div>
                    <div><span class="text-dim">场景: </span><span class="text-default">{{ g.scene }}</span></div>
                </div>
                <div class="flex items-center gap-1 mt-3 pt-2 border-t border-themed/30">
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                        <Pencil class="w-3 h-3 text-dim" />
                    </button>
                    <button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                        <Trash2 class="w-3 h-3 text-danger" />
                    </button>
                </div>
            </div>
        </div>

        <!-- 数据项管理 -->
        <div v-if="activeFunc === 'items'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">指标数据项</span>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">指标</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">数据源</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">数据格式</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">单位</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">采集频率</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">存储方式</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">所属分组</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d in dataItems" :key="d.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ d.metric }}</td>
                        <td class="px-4 py-2.5 text-default">{{ d.source }}</td>
                        <td class="text-center px-4 py-2.5 text-primary font-mono">{{ d.format }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.unit || '—' }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.frequency }}</td>
                        <td class="px-4 py-2.5 text-dim">{{ d.storage }}</td>
                        <td class="text-center px-4 py-2.5 text-default">{{ d.group }}</td>
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

        <!-- 报警策略 -->
        <div v-if="activeFunc === 'alarm'" class="space-y-3">
            <div v-for="s in alarmStrategies" :key="s.id"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <Bell class="w-4 h-4" :class="s.enabled ? 'text-primary' : 'text-dim'" />
                        <span class="text-xs font-bold text-default">{{ s.metric }} 报警策略</span>
                        <span class="text-[10px] text-primary font-mono">{{ s.id }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px]" :class="s.enabled ? 'text-success' : 'text-dim'">{{ s.enabled ? '已启用'
                            : '已停用' }}</span>
                        <button @click="toggleStrategy(s)" class="px-2 py-0.5 text-[10px] rounded cursor-pointer"
                            :class="s.enabled ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-surface text-dim hover:bg-hover-themed'">{{
                                s.enabled ? '停用' : '启用' }}</button>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <div class="p-3 rounded-lg border border-warning/30 bg-warning/5">
                        <p class="text-[10px] text-warning font-medium mb-1">一级 · {{ s.level1.label }}</p>
                        <p class="text-xs font-bold text-default">阈值: {{ s.level1.threshold }}</p>
                        <p class="text-[10px] text-dim mt-1">通知: {{ s.level1.notify }}</p>
                    </div>
                    <div class="p-3 rounded-lg border border-danger/30 bg-danger/5">
                        <p class="text-[10px] text-danger font-medium mb-1">二级 · {{ s.level2.label }}</p>
                        <p class="text-xs font-bold text-default">阈值: {{ s.level2.threshold }}</p>
                        <p class="text-[10px] text-dim mt-1">通知: {{ s.level2.notify }}</p>
                    </div>
                    <div class="p-3 rounded-lg border border-danger/50 bg-danger/10">
                        <p class="text-[10px] text-danger font-bold mb-1">三级 · {{ s.level3.label }}</p>
                        <p class="text-xs font-bold text-default">阈值: {{ s.level3.threshold }}</p>
                        <p class="text-[10px] text-dim mt-1">通知: {{ s.level3.notify }}</p>
                    </div>
                </div>
            </div>
        </div>
    <!-- 新增弹窗 -->
    <ModalDialog :show="showAddModal" title="新增指标分组" @close="showAddModal = false" @confirm="doAdd">
        <div class="space-y-3">
            <div>
                <label class="text-[10px] text-dim block mb-1">分组名称</label>
                <input v-model="addForm.name" type="text" placeholder="请输入分组名称"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">描述</label>
                <input v-model="addForm.desc" type="text" placeholder="请输入描述"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
        </div>
    </ModalDialog>
    
        <ToastNotify ref="toast" />
    </div>
</template>
