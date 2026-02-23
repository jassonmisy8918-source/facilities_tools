<script setup lang="ts">
import { ref } from 'vue'
import { RefreshCw, PlayCircle, CheckCircle, AlertTriangle } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const loopNetworks = ref([
    { id: 1, name: '圭塘街道环状管网 A', nodes: 45, pipes: 52, loops: 8, status: '正常', flowBalance: 98.2, pressureVariance: 0.12 },
    { id: 2, name: '洞井街道环状管网 B', nodes: 38, pipes: 44, loops: 6, status: '偏差', flowBalance: 89.5, pressureVariance: 0.35 },
    { id: 3, name: '侯家塘街道环状管网 C', nodes: 30, pipes: 35, loops: 5, status: '正常', flowBalance: 96.8, pressureVariance: 0.15 },
    { id: 4, name: '雨花亭街道环状管网 D', nodes: 28, pipes: 32, loops: 4, status: '异常', flowBalance: 72.3, pressureVariance: 0.68 },
])

const diagnosticItems = ref([
    { metric: '流量分配均衡度', desc: '各支路流量与设计值的偏差程度', threshold: '≥ 90%', icon: '📊' },
    { metric: '压力分布方差', desc: '管网各节点压力的离散程度', threshold: '≤ 0.3', icon: '📈' },
    { metric: '死水区域识别', desc: '流速极低的管段数量', threshold: '= 0', icon: '🔍' },
    { metric: '环路冗余度', desc: '管网结构的备用路径数量', threshold: '≥ 2', icon: '🔄' },
])

function runDiagnosis() { toast.value?.show('环状管网综合诊断执行中...', 'info') }
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                <RefreshCw class="w-4 h-4 text-primary" />环状管网诊断
            </h3>
            <button @click="runDiagnosis"
                class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                <PlayCircle class="w-3.5 h-3.5" />综合诊断
            </button>
        </div>

        <!-- 诊断指标 -->
        <div class="grid grid-cols-4 gap-3">
            <div v-for="d in diagnosticItems" :key="d.metric"
                class="bg-card border border-themed rounded-xl shadow-themed p-3">
                <span class="text-lg">{{ d.icon }}</span>
                <p class="text-xs font-medium text-default mt-2">{{ d.metric }}</p>
                <p class="text-[10px] text-muted-themed mt-0.5">{{ d.desc }}</p>
                <p class="text-[10px] text-primary font-medium mt-1">标准: {{ d.threshold }}</p>
            </div>
        </div>

        <!-- 管网列表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-themed">
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管网名称</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">节点数</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管段数</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">环路数</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">流量均衡</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">压力方差</th>
                        <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="net in loopNetworks" :key="net.id"
                        class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                        <td class="px-4 py-2.5 text-xs font-medium text-default">{{ net.name }}</td>
                        <td class="px-4 py-2.5 text-xs text-dim">{{ net.nodes }}</td>
                        <td class="px-4 py-2.5 text-xs text-dim">{{ net.pipes }}</td>
                        <td class="px-4 py-2.5 text-xs text-primary font-medium">{{ net.loops }}</td>
                        <td class="px-4 py-2.5 text-xs font-medium"
                            :class="net.flowBalance >= 90 ? 'text-success' : net.flowBalance >= 80 ? 'text-warning' : 'text-danger'">
                            {{ net.flowBalance }}%</td>
                        <td class="px-4 py-2.5 text-xs font-medium"
                            :class="net.pressureVariance <= 0.3 ? 'text-success' : 'text-danger'">{{
                            net.pressureVariance }}</td>
                        <td class="px-4 py-2.5">
                            <span class="text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 w-fit"
                                :class="net.status === '正常' ? 'bg-success/15 text-success' : net.status === '偏差' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'">
                                <CheckCircle v-if="net.status === '正常'" class="w-3 h-3" />
                                <AlertTriangle v-else class="w-3 h-3" />
                                {{ net.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
