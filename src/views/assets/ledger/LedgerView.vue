<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Download, Plus, ChevronLeft, ChevronRight, Eye, Database, Trash2, Edit3, Settings, History, Filter } from 'lucide-vue-next'
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
    { key: 'district', label: '区域' }, { key: 'partition', label: '所属分区' }, { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
  ],
  well: [
    { key: 'code', label: '编号' }, { key: 'name', label: '井名称' }, { key: 'wellType', label: '井类型' },
    { key: 'depth', label: '井深(m)' }, { key: 'material', label: '井盖材质' }, { key: 'district', label: '区域' },
    { key: 'partition', label: '所属分区' }, { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
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

const allColumns = computed(() => tabColumns[activeTab.value] || tabColumns.pipe)
const columns = computed(() => {
  if (Object.keys(fieldVisibility.value).length === 0) return allColumns.value
  return allColumns.value?.filter(c => fieldVisibility.value[c.key] !== false) ?? []
})

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 15

// 生成 mock 数据
function generateData(tab: string) {
  const districts = ['圭塘街道', '洞井街道', '侯家塘街道', '雨花亭街道', '左家塘街道']
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
      partition: ['雨花污水分区 A', '洞井污水分区 B', '侯家塘污水分区 C', '东城污水分区 D', '雨花雨水汇水区 1'][i % 5],
      status: statuses[i % 5],
      buildYear: 2010 + (i % 14),
    }
    if (tab === 'pipe') Object.assign(base, { type: ['雨水管', '污水管', '合流管'][i % 3], material: ['PE', 'HDPE', '钢筋混凝土'][i % 3], diameter: `DN${[300, 400, 600][i % 3]}`, length: (Math.random() * 500 + 10).toFixed(1) })
    if (tab === 'well') Object.assign(base, { wellType: ['圆形检查井', '矩形检查井', '跌水井'][i % 3], depth: (1.5 + Math.random() * 4).toFixed(1), material: ['球墨铸铁', '复合材料', '混凝土'][i % 3] })
    if (tab === 'rainInlet') Object.assign(base, { inletType: ['平箅式', '立箅式', '联合式'][i % 3], size: ['680×380', '750×450', '900×500'][i % 3], road: ['韶山路', '劳动路', '和平街'][i % 3] })
    if (tab === 'user') Object.assign(base, { userType: ['工业', '商业', '餐饮', '医疗'][i % 4], permit: `PWP-2024-${String(i + 1).padStart(4, '0')}`, dailyVolume: (50 + Math.random() * 500).toFixed(0) })
    if (tab === 'pump') Object.assign(base, { capacity: [200, 350, 500][i % 3], pumpCount: [2, 3, 4][i % 3], power: [30, 55, 110][i % 3] })
    if (tab === 'sewagePlant') Object.assign(base, { capacity: [5, 10, 20][i % 3], process: ['AAO', 'MBR', 'SBR'][i % 3] })
    if (tab === 'gate') Object.assign(base, { gateType: ['平板闸门', '拍门', '蝶阀'][i % 3], size: ['1000×800', '800×600', '600×400'][i % 3] })
    if (tab === 'interceptor') Object.assign(base, { intType: ['截流井', '截流闸', '调蓄池'][i % 3], capacity: [100, 200, 500][i % 3] })
    if (tab === 'weir') Object.assign(base, { weirType: ['矩形堰', '三角堰', 'V型堰'][i % 3], elevation: (2 + Math.random() * 3).toFixed(2) })
    if (tab === 'valve') Object.assign(base, { valveType: ['蝶阀', '闸阀', '止回阀'][i % 3], diameter: `DN${[100, 200, 300][i % 3]}` })
    if (tab === 'outlet') Object.assign(base, { outletType: ['雨水排放口', '溢流排放口', '合流排放口'][i % 3], receiver: ['圭塘河', '北河', '南溪'][i % 3] })
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
  let list = currentData.value
  const q = searchQuery.value.toLowerCase()
  if (q) list = list.filter(f => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q))
  if (filterDistrict.value) list = list.filter(f => f.district === filterDistrict.value)
  if (filterStatus.value) list = list.filter(f => f.status === filterStatus.value)
  // 额外筛选条件
  for (const ef of activeExtraFilters.value) {
    const val = extraFilterValues.value[ef.key]
    if (val) list = list.filter(f => String(f[ef.key]) === val)
  }
  return list
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
  extraFilterValues.value = {}
  filterDistrict.value = ''
  filterStatus.value = ''
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
const addForm = ref<Record<string, string>>({})
function openAdd() {
  const form: Record<string, string> = {}
  allColumns.value?.forEach(c => { form[c.key] = '' })
  addForm.value = form
  showAddModal.value = true
}
function doAdd() {
  if (!addForm.value.name) { toast.value?.show('请输入名称', 'warning'); return }
  const newItem: Record<string, any> = { id: Date.now(), ...addForm.value }
  if (!newItem.status) newItem.status = '正常'
  if (!tabDataCache.value[activeTab.value]) tabDataCache.value[activeTab.value] = generateData(activeTab.value)
  tabDataCache.value[activeTab.value]!.unshift(newItem)
  showAddModal.value = false
  toast.value?.show('新增成功', 'success')
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

// 编辑弹窗
const showEditModal = ref(false)
const editForm = ref<Record<string, any>>({})
function openEdit(item: Record<string, any>) { editForm.value = { ...item }; showEditModal.value = true }
function doEdit() {
  const list = tabDataCache.value[activeTab.value]
  if (list) {
    const idx = list.findIndex(i => i.id === editForm.value.id)
    if (idx >= 0) list[idx] = { ...editForm.value }
  }
  showEditModal.value = false
  toast.value?.show('编辑保存成功', 'success')
}

// 生命周期管理
const showLifecycleModal = ref(false)
const lifecycleItem = ref<Record<string, any>>({})
const lifecycleEvents = ref([
  { date: '2018-03-15', event: '建档', operator: '张工', desc: '设施竣工建档录入' },
  { date: '2020-06-20', event: '例行检测', operator: '李工', desc: '年度检测合格' },
  { date: '2022-09-10', event: '维修', operator: '王工', desc: '密封更换' },
  { date: '2023-11-05', event: '复检', operator: '赵工', desc: '维修后复检合格' },
])
function openLifecycle(item: Record<string, any>) { lifecycleItem.value = item; showLifecycleModal.value = true }

// 字段配置
const showFieldConfig = ref(false)
const fieldVisibility = ref<Record<string, boolean>>({})
function openFieldConfig() {
  if (Object.keys(fieldVisibility.value).length === 0) {
    allColumns.value?.forEach(c => { fieldVisibility.value[c.key] = true })
  }
  showFieldConfig.value = true
}
function applyFieldConfig() {
  showFieldConfig.value = false
  toast.value?.show('字段配置已应用，表格已更新', 'success')
}
function resetFieldConfig() {
  allColumns.value?.forEach(c => { fieldVisibility.value[c.key] = true })
  toast.value?.show('已恢复默认配置', 'info')
}

// 高级查询
const showAdvFilter = ref(false)
const filterDistrict = ref('')
const filterStatus = ref('')

// 每种 tab 的额外筛选字段
const tabExtraFilters: Record<string, { key: string; label: string; options: string[] }[]> = {
  pipe: [
    { key: 'type', label: '管道类型', options: ['雨水管', '污水管', '合流管'] },
    { key: 'material', label: '材质', options: ['PE', 'HDPE', '钢筋混凝土'] },
    { key: 'diameter', label: '管径', options: ['DN300', 'DN400', 'DN600'] },
  ],
  well: [
    { key: 'wellType', label: '井类型', options: ['圆形检查井', '矩形检查井', '跌水井'] },
    { key: 'material', label: '井盖材质', options: ['球墨铸铁', '复合材料', '混凝土'] },
  ],
  rainInlet: [
    { key: 'inletType', label: '雨水口类型', options: ['平箅式', '立箅式', '联合式'] },
    { key: 'road', label: '所在道路', options: ['韶山路', '劳动路', '和平街'] },
  ],
  user: [
    { key: 'userType', label: '类型', options: ['工业', '商业', '餐饮', '医疗'] },
  ],
  pump: [
    { key: 'capacity', label: '设计流量', options: ['200', '350', '500'] },
  ],
  sewagePlant: [
    { key: 'process', label: '处理工艺', options: ['AAO', 'MBR', 'SBR'] },
  ],
  gate: [
    { key: 'gateType', label: '类型', options: ['平板闸门', '拍门', '蝶阀'] },
  ],
  interceptor: [
    { key: 'intType', label: '类型', options: ['截流井', '截流闸', '调蓄池'] },
  ],
  outlet: [
    { key: 'outletType', label: '类型', options: ['雨水排放口', '溢流排放口', '合流排放口'] },
    { key: 'receiver', label: '受纳水体', options: ['圭塘河', '北河', '南溪'] },
  ],
  device: [
    { key: 'devType', label: '设备类型', options: ['流量计', '液位计', '雨量计', '水质分析仪'] },
  ],
}

const extraFilterValues = ref<Record<string, string>>({})
const activeExtraFilters = computed(() => tabExtraFilters[activeTab.value] || [])

// 生命周期状态变更
const lifecycleStages = ['建档', '运行', '检修', '维修', '改造', '停用', '报废']
const newLifecycleStage = ref('')
const newLifecycleDesc = ref('')
function changeLifecycleStatus() {
  if (!newLifecycleStage.value) { toast.value?.show('请选择目标状态', 'warning'); return }
  lifecycleEvents.value.push({
    date: new Date().toISOString().slice(0, 10),
    event: newLifecycleStage.value,
    operator: '当前用户',
    desc: newLifecycleDesc.value || `状态变更为${newLifecycleStage.value}`
  })
  // 同步更新数据源状态
  const list = tabDataCache.value[activeTab.value]
  if (list) {
    const item = list.find(i => i.id === lifecycleItem.value.id)
    if (item) {
      if (newLifecycleStage.value === '报废') item.status = '已报废'
      else if (newLifecycleStage.value === '停用') item.status = '已停用'
      else if (newLifecycleStage.value === '维修') item.status = '维修中'
      else item.status = '正常'
    }
  }
  newLifecycleStage.value = ''
  newLifecycleDesc.value = ''
  toast.value?.show('生命周期状态已更新', 'success')
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
        <button @click="showAdvFilter = !showAdvFilter"
          class="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
          <Filter class="w-3.5 h-3.5" /> 高级筛选
        </button>
        <button @click="openFieldConfig"
          class="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
          <Settings class="w-3.5 h-3.5" /> 字段配置
        </button>
        <button @click="openAdd"
          class="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
          <Plus class="w-3.5 h-3.5" /> 新增
        </button>
      </div>
    </div>

    <!-- 高级筛选面板 -->
    <div v-if="showAdvFilter"
      class="bg-card border border-themed rounded-xl shadow-themed p-3 flex items-end gap-3 flex-wrap">
      <div><label class="text-[10px] text-dim block mb-1">区域</label><select v-model="filterDistrict"
          class="bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default">
          <option value="">全部</option>
          <option>圭塘街道</option>
          <option>洞井街道</option>
          <option>侯家塘街道</option>
          <option>雨花亭街道</option>
          <option>左家塘街道</option>
        </select></div>
      <div><label class="text-[10px] text-dim block mb-1">状态</label><select v-model="filterStatus"
          class="bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default">
          <option value="">全部</option>
          <option>正常</option>
          <option>轻微缺陷</option>
          <option>需维修</option>
        </select></div>
      <div v-for="ef in activeExtraFilters" :key="ef.key">
        <label class="text-[10px] text-dim block mb-1">{{ ef.label }}</label>
        <select v-model="extraFilterValues[ef.key]"
          class="bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default">
          <option value="">全部</option>
          <option v-for="opt in ef.options" :key="opt">{{ opt }}</option>
        </select>
      </div>
      <button @click="extraFilterValues = {}; filterDistrict = ''; filterStatus = ''"
        class="px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default cursor-pointer">重置</button>
      <button @click="showAdvFilter = false"
        class="px-3 py-1.5 bg-primary text-white rounded-md text-xs cursor-pointer">应用筛选</button>
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
                <select v-else-if="col.key === 'partition'" v-model="item[col.key]"
                  class="bg-transparent border border-themed rounded px-1.5 py-0.5 text-[10px] text-primary font-medium cursor-pointer focus:outline-none focus:border-primary w-full max-w-[140px]"
                  @change="toast?.show(`已关联到 ${item[col.key]}`, 'success')">
                  <option value="">未关联</option>
                  <option>雨花污水分区 A</option>
                  <option>洞井污水分区 B</option>
                  <option>侯家塘污水分区 C</option>
                  <option>东城污水分区 D</option>
                  <option>雨花雨水汇水区 1</option>
                  <option>洞井雨水汇水区 2</option>
                </select>
                <span v-else>{{ item[col.key] }}</span>
              </td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-1">
                  <button @click="viewDetail(item)"
                    class="p-1 rounded hover:bg-primary/10 text-primary transition-colors cursor-pointer" title="查看">
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <button @click="openEdit(item)"
                    class="p-1 rounded hover:bg-info/10 text-info transition-colors cursor-pointer" title="编辑">
                    <Edit3 class="w-3.5 h-3.5" />
                  </button>
                  <button @click="openLifecycle(item)"
                    class="p-1 rounded hover:bg-success/10 text-success transition-colors cursor-pointer" title="生命周期">
                    <History class="w-3.5 h-3.5" />
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
      width="600px" @close="showAddModal = false" @confirm="doAdd">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="col in allColumns" :key="col.key">
          <label class="text-[10px] text-dim mb-1 block">{{ col.label }} <span v-if="col.key === 'name'"
              class="text-danger">*</span></label>
          <select v-if="col.key === 'status'" v-model="addForm[col.key]"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
            <option>正常</option>
            <option>轻微缺陷</option>
            <option>需维修</option>
          </select>
          <select v-else-if="col.key === 'district'" v-model="addForm[col.key]"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
            <option>圭塘街道</option>
            <option>洞井街道</option>
            <option>侯家塘街道</option>
            <option>雨花亭街道</option>
            <option>左家塘街道</option>
          </select>
          <input v-else v-model="addForm[col.key]" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            :placeholder="'请输入' + col.label" />
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

    <!-- 编辑弹窗 -->
    <ModalDialog :show="showEditModal" :title="'编辑 ' + (editForm.name || '')" width="560px"
      @close="showEditModal = false" @confirm="doEdit">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="col in columns" :key="col.key">
          <label class="text-[10px] text-dim mb-1 block">{{ col.label }}</label>
          <input v-model="editForm[col.key]" type="text"
            class="w-full bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary" />
        </div>
      </div>
    </ModalDialog>

    <!-- 生命周期弹窗 -->
    <ModalDialog :show="showLifecycleModal" :title="'生命周期 · ' + (lifecycleItem.name || '')" width="560px"
      @close="showLifecycleModal = false" @confirm="showLifecycleModal = false">
      <div class="space-y-3">
        <div class="flex items-center gap-2 text-xs mb-1"><span class="text-dim">编号:</span><span
            class="text-primary font-mono">{{ lifecycleItem.code }}</span><span class="text-dim ml-2">当前状态:</span><span
            class="text-success font-medium">{{ lifecycleItem.status }}</span></div>

        <!-- 时间线 -->
        <div class="border border-themed rounded-lg p-3 max-h-48 overflow-y-auto">
          <div v-for="(evt, idx) in lifecycleEvents" :key="idx" class="flex gap-3 relative">
            <div class="flex flex-col items-center">
              <div class="w-2.5 h-2.5 rounded-full z-10"
                :class="idx === lifecycleEvents.length - 1 ? 'bg-primary' : 'bg-primary/40'"></div>
              <div v-if="idx < lifecycleEvents.length - 1" class="w-0.5 flex-1 bg-primary/20"></div>
            </div>
            <div class="pb-3 flex-1">
              <div class="flex items-center gap-2"><span class="text-xs font-bold text-default">{{ evt.event
              }}</span><span class="text-[10px] text-dim">{{ evt.date }}</span></div>
              <p class="text-[10px] text-dim">{{ evt.operator }} · {{ evt.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 状态变更操作 -->
        <div class="border border-themed rounded-lg p-3 bg-surface">
          <span class="text-[10px] font-bold text-default block mb-2">操作: 变更生命周期状态</span>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] text-dim block mb-1">目标状态</label>
              <select v-model="newLifecycleStage"
                class="w-full bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default">
                <option value="">请选择</option>
                <option v-for="s in lifecycleStages" :key="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] text-dim block mb-1">备注说明</label>
              <input v-model="newLifecycleDesc" type="text"
                class="w-full bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default"
                placeholder="可选" />
            </div>
          </div>
          <button @click="changeLifecycleStatus"
            class="mt-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs cursor-pointer hover:bg-primary-light transition-colors">确认变更</button>
        </div>
      </div>
    </ModalDialog>

    <!-- 字段配置弹窗 -->
    <ModalDialog :show="showFieldConfig" title="属性字段自定义配置" @close="showFieldConfig = false" @confirm="applyFieldConfig">
      <p class="text-[10px] text-dim mb-3">勾选需要在台账列表中显示的字段，取消勾选将隐藏对应列</p>
      <div class="space-y-1.5">
        <label v-for="col in allColumns" :key="col.key"
          class="flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed cursor-pointer">
          <input type="checkbox" v-model="fieldVisibility[col.key]" class="w-3.5 h-3.5 accent-primary cursor-pointer" />
          <span class="text-xs text-default">{{ col.label }}</span>
          <span class="text-[10px] text-dim ml-auto">{{ col.key }}</span>
        </label>
      </div>
      <button @click="resetFieldConfig"
        class="mt-3 text-[10px] text-primary cursor-pointer hover:underline">恢复默认配置</button>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
