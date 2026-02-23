<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Plus, Pencil, Trash2, CheckCircle, Circle } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'

// 巡查内容标准化配置
const categories = ref([
    {
        name: '检查井巡查', items: [
            { id: 'CI-01', name: '井盖完好性', standard: '井盖无缺失、破损、翘动', method: '目视', required: true },
            { id: 'CI-02', name: '井内淤积', standard: '淤积深度不超过管径1/3', method: '尺量', required: true },
            { id: 'CI-03', name: '井壁状况', standard: '无裂缝、渗漏、变形', method: '目视/手电', required: true },
            { id: 'CI-04', name: '爬梯完好性', standard: '爬梯固定牢靠、无锈蚀', method: '目视/手动', required: false },
            { id: 'CI-05', name: '井室积水', standard: '无异常积水', method: '目视', required: true },
        ]
    },
    {
        name: '排口巡查', items: [
            { id: 'OI-01', name: '排口畅通', standard: '无堵塞、无垃圾杂物', method: '目视', required: true },
            { id: 'OI-02', name: '水质外观', standard: '无明显异味异色', method: '感官', required: true },
            { id: 'OI-03', name: '周边环境', standard: '排口周围整洁、无违建', method: '目视', required: false },
            { id: 'OI-04', name: '拍门/闸门', standard: '启闭灵活、密封良好', method: '操作测试', required: true },
        ]
    },
    {
        name: '管道巡查', items: [
            { id: 'PI-01', name: '地面沉降', standard: '管线上方无明显沉降', method: '目视/水准仪', required: true },
            { id: 'PI-02', name: '路面冒溢', standard: '无污水冒溢现象', method: '目视', required: true },
            { id: 'PI-03', name: '周边施工', standard: '无影响管道安全的施工', method: '目视/走访', required: false },
        ]
    },
    {
        name: '泵站巡查', items: [
            { id: 'SI-01', name: '设备运行', standard: '泵机运行正常、无异响', method: '听/看/触', required: true },
            { id: 'SI-02', name: '格栅清理', standard: '格栅无堵塞、已清理', method: '目视', required: true },
            { id: 'SI-03', name: '水位检查', standard: '前池水位在正常范围', method: '读数', required: true },
            { id: 'SI-04', name: '电气系统', standard: '配电柜无报警、参数正常', method: '读数', required: true },
            { id: 'SI-05', name: '环境卫生', standard: '站区整洁、设备标识清晰', method: '目视', required: false },
        ]
    },
])

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', category: '', method: '', standard: '' })
const toast = ref<InstanceType<typeof ToastNotify>>()
function openAdd() { addForm.value = { name: '', category: '', method: '', standard: '' }; showAddModal.value = true }
function doAdd() { showAddModal.value = false; toast.value?.show('新增成功', 'success') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <FileText class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">标准化巡查检查项</span><span class="text-xs text-muted-themed">|
                    {{categories.reduce((s, c) => s + c.items.length, 0)}} 项</span>
            </div>
            <button
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer" @click="openAdd()">
                <Plus class="w-3.5 h-3.5" />新增检查项
            </button>
        </div>

        <div v-for="cat in categories" :key="cat.name"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ cat.name
                        }}</span><span class="text-[10px] text-muted-themed">({{ cat.items.length }}项)</span></div>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2 text-dim font-medium">编号</th>
                        <th class="text-left px-4 py-2 text-dim font-medium">检查项</th>
                        <th class="text-left px-4 py-2 text-dim font-medium">检查标准</th>
                        <th class="text-center px-4 py-2 text-dim font-medium">检查方法</th>
                        <th class="text-center px-4 py-2 text-dim font-medium">必检</th>
                        <th class="text-center px-4 py-2 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cat.items" :key="item.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2 text-primary font-mono">{{ item.id }}</td>
                        <td class="px-4 py-2 text-default font-medium">{{ item.name }}</td>
                        <td class="px-4 py-2 text-dim">{{ item.standard }}</td>
                        <td class="text-center px-4 py-2 text-default">{{ item.method }}</td>
                        <td class="text-center px-4 py-2">
                            <component :is="item.required ? CheckCircle : Circle" class="w-3.5 h-3.5 inline"
                                :class="item.required ? 'text-success' : 'text-dim'" />
                        </td>
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
    <!-- 新增弹窗 -->
    <ModalDialog :show="showAddModal" title="新增检查项" @close="showAddModal = false" @confirm="doAdd">
        <div class="space-y-3">
            <div>
                <label class="text-[10px] text-dim block mb-1">检查项名称</label>
                <input v-model="addForm.name" type="text" placeholder="请输入检查项名称"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">分类</label>
                <input v-model="addForm.category" type="text" placeholder="管道/检查井/排口"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">检查方法</label>
                <input v-model="addForm.method" type="text" placeholder="请输入检查方法"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">合格标准</label>
                <input v-model="addForm.standard" type="text" placeholder="请输入合格标准"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
        </div>
    </ModalDialog>
        <ToastNotify ref="toast" />
    </div>
</template>
