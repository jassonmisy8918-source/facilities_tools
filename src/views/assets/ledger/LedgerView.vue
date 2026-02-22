<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Download, Plus, ChevronLeft, ChevronRight, Eye, Database, Trash2 } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

// 台账类别 Tab —— 需求 9.1.1.4.2 的12种台账
const ledgerTabs = [
  { key: 'pipe', label: '排水管网' },
  { key: 'well', label: '检查井' },
  { key: 'rainInlet', label: '雨水口' },
  { key: 'user', label: '排水户' },
  { key: 'pump', label: '泵站' },
  { key: 'sewagePlant', label: '污水厂' },
  { key: 'gate', label: '闸门' },
  { key: 'interceptor', label: '截留设施' },
  { key: 'weir', label: '溢流堰' },
  { key: 'valve', label: '阀门' },
  { key: 'outlet', label: '排放口' },
  { key: 'device', label: '监测设备' },
]
const activeTab = ref('pipe')

// 每种台账的表头定义
const tabColumns: Record<string, { key: string; label: string }[]> = {
  pipe: [
    { key: 'code', label: '编号' }, { key: 'name', label: '管段名称' }, { key: 'type', label: '管道类型' },
    { key: 'material', label: '材质' }, { key: 'diameter', label: '管径' }, { key: 'length', label: '长度(m)' },
    { key: 'district', label: '区域' }, { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
  ],
  well: [
    { key: 'code', label: '编号' }, { key: 'name', label: '井名称' }, { key: 'wellType', label: '井类型' },
    { key: 'depth', label: '井深(m)' }, { key: 'material', label: '井盖材质' }, { key: 'district', label: '区域' },
    { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
  ],
  rainInlet: [
    { key: 'code', label: '编号' }, { key: 'name', label: '名称' }, { key: 'inletType', label: '雨水口类型' },
    { key: 'size', label: '尺寸' }, { key: 'district', label: '区域' }, { key: 'road', label: '所在道路' },
    { key: 'status', label: '状态' },
  ],
  user: [
    { key: 'code', label: '编号' }, { key: 'name', label: '排水户名称' }, { key: 'userType', label: '类型' },
    { key: 'permit', label: '排水许可证' }, { key: 'dailyVolume', label: '日排水量(m³)' },
    { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
  pump: [
    { key: 'code', label: '编号' }, { key: 'name', label: '泵站名称' }, { key: 'capacity', label: '设计流量(m³/h)' },
    { key: 'pumpCount', label: '水泵数' }, { key: 'power', label: '装机功率(kW)' },
    { key: 'district', label: '区域' }, { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
  ],
  sewagePlant: [
    { key: 'code', label: '编号' }, { key: 'name', label: '污水厂名称' }, { key: 'capacity', label: '处理规模(万m³/d)' },
    { key: 'process', label: '处理工艺' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
  gate: [
    { key: 'code', label: '编号' }, { key: 'name', label: '闸门名称' }, { key: 'gateType', label: '类型' },
    { key: 'size', label: '尺寸' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
  interceptor: [
    { key: 'code', label: '编号' }, { key: 'name', label: '设施名称' }, { key: 'intType', label: '类型' },
    { key: 'capacity', label: '截流能力(m³/h)' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
  weir: [
    { key: 'code', label: '编号' }, { key: 'name', label: '溢流堰名称' }, { key: 'weirType', label: '类型' },
    { key: 'elevation', label: '堰顶高程(m)' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
  valve: [
    { key: 'code', label: '编号' }, { key: 'name', label: '阀门名称' }, { key: 'valveType', label: '类型' },
    { key: 'diameter', label: '口径' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
  outlet: [
    { key: 'code', label: '编号' }, { key: 'name', label: '排放口名称' }, { key: 'outletType', label: '类型' },
    { key: 'receiver', label: '受纳水体' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
  device: [
    { key: 'code', label: '编号' }, { key: 'name', label: '设备名称' }, { key: 'devType', label: '设备类型' },
    { key: 'model', label: '型号' }, { key: 'installDate', label: '安装日期' },
    { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
  ],
}

const columns = computed(() => tabColumns[activeTab.value] || tabColumns.pipe)

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 15

// 生成 mock 数据
function generateData(tab: string) {
  const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区']
  const statuses = ['正常', '正常', '正常', '轻微缺陷', '需维修']
  const prefix: Record<string, string> = {
    pipe: 'PS', well: 'MH', rainInlet: 'RI', user: 'DU', pump: 'BZ', sewagePlant: 'SP',
    gate: 'GT', interceptor: 'IC', weir: 'WR', valve: 'VL', outlet: 'OT', device: 'DV',
  }
  const count: Record<string, number> = {
    pipe: 120, well: 80, rainInlet: 60, user: 45, pump: 18, sewagePlant: 6,
    gate: 24, interceptor: 12, weir: 15, valve: 35, outlet: 42, device: 56,
  }
  const n = count[tab] || 30
  return Array.from({ length: n }, (_, i) => {
    const base: Record<string, any> = {
      id: i + 1,
      code: `${prefix[tab]}-${String(i + 1).padStart(6, '0')}`,
      name: `${districts[i % 5]}${ledgerTabs.find(t => t.key === tab)?.label}${i + 1}`,
      district: districts[i % 5],
      status: statuses[i % 5],
      buildYear: 2010 + (i % 14),
    }
    if (tab === 'pipe') Object.assign(base, { type: ['雨水管', '污水管', '合流管'][i % 3], material: ['PE', 'HDPE', '钢筋混凝土'][i % 3], diameter: `DN${[300, 400, 600][i % 3]}`, length: (Math.random() * 500 + 10).toFixed(1) })
    if (tab === 'well') Object.assign(base, { wellType: ['圆形检查井', '矩形检查井', '跌水井'][i % 3], depth: (1.5 + Math.random() * 4).toFixed(1), material: ['球墨铸铁', '复合材料', '混凝土'][i % 3] })
    if (tab === 'rainInlet') Object.assign(base, { inletType: ['平箅式', '立箅式', '联合式'][i % 3], size: ['680×380', '750×450', '900×500'][i % 3], road: ['朝阳路', '民生路', '和平街'][i % 3] })
    if (tab === 'user') Object.assign(base, { userType: ['工业', '商业', '餐饮', '医疗'][i % 4], permit: `PWP-2024-${String(i + 1).padStart(4, '0')}`, dailyVolume: (50 + Math.random() * 500).toFixed(0) })
    if (tab === 'pump') Object.assign(base, { capacity: [200, 350, 500][i % 3], pumpCount: [2, 3, 4][i % 3], power: [30, 55, 110][i % 3] })
    if (tab === 'sewagePlant') Object.assign(base, { capacity: [5, 10, 20][i % 3], process: ['AAO', 'MBR', 'SBR'][i % 3] })
    if (tab === 'gate') Object.assign(base, { gateType: ['平板闸门', '拍门', '蝶阀'][i % 3], size: ['1000×800', '800×600', '600×400'][i % 3] })
    if (tab === 'interceptor') Object.assign(base, { intType: ['截流井', '截流闸', '调蓄池'][i % 3], capacity: [100, 200, 500][i % 3] })
    if (tab === 'weir') Object.assign(base, { weirType: ['矩形堰', '三角堰', 'V型堰'][i % 3], elevation: (2 + Math.random() * 3).toFixed(2) })
    if (tab === 'valve') Object.assign(base, { valveType: ['蝶阀', '闸阀', '止回阀'][i % 3], diameter: `DN${[100, 200, 300][i % 3]}` })
    if (tab === 'outlet') Object.assign(base, { outletType: ['雨水排放口', '溢流排放口', '合流排放口'][i % 3], receiver: ['东湖', '北河', '南溪'][i % 3] })
    if (tab === 'device') Object.assign(base, { devType: ['流量计', '液位计', '雨量计', '水质分析仪'][i % 4], model: ['FM-200', 'LS-100', 'RG-50', 'WQ-300'][i % 4], installDate: `202${i % 4}-0${(i % 9) + 1}-${10 + (i % 20)}` })
    return base
  })
}

const tabDataCache = ref<Record<string, any[]>>({})
const currentData = computed(() => {
  if (!tabDataCache.value[activeTab.value]) {
    tabDataCache.value[activeTab.value] = generateData(activeTab.value)
  }
  return tabDataCache.value[activeTab.value]!
})

const filteredData = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return currentData.value
  return currentData.value.filter(f => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q))
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize))
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

function switchTab(key: string) {
  activeTab.value = key
  currentPage.value = 1
  searchQuery.value = ''
}

function getStatusClass(status: string) {
  if (status === '正常') return 'bg-success/15 text-success'
  if (status === '轻微缺陷') return 'bg-warning/15 text-warning'
  return 'bg-danger/15 text-danger'
}

// Toast
const toast = ref<InstanceType<typeof ToastNotify>>()

// 新增弹窗
const showAddModal = ref(false)
const addForm = ref<Record<string, string>>({ name: '', code: '' })
function openAdd() { addForm.value = { name: '', code: '' }; showAddModal.value = true }
function doAdd() {
  if (!addForm.value.name) { toast.value?.show('请输入名称', 'warning'); return }
  toast.value?.show('新增成功', 'success'); showAddModal.value = false
}

// 查看弹窗
const showDetailModal = ref(false)
const detailItem = ref<Record<string, any>>({})
function viewDetail(item: Record<string, any>) { detailItem.value = item; showDetailModal.value = true }

// 删除
const showDeleteModal = ref(false)
const deletingId = ref(0)
function confirmDelete(id: number) { deletingId.value = id; showDeleteModal.value = true }
function doDelete() {
  tabDataCache.value[activeTab.value] = (tabDataCache.value[activeTab.value] ?? []).filter(i => i.id !== deletingId.value)
  showDeleteModal.value = false
  toast.value?.show('删除成功', 'success')
}

// 导出
function handleExport() { toast.value?.show('数据导出中，请稍候...', 'info') }
</script>

<template>
  <div class="space-y-4">
    <!-- 台账类型 Tab -->
    <div class="bg-card border border-themed rounded-xl shadow-themed p-1.5 overflow-x-auto">
      <div class="flex items-center gap-0.5 min-w-max">
        <button v-for="tab in ledgerTabs" :key="tab.key" @click="switchTab(tab.key)"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
          :class="activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
        <input v-model="searchQuery" type="text" placeholder="搜索编号或名称..."
          class="w-full pl-9 pr-4 py-2 bg-input border border-themed rounded-lg text-sm text-default placeholder-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-themed">
          <Database class="w-3.5 h-3.5 inline mr-1" />共 {{ currentData.length }} 条
        </span>
        <button @click="handleExport"
          class="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
          <Download class="w-3.5 h-3.5" /> 导出
        </button>
        <button @click="openAdd"
          class="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
          <Plus class="w-3.5 h-3.5" /> 新增
        </button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th v-for="col in columns" :key="col.key"
                class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface whitespace-nowrap">
                {{ col.label }}
              </th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pagedData" :key="item.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td v-for="col in columns" :key="col.key" class="px-4 py-2.5 text-xs whitespace-nowrap"
                :class="col.key === 'code' ? 'font-mono text-primary' : col.key === 'status' ? '' : col.key === 'name' ? 'text-default' : 'text-dim'">
                <span v-if="col.key === 'status'" class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getStatusClass(item[col.key])">{{ item[col.key] }}</span>
                <span v-else>{{ item[col.key] }}</span>
              </td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-1">
                  <button @click="viewDetail(item)"
                    class="p-1 rounded hover:bg-primary/10 text-primary transition-colors cursor-pointer" title="查看">
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button @click="confirmDelete(item.id)"
                    class="p-1 rounded hover:bg-danger/10 text-dim hover:text-danger transition-colors cursor-pointer"
                    title="删除">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="flex items-center justify-between px-4 py-3 border-t border-themed">
        <p class="text-xs text-muted-themed">
          共 {{ filteredData.length }} 条，第 {{ currentPage }} / {{ totalPages }} 页
        </p>
        <div class="flex items-center gap-1">
          <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
            class="p-1.5 rounded-md border border-themed text-dim hover:bg-hover-themed disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed">
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
          <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
            class="p-1.5 rounded-md border border-themed text-dim hover:bg-hover-themed disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed">
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 新增弹窗 -->
    <ModalDialog :show="showAddModal" :title="'新增' + (ledgerTabs.find(t => t.key === activeTab)?.label || '')"
      @close="showAddModal = false" @confirm="doAdd">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-dim mb-1 block">名称 <span class="text-danger">*</span></label>
          <input v-model="addForm.name" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="请输入名称" />
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">区域</label>
          <select v-model="addForm.district"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
            <option>朝阳区</option>
            <option>海淀区</option>
            <option>西城区</option>
            <option>东城区</option>
            <option>丰台区</option>
          </select>
        </div>
      </div>
    </ModalDialog>

    <!-- 查看详情弹窗 -->
    <ModalDialog :show="showDetailModal" :title="detailItem.name || '详情'" width="560px" @close="showDetailModal = false"
      @confirm="showDetailModal = false">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="col in columns" :key="col.key" class="text-xs">
          <span class="text-dim">{{ col.label }}：</span>
          <span class="text-default font-medium">{{ detailItem[col.key] }}</span>
        </div>
      </div>
    </ModalDialog>

    <!-- 删除确认 -->
    <ModalDialog :show="showDeleteModal" title="确认删除" @close="showDeleteModal = false" @confirm="doDelete">
      <p class="text-xs text-dim">确定要删除该记录吗？此操作不可撤销。</p>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
