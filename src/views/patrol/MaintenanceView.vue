<script setup lang="ts">
import { ref } from 'vue'
import { Wrench, Gauge, Truck, DollarSign, Plus, Download } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// 养护管理 Tab —— 需求 9.1.3.4.3
const maintenanceTabs = [
  { key: 'records', label: '养护记录' },
  { key: 'plan', label: '养护计划' },
  { key: 'instrument', label: '仪表维护' },
  { key: 'equipment', label: '设备管理' },
]
const activeTab = ref('records')

// 养护记录
const records = ref([
  { id: 'MN-001', type: '管道清淤', target: '朝阳路DN600 P01-P10段', team: '养护一队', startDate: '2024-03-14', endDate: '2024-03-16', status: 'processing', progress: 60, cost: 12500 },
  { id: 'MN-002', type: 'CCTV检测', target: '民生路DN400 全段', team: '检测组', startDate: '2024-03-13', endDate: '2024-03-18', status: 'processing', progress: 35, cost: 28000 },
  { id: 'MN-003', type: '管道修复', target: '和平路DN300 P05-P06段', team: '养护二队', startDate: '2024-03-12', endDate: '2024-03-13', status: 'completed', progress: 100, cost: 45000 },
  { id: 'MN-004', type: '检查井维修', target: '新华街 检查井#45~#50', team: '养护三队', startDate: '2024-03-15', endDate: '2024-03-17', status: 'pending', progress: 0, cost: 8000 },
  { id: 'MN-005', type: '雨水口清掏', target: '建设大道 全线雨水口', team: '养护一队', startDate: '2024-03-10', endDate: '2024-03-11', status: 'completed', progress: 100, cost: 6500 },
])

// 养护计划
const maintenancePlans = ref([
  { id: 'MP-001', name: '2024年Q1管道清淤计划', scope: '全市主干管', totalLength: '128.5km', completedLength: '85.2km', progress: 66, budget: 580000, spent: 382000, status: 'active' },
  { id: 'MP-002', name: '2024年检查井普查养护', scope: '朝阳区+海淀区', totalCount: 3200, completedCount: 1856, progress: 58, budget: 150000, spent: 86000, status: 'active' },
  { id: 'MP-003', name: '排放口季度维护', scope: '全市排放口', totalCount: 89, completedCount: 0, progress: 0, budget: 45000, spent: 0, status: 'pending' },
])

// 仪表维护
const instrumentRecords = ref([
  { id: 'IC-001', device: '朝阳路流量计 FM-201', type: '流量计校准', calibDate: '2024-03-10', nextCalib: '2024-06-10', result: '合格', deviation: '±0.5%' },
  { id: 'IC-002', device: '民生路液位计 LS-105', type: '液位计校准', calibDate: '2024-03-08', nextCalib: '2024-06-08', result: '合格', deviation: '±1mm' },
  { id: 'IC-003', device: '和平路水质分析仪 WQ-302', type: '水质仪校准', calibDate: '2024-02-25', nextCalib: '2024-05-25', result: '合格', deviation: '±2%' },
  { id: 'IC-004', device: '东湖雨量计 RG-051', type: '雨量计校准', calibDate: '2024-01-15', nextCalib: '2024-04-15', result: '需复检', deviation: '±5%' },
])

// 设备管理
const equipmentList = ref([
  { id: 'VH-001', name: '清淤车 A-01', type: '车辆', model: '东风D9', status: 'in-use', assignee: '养护一队', mileage: 45230 },
  { id: 'VH-002', name: 'CCTV检测机器人', type: '检测仪器', model: 'ROVVER X', status: 'available', assignee: '检测组', mileage: 0 },
  { id: 'VH-003', name: '管道封堵器', type: '工具', model: 'PB-600', status: 'available', assignee: '养护二队', mileage: 0 },
  { id: 'VH-004', name: '抢修车 B-02', type: '车辆', model: '江铃域虎', status: 'in-use', assignee: '养护三队', mileage: 32100 },
  { id: 'VH-005', name: '声呐检测仪', type: '检测仪器', model: 'SL-300', status: 'maintenance', assignee: '检测组', mileage: 0 },
])

// 养护成本统计
const costSummary = { total: 100000, material: 38000, labor: 42000, equipment: 20000 }

function getStatusClass(s: string) { return s === 'completed' ? 'bg-success/15 text-success' : s === 'processing' || s === 'active' || s === 'in-use' ? 'bg-info/15 text-info' : s === 'available' ? 'bg-success/15 text-success' : s === 'maintenance' ? 'bg-warning/15 text-warning' : 'bg-warning/15 text-warning' }
function getStatusText(s: string) { return s === 'completed' ? '已完成' : s === 'processing' ? '进行中' : s === 'active' ? '执行中' : s === 'pending' ? '待开始' : s === 'in-use' ? '使用中' : s === 'available' ? '可用' : '维修中' }

