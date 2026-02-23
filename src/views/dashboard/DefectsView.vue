<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const defectTypes = ref([
    { type: '淤积', count: 45, level: '功能', severity: '中' },
    { type: '堵塞', count: 28, level: '功能', severity: '高' },
    { type: '破裂', count: 18, level: '结构', severity: '严重' },
    { type: '变形', count: 12, level: '结构', severity: '中' },
    { type: '腐蚀', count: 22, level: '结构', severity: '中' },
    { type: '渗漏', count: 35, level: '功能', severity: '高' },
])
const defectGrades = ref([
    { grade: '一级(轻微)', count: 48, pct: 30 },
    { grade: '二级(中等)', count: 52, pct: 32.5 },
    { grade: '三级(严重)', count: 38, pct: 23.8 },
    { grade: '四级(紧急)', count: 22, pct: 13.7 },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-2 mb-1">
            <AlertTriangle class="w-4 h-4 text-danger" /><span
                class="text-sm font-semibold text-default">排水设施缺陷统计</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <span class="text-xs font-bold text-default block mb-2">缺陷种类数目</span>
                <div class="space-y-2">
                    <div v-for="d in defectTypes" :key="d.type" class="flex items-center gap-2"><span
                            class="text-[10px] text-dim w-10">{{ d.type }}</span>
                        <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                :class="d.severity === '严重' ? 'bg-danger' : d.severity === '高' ? 'bg-warning' : 'bg-primary'"
                                :style="{ width: (d.count / 45 * 100) + '%' }"></div>
                        </div><span class="text-[10px] font-bold text-default w-8 text-right">{{ d.count }}</span><span
                            class="text-[10px] px-1 py-0.5 rounded"
                            :class="d.level === '功能' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'">{{ d.level
                            }}</span>
                    </div>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <span class="text-xs font-bold text-default block mb-2">缺陷等级分布</span>
                <div class="space-y-3">
                    <div v-for="g in defectGrades" :key="g.grade" class="flex items-center gap-2"><span
                            class="text-[10px] text-default w-20">{{ g.grade }}</span>
                        <div class="flex-1 h-4 bg-surface rounded-full overflow-hidden">
                            <div class="h-full rounded-full"
                                :class="g.grade.includes('紧急') ? 'bg-danger' : g.grade.includes('严重') ? 'bg-warning' : g.grade.includes('中等') ? 'bg-primary' : 'bg-info'"
                                :style="{ width: (g.pct * 2) + '%' }"></div>
                        </div><span class="text-[10px] font-bold text-default">{{ g.count }}({{ g.pct }}%)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
