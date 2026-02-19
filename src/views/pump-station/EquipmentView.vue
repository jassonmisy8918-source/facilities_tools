<script setup lang="ts">
import { ref } from 'vue'
import { Settings, ClipboardCheck, Shield, Package, Wrench, Plus, Download } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// 泵站设备管理 Tab —— 需求 9.1.4.4.5
const equipTabs = [
  { key: 'list', label: '设备台账' },
  { key: 'inspection', label: '设备巡检' },
  { key: 'maintenance', label: '设备保养' },
  { key: 'spare', label: '备品备件' },
]
const activeTab = ref('list')

// 设备台账
const equipment = ref([
  { id: 'EQ-001', name: '1号离心泵', station: '朝阳路泵站', model: 'WQ200-15-15', power: '15kW', installDate: '2021-05-12', lastMaintenance: '2024-02-20', runtime: 12450, status: 'running', mtbf: 2100, availability: 98.5 },
  { id: 'EQ-002', name: '2号离心泵', station: '朝阳路泵站', model: 'WQ200-15-15', power: '15kW', installDate: '2021-05-12', lastMaintenance: '2024-01-15', runtime: 11200, status: 'standby', mtbf: 2050, availability: 97.8 },
  { id: 'EQ-003', name: '3号离心泵', station: '朝阳路泵站', model: 'WQ200-15-15', power: '15kW', installDate: '2021-05-12', lastMaintenance: '2024-03-05', runtime: 8800, status: 'running', mtbf: 2200, availability: 99.1 },
  { id: 'EQ-004', name: '1号潜污泵', station: '东湖泵站', model: 'WQ300-25-30', power: '30kW', installDate: '2020-03-20', lastMaintenance: '2024-02-10', runtime: 18600, status: 'running', mtbf: 1800, availability: 96.2 },
  { id: 'EQ-005', name: '2号潜污泵', station: '东湖泵站', model: 'WQ300-25-30', power: '30kW', installDate: '2020-03-20', lastMaintenance: '2024-01-25', runtime: 17200, status: 'fault', mtbf: 1650, availability: 92.5 },
])

// 巡检记录
const inspections = ref([
  { id: 'IP-001', device: '1号离心泵', station: '朝阳路泵站', inspector: '张伟', date: '2024-03-15', items: 12, passCount: 12, result: '合格', nextDate: '2024-03-22' },
  { id: 'IP-002', device: '2号潜污泵', station: '东湖泵站', inspector: '李明', date: '2024-03-14', items: 12, passCount: 10, result: '需关注', nextDate: '2024-03-21' },
  { id: 'IP-003', device: '闸门控制柜', station: '和平路泵站', inspector: '王强', date: '2024-03-13', items: 8, passCount: 8, result: '合格', nextDate: '2024-03-20' },
  { id: 'IP-004', device: '配电柜', station: '朝阳路泵站', inspector: '赵刚', date: '2024-03-12', items: 10, passCount: 9, result: '需关注', nextDate: '2024-03-19' },
])

// 保养记录
const maintenanceRecords = ref([
  { id: 'MT-001', device: '1号离心泵', station: '朝阳路泵站', type: '定期保养', date: '2024-02-20', content: '轴承润滑、密封件检查、电气绝缘测试', cost: 3500, nextDate: '2024-05-20' },
  { id: 'MT-002', device: '2号潜污泵', station: '东湖泵站', type: '故障维修', date: '2024-03-10', content: '轴承更换、定子绝缘处理、出水口密封更换', cost: 18500, nextDate: '—' },
  { id: 'MT-003', device: '闸阀组', station: '和平路泵站', type: '定期保养', date: '2024-03-05', content: '阀体清洗、密封圈更换、电控系统检测', cost: 5200, nextDate: '2024-06-05' },
])

// 备品备件
const spares = ref([
  { id: 'SP-001', name: '机械密封件', spec: 'WQ200配套', stock: 12, minStock: 5, unit: '套', price: 850 },
  { id: 'SP-002', name: '轴承 6310-2RS', spec: 'SKF原装', stock: 8, minStock: 4, unit: '个', price: 320 },
  { id: 'SP-003', name: '电缆 YJV-4×10', spec: '铜芯交联', stock: 200, minStock: 100, unit: '米', price: 25 },
  { id: 'SP-004', name: '接触器 CJ20-63', spec: '380V/63A', stock: 3, minStock: 3, unit: '个', price: 180 },
  { id: 'SP-005', name: '叶轮', spec: 'WQ300配套', stock: 2, minStock: 2, unit: '个', price: 6500 },
  { id: 'SP-006', name: '密封圈', spec: 'DN200丁腈橡胶', stock: 30, minStock: 10, unit: '个', price: 45 },
])

