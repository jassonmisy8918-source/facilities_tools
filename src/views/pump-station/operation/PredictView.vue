<script setup lang="ts">
import { ref } from 'vue'
import { Cpu, TrendingUp, AlertTriangle, Settings } from 'lucide-vue-next'

const activeFunc = ref('predict')
const funcTabs = [
    { key: 'predict', label: '预测信息' },
    { key: 'analysis', label: '数据分析' },
    { key: 'suggest', label: '预警建议' },
    { key: 'optimize', label: '参数优化' },
]

const predictions = ref([
    { id: 1, device: '1号水泵', station: '朝阳泵站', metric: '轴承振动', current: '6.2mm/s', trend: '上升', predict: '30天内可能故障', level: '预警', confidence: 82 },
    { id: 2, device: '主电机', station: '西城泵站', metric: '绝缘电阻', current: '15MΩ', trend: '下降', predict: '60天内需保养', level: '提示', confidence: 75 },
    { id: 3, device: '3号水泵', station: '通州泵站', metric: '效率衰减', current: '效率降至82%', trend: '下降', predict: '需检查叶轮', level: '预警', confidence: 88 },
    { id: 4, device: '格栅机', station: '丰台泵站', metric: '电流偏大', current: '链条磨损征兆', trend: '上升', predict: '15天内需更换', level: '告警', confidence: 91 },
])

const analysisData = ref([
    { device: '1号水泵', metric: '振动', values: [5.0, 5.2, 5.5, 5.8, 6.0, 6.2], trend: '持续上升', degradation: '轴承磨损' },
    { device: '主电机', metric: '绝缘', values: [25, 22, 20, 18, 16, 15], trend: '持续下降', degradation: '绝缘老化' },
    { device: '3号水泵', metric: '效率', values: [92, 90, 88, 86, 84, 82], trend: '持续下降', degradation: '叶轮磨损/淤积' },
])

const suggestions = ref([
    { id: 1, device: '格栅机', station: '丰台泵站', level: '告警', suggestion: '建议15天内更换链条，同步检查齿耙磨损', plan: '计划性停机更换', urgency: '高' },
    { id: 2, device: '1号水泵', station: '朝阳泵站', level: '预警', suggestion: '建议30天内更换轴承，检查对中情况', plan: '安排保养工单', urgency: '中' },
    { id: 3, device: '3号水泵', station: '通州泵站', level: '预警', suggestion: '检查叶轮磨损及管道淤积，清洗后评估', plan: '安排巡检', urgency: '中' },
])

const optimizations = ref([
    { id: 1, device: '1号水泵', param: '运行频率', before: '50Hz', after: '47Hz', time: '2024-03-10', effect: '振动降低12%，节能8%', operator: '张伟' },
    { id: 2, device: '主电机', param: '冷却风量', before: '标准', after: '增强', time: '2024-03-08', effect: '温度降低5°C', operator: '李明' },
    { id: 3, device: '3号水泵', param: '启停策略', before: '固定时段', after: '按水位联动', time: '2024-02-20', effect: '空转减少30%', operator: '赵刚' },
])

function levelClass(l: string) { return l === '告警' ? 'bg-danger/10 text-danger' : l === '预警' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'predict'">
            <div class="flex items-center gap-2 mb-1">
                <Cpu class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">设备故障预测</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">指标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">当前值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">趋势</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">预测结果</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">置信度</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in predictions" :key="p.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ p.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ p.metric }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ p.current }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="p.trend === '上升' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                    p.trend === '上升' ? '↑' : '↓' }} {{ p.trend }}</span></td>
                            <td class="px-2 py-2.5 text-default">{{ p.predict }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="levelClass(p.level)">{{ p.level }}</span></td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="p.confidence >= 85 ? 'text-success' : 'text-warning'">{{ p.confidence }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'analysis'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingUp class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">监测数据分析</span>
            </div>
            <div class="space-y-3">
                <div v-for="a in analysisData" :key="a.device + a.metric"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                            a.device }} — {{ a.metric }}</span><span
                            class="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning">{{ a.trend }}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                        <div class="flex-1 flex items-end gap-1 h-10">
                            <div v-for="(v, i) in a.values" :key="i" class="flex-1 bg-primary/20 rounded-t"
                                :style="{ height: (v / Math.max(...a.values) * 100) + '%' }">
                                <div class="w-full bg-primary rounded-t"
                                    :style="{ height: '100%', opacity: 0.4 + i * 0.12 }"></div>
                            </div>
                        </div>
                    </div>
                    <p class="text-[10px] text-dim">退化分析: <span class="text-warning font-medium">{{ a.degradation
                            }}</span></p>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'suggest'">
            <div class="flex items-center gap-2 mb-1">
                <AlertTriangle class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">预警建议</span>
            </div>
            <div class="space-y-3">
                <div v-for="s in suggestions" :key="s.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ s.device
                                }}</span><span class="text-[10px] text-dim">{{ s.station }}</span></div>
                        <div class="flex items-center gap-2"><span class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                :class="levelClass(s.level)">{{ s.level }}</span><span
                                class="text-[10px] px-1.5 py-0.5 rounded"
                                :class="s.urgency === '高' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'">紧急度:
                                {{ s.urgency }}</span></div>
                    </div>
                    <p class="text-[10px] text-default mb-1">💡 {{ s.suggestion }}</p>
                    <p class="text-[10px] text-dim">📋 建议方案: <span class="text-primary">{{ s.plan }}</span></p>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'optimize'">
            <div class="flex items-center gap-2 mb-1">
                <Settings class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">运行参数优化</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">参数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">优化前</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">优化后</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">效果</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作人</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in optimizations" :key="o.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ o.device }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.param }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ o.before }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ o.after }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ o.time }}</td>
                            <td class="px-2 py-2.5 text-success">{{ o.effect }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ o.operator }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
