<script setup lang="ts">
import { ref, computed } from 'vue'
import { Activity, BarChart3, TrendingUp } from 'lucide-vue-next'

const activeFunc = ref('logic')
const funcTabs = [
    { key: 'logic', label: '全要素逻辑图' },
    { key: 'stats', label: '防涝设施统计' },
    { key: 'ratio', label: '污/供比分析' },
]

const pipes = ref([
    { name: '主干管A(雨花)', flow: 12500, level: 2.8, load: 83, status: '高负荷' },
    { name: '主干管B(洞井)', flow: 6800, level: 1.6, load: 57, status: '正常' },
    { name: '分支管C(黎托街道)', flow: 7200, level: 3.2, load: 90, status: '超负荷' },
])
const pumps = ref([
    { name: '韶山路泵站', inFlow: 342, outFlow: 338, power: 78, fLevel: 3.2, bLevel: 1.5, load: 85 },
    { name: '圭塘河泵站', inFlow: 518, outFlow: 510, power: 92, fLevel: 2.8, bLevel: 1.2, load: 72 },
])
const plants = ref([
    { name: '洞井浏阳河厂', cap: 12, actual: 10.5, inCOD: 280, outCOD: 28, energy: 0.28, bodRate: 90 },
    { name: '黎托街道厂', cap: 8, actual: 7.2, inCOD: 320, outCOD: 32, energy: 0.31, bodRate: 85 },
])

const statsCats = ['排水户', '检查井', '管网', '污水厂', '泵站', '闸门', '排放口']
const activeCat = ref('排水户')
const statsMap: Record<string, { regions: string[]; vals: number[]; types: { n: string; c: number }[] }> = {
    '排水户': { regions: ['雨花', '洞井', '黎托街道', '左家塘', '侯家塘'], vals: [85, 62, 45, 38, 28], types: [{ n: '工业', c: 52 }, { n: '商业', c: 68 }, { n: '餐饮', c: 45 }, { n: '居民', c: 71 }] },
    '检查井': { regions: ['雨花', '洞井', '黎托街道', '左家塘', '侯家塘'], vals: [1250, 980, 860, 720, 450], types: [{ n: '直线井', c: 2800 }, { n: '转角井', c: 920 }, { n: '三通井', c: 340 }] },
    '管网': { regions: ['雨花', '洞井', '黎托街道', '左家塘', '侯家塘'], vals: [320, 280, 250, 180, 95], types: [{ n: '污水管', c: 580 }, { n: '雨水管', c: 420 }, { n: '合流管', c: 125 }] },
    '污水厂': { regions: ['雨花', '洞井', '黎托街道', '左家塘'], vals: [2, 1, 1, 1], types: [{ n: '大型', c: 2 }, { n: '中型', c: 2 }, { n: '小型', c: 1 }] },
    '泵站': { regions: ['雨花', '洞井', '黎托街道', '左家塘'], vals: [5, 3, 2, 2], types: [{ n: '大型', c: 4 }, { n: '中型', c: 5 }, { n: '小型', c: 4 }] },
    '闸门': { regions: ['雨花', '洞井', '黎托街道', '左家塘'], vals: [8, 5, 6, 4], types: [{ n: '截流闸', c: 12 }, { n: '调节闸', c: 8 }, { n: '防倒流', c: 6 }] },
    '排放口': { regions: ['雨花', '洞井', '黎托街道', '左家塘'], vals: [12, 8, 10, 6], types: [{ n: '雨水口', c: 18 }, { n: '污水口', c: 12 }, { n: '溢流口', c: 10 }] },
}

const ratios = ref([
    { month: '2024-01', supply: 42000, sewage: 33600, ratio: 80.0 },
    { month: '2024-02', supply: 40000, sewage: 33200, ratio: 83.0 },
    { month: '2024-03', supply: 45000, sewage: 37800, ratio: 84.0 },
])

