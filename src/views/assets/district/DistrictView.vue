<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  Droplets, CloudRain, Building2, Grid3X3,
  MapPin, Plus, Eye, Trash2, Search, Pencil, Link, Activity, Undo2
} from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
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
    { id: 1, name: '雨花污水分区 A', area: '12.5 km²', pipeLength: '486 km', facilities: { pipes: 2340, wells: 1560, pumps: 3, plants: 1 }, coverage: 95, status: '正常' },
    { id: 2, name: '洞井污水分区 B', area: '18.3 km²', pipeLength: '612 km', facilities: { pipes: 3120, wells: 2080, pumps: 4, plants: 1 }, coverage: 92, status: '正常' },
    { id: 3, name: '侯家塘污水分区 C', area: '8.7 km²', pipeLength: '324 km', facilities: { pipes: 1560, wells: 1040, pumps: 2, plants: 0 }, coverage: 88, status: '待优化' },
    { id: 4, name: '东城污水分区 D', area: '6.2 km²', pipeLength: '256 km', facilities: { pipes: 1230, wells: 820, pumps: 1, plants: 0 }, coverage: 91, status: '正常' },
  ],
  rain: [
    { id: 5, name: '雨花雨水汇水区 1', area: '15.8 km²', pipeLength: '380 km', facilities: { pipes: 1890, wells: 960, pumps: 2, plants: 0 }, coverage: 90, status: '正常' },
    { id: 6, name: '洞井雨水汇水区 2', area: '22.1 km²', pipeLength: '520 km', facilities: { pipes: 2560, wells: 1340, pumps: 3, plants: 0 }, coverage: 87, status: '待优化' },
    { id: 7, name: '左家塘雨水汇水区 3', area: '18.5 km²', pipeLength: '410 km', facilities: { pipes: 2040, wells: 1080, pumps: 2, plants: 0 }, coverage: 82, status: '待扩建' },
  ],
  admin: [
    { id: 8, name: '圭塘街道', area: '470.8 km²', pipeLength: '2,340 km', facilities: { pipes: 12560, wells: 8340, pumps: 12, plants: 3 }, coverage: 93, status: '正常' },
    { id: 9, name: '洞井街道', area: '431.0 km²', pipeLength: '2,120 km', facilities: { pipes: 11200, wells: 7450, pumps: 10, plants: 2 }, coverage: 91, status: '正常' },
    { id: 10, name: '侯家塘街道', area: '50.7 km²', pipeLength: '890 km', facilities: { pipes: 4560, wells: 3040, pumps: 5, plants: 1 }, coverage: 96, status: '正常' },
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

const filteredDistricts = computed(() => {
  if (!searchKeyword.value) return currentDistricts.value
  const kw = searchKeyword.value.toLowerCase()
  return currentDistricts.value.filter(d => d.name.toLowerCase().includes(kw))
})

// ===================== 新建分区（含地图打点） =====================
const showAddModal = ref(false)
const addForm = ref({ name: '', area: '', pipeLength: '', coverage: 90 })
const boundaryPoints = ref<[number, number][]>([])
const addMapRef = ref<HTMLElement>()
let addMapInstance: any = null
let addMapMarkers: any[] = []
let addMapPolygon: any = null

const AMAP_KEY = '2831a4407f599a6815d9fa2608676c9e'
const AMAP_SECURITY_CODE = '01051b2c2a2b850b592d80160a115710'

function loadAMapSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) { resolve(); return }
    if (AMAP_SECURITY_CODE) (window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }
    const existing = document.getElementById('amap-sdk')
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const s = document.createElement('script')
    s.id = 'amap-sdk'
    s.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('AMap load failed'))
    document.head.appendChild(s)
  })
}

function updatePolygon() {
  if (!addMapInstance) return
  const AMap = (window as any).AMap
  if (addMapPolygon) addMapInstance.remove(addMapPolygon)
  if (boundaryPoints.value.length >= 3) {
    addMapPolygon = new AMap.Polygon({
      path: boundaryPoints.value.map(([lng, lat]: [number, number]) => new AMap.LngLat(lng, lat)),
      fillColor: '#3B82F680', fillOpacity: 0.3,
      strokeColor: '#3B82F6', strokeWeight: 2,
    })
    addMapInstance.add(addMapPolygon)
  }
}

