<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle, XCircle, Send, Volume2 } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const alarms = ref([
    { id: 1, level: 'critical', title: '万家丽路DN300水位超限', location: '万家丽路DN300 监测点#06', time: '2024-03-15 14:23', value: '2.35m (阈值: 2.0m)', status: 'active', type: '水位超限' },
    { id: 2, level: 'warning', title: '侯家塘街道进水口COD超标', location: '侯家塘街道进水口 WQ-302', time: '2024-03-15 13:45', value: '45mg/L (阈值: 40mg/L)', status: 'active', type: '水质超标' },
    { id: 3, level: 'warning', title: '劳动路DN400水位预警', location: '劳动路DN400 监测点#02', time: '2024-03-15 12:30', value: '1.85m (阈值: 1.8m)', status: 'acknowledged', type: '水位超限' },
    { id: 4, level: 'info', title: '左家塘街道降雨量增加', location: '左家塘街道雨量站 RG-051', time: '2024-03-15 11:20', value: '8.5mm/h', status: 'acknowledged', type: '雨量预警' },
    { id: 5, level: 'notice', title: '韶山路流量波动提醒', location: '韶山路DN600 FM-201', time: '2024-03-15 10:15', value: '波动幅度: ±15%', status: 'resolved', type: '流量异常' },
    { id: 6, level: 'critical', title: '芙蓉路泵站进水位超高', location: '芙蓉路泵站 前池', time: '2024-03-15 09:30', value: '4.1m (阈值: 3.8m)', status: 'active', type: '水位超限' },
    { id: 7, level: 'warning', title: '黎托街道雨量站降雨超限', location: '黎托街道雨量站 RG-2003', time: '2024-03-15 08:45', value: '12.6mm/h (阈值: 10mm/h)', status: 'active', type: '雨量预警' },
    { id: 8, level: 'critical', title: '侯家塘街道水质仪设备离线', location: '侯家塘街道进水口 WQ-302', time: '2024-03-15 07:10', value: '离线时长: 3小时', status: 'active', type: '仪表故障' },
    { id: 9, level: 'warning', title: '左家塘路液位计传感器异常', location: '左家塘路DN500 LG-4003', time: '2024-03-15 06:30', value: '读数漂移: ±0.5m', status: 'active', type: '仪表故障' },
    { id: 10, level: 'warning', title: '万家丽路流量计通信中断', location: '万家丽路DN300 FM-3005', time: '2024-03-14 22:00', value: '中断时长: 12小时', status: 'acknowledged', type: '仪表故障' },
])

const levelFilter = ref('all')
const statusFilter = ref('all')
const levelOptions = [{ key: 'all', label: '全部' }, { key: 'critical', label: '紧急' }, { key: 'warning', label: '严重' }, { key: 'info', label: '一般' }, { key: 'notice', label: '提示' }]

const alarmStats = computed(() => [
    { label: '今日预警', value: alarms.value.length, color: '#FF4757' },
    { label: '报警中', value: alarms.value.filter(a => a.status === 'active').length, color: '#FFB020' },
    { label: '已确认', value: alarms.value.filter(a => a.status === 'acknowledged').length, color: '#3B82F6' },
    { label: '已消警', value: alarms.value.filter(a => a.status === 'resolved').length, color: '#00D4AA' },
])

const filteredAlarms = computed(() => alarms.value.filter(a => {
    if (levelFilter.value !== 'all' && a.level !== levelFilter.value) return false
    if (statusFilter.value !== 'all' && a.status !== statusFilter.value) return false
    return true
}))

function confirmAlarm(alarm: typeof alarms.value[0]) { alarm.status = 'acknowledged'; toast.value?.show(`预警 "${alarm.title}" 已确认`, 'info') }
function resolveAlarm(alarm: typeof alarms.value[0]) { alarm.status = 'resolved'; toast.value?.show(`预警 "${alarm.title}" 已消警`, 'success') }

const showDispatchModal = ref(false)
const dispatchAlarm = ref<typeof alarms.value[0] | null>(null)
const dispatchForm = ref({ assignee: '', priority: '高', remark: '' })
function openDispatch(alarm: typeof alarms.value[0]) { dispatchAlarm.value = alarm; dispatchForm.value = { assignee: '', priority: '高', remark: '' }; showDispatchModal.value = true }
function doDispatch() { if (!dispatchForm.value.assignee) { toast.value?.show('请选择派单人员', 'warning'); return }; showDispatchModal.value = false; toast.value?.show(`已派单给 ${dispatchForm.value.assignee}`, 'success') }

function getLevelClass(l: string) { return l === 'critical' ? 'bg-danger text-white' : l === 'warning' ? 'bg-warning text-white' : l === 'info' ? 'bg-info/20 text-info' : 'bg-surface text-dim' }
function getLevelText(l: string) { return l === 'critical' ? '紧急' : l === 'warning' ? '严重' : l === 'info' ? '一般' : '提示' }
function getStatusClass(s: string) { return s === 'active' ? 'text-danger' : s === 'acknowledged' ? 'text-warning' : 'text-success' }
function getStatusText(s: string) { return s === 'active' ? '报警中' : s === 'acknowledged' ? '已确认' : '已消警' }
</script>