function lc(l: number) { return l >= 90 ? 'text-danger' : l >= 75 ? 'text-warning' : 'text-success' }
const currentStats = computed(() => statsMap[activeCat.value] ?? { regions: [], vals: [1], types: [] })
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'logic'">
            <div class="flex items-center gap-2 mb-1">
                <Activity class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">全要素逻辑图</span>
            </div>
            <span class="text-xs font-bold text-default block mb-2">管网</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">管段</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">流量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">水位</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负荷</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in pipes" :key="p.name" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ p.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ p.flow.toLocaleString() }}
                            </td>
                            <td class="text-center px-2 py-2.5">{{ p.level }}m</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="lc(p.load)">{{ p.load }}%</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="p.status === '超负荷' ? 'bg-danger/10 text-danger' : p.status === '高负荷' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'">{{
                                        p.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span class="text-xs font-bold text-default block mb-2">泵站</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进水</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">出水</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">前水位</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">后水位</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">负荷</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in pumps" :key="s.name" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ s.inFlow }}</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ s.outFlow }}</td>
                            <td class="text-center px-2 py-2.5 text-warning">{{ s.fLevel }}m</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ s.bLevel }}m</td>
                            <td class="text-center px-2 py-2.5 font-bold" :class="lc(s.load)">{{ s.load }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span class="text-xs font-bold text-default block mb-2">污水厂</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">厂站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">处理量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">进/出COD</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">能耗</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">BOD削减率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="f in plants" :key="f.name" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ f.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ f.actual }}/{{ f.cap }}万</td>
                            <td class="text-center px-2 py-2.5">{{ f.inCOD }}→<span class="text-success font-bold">{{
                                f.outCOD }}</span></td>
                            <td class="text-center px-2 py-2.5">{{ f.energy }}kWh/m³</td>
                            <td class="text-center px-2 py-2.5 font-bold"
                                :class="f.bodRate >= 85 ? 'text-success' : 'text-warning'">{{ f.bodRate }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'stats'">
            <div class="flex items-center gap-2 mb-1">
                <BarChart3 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">防涝设施统计</span>
            </div>
            <div class="flex gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto mb-3">
                <button v-for="c in statsCats" :key="c" @click="activeCat = c"
                    class="px-2 py-1 rounded text-[10px] font-medium cursor-pointer whitespace-nowrap"
                    :class="activeCat === c ? 'bg-primary text-white' : 'text-dim hover:bg-hover-themed'">{{ c
                    }}</button>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">区域分布</span>
                    <div class="space-y-1.5">
                        <div v-for="(r, i) in currentStats.regions" :key="r" class="flex items-center gap-2">
                            <span class="text-[10px] text-dim w-8">{{ r }}</span>
                            <div class="flex-1 h-3 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full"
                                    :style="{ width: (currentStats.vals[i]! / Math.max(...currentStats.vals) * 100) + '%' }">
                                </div>
                            </div><span class="text-[10px] font-bold w-10 text-right">{{ currentStats.vals[i]!
                                }}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4"><span
                        class="text-xs font-bold text-default block mb-2">类型占比</span>
                    <div class="space-y-2">
                        <div v-for="t in currentStats.types" :key="t.n" class="flex items-center gap-2">
                            <div class="w-2.5 h-2.5 rounded-full bg-primary"></div><span
                                class="text-[10px] text-default flex-1">{{ t.n }}</span><span
                                class="text-[10px] text-primary font-bold">{{ t.c }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="activeFunc === 'ratio'">
            <div class="flex items-center gap-2 mb-1">
                <TrendingUp class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">污/供比分析</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-center px-3 py-2.5 text-dim font-medium">月份</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">供水量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">污水量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">污/供比</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in ratios" :key="r.month" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="text-center px-3 py-2.5 text-default">{{ r.month }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ r.supply.toLocaleString() }}
                            </td>
                            <td class="text-center px-2 py-2.5 text-warning font-bold">{{ r.sewage.toLocaleString() }}
                            </td>
                            <td class="text-center px-2 py-2.5 text-lg font-bold"
                                :class="r.ratio >= 85 ? 'text-warning' : 'text-success'">{{ r.ratio }}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
