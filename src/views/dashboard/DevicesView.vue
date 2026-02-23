<script setup lang="ts">
import { ref } from 'vue'
import { Radio, Target } from 'lucide-vue-next'

const activeFunc = ref('equip')
const funcTabs = [{ key: 'equip', label: '监测设备统计' }, { key: 'object', label: '监测对象统计' }]

const equipStats = ref([
    { type: '流量设备', total: 85, online: 80, offline: 5, rate: 94.1 },
    { type: '液位设备', total: 62, online: 58, offline: 4, rate: 93.5 },
    { type: '水质设备', total: 28, online: 25, offline: 3, rate: 89.3 },
    { type: '降雨设备', total: 35, online: 34, offline: 1, rate: 97.1 },
])
const objectStats = ref([
    { type: '管道', count: 1125, monitored: 85, coverage: 7.6 },
    { type: '排放口', count: 40, monitored: 28, coverage: 70.0 },
    { type: '闸门', count: 26, monitored: 18, coverage: 69.2 },
    { type: '污水处理厂', count: 5, monitored: 5, coverage: 100 },
    { type: '河道', count: 12, monitored: 8, coverage: 66.7 },
    { type: '易涝点', count: 18, monitored: 15, coverage: 83.3 },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>
        <template v-if="activeFunc === 'equip'">
            <div class="flex items-center gap-2 mb-1">
                <Radio class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">监测设备统计</span>
            </div>
            <div class="grid grid-cols-4 gap-3 mb-3">
                <div v-for="e in equipStats" :key="e.type"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-[10px] text-dim mb-1">{{ e.type }}</p>
                    <p class="text-2xl font-bold text-primary">{{ e.total }}</p>
                    <div class="flex justify-center gap-3 mt-1 text-[10px]"><span class="text-success">在线 {{ e.online
                            }}</span><span class="text-danger">离线 {{ e.offline }}</span></div>
                    <div class="w-full h-1.5 bg-surface rounded-full mt-2 overflow-hidden">
                        <div class="h-full bg-success rounded-full" :style="{ width: e.rate + '%' }"></div>
                    </div>
                    <p class="text-[10px] text-success mt-1">在线率 {{ e.rate }}%</p>
                </div>
            </div>
        </template>
        <template v-if="activeFunc === 'object'">
            <div class="flex items-center gap-2 mb-1">
                <Target class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">监测对象统计</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">对象类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">总数</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">已监测</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">覆盖率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in objectStats" :key="o.type"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ o.type }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.count }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ o.monitored }}</td>
                            <td class="text-center px-2 py-2.5">
                                <div class="flex items-center justify-center gap-1">
                                    <div class="w-12 h-2 bg-surface rounded-full overflow-hidden">
                                        <div class="h-full rounded-full"
                                            :class="o.coverage >= 80 ? 'bg-success' : o.coverage >= 50 ? 'bg-warning' : 'bg-danger'"
                                            :style="{ width: o.coverage + '%' }"></div>
                                    </div><span class="text-[10px] font-bold"
                                        :class="o.coverage >= 80 ? 'text-success' : o.coverage >= 50 ? 'text-warning' : 'text-danger'">{{
                                        o.coverage }}%</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
