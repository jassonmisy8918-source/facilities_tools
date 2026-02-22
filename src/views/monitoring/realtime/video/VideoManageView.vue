<script setup lang="ts">
import { ref } from 'vue'
import { Video, Search, Plus, MapPin, Pencil, Trash2 } from 'lucide-vue-next'

const searchText = ref('')

const cameras = ref([
    { id: 1, name: '朝阳路泵站', ip: '192.168.1.101', location: '朝阳路泵站入口', region: '朝阳区', type: '球机', resolution: '1080P', online: true, installDate: '2023-06-15' },
    { id: 2, name: '东湖排放口', ip: '192.168.1.102', location: '东湖排放口周边', region: '东城区', type: '枪机', resolution: '4K', online: true, installDate: '2023-08-20' },
    { id: 3, name: '和平路节点', ip: '192.168.1.103', location: '和平路管网节点', region: '西城区', type: '球机', resolution: '1080P', online: false, installDate: '2023-05-10' },
    { id: 4, name: '民生路截流井', ip: '192.168.1.104', location: '民生路截流井', region: '海淀区', type: '枪机', resolution: '1080P', online: true, installDate: '2023-09-01' },
    { id: 5, name: '丰台区泵站', ip: '192.168.1.105', location: '丰台区主泵站', region: '丰台区', type: '球机', resolution: '4K', online: true, installDate: '2024-01-12' },
    { id: 6, name: '通州区排口', ip: '192.168.1.106', location: '通州河道排口', region: '通州区', type: '枪机', resolution: '1080P', online: false, installDate: '2023-07-25' },
])

const stats = {
    total: 6, online: 4, offline: 2, regions: 5,
}
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
                <button
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
</template>
