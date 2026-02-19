<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClipboardList, Search, Filter, Clock, User, MapPin, ChevronRight } from 'lucide-vue-next'

const statusFilter = ref('all')
const searchQuery = ref('')

const statusTabs = [
  { key: 'all', label: '全部', count: 24 },
  { key: 'pending', label: '待处理', count: 5 },
  { key: 'processing', label: '进行中', count: 8 },
  { key: 'completed', label: '已完成', count: 11 },
]

const workOrders = ref([
  { id: 'WO-2024001', title: '朝阳路管段日常巡查', type: '日常巡查', assignee: '张伟', location: '朝阳路 A01-A15段', status: 'processing', priority: 'normal', createTime: '2024-03-15 09:00', deadline: '2024-03-15 18:00', progress: 60 },
  { id: 'WO-2024002', title: '民生路管道渗漏处理', type: '紧急维修', assignee: '李明', location: '民生路 DN400 检查井#23', status: 'pending', priority: 'high', createTime: '2024-03-15 10:30', deadline: '2024-03-15 14:00', progress: 0 },
  { id: 'WO-2024003', title: '新华街排水口清理', type: '养护作业', assignee: '王强', location: '新华街排放口 OUT-018', status: 'processing', priority: 'normal', createTime: '2024-03-14 14:00', deadline: '2024-03-16 18:00', progress: 35 },
  { id: 'WO-2024004', title: '和平路检查井盖更换', type: '维修作业', assignee: '赵刚', location: '和平路 检查井#56', status: 'completed', priority: 'normal', createTime: '2024-03-13 08:00', deadline: '2024-03-14 18:00', progress: 100 },
  { id: 'WO-2024005', title: '东湖泵站周边管道巡检', type: '日常巡查', assignee: '陈静', location: '东湖泵站上游 500m范围', status: 'completed', priority: 'low', createTime: '2024-03-12 09:00', deadline: '2024-03-12 17:00', progress: 100 },
  { id: 'WO-2024006', title: '建设大道雨水口疏通', type: '养护作业', assignee: '周磊', location: '建设大道 雨水口 SW-032~SW-040', status: 'pending', priority: 'normal', createTime: '2024-03-15 11:00', deadline: '2024-03-17 18:00', progress: 0 },
  { id: 'WO-2024007', title: '丰台路管道CCTV检测', type: '检测作业', assignee: '吴涛', location: '丰台路 DN600 P03-P08段', status: 'processing', priority: 'normal', createTime: '2024-03-14 08:00', deadline: '2024-03-18 18:00', progress: 45 },
  { id: 'WO-2024008', title: '西城区污水冒溢紧急处理', type: '紧急维修', assignee: '张伟', location: '西城区 检查井#89', status: 'pending', priority: 'urgent', createTime: '2024-03-15 12:15', deadline: '2024-03-15 15:00', progress: 0 },
])

const filteredOrders = computed(() => {
  let list = workOrders.value
  if (statusFilter.value !== 'all') list = list.filter(o => o.status === statusFilter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(o => o.title.includes(q) || o.id.toLowerCase().includes(q))
  }
  return list
})

function getStatusClass(s: string) {
  return s === 'completed' ? 'bg-success/15 text-success' : s === 'processing' ? 'bg-info/15 text-info' : 'bg-warning/15 text-warning'
}
function getStatusText(s: string) {
  return s === 'completed' ? '已完成' : s === 'processing' ? '进行中' : '待处理'
}
function getPriorityClass(p: string) {
  return p === 'urgent' ? 'bg-danger/15 text-danger' : p === 'high' ? 'bg-warning/15 text-warning' : p === 'low' ? 'bg-success/15 text-success' : 'bg-info/15 text-info'
}
function getPriorityText(p: string) {
  return p === 'urgent' ? '紧急' : p === 'high' ? '高' : p === 'low' ? '低' : '普通'
}
</script>

<template>
  <div class="space-y-4">
    <!-- 状态标签 + 搜索 -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
        <button v-for="tab in statusTabs" :key="tab.key" @click="statusFilter = tab.key"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="statusFilter === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }} <span class="ml-1 opacity-70">({{ tab.count }})</span>
        </button>
      </div>
      <div class="relative max-w-xs">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
        <input v-model="searchQuery" placeholder="搜索工单..."
          class="w-full pl-9 pr-4 py-2 bg-input border border-themed rounded-lg text-sm text-default placeholder-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors" />
      </div>
    </div>

    <!-- 工单卡片列表 -->
    <div class="grid grid-cols-2 gap-3">
      <div v-for="order in filteredOrders" :key="order.id"
        class="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow group cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-primary font-mono">{{ order.id }}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded" :class="getPriorityClass(order.priority)">{{
                getPriorityText(order.priority) }}</span>
            </div>
            <h4 class="text-sm font-medium text-default">{{ order.title }}</h4>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(order.status)">{{
            getStatusText(order.status) }}</span>
        </div>

        <div class="space-y-1.5 mb-3">
          <div class="flex items-center gap-2 text-xs text-dim">
            <User class="w-3 h-3" />
            <span>{{ order.assignee }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-dim">
            <MapPin class="w-3 h-3" />
            <span class="truncate">{{ order.location }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-dim">
            <Clock class="w-3 h-3" />
            <span>截止: {{ order.deadline }}</span>
          </div>
        </div>

        <!-- 进度条 -->
        <div v-if="order.status !== 'pending'" class="flex items-center gap-2">
          <div class="flex-1 bg-surface rounded-full h-1.5">
            <div class="h-1.5 rounded-full transition-all" :class="order.progress === 100 ? 'bg-success' : 'bg-primary'"
              :style="{ width: order.progress + '%' }"></div>
          </div>
          <span class="text-[10px] text-muted-themed shrink-0">{{ order.progress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
