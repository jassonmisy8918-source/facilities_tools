<script setup lang="ts">
import { ref } from 'vue'
import { TrendingUp } from 'lucide-vue-next'

const activeFunc = ref('concentration')
const funcTabs = [
    { key: 'concentration', label: '进出水浓度' },
    { key: 'defect', label: '管道缺陷' },
    { key: 'intrusion', label: '外水入侵' },
    { key: 'cross', label: '雨污混接' },
]

const concentration = ref({
    inWater: [{ indicator: 'COD', value: 280, unit: 'mg/L' }, { indicator: 'BOD', value: 150, unit: 'mg/L' }, { indicator: 'SS', value: 200, unit: 'mg/L' }, { indicator: 'NH₃-N', value: 32, unit: 'mg/L' }],
    outWater: [{ indicator: 'COD', value: 28, unit: 'mg/L' }, { indicator: 'BOD', value: 8, unit: 'mg/L' }, { indicator: 'SS', value: 10, unit: 'mg/L' }, { indicator: 'NH₃-N', value: 3, unit: 'mg/L' }],
})
const defectStats = ref({
    types: [{ name: '淤积', count: 45 }, { name: '堵塞', count: 28 }, { name: '破裂', count: 18 }, { name: '变形', count: 12 }, { name: '腐蚀', count: 22 }],
    grades: [{ name: '一级', count: 48 }, { name: '二级', count: 52 }, { name: '三级', count: 38 }, { name: '四级', count: 22 }],
})
const intrusionStats = ref({
    types: [{ name: '地下水', count: 35, volume: 1200 }, { name: '河水', count: 12, volume: 800 }, { name: '雨水', count: 28, volume: 650 }],
})
const crossStats = ref({
    systems: [{ type: '雨混污', length: 12.5 }, { type: '污混雨', length: 8.2 }, { type: '合流制', length: 5.8 }],
    points: [{ area: '雨花', count: 15 }, { area: '洞井', count: 8 }, { area: '黎托街道', count: 12 }, { area: '左家塘', count: 6 }],
})
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>
        <template v-if="activeFunc === 'concentration'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingUp class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">污水厂进出水浓度</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">进水浓度</span>
                    <div class="space-y-2">
                        <div v-for="i in concentration.inWater" :key="i.indicator" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-12">{{ i.indicator }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-warning rounded-full"
                                    :style="{ width: Math.min(i.value / 3, 100) + '%' }"></div>
                            </div><span class="text-[10px] text-default font-bold">{{ i.value }}{{ i.unit }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">出水浓度</span>
                    <div class="space-y-2">
                        <div v-for="o in concentration.outWater" :key="o.indicator" class="flex items-center gap-2">
                            <span class="text-[10px] text-dim w-12">{{ o.indicator }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-success rounded-full"
                                    :style="{ width: Math.min(o.value / 3, 100) + '%' }"></div>
                            </div><span class="text-[10px] text-success font-bold">{{ o.value }}{{ o.unit }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="activeFunc === 'defect'">
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">缺陷种类</span>
                    <div class="space-y-1.5">
                        <div v-for="d in defectStats.types" :key="d.name" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-8">{{ d.name }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full"
                                    :style="{ width: (d.count / 52 * 100) + '%' }"></div>
                            </div><span class="text-[10px] font-bold">{{ d.count }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">缺陷等级</span>
                    <div class="space-y-1.5">
                        <div v-for="g in defectStats.grades" :key="g.name" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-8">{{ g.name }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full rounded-full"
                                    :class="g.name === '四级' ? 'bg-danger' : g.name === '三级' ? 'bg-warning' : 'bg-primary'"
                                    :style="{ width: (g.count / 52 * 100) + '%' }"></div>
                            </div><span class="text-[10px] font-bold">{{ g.count }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="activeFunc === 'intrusion'">
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <span class="text-xs font-bold text-default block mb-2">外水入侵统计</span>
                <div class="space-y-3">
                    <div v-for="t in intrusionStats.types" :key="t.name" class="flex items-center gap-3"><span
                            class="text-[10px] text-default w-14 font-medium">{{ t.name }}</span>
                        <div class="flex-1">
                            <div class="flex gap-2">
                                <div class="flex-1">
                                    <p class="text-[10px] text-dim mb-0.5">事件数</p>
                                    <div class="h-3 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full bg-primary rounded-full"
                                            :style="{ width: (t.count / 35 * 100) + '%' }"></div>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-[10px] text-dim mb-0.5">入侵量(m³/d)</p>
                                    <div class="h-3 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full bg-warning rounded-full"
                                            :style="{ width: (t.volume / 1200 * 100) + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div><span class="text-[10px] font-bold text-default w-16 text-right">{{ t.count }}次/{{
                            t.volume }}</span>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="activeFunc === 'cross'">
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">混接系统长度(km)</span>
                    <div class="space-y-1.5">
                        <div v-for="s in crossStats.systems" :key="s.type" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-14">{{ s.type }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full"
                                    :style="{ width: (s.length / 12.5 * 100) + '%' }"></div>
                            </div><span class="text-[10px] font-bold">{{ s.length }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">区域混接点数</span>
                    <div class="space-y-1.5">
                        <div v-for="p in crossStats.points" :key="p.area" class="flex items-center gap-2"><span
                                class="text-[10px] text-dim w-8">{{ p.area }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-warning rounded-full"
                                    :style="{ width: (p.count / 15 * 100) + '%' }"></div>
                            </div><span class="text-[10px] font-bold">{{ p.count }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
