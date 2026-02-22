<script setup lang="ts">
import { ref } from 'vue'
import { Clock, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-vue-next'

const activeFunc = ref('frequency')
const funcTabs = [
    { key: 'frequency', label: '巡查频率设置' },
    { key: 'priority', label: '优先级设定' },
]

// 频率配置
const frequencies = ref([
    { id: 'FQ-01', target: '主干管网 (DN400+)', level: 'A级', cycle: '季度', frequency: '4次/年', remark: '含人孔、检查井全检' },
    { id: 'FQ-02', target: '次干管网 (DN200-400)', level: 'B级', cycle: '半年', frequency: '2次/年', remark: '重点检查接口和弯头' },
    { id: 'FQ-03', target: '支管网 (DN200以下)', level: 'C级', cycle: '年度', frequency: '1次/年', remark: '抽检30%节点' },
    { id: 'FQ-04', target: '排口设施', level: 'A级', cycle: '月度', frequency: '12次/年', remark: '水质外观及淤积检查' },
    { id: 'FQ-05', target: '泵站前池', level: 'A级', cycle: '周', frequency: '52次/年', remark: '水位、设备运行、格栅' },
    { id: 'FQ-06', target: '低洼易涝点', level: 'S级', cycle: '汛期每日', frequency: '120+次/年', remark: '汛期每日巡查含夜巡' },
])

// 优先级
const priorities = ref([
    { level: 'S', label: '特急', color: 'bg-danger text-white', desc: '暴雨预警/重大积水/管网爆管等紧急情况', response: '30分钟内启动', scenarios: '暴雨橙色以上预警、管网爆管、重大内涝' },
    { level: 'A', label: '紧急', color: 'bg-warning text-white', desc: '设备故障/轻度积水/水质异常等需快速响应', response: '2小时内启动', scenarios: '泵站故障、轻度积水、水质超标报警' },
    { level: 'B', label: '重要', color: 'bg-info/80 text-white', desc: '计划性重点巡查/设备定期检修等', response: '按计划执行', scenarios: '季度/月度例行巡查、设备定检' },
    { level: 'C', label: '普通', color: 'bg-surface text-dim', desc: '日常巡查/数据抄录/环境检查等', response: '按排班执行', scenarios: '日常巡查、抽检、数据补录' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <!-- 频率 -->
        <div v-if="activeFunc === 'frequency'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">巡查频率配置</span>
                </div>
                <button
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />新增配置
                </button>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-4 py-2.5 text-dim font-medium">巡查对象</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">管网等级</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">巡查周期</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">频率</th>
                        <th class="text-left px-4 py-2.5 text-dim font-medium">备注</th>
                        <th class="text-center px-4 py-2.5 text-dim font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="f in frequencies" :key="f.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-default font-medium">{{ f.target }}</td>
                        <td class="text-center px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded font-bold"
                                :class="f.level === 'S级' ? 'bg-danger/10 text-danger' : f.level === 'A级' ? 'bg-warning/10 text-warning' : f.level === 'B级' ? 'bg-info/10 text-info' : 'bg-surface text-dim'">{{
                                f.level }}</span></td>
                        <td class="text-center px-4 py-2.5 text-default">{{ f.cycle }}</td>
                        <td class="text-center px-4 py-2.5 text-primary font-bold">{{ f.frequency }}</td>
                        <td class="px-4 py-2.5 text-dim">{{ f.remark }}</td>
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

        <!-- 优先级 -->
        <div v-if="activeFunc === 'priority'" class="space-y-3">
            <div class="flex items-center gap-2 mb-1">
                <AlertTriangle class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">任务优先级定义</span>
            </div>
            <div v-for="p in priorities" :key="p.level"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-start gap-3">
                    <span class="text-xs px-3 py-1.5 rounded-lg font-bold shrink-0" :class="p.color">{{ p.level }} · {{
                        p.label }}</span>
                    <div class="flex-1">
                        <p class="text-xs text-default font-medium">{{ p.desc }}</p>
                        <div class="flex items-center gap-4 mt-2 text-[10px]">
                            <div><span class="text-dim">响应要求: </span><span class="text-primary font-bold">{{ p.response
                                    }}</span></div>
                            <div><span class="text-dim">适用场景: </span><span class="text-default">{{ p.scenarios }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
