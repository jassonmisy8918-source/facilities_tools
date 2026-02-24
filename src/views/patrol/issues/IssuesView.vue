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
    { id: 'ISS-2024-001', title: '万家丽路MH-05井盖松动', type: '井盖问题', level: 'medium', location: '万家丽路200号', facility: 'DN400雨水检查井', reporter: '张伟', reportTime: '2024-03-15 09:15', status: 'processing', photos: 2, desc: '井盖翘动，行人通过有安全隐患，需紧急处理', statusHistory: [{ status: '已上报', date: '2024-03-15 09:15', note: '巡检员张伟现场上报' }, { status: '已受理', date: '2024-03-15 10:00', note: '调度中心已受理，派单至维修一组' }, { status: '处置中', date: '2024-03-15 14:30', note: '维修一组到达现场，正在更换井盖' }] },
    { id: 'ISS-2024-002', title: '侯家塘街道OUT-03排口堵塞', type: '排口问题', level: 'high', location: '侯家塘街道浏阳河段', facility: 'DN800排口', reporter: '李明', reportTime: '2024-03-14 10:30', status: 'pending', photos: 3, desc: '排口被大量垃圾堵塞，水流受阻，有溢流风险', statusHistory: [{ status: '已上报', date: '2024-03-14 10:30', note: '巡检员李明现场上报' }] },
    { id: 'ISS-2024-003', title: '劳动路路面沉降', type: '管道问题', level: 'high', location: '劳动路150号', facility: 'DN600污水管', reporter: '王强', reportTime: '2024-03-13 14:00', status: 'resolved', photos: 4, desc: '管线上方路面出现明显沉降约3cm，疑似管道破损', statusHistory: [{ status: '已上报', date: '2024-03-13 14:00', note: '巡检员王强现场上报' }, { status: '已受理', date: '2024-03-13 15:20', note: '调度中心审核通过' }, { status: '处置中', date: '2024-03-14 08:00', note: '施工队到达现场开挖检查' }, { status: '已闭环', date: '2024-03-15 17:00', note: '管道修复完成，路面恢复，验收合格' }] },
    { id: 'ISS-2024-004', title: '芙蓉路泵站格栅堵塞', type: '泵站问题', level: 'medium', location: '芙蓉路200号', facility: '芙蓉路泵站', reporter: '赵刚', reportTime: '2024-03-12 16:00', status: 'resolved', photos: 1, desc: '进水格栅被树枝杂物堵塞，已清理', statusHistory: [{ status: '已上报', date: '2024-03-12 16:00', note: '巡检员赵刚现场上报' }, { status: '已受理', date: '2024-03-12 16:30', note: '泵站值班人员确认' }, { status: '处置中', date: '2024-03-12 17:00', note: '清理格栅杂物中' }, { status: '已闭环', date: '2024-03-12 18:00', note: '格栅清理完毕，泵站运行恢复正常' }] },
    { id: 'ISS-2024-005', title: '黎托街道雨污混接疑似点', type: '混接问题', level: 'critical', location: '黎托街道花侯路', facility: 'DN400雨水管', reporter: '刘芳', reportTime: '2024-03-11 11:00', status: 'processing', photos: 5, desc: '雨水管内发现异味污水，疑似存在雨污混接', statusHistory: [{ status: '已上报', date: '2024-03-11 11:00', note: '巡检员刘芳现场上报' }, { status: '已受理', date: '2024-03-11 13:00', note: '混接排查专项组介入' }, { status: '处置中', date: '2024-03-12 09:00', note: 'CCTV检测中，已定位2处疑似混接点' }] },
])

// 提交表单
const submitForm = ref({ title: '', type: '井盖问题', level: 'medium', location: '', facility: '', desc: '' })
const showSubmitConfirm = ref(false)
function submitIssue() {
    if (!submitForm.value.title || !submitForm.value.location) { toast.value?.show('请填写必填项', 'warning'); return }
    showSubmitConfirm.value = true
}
function confirmSubmit() {
    const newId = `ISS-2024-${String(issues.value.length + 1).padStart(3, '0')}`
    issues.value.unshift({
        id: newId, title: submitForm.value.title, type: submitForm.value.type, level: submitForm.value.level,
        location: submitForm.value.location, facility: submitForm.value.facility || '-', reporter: '当前用户',
        reportTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: 'pending', photos: 0, desc: submitForm.value.desc || '-',
        statusHistory: [{ status: '已上报', date: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'), note: '现场上报提交' }],
    } as any)
    showSubmitConfirm.value = false
    submitForm.value = { title: '', type: '井盖问题', level: 'medium', location: '', facility: '', desc: '' }
    toast.value?.show('问题上报成功！', 'success')
    activeFunc.value = 'list'
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
                    <div class="mt-3 pt-3 border-t border-themed/30">
                        <p class="text-[10px] text-dim font-medium mb-2">状态追踪</p>
                        <div class="relative pl-4">
                            <div class="absolute left-[5px] top-1 bottom-1 w-0.5 bg-themed/20 rounded"></div>
                            <div v-for="(h, hi) in i.statusHistory" :key="hi" class="relative mb-2.5 last:mb-0">
                                <div class="absolute -left-4 top-0.5 w-2.5 h-2.5 rounded-full border-2 border-card"
                                    :class="hi === i.statusHistory.length - 1 && i.status !== 'resolved' ? 'bg-primary animate-pulse' : 'bg-success'"></div>
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] font-semibold" :class="hi === i.statusHistory.length - 1 && i.status !== 'resolved' ? 'text-primary' : 'text-success'">{{ h.status }}</span>
                                    <span class="text-[9px] text-dim">{{ h.date }}</span>
                                </div>
                                <p class="text-[10px] text-default mt-0.5">{{ h.note }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 上报确认弹窗 -->
        <ModalDialog :show="showSubmitConfirm" title="确认上报" @close="showSubmitConfirm = false" @confirm="confirmSubmit">
            <div class="space-y-2 text-xs">
                <p class="text-default">确认提交以下问题上报？</p>
                <div class="p-3 rounded-lg bg-surface space-y-1">
                    <p><span class="text-dim">标题：</span><span class="text-default font-medium">{{ submitForm.title }}</span></p>
                    <p><span class="text-dim">类型：</span><span class="text-default">{{ submitForm.type }}</span></p>
                    <p><span class="text-dim">位置：</span><span class="text-default">{{ submitForm.location }}</span></p>
                    <p v-if="submitForm.facility"><span class="text-dim">设施：</span><span class="text-default">{{ submitForm.facility }}</span></p>
                    <p v-if="submitForm.desc"><span class="text-dim">描述：</span><span class="text-default">{{ submitForm.desc }}</span></p>
                </div>
            </div>
        </ModalDialog>

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
