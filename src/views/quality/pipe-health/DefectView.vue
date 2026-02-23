<script setup lang="ts">
import { ref } from 'vue'
import { Search, Tag, Image, Cpu, BarChart3, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('detect')
const funcTabs = [
    { key: 'detect', label: '缺陷检测' },
    { key: 'defects', label: '缺陷台账' },
    { key: 'ai', label: 'AI识别' },
    { key: 'stats', label: '统计报表' },
]

const detections = ref([
    { id: 1, pipe: 'P-CD-001', method: 'CCTV', location: '圭塘街道万家丽路', length: '320m', defects: 8, date: '2024-03-15', operator: '张伟', status: '已完成' },
    { id: 2, pipe: 'P-HD-003', method: '声呐', location: '洞井街道浏阳河路', length: '180m', defects: 3, date: '2024-03-14', operator: '李明', status: '已完成' },
    { id: 3, pipe: 'P-TZ-002', method: 'CCTV', location: '黎托街道浏阳河段', length: '450m', defects: 12, date: '2024-03-12', operator: '赵刚', status: '已完成' },
    { id: 4, pipe: 'P-FT-005', method: 'CCTV', location: '左家塘街道南三环', length: '200m', defects: 0, date: '2024-03-10', operator: '王强', status: '检测中' },
])

const defectList = ref([
    { id: 1, pipe: 'P-CD-001', mark: '★', type: '结构性', name: '纵向裂缝', position: '45.2m', severity: '严重', grade: 4, size: '长1.2m/宽3mm', photos: 3, trend: '扩展', assessment: '需立即修复' },
    { id: 2, pipe: 'P-CD-001', mark: '', type: '功能性', name: '沉积物', position: '78.5m', severity: '中等', grade: 2, size: '管径占比30%', photos: 2, trend: '稳定', assessment: '需清淤' },
    { id: 3, pipe: 'P-TZ-002', mark: '★', type: '结构性', name: '管壁变形', position: '120.8m', severity: '严重', grade: 4, size: '变形率15%', photos: 4, trend: '发展', assessment: '需尽快修复' },
    { id: 4, pipe: 'P-TZ-002', mark: '', type: '结构性', name: '接口错位', position: '156.3m', severity: '轻微', grade: 1, size: '错位8mm', photos: 1, trend: '稳定', assessment: '观察' },
    { id: 5, pipe: 'P-HD-003', mark: '', type: '功能性', name: '树根侵入', position: '92.1m', severity: '中等', grade: 3, size: '侵入管径20%', photos: 2, trend: '发展', assessment: '需清除' },
    { id: 6, pipe: 'P-TZ-002', mark: '★', type: '结构性', name: '腐蚀', position: '230.5m', severity: '严重', grade: 4, size: '面积0.5m²', photos: 3, trend: '扩展', assessment: '需修复' },
])

const aiResults = ref([
    { type: '结构性缺陷', items: [{ name: '裂缝', detected: 12, accuracy: 95.2 }, { name: '变形', detected: 5, accuracy: 92.8 }, { name: '腐蚀', detected: 8, accuracy: 89.5 }, { name: '接口问题', detected: 6, accuracy: 91.3 }] },
    { type: '功能性缺陷', items: [{ name: '沉积/淤积', detected: 18, accuracy: 96.1 }, { name: '树根侵入', detected: 4, accuracy: 88.7 }, { name: '障碍物', detected: 3, accuracy: 93.5 }] },
])

const statsByType = ref([
    { type: '裂缝', count: 12, pct: 21.4 }, { type: '变形', count: 5, pct: 8.9 }, { type: '腐蚀', count: 8, pct: 14.3 },
    { type: '接口问题', count: 6, pct: 10.7 }, { type: '沉积', count: 18, pct: 32.1 }, { type: '树根侵入', count: 4, pct: 7.1 }, { type: '障碍物', count: 3, pct: 5.4 },
])

const statsByGrade = ref([
    { grade: '1级(轻微)', count: 15, pct: 26.8, color: 'bg-info' },
    { grade: '2级(中等)', count: 18, pct: 32.1, color: 'bg-warning' },
    { grade: '3级(较重)', count: 12, pct: 21.4, color: 'bg-danger/70' },
    { grade: '4级(严重)', count: 11, pct: 19.6, color: 'bg-danger' },
])

function severityClass(s: string) { return s === '严重' ? 'bg-danger/10 text-danger' : s === '中等' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }
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

        <template v-if="activeFunc === 'detect'">
            <div class="flex items-center gap-2 mb-1">
                <Search class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">缺陷检测信息</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方法</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">位置</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">长度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">缺陷数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">检测员</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in detections" :key="d.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono font-bold">{{ d.pipe }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                                    :class="d.method === 'CCTV' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{
                                    d.method }}</span></td>
                            <td class="px-2 py-2.5 text-default">{{ d.location }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.length }}</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="d.defects > 5 ? 'text-danger' : d.defects > 0 ? 'text-warning' : 'text-success'">
                                {{ d.defects }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.date }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.operator }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="d.status === '已完成' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'">{{
                                    d.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'defects'">
            <div class="flex items-center gap-2 mb-1">
                <Tag class="w-4 h-4 text-warning" /><span
                    class="text-sm font-semibold text-default">缺陷台账（含标记/图片/等级/评估）</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-1 py-2.5 text-dim font-medium">标记</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">缺陷</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">位置</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">严重度</th>
                            <th class="text-center px-1 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">尺寸</th>
                            <th class="text-center px-1 py-2.5 text-dim font-medium">
                                <Image class="w-3 h-3 inline" />
                            </th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">趋势</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">评估</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in defectList" :key="d.id" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ d.pipe }}</td>
                            <td class="text-center px-1 py-2.5 text-warning">{{ d.mark }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px] px-1 py-0.5 rounded"
                                    :class="d.type === '结构性' ? 'bg-danger/10 text-danger' : 'bg-info/10 text-info'">{{
                                    d.type }}</span></td>
                            <td class="px-2 py-2.5 text-default font-medium">{{ d.name }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.position }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="severityClass(d.severity)">{{ d.severity }}</span></td>
                            <td class="text-center px-1 py-2.5 font-bold"
                                :class="d.grade >= 4 ? 'text-danger' : d.grade >= 3 ? 'text-warning' : 'text-default'">
                                {{ d.grade }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ d.size }}</td>
                            <td class="text-center px-1 py-2.5 text-info">{{ d.photos }}</td>
                            <td class="text-center px-2 py-2.5"><span class="text-[10px]"
                                    :class="d.trend === '扩展' || d.trend === '发展' ? 'text-danger' : 'text-success'">{{
                                    d.trend }}</span></td>
                            <td class="px-2 py-2.5 text-default text-[10px]">{{ d.assessment }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'ai'">
            <div class="flex items-center gap-2 mb-1">
                <Cpu class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">AI缺陷识别</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div v-for="group in aiResults" :key="group.type"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-3"
                        :class="group.type === '结构性缺陷' ? 'text-danger' : 'text-info'">{{ group.type }}</span>
                    <div class="space-y-2">
                        <div v-for="item in group.items" :key="item.name"
                            class="flex items-center justify-between p-2 bg-surface rounded-lg">
                            <span class="text-[10px] text-default font-medium">{{ item.name }}</span>
                            <div class="flex items-center gap-3"><span class="text-[10px] text-primary font-bold">{{
                                    item.detected }} 处</span><span class="text-[10px] font-bold"
                                    :class="item.accuracy >= 93 ? 'text-success' : 'text-warning'">{{ item.accuracy
                                    }}%</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'stats'">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                    <BarChart3 class="w-4 h-4 text-primary" /><span
                        class="text-sm font-semibold text-default">缺陷统计报表</span>
                </div><button @click="toast?.show('报表已导出', 'success')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出
                </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-3">按缺陷类型</span>
                    <div class="space-y-2">
                        <div v-for="s in statsByType" :key="s.type" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-16">{{ s.type }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full" :style="{ width: s.pct + '%' }"></div>
                            </div><span class="text-[10px] text-default font-bold w-8 text-right">{{ s.count }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-3">按缺陷等级</span>
                    <div class="space-y-2">
                        <div v-for="s in statsByGrade" :key="s.grade" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-20">{{ s.grade }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full" :class="s.color" :style="{ width: s.pct + '%' }"></div>
                            </div><span class="text-[10px] text-default font-bold w-8 text-right">{{ s.count }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
