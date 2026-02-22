<script setup lang="ts">
import { ref } from 'vue'
import {
  Droplets, CloudRain, Building2, Grid3X3,
  MapPin, Plus, Eye, Trash2, Search
} from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// ===================== 分区类型切换 =====================
const districtTypes = [
  { key: 'sewage', label: '污水分区', icon: Droplets, color: 'text-primary' },
  { key: 'rain', label: '雨水分区', icon: CloudRain, color: 'text-info' },
  { key: 'admin', label: '行政分区', icon: Building2, color: 'text-warning' },
  { key: 'grid', label: '排水网格', icon: Grid3X3, color: 'text-success' },
]
const activeType = ref('sewage')
const searchKeyword = ref('')

// ===================== 各类型分区数据 =====================
const allDistricts = ref({
  sewage: [
    { id: 1, name: '朝阳污水分区 A', area: '12.5 km²', pipeLength: '486 km', facilities: { pipes: 2340, wells: 1560, pumps: 3, plants: 1 }, coverage: 95, status: '正常' },
    { id: 2, name: '海淀污水分区 B', area: '18.3 km²', pipeLength: '612 km', facilities: { pipes: 3120, wells: 2080, pumps: 4, plants: 1 }, coverage: 92, status: '正常' },
    { id: 3, name: '西城污水分区 C', area: '8.7 km²', pipeLength: '324 km', facilities: { pipes: 1560, wells: 1040, pumps: 2, plants: 0 }, coverage: 88, status: '待优化' },
    { id: 4, name: '东城污水分区 D', area: '6.2 km²', pipeLength: '256 km', facilities: { pipes: 1230, wells: 820, pumps: 1, plants: 0 }, coverage: 91, status: '正常' },
  ],
  rain: [
    { id: 5, name: '朝阳雨水汇水区 1', area: '15.8 km²', pipeLength: '380 km', facilities: { pipes: 1890, wells: 960, pumps: 2, plants: 0 }, coverage: 90, status: '正常' },
    { id: 6, name: '海淀雨水汇水区 2', area: '22.1 km²', pipeLength: '520 km', facilities: { pipes: 2560, wells: 1340, pumps: 3, plants: 0 }, coverage: 87, status: '待优化' },
    { id: 7, name: '丰台雨水汇水区 3', area: '18.5 km²', pipeLength: '410 km', facilities: { pipes: 2040, wells: 1080, pumps: 2, plants: 0 }, coverage: 82, status: '待扩建' },
  ],
  admin: [
    { id: 8, name: '朝阳区', area: '470.8 km²', pipeLength: '2,340 km', facilities: { pipes: 12560, wells: 8340, pumps: 12, plants: 3 }, coverage: 93, status: '正常' },
    { id: 9, name: '海淀区', area: '431.0 km²', pipeLength: '2,120 km', facilities: { pipes: 11200, wells: 7450, pumps: 10, plants: 2 }, coverage: 91, status: '正常' },
    { id: 10, name: '西城区', area: '50.7 km²', pipeLength: '890 km', facilities: { pipes: 4560, wells: 3040, pumps: 5, plants: 1 }, coverage: 96, status: '正常' },
  ],
  grid: [
    { id: 11, name: '网格 A-01-001', area: '0.25 km²', pipeLength: '12 km', facilities: { pipes: 56, wells: 38, pumps: 0, plants: 0 }, coverage: 100, status: '正常' },
    { id: 12, name: '网格 A-01-002', area: '0.25 km²', pipeLength: '10 km', facilities: { pipes: 48, wells: 32, pumps: 0, plants: 0 }, coverage: 95, status: '正常' },
    { id: 13, name: '网格 A-02-001', area: '0.25 km²', pipeLength: '8 km', facilities: { pipes: 42, wells: 28, pumps: 0, plants: 0 }, coverage: 88, status: '待优化' },
    { id: 14, name: '网格 B-01-001', area: '0.25 km²', pipeLength: '15 km', facilities: { pipes: 72, wells: 48, pumps: 1, plants: 0 }, coverage: 100, status: '正常' },
    { id: 15, name: '网格 B-01-002', area: '0.25 km²', pipeLength: '6 km', facilities: { pipes: 30, wells: 20, pumps: 0, plants: 0 }, coverage: 72, status: '待扩建' },
  ],
})

const currentDistricts = ref(allDistricts.value.sewage)

function switchType(key: string) {
  activeType.value = key
  currentDistricts.value = allDistricts.value[key as keyof typeof allDistricts.value]
}

function handleAdd() { toast.value?.show('创建新分区...', 'info') }
function handleView(name: string) { toast.value?.show(`查看分区：${name}`, 'info') }
function handleDelete(name: string) { toast.value?.show(`确认删除：${name}？`, 'warning') }
</script>

<template>
  <div class="space-y-4">
    <!-- 分区类型切换 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button v-for="dt in districtTypes" :key="dt.key" @click="switchType(dt.key)"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer"
          :class="activeType === dt.key ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-themed text-dim hover:bg-hover-themed'">
          <component :is="dt.icon" class="w-3.5 h-3.5" />{{ dt.label }}
          <span class="text-[10px] px-1.5 py-0.5 rounded-md"
            :class="activeType === dt.key ? 'bg-primary/20' : 'bg-surface'">
            {{ allDistricts[dt.key as keyof typeof allDistricts].length }}
          </span>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input v-model="searchKeyword" type="text" placeholder="搜索分区..."
            class="bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary w-40" />
        </div>
        <button @click="handleAdd"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
          <Plus class="w-3.5 h-3.5" />新建分区
        </button>
      </div>
    </div>

    <!-- 分区列表 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-themed">
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">分区名称</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">面积</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管线长度</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">管道</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">检查井</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">覆盖率</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in currentDistricts" :key="d.id"
            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
            <td class="px-4 py-2.5 text-xs font-medium text-default flex items-center gap-1.5">
              <MapPin class="w-3 h-3 text-primary" />{{ d.name }}
            </td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ d.area }}</td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ d.pipeLength }}</td>
            <td class="px-4 py-2.5 text-xs text-default">{{ d.facilities.pipes.toLocaleString() }}</td>
            <td class="px-4 py-2.5 text-xs text-default">{{ d.facilities.wells.toLocaleString() }}</td>
            <td class="px-4 py-2.5 text-xs text-default">{{ d.facilities.pumps }}</td>
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                  <div class="h-full rounded-full"
                    :class="d.coverage >= 90 ? 'bg-success' : d.coverage >= 80 ? 'bg-warning' : 'bg-danger'"
                    :style="{ width: d.coverage + '%' }"></div>
                </div>
                <span class="text-xs font-medium"
                  :class="d.coverage >= 90 ? 'text-success' : d.coverage >= 80 ? 'text-warning' : 'text-danger'">{{
                  d.coverage }}%</span>
              </div>
            </td>
            <td class="px-4 py-2.5">
              <span class="text-[10px] px-2 py-0.5 rounded-md"
                :class="d.status === '正常' ? 'bg-success/15 text-success' : d.status === '待优化' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'">{{
                d.status }}</span>
            </td>
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-1">
                <button @click="handleView(d.name)"
                  class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer" title="查看">
                  <Eye class="w-3.5 h-3.5 text-primary" />
                </button>
                <button @click="handleDelete(d.name)"
                  class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer" title="删除">
                  <Trash2 class="w-3.5 h-3.5 text-danger" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ToastNotify ref="toast" />
  </div>
</template>
