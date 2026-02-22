<script setup lang="ts">
import { ref } from 'vue'
import { Search, CheckCircle, XCircle, MessageSquare } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const pendingAlarms = ref([
    { id: 1, level: 'critical', title: '建设大道DN300水位超限', location: '建设大道DN300 监测点#06', time: '2024-03-15 14:23', value: '2.35m (阈值: 2.0m)', type: '水位超限', result: '' },
    { id: 2, level: 'warning', title: '西城区进水口COD超标', location: '西城区进水口 WQ-302', time: '2024-03-15 13:45', value: '45mg/L (阈值: 40mg/L)', type: '水质超标', result: '' },
    { id: 6, level: 'critical', title: '和平路泵站进水位超高', location: '和平路泵站 前池', time: '2024-03-15 09:30', value: '4.1m (阈值: 3.8m)', type: '水位超限', result: '' },
    { id: 7, level: 'warning', title: '通州区雨量站降雨超限', location: '通州区雨量站 RG-2003', time: '2024-03-15 08:45', value: '12.6mm/h (阈值: 10mm/h)', type: '雨量预警', result: '' },
])

const judgedAlarms = ref([
    { id: 3, level: 'warning', title: '民生路DN400水位预警', time: '2024-03-15 12:30', result: 'confirmed', judgement: '确认为真实报警，上游来水增大导致', operator: '张工', judgeTime: '2024-03-15 12:35' },
    { id: 4, level: 'info', title: '丰台区降雨量增加', time: '2024-03-15 11:20', result: 'false', judgement: '误报，传感器数据抖动', operator: '李工', judgeTime: '2024-03-15 11:30' },
])

function getLevelClass(l: string) { return l === 'critical' ? 'bg-danger text-white' : l === 'warning' ? 'bg-warning text-white' : l === 'info' ? 'bg-info/20 text-info' : 'bg-surface text-dim' }
function getLevelText(l: string) { return l === 'critical' ? '紧急' : l === 'warning' ? '严重' : l === 'info' ? '一般' : '提示' }

// 研判操作
const showJudgePanel = ref(false)
const currentAlarm = ref<typeof pendingAlarms.value[0] | null>(null)
const judgeForm = ref({ result: 'confirmed', note: '' })
const judgeResults = [{ key: 'confirmed', label: '确认报警' }, { key: 'false', label: '误报' }, { key: 'pending', label: '待观察' }]

function openJudge(alarm: typeof pendingAlarms.value[0]) { currentAlarm.value = alarm; judgeForm.value = { result: 'confirmed', note: '' }; showJudgePanel.value = true }

function submitJudge() {
    if (!judgeForm.value.note) { toast.value?.show('请填写研判说明', 'warning'); return }
    const alarm = currentAlarm.value!
    judgedAlarms.value.unshift({
        id: alarm.id, level: alarm.level, title: alarm.title, time: alarm.time,
        result: judgeForm.value.result, judgement: judgeForm.value.note, operator: '当前用户', judgeTime: new Date().toLocaleString(),
    })
    pendingAlarms.value = pendingAlarms.value.filter(a => a.id !== alarm.id)
    showJudgePanel.value = false
    toast.value?.show(`报警 "${alarm.title}" 研判完成`, 'success')
}
</script>

