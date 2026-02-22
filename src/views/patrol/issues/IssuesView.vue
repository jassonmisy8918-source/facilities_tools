<script setup lang="ts">
import { ref } from 'vue'
import { AlertCircle, Eye, Search, Camera, MapPin, Send } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('list')
const funcTabs = [
    { key: 'list', label: '问题信息管理' },
    { key: 'submit', label: '问题提交' },
    { key: 'track', label: '查看与追踪' },
]

const issues = ref([
    { id: 'ISS-2024-001', title: '建设大道MH-05井盖松动', type: '井盖问题', level: 'medium', location: '建设大道200号', facility: 'DN400雨水检查井', reporter: '张伟', reportTime: '2024-03-15 09:15', status: 'processing', photos: 2, desc: '井盖翘动，行人通过有安全隐患，需紧急处理' },
    { id: 'ISS-2024-002', title: '西城区OUT-03排口堵塞', type: '排口问题', level: 'high', location: '西城区清河段', facility: 'DN800排口', reporter: '李明', reportTime: '2024-03-14 10:30', status: 'pending', photos: 3, desc: '排口被大量垃圾堵塞，水流受阻，有溢流风险' },
    { id: 'ISS-2024-003', title: '民生路路面沉降', type: '管道问题', level: 'high', location: '民生路150号', facility: 'DN600污水管', reporter: '王强', reportTime: '2024-03-13 14:00', status: 'resolved', photos: 4, desc: '管线上方路面出现明显沉降约3cm，疑似管道破损' },
    { id: 'ISS-2024-004', title: '和平路泵站格栅堵塞', type: '泵站问题', level: 'medium', location: '和平路200号', facility: '和平路泵站', reporter: '赵刚', reportTime: '2024-03-12 16:00', status: 'resolved', photos: 1, desc: '进水格栅被树枝杂物堵塞，已清理' },
    { id: 'ISS-2024-005', title: '通州区雨污混接疑似点', type: '混接问题', level: 'critical', location: '通州区运河大道', facility: 'DN400雨水管', reporter: '刘芳', reportTime: '2024-03-11 11:00', status: 'processing', photos: 5, desc: '雨水管内发现异味污水，疑似存在雨污混接' },
])

// 提交表单
const submitForm = ref({ title: '', type: '井盖问题', level: 'medium', location: '', facility: '', desc: '' })
function submitIssue() {
    if (!submitForm.value.title || !submitForm.value.location) { toast.value?.show('请填写必填项', 'warning'); return }
    toast.value?.show('问题上报成功！', 'success')
    submitForm.value = { title: '', type: '井盖问题', level: 'medium', location: '', facility: '', desc: '' }
}

// 详情
const showDetail = ref(false)
const detailIssue = ref<typeof issues.value[0] | null>(null)
function viewIssue(i: typeof issues.value[0]) { detailIssue.value = i; showDetail.value = true }

