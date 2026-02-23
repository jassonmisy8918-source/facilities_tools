<script setup lang="ts">
import { ref } from 'vue'
import {
  GitBranch, ArrowRight, Search, PlayCircle, MapPin,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 网络完整性检查 =====================
const checkRunning = ref(false)
const checkProgress = ref(0)

const connectivityResults = ref([
  { id: 1, from: '检查井 #A001', to: '检查井 #A015', path: 14, distance: '1,245m', status: '连通' },
  { id: 2, from: '检查井 #B003', to: '检查井 #B021', path: 18, distance: '2,130m', status: '连通' },
  { id: 3, from: '检查井 #C007', to: '检查井 #C012', path: 0, distance: '-', status: '断开' },
  { id: 4, from: '检查井 #D002', to: '排放口 OUT-005', path: 22, distance: '3,450m', status: '连通' },
  { id: 5, from: '检查井 #E010', to: '检查井 #E025', path: 0, distance: '-', status: '断开' },
  { id: 6, from: '泵站 PS-001', to: '排放口 OUT-002', path: 8, distance: '890m', status: '连通' },
])

function runIntegrityCheck() {
  checkRunning.value = true; checkProgress.value = 0
  const timer = setInterval(() => {
    checkProgress.value += 15
    if (checkProgress.value >= 100) {
      clearInterval(timer); checkRunning.value = false
      toast.value?.show('网络完整性检查完成，发现 2 处断连', 'success')
    }
  }, 300)
}

// ===================== 故障点定位 =====================
const faultPoints = ref([
  { id: 1, location: '圭塘街道 韶山路段', well: 'MH-C007', type: '堵塞', severity: 'high', desc: '管段淤积严重，流量降至设计值20%', lat: 28.1387, lng: 113.045 },
  { id: 2, location: '洞井街道 中关村段', well: 'MH-E010', type: '断裂', severity: 'high', desc: '管道结构破损，存在渗漏', lat: 28.1742, lng: 113.0160 },
  { id: 3, location: '侯家塘街道 东塘段', well: 'MH-F003', type: '错口', severity: 'medium', desc: '管道接口处错位约3cm', lat: 28.1413, lng: 113.0440 },
  { id: 4, location: '雨花亭街道 王府井段', well: 'MH-G015', type: '沉降', severity: 'low', desc: '检查井轻微沉降，功能正常', lat: 28.1345, lng: 113.0505 },
])

const selectedFault = ref<number | null>(null)

function locateFault(id: number) {
  selectedFault.value = id
  const f = faultPoints.value.find(p => p.id === id)
  toast.value?.show(`已定位至：${f?.location}`, 'info')
}

// ===================== 统计概览 =====================
const stats = ref([
  { label: '管网总节点', value: '23,847', icon: GitBranch },
  { label: '连通节点', value: '23,410', icon: CheckCircle },
  { label: '断连节点', value: '437', icon: XCircle },
  { label: '故障点', value: '4', icon: AlertTriangle },
])
</script>

<template>
  <div class="space-y-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="s in stats" :key="s.label" class="bg-card border border-themed rounded-xl shadow-themed p-4">
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-dim">{{ s.label }}</p>
          <component :is="s.icon" class="w-3.5 h-3.5 text-primary" />
        </div>
        <p class="text-xl font-bold text-default">{{ s.value }}</p>
      </div>
    </div>

    <!-- 完整性检查 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-default flex items-center gap-2">
          <Search class="w-4 h-4 text-primary" />网络完整性检查
        </h3>
        <button @click="runIntegrityCheck" :disabled="checkRunning"
          class="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light disabled:opacity-50 transition-colors cursor-pointer">
          <PlayCircle class="w-3.5 h-3.5" />{{ checkRunning ? '检查中...' : '开始检查' }}
        </button>
      </div>
      <div v-if="checkRunning" class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] text-dim">检查进度</span>
          <span class="text-[10px] text-primary font-medium">{{ checkProgress }}%</span>
        </div>
        <div class="w-full h-1.5 bg-surface rounded-full overflow-hidden">
          <div class="h-full bg-primary rounded-full transition-all" :style="{ width: checkProgress + '%' }"></div>
        </div>
      </div>
      <!-- 连通性结果表 -->
      <div class="space-y-1.5">
        <div v-for="item in connectivityResults" :key="item.id"
          class="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-hover-themed transition-colors">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 text-xs">
              <span class="text-default font-medium">{{ item.from }}</span>
              <ArrowRight class="w-3 h-3 text-dim" />
              <span class="text-default font-medium">{{ item.to }}</span>
            </div>
            <p class="text-[10px] text-muted-themed mt-0.5">经过 {{ item.path }} 个节点 · {{ item.distance }}</p>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-md"
            :class="item.status === '连通' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'">{{ item.status
            }}</span>
        </div>
      </div>
    </div>

    <!-- 故障点定位 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <div class="px-4 py-3 border-b border-themed">
        <h3 class="text-sm font-semibold text-default flex items-center gap-2">
          <MapPin class="w-4 h-4 text-danger" />故障点定位
        </h3>
      </div>
      <div class="p-3 space-y-2">
        <div v-for="f in faultPoints" :key="f.id" @click="locateFault(f.id)"
          class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all"
          :class="selectedFault === f.id ? 'bg-primary/10 border border-primary/30' : 'bg-surface hover:bg-hover-themed'">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="f.severity === 'high' ? 'bg-danger/15' : f.severity === 'medium' ? 'bg-warning/15' : 'bg-info/15'">
              <AlertTriangle class="w-4 h-4"
                :class="f.severity === 'high' ? 'text-danger' : f.severity === 'medium' ? 'text-warning' : 'text-info'" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-default">{{ f.location }}</span>
                <span class="text-[10px] font-mono text-primary">{{ f.well }}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded"
                  :class="f.severity === 'high' ? 'bg-danger/15 text-danger' : f.severity === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'">{{
                  f.type }}</span>
              </div>
              <p class="text-[10px] text-muted-themed mt-0.5">{{ f.desc }}</p>
            </div>
          </div>
          <MapPin class="w-4 h-4" :class="selectedFault === f.id ? 'text-primary' : 'text-muted-themed'" />
        </div>
      </div>
    </div>

    <ToastNotify ref="toast" />
  </div>
</template>
