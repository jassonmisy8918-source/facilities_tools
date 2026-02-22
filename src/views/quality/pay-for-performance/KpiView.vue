<script setup lang="ts">
import { ref } from 'vue'
import { Target, Settings, Eye } from 'lucide-vue-next'

const activeFunc = ref('indicators')
const funcTabs = [
    { key: 'indicators', label: '指标信息' },
    { key: 'model', label: '考核模型' },
    { key: 'detail', label: '体系详情' },
]

const indicators = ref([
    { id: 1, name: '出水COD达标率', category: '水质', weight: 20, unit: '%', target: '≥95%', method: '月均达标天数/总天数×100%', formula: 'S = 达标天数/30×100', status: '启用' },
    { id: 2, name: '出水氨氮达标率', category: '水质', weight: 15, unit: '%', target: '≥95%', method: '月均达标天数/总天数×100%', formula: 'S = 达标天数/30×100', status: '启用' },
    { id: 3, name: '污水处理量完成率', category: '水量', weight: 15, unit: '%', target: '≥90%', method: '实际处理量/合同约定量×100%', formula: 'S = 实际量/计划量×100', status: '启用' },
    { id: 4, name: '污泥规范处置率', category: '污泥', weight: 10, unit: '%', target: '100%', method: '规范处置量/总产泥量×100%', formula: 'S = 规范量/总量×100', status: '启用' },
    { id: 5, name: '设备完好率', category: '运维', weight: 10, unit: '%', target: '≥95%', method: '完好设备数/总设备数×100%', formula: 'S = 完好数/总数×100', status: '启用' },
    { id: 6, name: '单位电耗', category: '能耗', weight: 10, unit: 'kWh/m³', target: '≤0.30', method: '总电耗/处理水量', formula: '实际值/标准值×100', status: '启用' },
    { id: 7, name: '安全生产', category: '安全', weight: 10, unit: '分', target: '100', method: '安全事故扣分制', formula: '100-扣分值', status: '启用' },
    { id: 8, name: '信息化运行', category: '管理', weight: 10, unit: '%', target: '≥90%', method: '数据上报及时率', formula: 'S = 及时率×100', status: '启用' },
])

const modelConfig = ref([
    { level: '优秀', range: '≥90分', payRate: '105%', bonus: '额外奖励5%', color: 'text-success' },
    { level: '良好', range: '80~89分', payRate: '100%', bonus: '全额支付', color: 'text-primary' },
    { level: '合格', range: '70~79分', payRate: '95%', bonus: '扣减5%', color: 'text-warning' },
    { level: '不合格', range: '<70分', payRate: '90%', bonus: '扣减10%+整改', color: 'text-danger' },
])

const detailCategories = ref([
    { category: '水质指标', indicators: 2, totalWeight: 35, desc: '出水COD、氨氮等水质达标率考核，权重最高' },
    { category: '水量指标', indicators: 1, totalWeight: 15, desc: '污水处理量完成情况考核' },
    { category: '污泥管理', indicators: 1, totalWeight: 10, desc: '污泥规范处置率考核' },
    { category: '运维管理', indicators: 1, totalWeight: 10, desc: '设备完好率、维护及时性考核' },
    { category: '能耗管理', indicators: 1, totalWeight: 10, desc: '单位电耗控制考核' },
    { category: '安全管理', indicators: 1, totalWeight: 10, desc: '安全生产扣分制考核' },
    { category: '信息化', indicators: 1, totalWeight: 10, desc: '数据上报及时率考核' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'indicators'">
            <div class="flex items-center gap-2 mb-1">
                <Target class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">绩效指标信息管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">指标名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类别</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">权重</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">目标值</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">计算方法</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in indicators" :key="i.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ i.name }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ i.category
                                    }}</span></td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ i.weight }}%</td>
                            <td class="text-center px-2 py-2.5 text-success font-bold">{{ i.target }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ i.method }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium bg-success/10 text-success">{{
                                    i.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'model'">
            <div class="flex items-center gap-2 mb-1">
                <Settings class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">考核模型配置</span>
            </div>
            <div class="space-y-3">
                <div v-for="m in modelConfig" :key="m.level"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3"><span class="text-sm font-bold" :class="m.color">{{ m.level
                                }}</span><span class="text-[10px] px-2 py-1 rounded bg-surface text-dim">{{ m.range
                                }}</span></div>
                        <div class="text-right">
                            <p class="text-lg font-bold" :class="m.color">{{ m.payRate }}</p>
                            <p class="text-[10px] text-dim">{{ m.bonus }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 mt-3">
                <span class="text-xs font-bold text-default block mb-2">综合评分公式</span>
                <div class="bg-surface rounded-lg p-3 font-mono text-[11px] text-primary">综合得分 = Σ(各指标得分 × 权重%) =
                    COD达标率×20% + 氨氮达标率×15% + 处理量×15% + ...</div>
            </div>
        </template>

        <template v-if="activeFunc === 'detail'">
            <div class="flex items-center gap-2 mb-1">
                <Eye class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">指标体系详情</span>
            </div>
            <div class="space-y-3">
                <div v-for="c in detailCategories" :key="c.category"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-default">{{
                            c.category }}</span>
                        <div class="flex items-center gap-2"><span class="text-[10px] text-dim">{{ c.indicators
                                }}项指标</span><span class="text-xs font-bold text-primary">权重 {{ c.totalWeight }}%</span>
                        </div>
                    </div>
                    <div class="w-full h-2 bg-surface rounded-full overflow-hidden mb-1">
                        <div class="h-full bg-primary rounded-full" :style="{ width: c.totalWeight + '%' }"></div>
                    </div>
                    <p class="text-[10px] text-dim">{{ c.desc }}</p>
                </div>
            </div>
        </template>
    </div>
</template>
