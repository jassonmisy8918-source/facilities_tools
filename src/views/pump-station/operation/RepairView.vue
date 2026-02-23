<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Save, Edit, Monitor, Smartphone } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('list')
const funcTabs = [
    { key: 'list', label: '报修列表' },
    { key: 'submit', label: '提交报修' },
    { key: 'draft', label: '草稿管理' },
]

const repairs = ref([
    { id: 1, device: '2号水泵', station: '雨花泵站', fault: '轴承异响/振动增大', reporter: '张伟', channel: 'PC', time: '2024-03-15 14:00', photos: 2, status: '待审核' },
    { id: 2, device: '格栅机', station: '左家塘泵站', fault: '链条断裂/停机', reporter: '李明', channel: 'APP', time: '2024-03-14 10:30', photos: 3, status: '已派发' },
    { id: 3, device: '配电柜B', station: '黎托泵站', fault: '接触器打火', reporter: '赵刚', channel: 'PC', time: '2024-03-13 16:20', photos: 1, status: '处理中' },
    { id: 4, device: '流量计FL-03', station: '侯家塘泵站', fault: '读数偏差大', reporter: '刘芳', channel: 'APP', time: '2024-03-12 09:15', photos: 0, status: '已完成' },
])

const drafts = ref([
    { id: 1, device: '阀门DN200', station: '黎托泵站', fault: '开关卡顿(待补充)', savedTime: '2024-03-15 11:00', reporter: '赵刚' },
    { id: 2, device: '液位计LV-05', station: '雨花泵站', fault: '(未填写)', savedTime: '2024-03-14 16:30', reporter: '张伟' },
])

function statusClass(s: string) {
    const m: Record<string, string> = { '待审核': 'bg-warning/10 text-warning', '已派发': 'bg-info/10 text-info', '处理中': 'bg-primary/10 text-primary', '已完成': 'bg-success/10 text-success' }
    return m[s] || 'bg-surface text-dim'
}
</script>

<template>
    <div class="space-y-4">
        <ToastNotify ref="toast" />
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'list'">
            <span class="text-sm font-semibold text-default block">报修记录</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">故障</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">报修人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">渠道</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">照片</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in repairs" :key="r.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.station }}</td>
                            <td class="px-2 py-2.5 text-default">{{ r.fault }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.reporter }}</td>
                            <td class="text-center px-2 py-2.5">
                                <component :is="r.channel === 'PC' ? Monitor : Smartphone" class="w-3.5 h-3.5 inline"
                                    :class="r.channel === 'PC' ? 'text-primary' : 'text-info'" />
                            </td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ r.time }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ r.photos }}张</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="statusClass(r.status)">{{ r.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'submit'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-6">
                <span class="text-sm font-semibold text-default block mb-4">提交报修申请</span>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-[10px] text-dim block mb-1">故障设备</label><select
                            class="w-full px-3 py-2 bg-surface border border-themed rounded-lg text-xs text-default outline-none">
                            <option>请选择设备</option>
                            <option>1号水泵</option>
                            <option>2号水泵</option>
                            <option>主电机</option>
                        </select></div>
                    <div><label class="text-[10px] text-dim block mb-1">所属泵站</label><select
                            class="w-full px-3 py-2 bg-surface border border-themed rounded-lg text-xs text-default outline-none">
                            <option>请选择泵站</option>
                            <option>雨花泵站</option>
                            <option>侯家塘泵站</option>
                        </select></div>
                    <div class="col-span-2"><label class="text-[10px] text-dim block mb-1">故障描述</label><textarea
                            rows="3"
                            class="w-full px-3 py-2 bg-surface border border-themed rounded-lg text-xs text-default outline-none resize-none"
                            placeholder="请描述故障现象..."></textarea></div>
                    <div class="col-span-2"><label class="text-[10px] text-dim block mb-1">上传照片</label>
                        <div
                            class="h-20 border-2 border-dashed border-themed rounded-lg flex items-center justify-center text-xs text-dim cursor-pointer hover:border-primary/50">
                            点击或拖拽上传故障照片</div>
                    </div>
                </div>
                <div class="flex gap-2 mt-4">
                    <button @click="toast?.show('报修已提交', 'success')"
                        class="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                        <Plus class="w-3.5 h-3.5" />提交报修
                    </button>
                    <button @click="toast?.show('已保存为草稿', 'info')"
                        class="flex items-center gap-1 px-4 py-2 bg-surface rounded-lg text-xs text-default hover:bg-hover-themed cursor-pointer">
                        <Save class="w-3.5 h-3.5" />暂存草稿
                    </button>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'draft'">
            <span class="text-sm font-semibold text-default block">草稿管理</span>
            <div class="space-y-3">
                <div v-for="d in drafts" :key="d.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-default">{{ d.device }} — {{ d.station }}</p>
                        <p class="text-[10px] text-dim">{{ d.fault }} · 暂存于 {{ d.savedTime }}</p>
                    </div>
                    <div class="flex gap-2"><button @click="toast?.show('编辑草稿', 'info')"
                            class="flex items-center gap-1 px-2 py-1 bg-primary text-white rounded text-[10px] cursor-pointer">
                            <Edit class="w-3 h-3" />编辑
                        </button><button @click="toast?.show('草稿已提交', 'success')"
                            class="flex items-center gap-1 px-2 py-1 bg-success text-white rounded text-[10px] cursor-pointer">
                            <Plus class="w-3 h-3" />提交
                        </button></div>
                </div>
            </div>
        </template>
    </div>
</template>