function undoLastPoint() {
  if (boundaryPoints.value.length === 0) return
  boundaryPoints.value.pop()
  const last = addMapMarkers.pop()
  if (last && addMapInstance) addMapInstance.remove(last)
  updatePolygon()
}

async function initAddMap() {
  await nextTick()
  if (!addMapRef.value) return
  try {
    await loadAMapSDK()
    const AMap = (window as any).AMap
    addMapInstance = new AMap.Map(addMapRef.value, {
      zoom: 13, center: [113.032549, 28.141], mapStyle: 'amap://styles/normal', resizeEnable: true,
    })
    addMapInstance.on('click', (e: any) => {
      const lnglat: [number, number] = [e.lnglat.getLng(), e.lnglat.getLat()]
      boundaryPoints.value.push(lnglat)
      const marker = new AMap.Marker({
        position: lnglat,
        label: { content: `<span style="font-size:10px;background:#3B82F6;color:#fff;padding:1px 5px;border-radius:3px">${boundaryPoints.value.length}</span>`, direction: 'top', offset: new AMap.Pixel(0, -4) },
      })
      addMapInstance.add(marker)
      addMapMarkers.push(marker)
      updatePolygon()
    })
  } catch (e) { console.error('AMap init failed:', e) }
}

function destroyAddMap() {
  if (addMapInstance) { addMapInstance.destroy(); addMapInstance = null }
  addMapMarkers = []; addMapPolygon = null
}

function handleAdd() {
  addForm.value = { name: '', area: '', pipeLength: '', coverage: 90 }
  boundaryPoints.value = []
  showAddModal.value = true
}

watch(showAddModal, (v) => { if (v) initAddMap(); else destroyAddMap() })

function doAdd() {
  if (!addForm.value.name) { toast.value?.show('请输入分区名称', 'warning'); return }
  if (boundaryPoints.value.length < 3) { toast.value?.show('请在地图上至少标注3个边界点', 'warning'); return }
  currentDistricts.value.push({
    id: Date.now(), name: addForm.value.name, area: addForm.value.area || '0 km²',
    pipeLength: addForm.value.pipeLength || '0 km',
    facilities: { pipes: 0, wells: 0, pumps: 0, plants: 0 },
    coverage: addForm.value.coverage, status: '正常',
    boundary: [...boundaryPoints.value],
  } as any)
  showAddModal.value = false
  toast.value?.show(`分区创建成功，包含 ${boundaryPoints.value.length} 个边界点`, 'success')
}

// ===================== 编辑分区 =====================
const showEditModal = ref(false)
const editForm = ref<any>({})
function handleEdit(d: any) { editForm.value = { ...d }; showEditModal.value = true }
function doEdit() {
  const idx = currentDistricts.value.findIndex(i => i.id === editForm.value.id)
  if (idx >= 0) currentDistricts.value[idx] = { ...editForm.value }
  showEditModal.value = false
  toast.value?.show('分区信息已更新', 'success')
}

// ===================== 查看详情 =====================
const showDetailModal = ref(false)
const detailItem = ref<any>({})
const detailTab = ref<'info' | 'bindFac' | 'bizData'>('info')
function handleView(d: any) { detailItem.value = d; detailTab.value = 'info'; showDetailModal.value = true }

// ===================== 设施绑定 =====================
const facilityPool = ref([
  { id: 'PS-001', name: '韶山路DN600管段', type: '管道', bound: false },
  { id: 'PS-002', name: '劳动路DN400管段', type: '管道', bound: false },
  { id: 'MH-001', name: '韶山路检查井#34', type: '检查井', bound: true },
  { id: 'MH-002', name: '万家丽路检查井#12', type: '检查井', bound: false },
  { id: 'BZ-01', name: '韶山路泵站', type: '泵站', bound: true },
  { id: 'BZ-02', name: '洞井泵站', type: '泵站', bound: false },
  { id: 'DV-01', name: '流量计-HD03', type: '监测设备', bound: true },
  { id: 'DV-02', name: '雨量计-CD01', type: '监测设备', bound: false },
  { id: 'OT-01', name: '圭塘河排放口', type: '排放口', bound: true },
  { id: 'OT-02', name: '浏阳河排放口', type: '排放口', bound: false },
])
const facFilterType = ref('all')
const filteredFacilities = computed(() => {
  let list = facilityPool.value
  if (facFilterType.value !== 'all') list = list.filter(f => f.type === facFilterType.value)
  return list
})
function toggleBind(fac: any) {
  fac.bound = !fac.bound
  toast.value?.show(fac.bound ? `已绑定 ${fac.name}` : `已解绑 ${fac.name}`, fac.bound ? 'success' : 'info')
}