function getStatusClass(s: string) { return s === 'running' ? 'bg-success/15 text-success' : s === 'standby' ? 'bg-info/15 text-info' : 'bg-danger/15 text-danger' }
function getStatusText(s: string) { return s === 'running' ? '运行中' : s === 'standby' ? '待机' : '故障' }
function getResultClass(r: string) { return r === '合格' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning' }

// 入库弹窗
const showAddSpare = ref(false)
const spareForm = ref({ name: '', spec: '', stock: 10, minStock: 5, unit: '个', price: 0 })
function openAddSpare() { spareForm.value = { name: '', spec: '', stock: 10, minStock: 5, unit: '个', price: 0 }; showAddSpare.value = true }
function doAddSpare() {
  if (!spareForm.value.name) { toast.value?.show('请输入备件名称', 'warning'); return }
  spares.value.unshift({ id: `SP-${String(spares.value.length + 1).padStart(3, '0')}`, ...spareForm.value })
  showAddSpare.value = false
  toast.value?.show('备件已入库登记', 'success')
}
function handleExport() { toast.value?.show('数据导出中...', 'info') }
</script>

<template>
  <div class="space-y-4">
    <!-- Tab -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
        <button v-for="tab in equipTabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button @click="handleExport"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
          <Download class="w-3 h-3" /> 导出
        </button>
        <button v-if="activeTab === 'spare'" @click="openAddSpare"
          class="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
          <Plus class="w-3.5 h-3.5" /> 入库登记
        </button>
      </div>
    </div>

    <!-- 设备台账 -->
    <template v-if="activeTab === 'list'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">设备名称</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">型号/功率</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">运行时长(h)</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">MTBF(h)</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">可用率</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">上次保养</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eq in equipment" :key="eq.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ eq.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ eq.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ eq.station }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ eq.model }} / {{ eq.power }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ eq.runtime.toLocaleString() }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ eq.mtbf.toLocaleString() }}</td>
              <td class="px-4 py-2.5 text-xs font-medium"
                :class="eq.availability >= 97 ? 'text-success' : eq.availability >= 95 ? 'text-warning' : 'text-danger'">
                {{ eq.availability }}%</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ eq.lastMaintenance }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getStatusClass(eq.status)">{{ getStatusText(eq.status) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 巡检 -->
    <template v-if="activeTab === 'inspection'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">设备</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">巡检人</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">日期</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">检查项</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">下次巡检</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ip in inspections" :key="ip.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ ip.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ ip.device }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ip.station }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ip.inspector }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ip.date }}</td>
              <td class="px-4 py-2.5 text-xs text-default">{{ ip.passCount }}/{{ ip.items }} 通过</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ ip.nextDate }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getResultClass(ip.result)">{{ ip.result }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 保养 -->
    <template v-if="activeTab === 'maintenance'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">设备</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">日期</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">内容</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">费用(¥)</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">下次保养</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mt in maintenanceRecords" :key="mt.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ mt.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ mt.device }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ mt.station }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ mt.type }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ mt.date }}</td>
              <td class="px-4 py-2.5 text-xs text-dim max-w-[200px] truncate">{{ mt.content }}</td>
              <td class="px-4 py-2.5 text-xs text-default font-medium">{{ mt.cost.toLocaleString() }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ mt.nextDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 备品备件 -->
    <template v-if="activeTab === 'spare'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">名称</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">规格</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">库存</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">最低库存</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">单价(¥)</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">库存状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sp in spares" :key="sp.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ sp.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ sp.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ sp.spec }}</td>
              <td class="px-4 py-2.5 text-xs text-default font-medium">{{ sp.stock }} {{ sp.unit }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ sp.minStock }} {{ sp.unit }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ sp.price }}</td>
              <td class="px-4 py-2.5">
                <span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="sp.stock > sp.minStock ? 'bg-success/15 text-success' : sp.stock === sp.minStock ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'">
                  {{ sp.stock > sp.minStock ? '充足' : sp.stock === sp.minStock ? '预警' : '不足' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 入库登记弹窗 -->
    <ModalDialog :show="showAddSpare" title="备件入库登记" @close="showAddSpare = false" @confirm="doAddSpare">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-dim mb-1 block">备件名称 <span class="text-danger">*</span></label>
          <input v-model="spareForm.name" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="例如：机械密封件" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-dim mb-1 block">规格型号</label>
            <input v-model="spareForm.spec" type="text"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="text-xs text-dim mb-1 block">单位</label>
            <select v-model="spareForm.unit"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
              <option>个</option>
              <option>套</option>
              <option>米</option>
              <option>公斤</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="text-xs text-dim mb-1 block">入库数量</label>
            <input v-model.number="spareForm.stock" type="number"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="text-xs text-dim mb-1 block">最低库存</label>
            <input v-model.number="spareForm.minStock" type="number"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="text-xs text-dim mb-1 block">单价(¥)</label>
            <input v-model.number="spareForm.price" type="number"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
          </div>
        </div>
      </div>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
