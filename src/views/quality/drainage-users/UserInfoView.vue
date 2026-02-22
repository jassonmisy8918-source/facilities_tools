<script setup lang="ts">
import { ref } from 'vue'
import { Users, Tag, Upload, BarChart3, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('ledger')
const funcTabs = [
    { key: 'ledger', label: '排水户台账' },
    { key: 'classify', label: '分级分类' },
    { key: 'io', label: '导入/导出' },
    { key: 'dashboard', label: '统计看板' },
]

const users = ref([
    { id: 1, name: '朝阳工业园A厂', type: '工业', category: 'A类', level: '重点', permit: 'PW-2024-001', volume: '800m³/日', quality: 'COD≤500', expiry: '2025-03-01', status: '正常' },
    { id: 2, name: '海淀科技大厦', type: '商业', category: 'B类', level: '一般', permit: 'PW-2024-015', volume: '120m³/日', quality: 'COD≤300', expiry: '2025-06-15', status: '正常' },
    { id: 3, name: '通州化工厂', type: '工业', category: 'A类', level: '重点', permit: 'PW-2023-088', volume: '1500m³/日', quality: 'COD≤800', expiry: '2024-12-31', status: '即将到期' },
    { id: 4, name: '西城美食街', type: '餐饮', category: 'C类', level: '一般', permit: 'PW-2024-032', volume: '50m³/日', quality: 'COD≤400', expiry: '2025-08-01', status: '正常' },
    { id: 5, name: '丰台医院', type: '医疗', category: 'A类', level: '重点', permit: 'PW-2024-005', volume: '300m³/日', quality: 'COD≤250', expiry: '2025-04-15', status: '正常' },
    { id: 6, name: '朝阳住宅小区', type: '居民', category: 'D类', level: '普通', permit: '-', volume: '200m³/日', quality: '-', expiry: '-', status: '免许可' },
])

const classifyRules = ref([
    { level: 'A类-重点监管', criteria: '日排水量≥500m³ 或 含特征污染物', count: 3, monitorFreq: '在线监测', inspectFreq: '月巡查' },
    { level: 'B类-一般监管', criteria: '100≤日排水量<500m³', count: 1, monitorFreq: '季度采样', inspectFreq: '季巡查' },
    { level: 'C类-基础监管', criteria: '日排水量<100m³ 且 餐饮/商业', count: 1, monitorFreq: '半年采样', inspectFreq: '半年巡查' },
    { level: 'D类-备案管理', criteria: '居民小区/公共设施', count: 1, monitorFreq: '年抽检', inspectFreq: '年巡查' },
])

const dashboardStats = ref({
    total: 6, byType: [{ type: '工业', count: 2, pct: 33 }, { type: '商业', count: 1, pct: 17 }, { type: '餐饮', count: 1, pct: 17 }, { type: '医疗', count: 1, pct: 17 }, { type: '居民', count: 1, pct: 17 }],
    byLevel: [{ level: '重点', count: 3, color: 'bg-danger' }, { level: '一般', count: 2, color: 'bg-warning' }, { level: '普通', count: 1, color: 'bg-info' }],
    permitStatus: [{ status: '正常', count: 4 }, { status: '即将到期', count: 1 }, { status: '免许可', count: 1 }],
})

function statusClass(s: string) { return s === '正常' ? 'bg-success/10 text-success' : s === '即将到期' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
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

        <template v-if="activeFunc === 'ledger'">
            <div class="flex items-center gap-2 mb-1">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">排水户台账</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-1 py-2.5 text-dim font-medium">分类</th>
                            <th class="text-center px-1 py-2.5 text-dim font-medium">级别</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">许可证号</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">排水量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">水质限值</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">到期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in users" :key="u.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium text-[10px]">{{ u.name }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1 py-0.5 rounded bg-surface text-default">{{ u.type }}</span>
                            </td>
                            <td class="text-center px-1 py-2.5 text-primary font-bold text-[10px]">{{ u.category }}</td>
                            <td class="text-center px-1 py-2.5"><span
                                    class="text-[10px] px-1 py-0.5 rounded font-medium"
                                    :class="u.level === '重点' ? 'bg-danger/10 text-danger' : u.level === '一般' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                    u.level }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px] font-mono">{{ u.permit }}</td>
                            <td class="text-center px-2 py-2.5 text-default text-[10px]">{{ u.volume }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ u.quality }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ u.expiry }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="statusClass(u.status)">{{ u.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'classify'">
            <div class="flex items-center gap-2 mb-1">
                <Tag class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">排水户分级分类</span>
            </div>
            <div class="space-y-3">
                <div v-for="c in classifyRules" :key="c.level"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                            c.level }}</span><span class="text-lg font-bold text-primary">{{ c.count }} 户</span></div>
                    <p class="text-[10px] text-dim mb-2">📋 {{ c.criteria }}</p>
                    <div class="flex gap-4 text-[10px]"><span class="text-dim">监测: <span
                                class="text-primary font-bold">{{ c.monitorFreq }}</span></span><span
                            class="text-dim">巡查: <span class="text-default">{{ c.inspectFreq }}</span></span></div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'io'">
            <div class="flex items-center gap-2 mb-1">
                <Upload class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">排水户信息导入/导出</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-colors"
                    @click="toast?.show('请选择导入文件', 'info')">
                    <Upload class="w-8 h-8 text-primary" />
                    <span class="text-xs font-bold text-default">批量导入</span>
                    <p class="text-[10px] text-dim text-center">支持 Excel(.xlsx) 格式<br>包含排水户基本信息、许可信息</p>
                    <button
                        class="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">选择文件</button>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-success transition-colors"
                    @click="toast?.show('排水户信息已导出', 'success')">
                    <Download class="w-8 h-8 text-success" />
                    <span class="text-xs font-bold text-default">批量导出</span>
                    <p class="text-[10px] text-dim text-center">导出当前所有排水户信息<br>包含台账、许可、分级分类</p>
                    <button
                        class="px-4 py-2 bg-success text-white rounded-lg text-xs font-medium hover:opacity-90 cursor-pointer">导出
                        Excel</button>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'dashboard'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">排水户统计看板</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-3xl font-bold text-primary">{{ dashboardStats.total }}</p>
                    <p class="text-[10px] text-dim">排水户总数</p>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-2">按类型</span>
                    <div class="space-y-1">
                        <div v-for="t in dashboardStats.byType" :key="t.type" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-10">{{ t.type }}</span>
                            <div class="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full" :style="{ width: t.pct + '%' }"></div>
                            </div><span class="text-[10px] text-default font-bold">{{ t.count }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-2">按监管级别</span>
                    <div class="space-y-2">
                        <div v-for="l in dashboardStats.byLevel" :key="l.level" class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full" :class="l.color"></div><span
                                class="text-[10px] text-default flex-1">{{ l.level }}</span><span
                                class="text-xs font-bold text-default">{{ l.count }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