<template>
    <div class="space-y-4">
        <!-- 统计 -->
        <div class="grid grid-cols-4 gap-3">
            <div v-for="stat in alarmStats" :key="stat.label"
                class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-3xl font-bold" :style="{ color: stat.color }">{{ stat.value }}</p>
                <p class="text-xs text-dim mt-1">{{ stat.label }}</p>
            </div>
        </div>

        <!-- 动态报警横幅 -->
        <div v-if="alarms.filter(a => a.status === 'active').length > 0"
            class="bg-danger/10 border border-danger/30 rounded-xl p-3 flex items-center gap-3">
            <Volume2 class="w-5 h-5 text-danger animate-pulse shrink-0" />
            <div class="flex-1 overflow-hidden">
                <marquee class="text-xs text-danger font-medium" scrollamount="3">
                    <span v-for="a in alarms.filter(x => x.status === 'active')" :key="a.id" class="mr-8">🚨 {{ a.title
                        }} — {{ a.location }} — {{ a.time }}</span>
                </marquee>
            </div>
        </div>

        <!-- 筛选 -->
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-xs">
                <span class="text-dim">等级:</span>
                <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                    <button v-for="opt in levelOptions" :key="opt.key" @click="levelFilter = opt.key"
                        class="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                        :class="levelFilter === opt.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                            opt.label }}</button>
                </div>
            </div>
            <div class="flex items-center gap-2 text-xs">
                <span class="text-dim">状态:</span>
                <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                    <button
                        v-for="st in [{ key: 'all', label: '全部' }, { key: 'active', label: '报警中' }, { key: 'acknowledged', label: '已确认' }, { key: 'resolved', label: '已消警' }]"
                        :key="st.key" @click="statusFilter = st.key"
                        class="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                        :class="statusFilter === st.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                            st.label }}</button>
                </div>
            </div>
        </div>

        <!-- 列表 -->
        <div class="space-y-2">
            <div v-for="alarm in filteredAlarms" :key="alarm.id"
                class="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow">
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3">
                        <span class="text-[10px] px-2 py-0.5 rounded-md mt-0.5" :class="getLevelClass(alarm.level)">{{
                            getLevelText(alarm.level) }}</span>
                        <div>
                            <h4 class="text-sm font-semibold text-default">{{ alarm.title }}</h4>
                            <p class="text-xs text-dim mt-1">{{ alarm.location }}</p>
                            <p class="text-xs text-dim mt-0.5">{{ alarm.time }} · {{ alarm.value }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <span class="text-xs font-medium" :class="getStatusClass(alarm.status)">{{
                            getStatusText(alarm.status) }}</span>
                        <div class="flex items-center gap-1">
                            <button v-if="alarm.status === 'active'" @click="confirmAlarm(alarm)" title="确认"
                                class="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors cursor-pointer">
                                <CheckCircle class="w-3.5 h-3.5" />
                            </button>
                            <button v-if="alarm.status !== 'resolved'" @click="resolveAlarm(alarm)" title="消警"
                                class="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors cursor-pointer">
                                <XCircle class="w-3.5 h-3.5" />
                            </button>
                            <button @click="openDispatch(alarm)" title="派单"
                                class="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                                <Send class="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="filteredAlarms.length === 0" class="text-center py-12 text-dim text-sm">暂无匹配的预警信息</div>
        </div>

        <ModalDialog :show="showDispatchModal" title="派发工单" @close="showDispatchModal = false" @confirm="doDispatch">
            <div class="space-y-3">
                <div v-if="dispatchAlarm" class="p-3 bg-surface rounded-lg text-xs">
                    <p class="text-default font-medium">{{ dispatchAlarm.title }}</p>
                    <p class="text-dim mt-0.5">{{ dispatchAlarm.location }}</p>
                </div>
                <div><label class="text-xs text-dim mb-1 block">派单人员 <span class="text-danger">*</span></label><select
                        v-model="dispatchForm.assignee"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                        <option value="">请选择</option>
                        <option>张伟</option>
                        <option>李明</option>
                        <option>王强</option>
                        <option>赵刚</option>
                    </select></div>
                <div><label class="text-xs text-dim mb-1 block">优先级</label><select v-model="dispatchForm.priority"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                        <option>高</option>
                        <option>中</option>
                        <option>低</option>
                    </select></div>
                <div><label class="text-xs text-dim mb-1 block">备注</label><textarea v-model="dispatchForm.remark"
                        rows="2"
                        class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary resize-none"
                        placeholder="可选备注"></textarea></div>
            </div>
        </ModalDialog>
        <ToastNotify ref="toast" />
    </div>
</template>
