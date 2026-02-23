<script setup lang="ts">
import { ref } from 'vue'
import { Video, Search, Plus, MapPin, Pencil, Trash2 } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const searchText = ref('')

const cameras = ref([
    { id: 1, name: '韶山路泵站', ip: '192.168.1.101', location: '韶山路泵站入口', region: '圭塘街道', type: '球机', resolution: '1080P', online: true, installDate: '2023-06-15' },
    { id: 2, name: '圭塘河排放口', ip: '192.168.1.102', location: '圭塘河排放口周边', region: '雨花亭街道', type: '枪机', resolution: '4K', online: true, installDate: '2023-08-20' },
    { id: 3, name: '芙蓉路节点', ip: '192.168.1.103', location: '芙蓉路管网节点', region: '侯家塘街道', type: '球机', resolution: '1080P', online: false, installDate: '2023-05-10' },
    { id: 4, name: '劳动路截流井', ip: '192.168.1.104', location: '劳动路截流井', region: '洞井街道', type: '枪机', resolution: '1080P', online: true, installDate: '2023-09-01' },
    { id: 5, name: '左家塘街道泵站', ip: '192.168.1.105', location: '左家塘街道主泵站', region: '左家塘街道', type: '球机', resolution: '4K', online: true, installDate: '2024-01-12' },
    { id: 6, name: '黎托街道排口', ip: '192.168.1.106', location: '黎托街道河道排口', region: '黎托街道', type: '枪机', resolution: '1080P', online: false, installDate: '2023-07-25' },
])

const stats = {
    total: 6, online: 4, offline: 2, regions: 5,
}

const toast = ref<InstanceType<typeof ToastNotify>>()
const showAddModal = ref(false)
const addForm = ref({ name: '', ip: '', location: '', region: '', type: '球机', resolution: '1080P' })
function openAdd() { addForm.value = { name: '', ip: '', location: '', region: '', type: '球机', resolution: '1080P' }; showAddModal.value = true }
function doAdd() { showAddModal.value = false; toast.value?.show('摄像头添加成功', 'success') }
</script>

<template>
    <div class="space-y-4">
        <!-- 统计概览 -->
        <div class="grid grid-cols-4 gap-3">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <Video class="w-5 h-5 text-primary shrink-0" />
                <div>
                    <p class="text-xs text-dim">摄像头总数</p>
                    <p class="text-lg font-bold text-default">{{ stats.total }}</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-success"></div>
                </div>
                <div>
                    <p class="text-xs text-dim">在线</p>
                    <p class="text-lg font-bold text-success">{{ stats.online }}</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-danger/20 flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-danger"></div>
                </div>
                <div>
                    <p class="text-xs text-dim">离线</p>
                    <p class="text-lg font-bold text-danger">{{ stats.offline }}</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
                <MapPin class="w-5 h-5 text-info shrink-0" />
                <div>
                    <p class="text-xs text-dim">覆盖区域</p>
                    <p class="text-lg font-bold text-default">{{ stats.regions }}</p>
                </div>
            </div>
        </div>

        <!-- 操作栏 + 表格 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input v-model="searchText" type="text" placeholder="搜索摄像头..."
                            class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-56" />
                    </div>
                </div>
                <button @click="openAdd()"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Plus class="w-3.5 h-3.5" /> 添加摄像头
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">名称</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">IP地址</th>
                            <th class="text-left px-4 py-2.5 text-dim font-medium">安装位置</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">分辨率</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cam in cameras" :key="cam.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ cam.name }}</td>
                            <td class="px-4 py-2.5 text-dim font-mono">{{ cam.ip }}</td>
                            <td class="px-4 py-2.5 text-default">{{ cam.location }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ cam.region }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ cam.type }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ cam.resolution }}</td>
                            <td class="text-center px-4 py-2.5">
                                <span class="flex items-center justify-center gap-1">
                                    <span class="w-1.5 h-1.5 rounded-full"
                                        :class="cam.online ? 'bg-success' : 'bg-danger'"></span>
                                    <span :class="cam.online ? 'text-success' : 'text-danger'">{{ cam.online ? '在线' :
                                        '离线' }}</span>
                                </span>
                            </td>
                            <td class="text-center px-4 py-2.5">
                                <div class="flex items-center justify-center gap-1.5">
                                    <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
                                        <Pencil class="w-3 h-3 text-dim" />
                                    </button>
                                    <button class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer">
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

    <!-- 添加摄像头弹窗 -->
    <ModalDialog :show="showAddModal" title="添加摄像头" @close="showAddModal = false" @confirm="doAdd">
        <div class="space-y-3">
            <div>
                <label class="text-[10px] text-dim block mb-1">摄像头名称</label>
                <input v-model="addForm.name" type="text" placeholder="请输入名称"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">IP地址</label>
                <input v-model="addForm.ip" type="text" placeholder="如 192.168.1.107"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div>
                <label class="text-[10px] text-dim block mb-1">安装位置</label>
                <input v-model="addForm.location" type="text" placeholder="请输入安装位置"
                    class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">区域</label>
                    <input v-model="addForm.region" type="text" placeholder="区域"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">类型</label>
                    <select v-model="addForm.type"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                        <option>球机</option>
                        <option>枪机</option>
                        <option>半球</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">分辨率</label>
                    <select v-model="addForm.resolution"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                        <option>1080P</option>
                        <option>4K</option>
                        <option>720P</option>
                    </select>
                </div>
            </div>
        </div>
    </ModalDialog>
    <ToastNotify ref="toast" />
</template>
