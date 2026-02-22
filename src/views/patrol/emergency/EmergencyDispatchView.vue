<script setup lang="ts">
import { ref } from 'vue'
import { Truck, Clock, Users, Package } from 'lucide-vue-next'

const activeFunc = ref('dispatch')
const funcTabs = [
    { key: 'dispatch', label: '资源调度优化' },
    { key: 'response', label: '响应时间统计' },
]

// 调度
const resources = ref([
    {
        type: '人员', items: [
            { name: 'A班应急组', location: '朝阳区基地', distance: '2.5km', time: '15min', available: true, members: 4, skills: '管网抢修/排水' },
            { name: 'B班应急组', location: '西城区基地', distance: '5.8km', time: '25min', available: true, members: 3, skills: '管网抢修/水质' },
            { name: 'C班应急组', location: '丰台区基地', distance: '8.2km', time: '35min', available: false, members: 4, skills: '泵站运维/排水' },
        ]
    },
    {
        type: '设备', items: [
            { name: '移动泵车-01', location: '朝阳区仓库', distance: '3km', time: '20min', available: true, members: 0, skills: '排量: 500m³/h' },
            { name: '移动泵车-02', location: '西城区仓库', distance: '6km', time: '30min', available: true, members: 0, skills: '排量: 300m³/h' },
            { name: 'CCTV检测车', location: '通州区车库', distance: '12km', time: '45min', available: true, members: 0, skills: 'DN200-1000管道检测' },
        ]
    },
    {
        type: '物资', items: [
            { name: '沙袋(朝阳库)', location: '朝阳区仓库', distance: '3km', time: '20min', available: true, members: 0, skills: '库存: 500袋' },
            { name: '管材(中心库)', location: '中心仓库', distance: '7km', time: '30min', available: true, members: 0, skills: 'DN200-600各规格' },
            { name: '应急照明', location: '朝阳区仓库', distance: '3km', time: '20min', available: true, members: 0, skills: '库存: 20套' },
        ]
    },
])

// 响应时间
const responseStats = ref([
    { event: '暴雨内涝-03.15', type: '自然灾害', reportTime: '06:00', dispatchTime: '06:08', arriveTime: '06:25', resolveTime: '09:30', reportToDispatch: 8, dispatchToArrive: 17, arriveToResolve: 185, total: 210 },
    { event: '管网冒溢-03.10', type: '设施故障', reportTime: '14:30', dispatchTime: '14:35', arriveTime: '14:55', resolveTime: '16:20', reportToDispatch: 5, dispatchToArrive: 20, arriveToResolve: 85, total: 110 },
    { event: '水质异常-03.05', type: '环境事件', reportTime: '10:00', dispatchTime: '10:15', arriveTime: '10:45', resolveTime: '14:00', reportToDispatch: 15, dispatchToArrive: 30, arriveToResolve: 195, total: 240 },
    { event: '泵站故障-02.28', type: '设施故障', reportTime: '22:00', dispatchTime: '22:05', arriveTime: '22:30', resolveTime: '23:15', reportToDispatch: 5, dispatchToArrive: 25, arriveToResolve: 45, total: 75 },
])

const avgStats = ref({ reportToDispatch: 8, dispatchToArrive: 23, arriveToResolve: 128, total: 159 })
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <!-- 资源调度 -->
        <template v-if="activeFunc === 'dispatch'">
            <div v-for="r in resources" :key="r.type"
                class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <component :is="r.type === '人员' ? Users : r.type === '设备' ? Truck : Package"
                        class="w-4 h-4 text-primary" />
                    <span class="text-xs font-bold text-default">{{ r.type }}资源</span>
                    <span class="text-[10px] text-dim">可用 {{r.items.filter(i => i.available).length}}/{{
                        r.items.length }}</span>
                </div>
                <div class="p-3 space-y-2">
                    <div v-for="item in r.items" :key="item.name"
                        class="flex items-center justify-between p-3 rounded-lg bg-surface">
                        <div class="flex items-center gap-3">
                            <span class="w-2 h-2 rounded-full"
                                :class="item.available ? 'bg-success' : 'bg-gray-400'"></span>
                            <div>
                                <p class="text-xs font-medium text-default">{{ item.name }}</p>
                                <p class="text-[10px] text-dim">{{ item.skills }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 text-[10px]">
                            <div class="text-right">
                                <p class="text-dim">距离</p>
                                <p class="text-default font-bold">{{ item.distance }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-dim">预计到达</p>
                                <p class="text-primary font-bold">{{ item.time }}</p>
                            </div>
                            <button class="px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                                :class="item.available ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-surface text-dim'"
                                :disabled="!item.available">{{ item.available ? '调度' : '不可用' }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- 响应时间 -->
        <template v-if="activeFunc === 'response'">
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-primary">{{ avgStats.reportToDispatch }}<span
                            class="text-xs text-dim">min</span></p>
                    <p class="text-[10px] text-dim">平均响应</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-info">{{ avgStats.dispatchToArrive }}<span
                            class="text-xs text-dim">min</span></p>
                    <p class="text-[10px] text-dim">平均到达</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-warning">{{ avgStats.arriveToResolve }}<span
                            class="text-xs text-dim">min</span></p>
                    <p class="text-[10px] text-dim">平均处置</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <p class="text-2xl font-bold text-success">{{ avgStats.total }}<span
                            class="text-xs text-dim">min</span></p>
                    <p class="text-[10px] text-dim">平均总耗时</p>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                    <Clock class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">各环节耗时明细</span>
                </div>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">事件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">上报→调度</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">调度→到达</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">到达→处置</th>
                            <th class="text-center px-3 py-2.5 text-dim font-medium">总耗时</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in responseStats" :key="s.event"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.event }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ s.type }}</td>
                            <td class="text-center px-2 py-2.5"><span class="font-bold"
                                    :class="s.reportToDispatch <= 10 ? 'text-success' : 'text-warning'">{{
                                    s.reportToDispatch }}min</span></td>
                            <td class="text-center px-2 py-2.5"><span class="font-bold"
                                    :class="s.dispatchToArrive <= 30 ? 'text-success' : 'text-warning'">{{
                                    s.dispatchToArrive }}min</span></td>
                            <td class="text-center px-2 py-2.5"><span class="font-bold text-default">{{
                                    s.arriveToResolve }}min</span></td>
                            <td class="text-center px-3 py-2.5"><span class="font-bold"
                                    :class="s.total <= 120 ? 'text-success' : s.total <= 180 ? 'text-warning' : 'text-danger'">{{
                                    s.total }}min</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