function getLevelColor(l: string) { return l === 'critical' ? 'text-danger bg-danger/10' : l === 'high' ? 'text-warning bg-warning/10' : l === 'medium' ? 'text-info bg-info/10' : 'text-dim bg-surface' }
function getLevelText(l: string) { return l === 'critical' ? '严重' : l === 'high' ? '重要' : l === 'medium' ? '一般' : '轻微' }
function getStatusColor(s: string) { return s === 'processing' ? 'text-primary bg-primary/10' : s === 'resolved' ? 'text-success bg-success/10' : 'text-warning bg-warning/10' }
function getStatusText(s: string) { return s === 'processing' ? '处理中' : s === 'resolved' ? '已解决' : '待处理' }
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
        </div>

        <!-- 问题列表 -->
        <template v-if="activeFunc === 'list'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-default">{{ issues.length }}</p>
                    <p class="text-[10px] text-dim">总问题</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-warning">{{issues.filter(i => i.status === 'pending').length}}
                    </p>
                    <p class="text-[10px] text-dim">待处理</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{issues.filter(i => i.status === 'processing').length
                    }}</p>
                    <p class="text-[10px] text-dim">处理中</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{issues.filter(i => i.status === 'resolved').length}}
                    </p>
                    <p class="text-[10px] text-dim">已解决</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">编号</th>
                            <th class="text-left px-3 py-2.5 text-dim font-medium">标题</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">上报人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">照片</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in issues" :key="i.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ i.id }}</td>
                            <td class="px-3 py-2.5 text-default font-medium">{{ i.title }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ i.type }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="getLevelColor(i.level)">{{ getLevelText(i.level) }}</span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ i.reporter }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ i.reportTime }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ i.photos }}📷</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="getStatusColor(i.status)">{{ getStatusText(i.status) }}</span></td>
                            <td class="text-center px-2 py-2.5"><button @click="viewIssue(i)"
                                    class="p-1 rounded hover:bg-hover-themed cursor-pointer">
                                    <Eye class="w-3 h-3 text-primary" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 问题提交 -->
        <template v-if="activeFunc === 'submit'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-5 max-w-2xl">
                <div class="flex items-center gap-2 mb-4">
                    <AlertCircle class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">上报巡查问题</span>
                </div>
                <div class="space-y-3">
                    <div><label class="text-[10px] text-dim block mb-1">问题标题 *</label><input v-model="submitForm.title"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary"
                            placeholder="简述问题" /></div>
                    <div class="grid grid-cols-2 gap-3">
                        <div><label class="text-[10px] text-dim block mb-1">问题类型</label><select
                                v-model="submitForm.type"
                                class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                                <option>井盖问题</option>
                                <option>排口问题</option>
                                <option>管道问题</option>
                                <option>泵站问题</option>
                                <option>混接问题</option>
                                <option>其他</option>
                            </select></div>
                        <div><label class="text-[10px] text-dim block mb-1">严重等级</label><select
                                v-model="submitForm.level"
                                class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                                <option value="critical">严重</option>
                                <option value="high">重要</option>
                                <option value="medium">一般</option>
                                <option value="low">轻微</option>
                            </select></div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div><label class="text-[10px] text-dim block mb-1">问题位置 *</label>
                            <div class="relative">
                                <MapPin class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                                    v-model="submitForm.location"
                                    class="w-full bg-input border border-themed rounded-lg pl-8 pr-3 py-2 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary"
                                    placeholder="位置/地址" />
                            </div>
                        </div>
                        <div><label class="text-[10px] text-dim block mb-1">关联设施</label><input
                                v-model="submitForm.facility"
                                class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary"
                                placeholder="设施名称/编号" /></div>
                    </div>
                    <div><label class="text-[10px] text-dim block mb-1">问题描述</label><textarea v-model="submitForm.desc"
                            rows="3"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary resize-none"
                            placeholder="详细描述"></textarea></div>
                    <div><label class="text-[10px] text-dim block mb-1">现场照片</label>
                        <div class="flex gap-2">
                            <div
                                class="w-20 h-20 rounded-lg border-2 border-dashed border-themed flex flex-col items-center justify-center text-dim cursor-pointer hover:border-primary hover:text-primary transition-colors">
                                <Camera class="w-5 h-5 mb-1" /><span class="text-[9px]">拍照/上传</span>
                            </div>
                        </div>
                    </div>
                    <button @click="submitIssue"
                        class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Send class="w-3.5 h-3.5" />提交上报
                    </button>
                </div>
            </div>
        </template>

        <!-- 查看与追踪 -->
        <template v-if="activeFunc === 'track'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center gap-3">
                <div class="relative">
                    <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" /><input
                        placeholder="搜索问题..."
                        class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary w-48" />
                </div>
                <select
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option>全部状态</option>
                    <option>待处理</option>
                    <option>处理中</option>
                    <option>已解决</option>
                </select>
                <select
                    class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                    <option>全部等级</option>
                    <option>严重</option>
                    <option>重要</option>
                    <option>一般</option>
                </select>
            </div>
            <div class="space-y-3">
                <div v-for="i in issues" :key="i.id" class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ i.title
                            }}</span><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="getLevelColor(i.level)">{{ getLevelText(i.level) }}</span><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="getStatusColor(i.status)">{{ getStatusText(i.status) }}</span></div>
                            <div class="text-[10px] text-dim mt-0.5">{{ i.id }} · {{ i.reporter }} · {{ i.reportTime }}
                            </div>
                        </div>
                        <button @click="viewIssue(i)"
                            class="text-[10px] text-primary hover:underline cursor-pointer">查看详情</button>
                    </div>
                    <p class="text-[10px] text-default mb-2">{{ i.desc }}</p>
                    <div class="flex items-center gap-3 text-[10px] text-dim"><span>📍 {{ i.location }}</span><span>🏗
                            {{ i.facility }}</span><span>📷 {{ i.photos }}张</span></div>
                    <div class="mt-2 pt-2 border-t border-themed/30 flex items-center gap-2">
                        <div class="flex items-center gap-1" v-if="i.status !== 'pending'">
                            <div class="w-1.5 h-1.5 rounded-full bg-success"></div><span
                                class="text-[10px] text-dim">已受理</span>
                        </div>
                        <div class="w-4 h-0.5 bg-themed/30" v-if="i.status !== 'pending'"></div>
                        <div class="flex items-center gap-1"
                            v-if="i.status === 'processing' || i.status === 'resolved'">
                            <div class="w-1.5 h-1.5 rounded-full"
                                :class="i.status === 'resolved' ? 'bg-success' : 'bg-primary animate-pulse'"></div><span
                                class="text-[10px] text-dim">{{ i.status === 'resolved' ? '已处置' : '处置中' }}</span>
                        </div>
                        <div class="w-4 h-0.5 bg-themed/30" v-if="i.status === 'resolved'"></div>
                        <div class="flex items-center gap-1" v-if="i.status === 'resolved'">
                            <div class="w-1.5 h-1.5 rounded-full bg-success"></div><span
                                class="text-[10px] text-dim">已闭环</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <ModalDialog :show="showDetail" title="问题详情" @close="showDetail = false" @confirm="showDetail = false">
            <div v-if="detailIssue" class="space-y-3 text-xs">
                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">编号</p>
                        <p class="text-default font-bold mt-0.5">{{ detailIssue.id }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">标题</p>
                        <p class="text-default font-bold mt-0.5">{{ detailIssue.title }}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">类型 / 等级</p>
                        <p class="text-default mt-0.5">{{ detailIssue.type }} / {{ getLevelText(detailIssue.level) }}
                        </p>
                    </div>
                    <div class="p-3 rounded-lg bg-surface">
                        <p class="text-dim">位置</p>
                        <p class="text-default mt-0.5">{{ detailIssue.location }}</p>
                    </div>
                </div>
                <div class="p-3 rounded-lg bg-surface">
                    <p class="text-dim">问题描述</p>
                    <p class="text-default mt-0.5">{{ detailIssue.desc }}</p>
                </div>
            </div>
        </ModalDialog>
        <ToastNotify ref="toast" />
    </div>
</template>