// 新增养护记录弹窗
const showAddModal = ref(false)
const addForm = ref({ type: '管道清淤', target: '', team: '养护一队' })
function openAdd() { addForm.value = { type: '管道清淤', target: '', team: '养护一队' }; showAddModal.value = true }
function doAdd() {
  if (!addForm.value.target) { toast.value?.show('请输入养护对象', 'warning'); return }
  records.value.unshift({ id: `MN-${String(records.value.length + 1).padStart(3, '0')}`, type: addForm.value.type, target: addForm.value.target, team: addForm.value.team, startDate: new Date().toISOString().slice(0, 10), endDate: '待定', status: 'pending', progress: 0, cost: 0 })
  showAddModal.value = false
  toast.value?.show('养护记录已创建', 'success')
}
function handleExport() { toast.value?.show('养护记录导出中...', 'info') }
</script>

<template>
  <div class="space-y-4">
    <!-- Tab -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
        <button v-for="tab in maintenanceTabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }}
        </button>
      </div>
      <!-- 操作按钮 -->
      <div class="flex items-center gap-2">
        <button @click="handleExport"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
          <Download class="w-3 h-3" /> 导出
        </button>
        <button @click="openAdd"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
          <Plus class="w-3 h-3" /> 新增记录
        </button>
      </div>
    </div>

    <!-- 养护记录表格 -->
    <template v-if="activeTab === 'records'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">养护类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">养护对象</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">执行团队</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">起止时间</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">费用(¥)</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">进度</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in records" :key="r.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ r.id }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ r.type }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.target }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.team }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ r.startDate }} ~ {{ r.endDate }}</td>
              <td class="px-4 py-2.5 text-xs text-default font-medium">{{ r.cost.toLocaleString() }}</td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-surface rounded-full h-1.5">
                    <div class="h-1.5 rounded-full" :class="r.progress === 100 ? 'bg-success' : 'bg-primary'"
                      :style="{ width: r.progress + '%' }"></div>
                  </div>
                  <span class="text-[10px] text-muted-themed">{{ r.progress }}%</span>
                </div>
              </td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getStatusClass(r.status)">{{ getStatusText(r.status) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 养护计划 -->
    <template v-if="activeTab === 'plan'">
      <div class="space-y-3">
        <div v-for="p in maintenancePlans" :key="p.id"
          class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="text-sm font-semibold text-default">{{ p.name }}</h4>
              <p class="text-xs text-dim mt-0.5">{{ p.scope }}</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(p.status)">{{
              getStatusText(p.status) }}</span>
          </div>
          <div class="flex items-center gap-6 text-xs mb-3">
            <div class="text-dim">进度:
              <span class="text-default font-medium">{{ p.progress }}%</span>
            </div>
            <div class="text-dim">预算:
              <span class="text-default font-medium">¥{{ p.budget.toLocaleString() }}</span>
            </div>
            <div class="text-dim">已用:
              <span class="font-medium" :class="p.spent > p.budget * 0.9 ? 'text-danger' : 'text-default'">¥{{
                p.spent.toLocaleString() }}</span>
            </div>
          </div>
          <div class="w-full bg-surface rounded-full h-2">
            <div class="h-2 rounded-full bg-primary transition-all" :style="{ width: p.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 仪表维护 -->
    <template v-if="activeTab === 'instrument'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">设备</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">校准类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">校准日期</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">下次校准</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">偏差</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ic in instrumentRecords" :key="ic.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ ic.id }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ ic.device }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ic.type }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ic.calibDate }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ic.nextCalib }}</td>
              <td class="px-4 py-2.5 text-xs text-default font-mono">{{ ic.deviation }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="ic.result === '合格' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'">{{ ic.result
                  }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 设备管理 -->
    <template v-if="activeTab === 'equipment'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">名称</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">型号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">分配</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eq in equipmentList" :key="eq.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ eq.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ eq.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ eq.type }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ eq.model }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ eq.assignee }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getStatusClass(eq.status)">{{ getStatusText(eq.status) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 新增养护记录弹窗 -->
    <ModalDialog :show="showAddModal" title="新增养护记录" @close="showAddModal = false" @confirm="doAdd">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-dim mb-1 block">养护类型</label>
          <select v-model="addForm.type"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
            <option>管道清淤</option>
            <option>CCTV检测</option>
            <option>管道修复</option>
            <option>检查井维修</option>
            <option>雨水口清掘</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">养护对象 <span class="text-danger">*</span></label>
          <input v-model="addForm.target" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="例如：朝阳路 DN600 P01-P10段" />
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">执行团队</label>
          <select v-model="addForm.team"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
            <option>养护一队</option>
            <option>养护二队</option>
            <option>养护三队</option>
            <option>检测组</option>
          </select>
        </div>
      </div>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