<template>
    <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
            <!-- 待研判 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Search class="w-4 h-4 text-warning" /><span
                            class="text-sm font-semibold text-default">待研判报警</span><span
                            class="text-xs text-muted-themed">({{ pendingAlarms.length }})</span>
                    </div>
                </div>
                <div class="p-3 space-y-2 max-h-96 overflow-y-auto">
                    <div v-for="a in pendingAlarms" :key="a.id" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-start justify-between">
                            <div class="flex items-start gap-2">
                                <span class="text-[10px] px-1.5 py-0.5 rounded mt-0.5 shrink-0"
                                    :class="getLevelClass(a.level)">{{ getLevelText(a.level) }}</span>
                                <div>
                                    <p class="text-xs font-medium text-default">{{ a.title }}</p>
                                    <p class="text-[10px] text-dim mt-0.5">{{ a.location }}</p>
                                    <p class="text-[10px] text-muted-themed mt-0.5">{{ a.time }} · {{ a.value }}</p>
                                </div>
                            </div>
                            <button @click="openJudge(a)"
                                class="px-2.5 py-1 bg-primary text-white rounded text-[10px] font-medium hover:bg-primary-light transition-colors cursor-pointer shrink-0">研判</button>
                        </div>
                    </div>
                    <div v-if="pendingAlarms.length === 0" class="text-center py-8 text-dim text-xs">暂无待研判报警</div>
                </div>
            </div>

            <!-- 已研判 -->
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <MessageSquare class="w-4 h-4 text-success" /><span
                        class="text-sm font-semibold text-default">已研判记录</span><span
                        class="text-xs text-muted-themed">({{ judgedAlarms.length }})</span>
                </div>
                <div class="p-3 space-y-2 max-h-96 overflow-y-auto">
                    <div v-for="a in judgedAlarms" :key="a.id" class="p-3 rounded-lg bg-surface">
                        <div class="flex items-center justify-between mb-1.5">
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] px-1.5 py-0.5 rounded" :class="getLevelClass(a.level)">{{
                                    getLevelText(a.level) }}</span>
                                <span class="text-xs font-medium text-default">{{ a.title }}</span>
                            </div>
                            <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                                :class="a.result === 'confirmed' ? 'bg-danger/10 text-danger' : a.result === 'false' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                    a.result === 'confirmed' ? '确认报警' : a.result === 'false' ? '误报' : '待观察' }}</span>
                        </div>
                        <p class="text-[11px] text-default">{{ a.judgement }}</p>
                        <p class="text-[10px] text-muted-themed mt-1">{{ a.operator }} · {{ a.judgeTime }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 研判面板 -->
        <div v-if="showJudgePanel" class="bg-card border-2 border-primary/30 rounded-xl shadow-themed p-4">
            <h4 class="text-sm font-semibold text-default mb-3">报警研判 — {{ currentAlarm?.title }}</h4>
            <div class="grid grid-cols-2 gap-4">
                <div class="p-3 rounded-lg bg-surface text-xs space-y-1">
                    <p><span class="text-dim">报警点位: </span><span class="text-default">{{ currentAlarm?.location
                            }}</span></p>
                    <p><span class="text-dim">报警时间: </span><span class="text-default">{{ currentAlarm?.time }}</span>
                    </p>
                    <p><span class="text-dim">监测值: </span><span class="text-default font-bold">{{ currentAlarm?.value
                            }}</span></p>
                    <p><span class="text-dim">报警类型: </span><span class="text-default">{{ currentAlarm?.type }}</span>
                    </p>
                </div>
                <div class="space-y-3">
                    <div><label class="text-xs text-dim mb-1 block">研判结论</label>
                        <div class="flex gap-2">
                            <button v-for="r in judgeResults" :key="r.key" @click="judgeForm.result = r.key"
                                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                                :class="judgeForm.result === r.key ? 'bg-primary text-white' : 'bg-surface text-dim hover:text-default'">{{
                                r.label }}</button>
                        </div>
                    </div>
                    <div><label class="text-xs text-dim mb-1 block">研判说明 <span
                                class="text-danger">*</span></label><textarea v-model="judgeForm.note" rows="3"
                            class="w-full bg-input border border-themed rounded-lg px-3 py-2 text-xs text-default focus:outline-none focus:border-primary resize-none"
                            placeholder="请输入研判依据和说明"></textarea></div>
                    <div class="flex gap-2">
                        <button @click="submitJudge"
                            class="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer flex items-center gap-1">
                            <CheckCircle class="w-3 h-3" /> 提交研判
                        </button>
                        <button @click="showJudgePanel = false"
                            class="px-4 py-1.5 bg-surface text-dim rounded-lg text-xs hover:text-default transition-colors cursor-pointer flex items-center gap-1">
                            <XCircle class="w-3 h-3" /> 取消
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <ToastNotify ref="toast" />
    </div>
</template>
