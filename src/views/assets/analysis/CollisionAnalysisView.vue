<script setup lang="ts">
import { ref } from 'vue'
import { Zap, PlayCircle, AlertTriangle, Download } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 碰撞检测结果 =====================
const collisionResults = ref([
    { id: 1, drainPipe: 'PS-001234', otherPipe: 'GAS-045', otherType: '燃气', distance: '0.3m', location: '建国路 K2+350', risk: 'high', desc: '与燃气管线净距不足，低于规范要求0.5m' },
    { id: 2, drainPipe: 'PS-002567', otherPipe: 'PWR-023', otherType: '电力', distance: '0.8m', location: '中关村路 K1+200', risk: 'medium', desc: '与电力管道净距偏小，建议监测' },
    { id: 3, drainPipe: 'PS-003891', otherPipe: 'TEL-012', otherType: '通信', distance: '0.2m', location: '西单路 K0+800', risk: 'high', desc: '与通信管线交叉碰撞，存在安全隐患' },
    { id: 4, drainPipe: 'PS-004123', otherPipe: 'WAT-078', otherType: '给水', distance: '1.2m', location: '王府井 K3+100', risk: 'low', desc: '与给水管线净距满足规范' },
    { id: 5, drainPipe: 'PS-005456', otherPipe: 'GAS-089', otherType: '燃气', distance: '0.1m', location: '东直门 K1+500', risk: 'high', desc: '管线几乎重叠，需立即处理' },
])

// ===================== 风险等级统计 =====================
const riskStats = ref([
    { level: '高风险', count: 3, color: 'danger', desc: '净距<0.5m 或交叉碰撞' },
    { level: '中风险', count: 1, color: 'warning', desc: '净距0.5-1.0m' },
    { level: '低风险', count: 1, color: 'info', desc: '净距>1.0m，满足规范' },
])

function runCollisionCheck() { toast.value?.show('管线碰撞检测执行中...', 'info') }
function exportReport() { toast.value?.show('碰撞分析报告导出中...', 'info') }
</script>

<template>
    <div class="space-y-4">
        <!-- 风险统计 + 操作 -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div v-for="r in riskStats" :key="r.level"
                    class="bg-card border border-themed rounded-xl shadow-themed px-4 py-3 flex items-center gap-3">
                    <div class="text-xl font-bold" :class="`text-${r.color}`">{{ r.count }}</div>
                    <div>
                        <p class="text-xs font-medium text-default">{{ r.level }}</p>
                        <p class="text-[10px] text-muted-themed">{{ r.desc }}</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button @click="runCollisionCheck"
                    class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <PlayCircle class="w-3.5 h-3.5" />重新检测
                </button>
                <button @click="exportReport"
                    class="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                    <Download class="w-3.5 h-3.5" />导出报告
                </button>
            </div>
        </div>

        <!-- 碰撞结果列表 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed">
                <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                    <Zap class="w-4 h-4 text-warning" />碰撞检测结果
                </h3>
            </div>
            <div class="p-3 space-y-2">
                <div v-for="c in collisionResults" :key="c.id"
                    class="p-3 rounded-lg bg-surface hover:bg-hover-themed transition-colors">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <AlertTriangle class="w-4 h-4"
                                :class="c.risk === 'high' ? 'text-danger' : c.risk === 'medium' ? 'text-warning' : 'text-info'" />
                            <span class="text-xs font-medium text-default">{{ c.location }}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded"
                                :class="c.risk === 'high' ? 'bg-danger/15 text-danger' : c.risk === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'">
                                {{ c.risk === 'high' ? '高风险' : c.risk === 'medium' ? '中风险' : '低风险' }}
                            </span>
                        </div>
                        <span class="text-xs font-bold"
                            :class="c.risk === 'high' ? 'text-danger' : c.risk === 'medium' ? 'text-warning' : 'text-info'">净距
                            {{ c.distance }}</span>
                    </div>
                    <div class="flex items-center gap-4 text-[10px] text-muted-themed mb-1">
                        <span>排水管：<span class="font-mono text-primary">{{ c.drainPipe }}</span></span>
                        <span>{{ c.otherType }}管：<span class="font-mono text-default">{{ c.otherPipe }}</span></span>
                    </div>
                    <p class="text-[10px] text-dim">{{ c.desc }}</p>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />
    </div>
</template>
