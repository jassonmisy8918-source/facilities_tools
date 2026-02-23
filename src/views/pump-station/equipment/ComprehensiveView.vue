<script setup lang="ts">
import { ref } from 'vue'
import { Database, Target, BarChart3, Trash2, Package } from 'lucide-vue-next'
const activeFunc = ref('catalog')
const funcTabs = [
    { key: 'catalog', label: '分类台账' },
    { key: 'kpi-set', label: 'KPI设定' },
    { key: 'kpi-chart', label: 'KPI可视化' },
    { key: 'scrap', label: '报废管理' },
    { key: 'spare', label: '备品备件' },
]

const catalogData = ref([
    { category: '离心泵', total: 12, running: 8, standby: 2, repair: 1, scrap: 1 },
    { category: '电机', total: 8, running: 6, standby: 1, repair: 1, scrap: 0 },
    { category: '阀门', total: 15, running: 14, standby: 0, repair: 1, scrap: 0 },
    { category: '辅助设备', total: 6, running: 4, standby: 1, repair: 1, scrap: 0 },
    { category: '仪表', total: 10, running: 9, standby: 0, repair: 0, scrap: 1 },
])

const kpiSettings = ref([
    { id: 1, device: '离心泵', metric: '运行效率', target: '≥85%', weight: 30 },
    { id: 2, device: '离心泵', metric: '故障率', target: '≤2次/年', weight: 25 },
    { id: 3, device: '离心泵', metric: '完好率', target: '≥95%', weight: 25 },
    { id: 4, device: '离心泵', metric: '保养及时率', target: '100%', weight: 20 },
    { id: 5, device: '电机', metric: '运行效率', target: '≥90%', weight: 30 },
    { id: 6, device: '电机', metric: '故障率', target: '≤1次/年', weight: 30 },
    { id: 7, device: '阀门', metric: '完好率', target: '≥98%', weight: 50 },
])

const kpiResults = ref([
    { category: '离心泵', efficiency: 88, faultRate: 1.5, healthRate: 96, maintRate: 100, score: 92 },
    { category: '电机', efficiency: 91, faultRate: 0.8, healthRate: 97, maintRate: 100, score: 95 },
    { category: '阀门', efficiency: 95, faultRate: 0.5, healthRate: 99, maintRate: 100, score: 98 },
    { category: '仪表', efficiency: 92, faultRate: 1.2, healthRate: 95, maintRate: 90, score: 88 },
])

const scrapList = ref([
    { id: 1, device: '旧格栅机', category: '辅助设备', station: '左家塘泵站', reason: '超期/锈蚀', apply: '2024-02-10', status: '已归档' },
    { id: 2, device: '液位计LV-02', category: '仪表', station: '洞井泵站', reason: '精度不达标', apply: '2024-03-01', status: '已审批' },
])

const spareData = ref([
    { id: 1, name: '轴承6210', category: '水泵配件', qty: 20, min: 5, location: '仓库A-01', lastIn: '2024-02-20', lastOut: '2024-03-10' },
    { id: 2, name: '密封圈DN200', category: '水泵配件', qty: 50, min: 10, location: '仓库A-02', lastIn: '2024-01-15', lastOut: '2024-03-05' },
    { id: 3, name: '接触器CJX2', category: '电气配件', qty: 8, min: 3, location: '仓库B-01', lastIn: '2024-03-01', lastOut: '2024-03-12' },
    { id: 4, name: '压力表Y-100', category: '仪表', qty: 3, min: 2, location: '仓库B-03', lastIn: '2023-12-10', lastOut: '2024-02-28' },
])

function scoreClass(v: number) { return v >= 95 ? 'text-success' : v >= 85 ? 'text-primary' : 'text-warning' }
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

        <template v-if="activeFunc === 'catalog'">
            <div class="flex items-center gap-2 mb-1">
                <Database class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">分类台账</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">类别</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">总数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">运行</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">备用</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">检修</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">报废</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">完好率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in catalogData" :key="c.category"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ c.category }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ c.total }}</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ c.running }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ c.standby }}</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ c.repair }}</td>
                            <td class="text-center px-2 py-2.5 text-danger">{{ c.scrap }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="scoreClass(((c.running + c.standby) / c.total) * 100)">{{ (((c.running +
                                    c.standby) / c.total) * 100).toFixed(0) }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'kpi-set'">
            <div class="flex items-center gap-2 mb-1">
                <Target class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">设备KPI设定</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备类型</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">指标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">目标值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">权重</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="k in kpiSettings" :key="k.id"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ k.device }}</td>
                            <td class="px-2 py-2.5 text-default">{{ k.metric }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ k.target }}</td>
                            <td class="text-center px-2 py-2.5 text-info">{{ k.weight }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'kpi-chart'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">KPI统计可视化</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="h-32 bg-surface rounded-lg flex items-center justify-center text-xs text-dim">
                    <BarChart3 class="w-5 h-5 mr-2" />雷达图/柱状图（需接入ECharts）
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">类别</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">运行效率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">故障率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">完好率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">保养率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">综合得分</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="k in kpiResults" :key="k.category"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ k.category }}</td>
                            <td class="text-center px-2 py-2.5" :class="scoreClass(k.efficiency)">{{ k.efficiency }}%
                            </td>
                            <td class="text-center px-2 py-2.5 text-default">{{ k.faultRate }}次/年</td>
                            <td class="text-center px-2 py-2.5" :class="scoreClass(k.healthRate)">{{ k.healthRate }}%
                            </td>
                            <td class="text-center px-2 py-2.5" :class="scoreClass(k.maintRate)">{{ k.maintRate }}%</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="scoreClass(k.score)">{{ k.score }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'scrap'">
            <div class="flex items-center gap-2 mb-1">
                <Trash2 class="w-4 h-4 text-danger" /><span class="text-sm font-semibold text-default">设备报废管理</span>
            </div>
            <div class="space-y-3">
                <div v-for="s in scrapList" :key="s.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-default">{{ s.device }}</p>
                        <p class="text-[10px] text-dim">{{ s.category }} · {{ s.station }} · {{ s.reason }}</p>
                    </div>
                    <span class="text-[10px] px-2 py-0.5 rounded font-medium"
                        :class="s.status === '已归档' ? 'bg-surface text-dim' : 'bg-success/10 text-success'">{{ s.status
                        }}</span>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'spare'">
            <div class="flex items-center gap-2 mb-1">
                <Package class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">备品备件管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">分类</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">库存</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最低量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">位置</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最近入库</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">最近出库</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in spareData" :key="s.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.name }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ s.category }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="s.qty <= s.min ? 'text-danger' : 'text-success'">{{ s.qty }}</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ s.min }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ s.location }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ s.lastIn }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ s.lastOut }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