// ===================== 业务数据关联 =====================
const bizPatrols = ref([
  { date: '2024-03-18', route: '韶山路沿线', team: '巡查一组', result: '正常', issues: 0 },
  { date: '2024-03-15', route: '劳动路-万家丽路', team: '巡查二组', result: '发现问题', issues: 2 },
  { date: '2024-03-12', route: '韶山路南段', team: '巡查一组', result: '正常', issues: 0 },
])
const bizMonitors = ref([
  { device: '流量计-HD03', param: '流量', latest: '520 m³/h', trend: '↑', status: '正常' },
  { device: '液位计-TZ02', param: '水位', latest: '2.8 m', trend: '→', status: '正常' },
  { device: '雨量计-CD01', param: '累计雨量', latest: '12.5 mm', trend: '↑', status: '预警' },
])

// ===================== 删除 =====================
const showDeleteModal = ref(false)
const deletingId = ref(0)
function confirmDelete(id: number) { deletingId.value = id; showDeleteModal.value = true }
function doDelete() {
  currentDistricts.value = currentDistricts.value.filter(d => d.id !== deletingId.value)
  showDeleteModal.value = false
  toast.value?.show('分区已删除', 'success')
}
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
          <tr v-for="d in filteredDistricts" :key="d.id"
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
                <button @click="handleView(d)"
                  class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer" title="查看">
                  <Eye class="w-3.5 h-3.5 text-primary" />
                </button>
                <button @click="handleEdit(d)"
                  class="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer" title="编辑">
                  <Pencil class="w-3.5 h-3.5 text-info" />
                </button>
                <button @click="confirmDelete(d.id)"
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

    <!-- 新建分区弹窗（含地图打点） -->
    <ModalDialog :show="showAddModal" title="新建分区" width="720px" @close="showAddModal = false" @confirm="doAdd">
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] text-dim block mb-1">分区名称 <span class="text-danger">*</span></label>
            <input v-model="addForm.name"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
              placeholder="例如：雨花污水分区 E" />
          </div>
          <div><label class="text-[10px] text-dim block mb-1">覆盖率 (%)</label>
            <input v-model.number="addForm.coverage" type="number" min="0" max="100"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" />
          </div>
          <div><label class="text-[10px] text-dim block mb-1">面积</label>
            <input v-model="addForm.area"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default"
              placeholder="例如：10.5 km²" />
          </div>
          <div><label class="text-[10px] text-dim block mb-1">管线长度</label>
            <input v-model="addForm.pipeLength"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default"
              placeholder="例如：350 km" />
          </div>
        </div>
        <!-- 地图打点区域 -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] text-dim">↓ 点击地图标注分区边界点（至少3个点形成多边形）</label>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-medium"
                :class="boundaryPoints.length >= 3 ? 'text-success' : 'text-warning'">{{ boundaryPoints.length }}
                个点</span>
              <button v-if="boundaryPoints.length > 0" @click="undoLastPoint"
                class="flex items-center gap-0.5 text-[10px] text-primary hover:underline cursor-pointer">
                <Undo2 class="w-3 h-3" />撤销
              </button>
            </div>
          </div>
          <div ref="addMapRef" class="w-full h-56 rounded-lg border border-themed overflow-hidden"></div>
          <div v-if="boundaryPoints.length > 0" class="mt-1 flex flex-wrap gap-1">
            <span v-for="(pt, i) in boundaryPoints" :key="i"
              class="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
              P{{ i + 1 }}: {{ pt[0].toFixed(4) }}, {{ pt[1].toFixed(4) }}
            </span>
          </div>
        </div>
      </div>
    </ModalDialog>

    <!-- 编辑分区弹窗 -->
    <ModalDialog :show="showEditModal" :title="'编辑 ' + (editForm.name || '')" @close="showEditModal = false"
      @confirm="doEdit">
      <div class="space-y-3">
        <div><label class="text-[10px] text-dim block mb-1">分区名称</label>
          <input v-model="editForm.name"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div><label class="text-[10px] text-dim block mb-1">面积</label>
            <input v-model="editForm.area"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" />
          </div>
          <div><label class="text-[10px] text-dim block mb-1">管线长度</label>
            <input v-model="editForm.pipeLength"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" />
          </div>
        </div>
        <div><label class="text-[10px] text-dim block mb-1">覆盖率 (%)</label>
          <input v-model.number="editForm.coverage" type="number" min="0" max="100"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default" />
        </div>
        <div><label class="text-[10px] text-dim block mb-1">状态</label>
          <select v-model="editForm.status"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default">
            <option>正常</option>
            <option>待优化</option>
            <option>待扩建</option>
          </select>
        </div>
      </div>
    </ModalDialog>

    <!-- 查看详情弹窗（含设施绑定 + 业务数据关联） -->
    <ModalDialog :show="showDetailModal" :title="detailItem.name || '分区详情'" width="640px"
      @close="showDetailModal = false" @confirm="showDetailModal = false">
      <!-- Tab 切换 -->
      <div class="flex items-center gap-0.5 bg-surface rounded-lg p-0.5 mb-3">
        <button @click="detailTab = 'info'"
          class="px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
          :class="detailTab === 'info' ? 'bg-primary text-white' : 'text-dim hover:text-default'">基本信息</button>
        <button @click="detailTab = 'bindFac'"
          class="flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
          :class="detailTab === 'bindFac' ? 'bg-primary text-white' : 'text-dim hover:text-default'">
          <Link class="w-3 h-3" />设施绑定
        </button>
        <button @click="detailTab = 'bizData'"
          class="flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
          :class="detailTab === 'bizData' ? 'bg-primary text-white' : 'text-dim hover:text-default'">
          <Activity class="w-3 h-3" />业务数据
        </button>
      </div>

      <!-- 基本信息 -->
      <div v-if="detailTab === 'info'" class="space-y-2 text-xs">
        <div class="grid grid-cols-2 gap-2">
          <div class="p-2 rounded-lg bg-surface">
            <p class="text-[10px] text-dim">面积</p>
            <p class="text-default font-medium">{{ detailItem.area }}</p>
          </div>
          <div class="p-2 rounded-lg bg-surface">
            <p class="text-[10px] text-dim">管线总长</p>
            <p class="text-default font-medium">{{ detailItem.pipeLength }}</p>
          </div>
          <div class="p-2 rounded-lg bg-surface">
            <p class="text-[10px] text-dim">管道数</p>
            <p class="text-primary font-bold">{{ detailItem.facilities?.pipes?.toLocaleString() }}</p>
          </div>
          <div class="p-2 rounded-lg bg-surface">
            <p class="text-[10px] text-dim">检查井</p>
            <p class="text-default font-medium">{{ detailItem.facilities?.wells?.toLocaleString() }}</p>
          </div>
          <div class="p-2 rounded-lg bg-surface">
            <p class="text-[10px] text-dim">泵站</p>
            <p class="text-default font-medium">{{ detailItem.facilities?.pumps }}</p>
          </div>
          <div class="p-2 rounded-lg bg-surface">
            <p class="text-[10px] text-dim">覆盖率</p>
            <p class="font-bold" :class="detailItem.coverage >= 90 ? 'text-success' : 'text-warning'">{{
              detailItem.coverage }}%</p>
          </div>
        </div>
        <div v-if="detailItem.boundary?.length" class="p-2 rounded-lg bg-surface">
          <p class="text-[10px] text-dim mb-1">边界坐标 ({{ detailItem.boundary.length }} 个点)</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="(pt, i) in detailItem.boundary" :key="i"
              class="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
              P{{ Number(i) + 1 }}: {{ pt[0].toFixed(4) }}, {{ pt[1].toFixed(4) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 设施绑定 -->
      <div v-if="detailTab === 'bindFac'" class="space-y-2">
        <div class="flex items-center gap-2 mb-1">
          <select v-model="facFilterType"
            class="bg-input border border-themed rounded-md px-2 py-1 text-[10px] text-default">
            <option value="all">全部类型</option>
            <option>管道</option>
            <option>检查井</option>
            <option>泵站</option>
            <option>监测设备</option>
            <option>排放口</option>
          </select>
          <span class="text-[10px] text-dim ml-auto">已绑定 {{facilityPool.filter(f => f.bound).length}} / {{
            facilityPool.length }}</span>
        </div>
        <div class="max-h-52 overflow-y-auto space-y-1">
          <div v-for="fac in filteredFacilities" :key="fac.id"
            class="flex items-center gap-2 p-2 rounded-lg hover:bg-hover-themed transition-colors">
            <span class="text-[10px] text-primary font-mono w-16">{{ fac.id }}</span>
            <span class="text-xs text-default flex-1">{{ fac.name }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ fac.type }}</span>
            <button @click="toggleBind(fac)"
              class="px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors"
              :class="fac.bound ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'bg-success/10 text-success hover:bg-success/20'">
              {{ fac.bound ? '解绑' : '绑定' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 业务数据关联 -->
      <div v-if="detailTab === 'bizData'" class="space-y-3">
        <div>
          <span class="text-xs font-bold text-default block mb-1.5">巡查记录</span>
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-themed bg-surface/50">
                <th class="text-left px-3 py-1.5 text-dim font-medium">日期</th>
                <th class="text-left px-3 py-1.5 text-dim font-medium">路线</th>
                <th class="text-left px-3 py-1.5 text-dim font-medium">班组</th>
                <th class="text-center px-3 py-1.5 text-dim font-medium">结果</th>
                <th class="text-center px-3 py-1.5 text-dim font-medium">问题数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in bizPatrols" :key="p.date" class="border-b border-themed/30">
                <td class="px-3 py-1.5 text-dim">{{ p.date }}</td>
                <td class="px-3 py-1.5 text-default">{{ p.route }}</td>
                <td class="px-3 py-1.5 text-default">{{ p.team }}</td>
                <td class="text-center px-3 py-1.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                    :class="p.result === '正常' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{ p.result
                    }}</span></td>
                <td class="text-center px-3 py-1.5" :class="p.issues > 0 ? 'text-danger font-bold' : 'text-dim'">{{
                  p.issues }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <span class="text-xs font-bold text-default block mb-1.5">监测数据</span>
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-themed bg-surface/50">
                <th class="text-left px-3 py-1.5 text-dim font-medium">设备</th>
                <th class="text-left px-3 py-1.5 text-dim font-medium">参数</th>
                <th class="text-left px-3 py-1.5 text-dim font-medium">最新值</th>
                <th class="text-center px-3 py-1.5 text-dim font-medium">趋势</th>
                <th class="text-center px-3 py-1.5 text-dim font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in bizMonitors" :key="m.device" class="border-b border-themed/30">
                <td class="px-3 py-1.5 text-primary font-medium">{{ m.device }}</td>
                <td class="px-3 py-1.5 text-default">{{ m.param }}</td>
                <td class="px-3 py-1.5 text-default font-mono">{{ m.latest }}</td>
                <td class="text-center px-3 py-1.5 text-lg">{{ m.trend }}</td>
                <td class="text-center px-3 py-1.5"><span class="text-[10px] px-1.5 py-0.5 rounded"
                    :class="m.status === '正常' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'">{{ m.status
                    }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ModalDialog>

    <!-- 删除确认 -->
    <ModalDialog :show="showDeleteModal" title="确认删除" @close="showDeleteModal = false" @confirm="doDelete">
      <p class="text-xs text-dim">确定要删除该分区吗？删除后关联的设施数据绑定将被解除。</p>
    </ModalDialog>
  </div>
</template>
