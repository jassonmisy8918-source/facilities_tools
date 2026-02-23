<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Building2 } from 'lucide-vue-next'

const activeFunc = ref('area')
const funcTabs = [
    { key: 'area', label: '区域基础' },
    { key: 'org', label: '管理主体' },
]

const areaData = ref([
    { name: '圭塘街道', area: 465.1, drainageArea: 312.5, coverage: 67.2, population: 345 },
    { name: '洞井街道', area: 430.8, drainageArea: 285.0, coverage: 66.2, population: 313 },
    { name: '黎托街道', area: 906.3, drainageArea: 420.0, coverage: 46.3, population: 184 },
    { name: '左家塘街道', area: 305.8, drainageArea: 220.0, coverage: 71.9, population: 211 },
    { name: '侯家塘街道', area: 50.7, drainageArea: 48.5, coverage: 95.7, population: 113 },
])

const waterSystems = ref([
    { name: '北运河', length: 42.5, level: '一级', flow: '南→北', basin: 1080, status: '正常' },
    { name: '浏阳河', length: 23.8, level: '二级', flow: '西→东', basin: 210, status: '正常' },
    { name: '凉水河', length: 35.2, level: '二级', flow: '北→南', basin: 580, status: '关注' },
    { name: '通惠河', length: 20.1, level: '二级', flow: '西→东', basin: 140, status: '正常' },
])

const supervisors = ref([
    { name: '市水务局', jurisdiction: '全市', responsibility: '行业监管/规划审批/应急指挥', contact: '010-6520xxxx', staff: 120 },
    { name: '圭塘街道水务局', jurisdiction: '圭塘街道', responsibility: '区域监管/许可审批', contact: '010-8598xxxx', staff: 45 },
    { name: '洞井街道水务局', jurisdiction: '洞井街道', responsibility: '区域监管/许可审批', contact: '010-6280xxxx', staff: 38 },
])

const operators = ref([
    { name: 'XX排水集团', scope: '雨花/左家塘/侯家塘', services: '管网运维/泵站运营/巡查养护', contract: '2023-2028', staff: 580 },
    { name: 'YY水务公司', scope: '洞井/黎托街道', services: '管网运维/污水厂运营', contract: '2024-2029', staff: 420 },
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

        <template v-if="activeFunc === 'area'">
            <div class="flex items-center gap-2 mb-1">
                <MapPin class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">区域基础信息</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">区域</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">总面积(km²)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">排水面积</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">覆盖率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">服务人口(万)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="a in areaData" :key="a.name" class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ a.name }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ a.area }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ a.drainageArea }}</td>
                            <td class="text-center px-2 py-2.5"><span class="font-bold"
                                    :class="a.coverage >= 70 ? 'text-success' : a.coverage >= 50 ? 'text-warning' : 'text-danger'">{{
                                        a.coverage }}%</span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ a.population }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span class="text-xs font-bold text-default block mb-2">流域水系</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">水系</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">长度(km)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">流向</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">流域面积(km²)</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="w in waterSystems" :key="w.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ w.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ w.length }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-default">{{ w.level
                                    }}</span></td>
                            <td class="text-center px-2 py-2.5 text-default">{{ w.flow }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ w.basin }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="w.status === '正常' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{
                                        w.status }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'org'">
            <div class="flex items-center gap-2 mb-1">
                <Building2 class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">管理主体信息</span>
            </div>
            <span class="text-xs font-bold text-default block mb-2">主管单位</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden mb-3">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">单位</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">管辖范围</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">职责</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">联系电话</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">人员</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in supervisors" :key="s.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ s.jurisdiction }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ s.responsibility }}</td>
                            <td class="text-center px-2 py-2.5 text-dim font-mono text-[10px]">{{ s.contact }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ s.staff }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span class="text-xs font-bold text-default block mb-2">运营单位</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">单位</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">服务范围</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">服务内容</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">合同期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">人员</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in operators" :key="o.name"
                            class="border-b border-themed/30 hover:bg-hover-themed">
                            <td class="px-3 py-2.5 text-default font-medium">{{ o.name }}</td>
                            <td class="text-center px-2 py-2.5 text-primary">{{ o.scope }}</td>
                            <td class="px-2 py-2.5 text-dim text-[10px]">{{ o.services }}</td>
                            <td class="text-center px-2 py-2.5 text-default text-[10px]">{{ o.contract }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ o.staff }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
