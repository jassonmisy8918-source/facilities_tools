<script setup lang="ts">
import { ref } from 'vue'
import { Play, Plus, Pencil, Download, Eye } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('plans')
const funcTabs = [
    { key: 'plans', label: '应急预案管理' },
    { key: 'drill', label: '模拟演练' },
]

const plans = ref([
    { id: 'EP-001', name: '暴雨内涝应急预案', type: '自然灾害', level: 'I级', updateDate: '2024-01-15', version: 'v3.2', status: 'active', steps: 8, resources: '泵车×3/应急队×2/沙袋×500', responsible: '张主任' },
    { id: 'EP-002', name: '管网爆管应急预案', type: '设施故障', level: 'II级', updateDate: '2024-02-20', version: 'v2.1', status: 'active', steps: 6, resources: '抢修队×1/管材×50m/围挡×20', responsible: '李主管' },
    { id: 'EP-003', name: '水质污染应急预案', type: '环境事件', level: 'II级', updateDate: '2023-12-01', version: 'v1.5', status: 'active', steps: 7, resources: '检测车×1/应急处理药剂/封堵设备', responsible: '王工' },
    { id: 'EP-004', name: '泵站停电应急预案', type: '设施故障', level: 'III级', updateDate: '2024-03-01', version: 'v2.0', status: 'active', steps: 5, resources: '发电机×2/临时泵×2', responsible: '赵站长' },
])

const drills = ref([
    { id: 'DR-001', name: '2024年Q1暴雨应急演练', plan: 'EP-001', date: '2024-03-10', participants: 15, duration: '2.5小时', score: 92, issues: 2, status: 'completed', summary: '整体响应及时，设备调配环节需优化，沙袋运输耗时超预期' },
    { id: 'DR-002', name: '管网爆管抢修演练', plan: 'EP-002', date: '2024-02-25', participants: 8, duration: '1.5小时', score: 88, issues: 1, status: 'completed', summary: '抢修流程规范，现场围挡速度需提升' },
    { id: 'DR-003', name: '水质污染处置演练', plan: 'EP-003', date: '2024-04-01', participants: 12, duration: '3小时', score: 0, issues: 0, status: 'planned', summary: '待执行' },
])

function startDrill(d: typeof drills.value[0]) { toast.value?.show(`演练 "${d.name}" 已启动`, 'success') }

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', level: '', type: '', scope: '' })

function openAdd() { addForm.value = { name: '', level: '', type: '', scope: '' }; showAddModal.value = true }
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
            <button v-if="activeFunc === 'plans'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer" @click="openAdd()">
                <Plus class="w-3.5 h-3.5" />新增预案
            </button>
            <button v-if="activeFunc === 'drill'"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <Plus class="w-3.5 h-3.5" />创建演练
            </button>
        </div>

        <!-- 预案 -->
        <template v-if="activeFunc === 'plans'">
            <div class="grid grid-cols-2 gap-3">
                <div v-for="p in plans" :key="p.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        p.name }}</span><span class="text-[10px] px-2 py-0.5 rounded font-bold"
                            :class="p.level === 'I级' ? 'bg-danger/10 text-danger' : p.level === 'II级' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                p.level }}</span></div>
                    <div class="grid grid-cols-2 gap-y-1 text-[10px] mb-2">
                        <div><span class="text-dim">类型: </span><span class="text-default">{{ p.type }}</span></div>
                        <div><span class="text-dim">版本: </span><span class="text-primary font-mono">{{ p.version
                        }}</span></div>
                        <div><span class="text-dim">流程步骤: </span><span class="text-default">{{ p.steps }}步</span></div>
                        <div><span class="text-dim">责任人: </span><span class="text-default">{{ p.responsible }}</span>
                        </div>
                    </div>
                    <p class="text-[10px] text-dim mb-2">🏗 {{ p.resources }}</p>
                    <div class="flex items-center justify-between pt-2 border-t border-themed/30">
                        <span class="text-[10px] text-dim">更新: {{ p.updateDate }}</span>
                        <div class="flex items-center gap-1"><button
                                class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                <Eye class="w-3 h-3 text-primary" />
                            </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                <Download class="w-3 h-3 text-dim" />
                            </button><button class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                <Pencil class="w-3 h-3 text-dim" />
                            </button></div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 演练 -->
        <template v-if="activeFunc === 'drill'">
            <div class="space-y-3">
                <div v-for="d in drills" :key="d.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ d.name
                            }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="d.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                        d.status === 'completed' ? '已完成' : '待执行' }}</span></div>
                            <div class="text-[10px] text-dim mt-0.5">关联预案: {{ d.plan }} · 日期: {{ d.date }} · {{
                                d.participants }}人参与 · {{ d.duration }}</div>
                        </div>
                        <div class="flex items-center gap-2">
                            <div v-if="d.score > 0" class="text-center">
                                <p class="text-lg font-bold"
                                    :class="d.score >= 90 ? 'text-success' : d.score >= 80 ? 'text-warning' : 'text-danger'">
                                    {{ d.score }}</p>
                                <p class="text-[8px] text-dim">评分</p>
                            </div>
                            <button v-if="d.status === 'planned'" @click="startDrill(d)"
                                class="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                                <Play class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <p class="text-[10px] text-default">{{ d.summary }}</p>
                    <div v-if="d.issues > 0" class="mt-1 text-[10px] text-warning">⚠ 发现问题: {{ d.issues }}项</div>
                </div>
            </div>
        </template>
    <!-- 新增弹窗 -->
    <ModalDialog :show="showAddModal" title="新增应急预案" @close="showAddModal = false" @confirm="doAdd">
        <div class="space-y-3">
            <div>
                <label class="text-[10px] text-dim block mb-1">预案名称</label>
                <input v-model="addForm.name" type="text" placeholder="请输入预案名称"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">响应级别</label>
                <input v-model="addForm.level" type="text" placeholder="Ⅰ级/Ⅱ级/Ⅲ级/Ⅳ级"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">事件类型</label>
                <input v-model="addForm.type" type="text" placeholder="暴雨内涝/管道破裂"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">适用范围</label>
                <input v-model="addForm.scope" type="text" placeholder="请输入适用范围"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
        </div>
    </ModalDialog>
    
        <ToastNotify ref="toast" />
    </div>
</template>
