<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import {
    Database, BarChart3, GitCompare, Download,
    Upload, Eye, Calendar
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 功能模块 Tab =====================
const subTabs = [
    { key: 'data', label: '数据管理', icon: Database },
    { key: 'stats', label: '统计分析', icon: BarChart3 },
    { key: 'compare', label: '版本对比', icon: GitCompare },
]
const activeSubTab = ref('data')

// ===================== 普查成果数据管理 =====================
const censusDatasets = ref([
    { id: 1, name: '2024年排水管网普查', area: '全域', type: '管网数据', total: 15680, status: '已入库', date: '2024-03-01', source: '第三方普查' },
    { id: 2, name: '2024年检查井普查', area: '全域', type: '设施数据', total: 12456, status: '已入库', date: '2024-02-20', source: '第三方普查' },
    { id: 3, name: '2024年泵站普查', area: '全域', type: '设施数据', total: 18, status: '已入库', date: '2024-02-15', source: '自查' },
    { id: 4, name: '2023年补充普查', area: '朝阳区', type: '补充数据', total: 2340, status: '待审核', date: '2024-01-10', source: '补充采集' },
    { id: 5, name: '2023年排水户调查', area: '全域', type: '用户数据', total: 3420, status: '已入库', date: '2023-12-20', source: '入户调查' },
])

// ===================== 版本对比 =====================
const compareVersions = ref([
    { field: '管网总长度', v2024: '2,847 km', v2023: '2,612 km', change: '+235 km', trend: 'up' },
    { field: '检查井数量', v2024: '12,456 座', v2023: '11,890 座', change: '+566', trend: 'up' },
    { field: '雨水口数量', v2024: '8,234 个', v2023: '7,645 个', change: '+589', trend: 'up' },
    { field: '泵站数量', v2024: '18 座', v2023: '16 座', change: '+2', trend: 'up' },
    { field: '排放口数量', v2024: '89 个', v2023: '92 个', change: '-3', trend: 'down' },
    { field: '监测设备', v2024: '156 台', v2023: '98 台', change: '+58', trend: 'up' },
    { field: '管网缺陷率', v2024: '4.7%', v2023: '6.2%', change: '-1.5%', trend: 'down' },
])

// ===================== 统计图表 =====================
const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            legend: { data: ['管网', '检查井', '雨水口', '其他'], textStyle: { color: 'var(--text-dim)', fontSize: 10 }, top: 0 },
            grid: { top: 35, right: 20, bottom: 30, left: 50 },
            xAxis: { type: 'category', data: ['朝阳', '海淀', '西城', '东城', '丰台'], axisLabel: { color: 'var(--text-dim)', fontSize: 10 } },
            yAxis: { type: 'value', axisLabel: { color: 'var(--text-dim)', fontSize: 10 }, splitLine: { lineStyle: { color: 'var(--border-themed)', type: 'dashed' } } },
            series: [
                { name: '管网', type: 'bar', data: [3200, 2800, 2400, 2100, 1956], itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
                { name: '检查井', type: 'bar', data: [2100, 1900, 1600, 1400, 1234], itemStyle: { color: '#00D4AA', borderRadius: [3, 3, 0, 0] } },
                { name: '雨水口', type: 'bar', data: [1500, 1300, 1200, 1100, 1020], itemStyle: { color: '#FFB020', borderRadius: [3, 3, 0, 0] } },
                { name: '其他', type: 'bar', data: [400, 350, 300, 280, 250], itemStyle: { color: '#8B5CF6', borderRadius: [3, 3, 0, 0] } },
            ],
        })
        window.addEventListener('resize', () => chart?.resize())
    }
})
onUnmounted(() => { chart?.dispose(); chart = null })

function handleImport() { toast.value?.show('请选择普查成果文件...', 'info') }
function handleExport() { toast.value?.show('普查数据导出中...', 'info') }
function viewDetail(name: string) { toast.value?.show(`查看：${name}`, 'info') }
</script>

<template>
    <div class="space-y-4">
        <!-- 子功能 Tab -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
                <button v-for="tab in subTabs" :key="tab.key" @click="activeSubTab = tab.key"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
                    :class="activeSubTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="tab.icon" class="w-3.5 h-3.5" />{{ tab.label }}
                </button>
            </div>
            <div class="flex items-center gap-2">
                <button @click="handleImport"
                    class="flex items-center gap-1 px-3 py-1.5 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                    <Upload class="w-3.5 h-3.5" />导入
                </button>
                <button @click="handleExport"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
        </div>

        <!-- 数据管理 -->
        <template v-if="activeSubTab === 'data'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">普查项目</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">区域</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">数据类型</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">记录数</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">来源</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">入库日期</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ds in censusDatasets" :key="ds.id"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-xs font-medium text-default">{{ ds.name }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ ds.area }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ ds.type }}</td>
                            <td class="px-4 py-2.5 text-xs text-default">{{ ds.total.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ ds.source }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ ds.date }}</td>
                            <td class="px-4 py-2.5">
                                <span class="text-[10px] px-2 py-0.5 rounded-md"
                                    :class="ds.status === '已入库' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'">{{
                                        ds.status }}</span>
                            </td>
                            <td class="px-4 py-2.5">
                                <button @click="viewDetail(ds.name)"
                                    class="text-xs text-primary hover:underline cursor-pointer flex items-center gap-0.5">
                                    <Eye class="w-3 h-3" />查看
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 统计分析 -->
        <template v-if="activeSubTab === 'stats'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <p class="text-xs text-dim mb-1">普查项目</p>
                    <p class="text-xl font-bold text-default">{{ censusDatasets.length }}</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <p class="text-xs text-dim mb-1">数据总量</p>
                    <p class="text-xl font-bold text-primary">{{censusDatasets.reduce((s, d) => s + d.total,
                        0).toLocaleString()}}</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <p class="text-xs text-dim mb-1">已入库</p>
                    <p class="text-xl font-bold text-success">{{censusDatasets.filter(d => d.status === '已入库').length
                    }}</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <p class="text-xs text-dim mb-1">待审核</p>
                    <p class="text-xl font-bold text-warning">{{censusDatasets.filter(d => d.status === '待审核').length
                    }}</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <h3 class="text-sm font-semibold text-default mb-3">各区域设施分布</h3>
                <div ref="chartRef" class="h-72"></div>
            </div>
        </template>

        <!-- 版本对比 -->
        <template v-if="activeSubTab === 'compare'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 mb-4">
                <div class="flex items-center gap-3 text-xs text-dim">
                    <Calendar class="w-4 h-4 text-primary" />
                    <span>对比版本：</span>
                    <span class="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">2024年Q1普查</span>
                    <span>vs</span>
                    <span class="px-2 py-1 bg-surface text-default rounded-md font-medium">2023年普查</span>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-themed">
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">指标</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">2024年</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">2023年</th>
                            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">变化</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in compareVersions" :key="row.field"
                            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-xs font-medium text-default">{{ row.field }}</td>
                            <td class="px-4 py-2.5 text-xs text-primary font-medium">{{ row.v2024 }}</td>
                            <td class="px-4 py-2.5 text-xs text-dim">{{ row.v2023 }}</td>
                            <td class="px-4 py-2.5 text-xs font-medium"
                                :class="row.trend === 'up' ? 'text-success' : 'text-warning'">
                                {{ row.change }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <ToastNotify ref="toast" />
    </div>
</template>
