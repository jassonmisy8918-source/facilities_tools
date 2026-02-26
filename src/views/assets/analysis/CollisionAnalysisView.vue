<script setup lang="ts">
import { ref, computed } from 'vue'
import { Zap, PlayCircle, AlertTriangle, Download, Search, Eye, Map } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 碰撞检测结果 =====================
const collisionResults = ref([
    { id: 1, drainPipe: 'PS-001234', otherPipe: 'GAS-045', otherType: '燃气', distance: '0.3m', location: '建国路 K2+350', risk: 'high', desc: '与燃气管线净距不足，低于规范要求0.5m' },
    { id: 2, drainPipe: 'PS-002567', otherPipe: 'PWR-023', otherType: '电力', distance: '0.8m', location: '中关村路 K1+200', risk: 'medium', desc: '与电力管道净距偏小，建议监测' },
    { id: 3, drainPipe: 'PS-003891', otherPipe: 'TEL-012', otherType: '通信', distance: '0.2m', location: '东塘路 K0+800', risk: 'high', desc: '与通信管线交叉碰撞，存在安全隐患' },
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
function openMapView() { window.open('https://app.yyinfo168.top/analysis/collision', '_blank') }

// 搜索和过滤
const searchText = ref('')
const filterRisk = ref('all')
const filteredResults = computed(() => {
    let list = collisionResults.value
    if (filterRisk.value !== 'all') list = list.filter(c => c.risk === filterRisk.value)
    if (searchText.value) {
        const kw = searchText.value.toLowerCase()
        list = list.filter(c => c.location.toLowerCase().includes(kw) || c.drainPipe.toLowerCase().includes(kw) || c.otherPipe.toLowerCase().includes(kw))
    }
    return list
})

// 详情弹窗
const showDetail = ref(false)
const detailItem = ref<any>(null)
function viewDetail(c: any) { detailItem.value = c; showDetail.value = true }
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
                <button @click="openMapView"
                    class="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                    <Map class="w-3.5 h-3.5" />地图查看
                </button>
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
            <div class="px-4 py-3 border-b border-themed flex items-center justify-between">
                <h3 class="text-sm font-semibold text-default flex items-center gap-2">
                    <Zap class="w-4 h-4 text-warning" />碰撞检测结果 <span class="text-[10px] text-dim font-normal ml-1">共 {{
                        filteredResults.length }} 条</span>
                </h3>
                <div class="flex items-center gap-2">
                    <div class="relative">
                        <Search class="w-3 h-3 text-dim absolute left-2 top-1/2 -translate-y-1/2" />
                        <input v-model="searchText" placeholder="搜索位置/管线..."
                            class="bg-input border border-themed rounded-md pl-7 pr-2 py-1 text-[10px] text-default w-36 focus:outline-none focus:border-primary" />
                    </div>
                    <select v-model="filterRisk"
                        class="bg-input border border-themed rounded-md px-2 py-1 text-[10px] text-default">
                        <option value="all">全部等级</option>
                        <option value="high">高风险</option>
                        <option value="medium">中风险</option>
                        <option value="low">低风险</option>
                    </select>
                </div>
            </div>
            <div class="p-3 space-y-2">
                <div v-for="c in filteredResults" :key="c.id"
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
                    <button @click="viewDetail(c)"
                        class="mt-1.5 flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer">
                        <Eye class="w-3 h-3" />查看详情
                    </button>
                </div>
            </div>
        </div>

        <ToastNotify ref="toast" />

        <!-- 碰撞详情弹窗 -->
        <ModalDialog :show="showDetail" :title="'碰撞详情 · ' + (detailItem?.location || '')" width="480px"
            @close="showDetail = false" @confirm="showDetail = false">
            <div v-if="detailItem" class="space-y-2 text-xs">
                <div class="grid grid-cols-2 gap-2">
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">排水管线</p>
                        <p class="text-primary font-mono font-medium">{{ detailItem.drainPipe }}</p>
                    </div>
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">{{ detailItem.otherType }}管线</p>
                        <p class="text-default font-mono">{{ detailItem.otherPipe }}</p>
                    </div>
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">净距</p>
                        <p class="font-bold"
                            :class="detailItem.risk === 'high' ? 'text-danger' : detailItem.risk === 'medium' ? 'text-warning' : 'text-info'">
                            {{ detailItem.distance }}</p>
                    </div>
                    <div class="p-2 rounded-lg bg-surface">
                        <p class="text-[10px] text-dim">风险等级</p>
                        <p class="font-bold"
                            :class="detailItem.risk === 'high' ? 'text-danger' : detailItem.risk === 'medium' ? 'text-warning' : 'text-info'">
                            {{ detailItem.risk === 'high' ? '高风险' : detailItem.risk === 'medium' ? '中风险' : '低风险' }}</p>
                    </div>
                </div>
                <div class="p-2 rounded-lg bg-surface">
                    <p class="text-[10px] text-dim">位置</p>
                    <p class="text-default">{{ detailItem.location }}</p>
                </div>
                <div class="p-2 rounded-lg bg-surface">
                    <p class="text-[10px] text-dim">说明</p>
                    <p class="text-default">{{ detailItem.desc }}</p>
                </div>
                <div v-if="detailItem.risk === 'high'" class="p-2 rounded-lg bg-danger/10 border border-danger/20">
                    <p class="text-[10px] text-danger font-medium">☢ 高风险预警：该碰撞点净距不满足规范要求，建议立即处理！</p>
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
