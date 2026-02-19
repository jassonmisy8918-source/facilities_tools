<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserCheck, Building2, Search, Plus, FileText, Filter } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

const typeFilter = ref('all')
const searchText = ref('')

const typeOptions = [
  { key: 'all', label: '全部' },
  { key: 'industrial', label: '工业' },
  { key: 'commercial', label: '商业' },
  { key: 'catering', label: '餐饮' },
  { key: 'medical', label: '医疗' },
  { key: 'residential', label: '居民' },
]

const users = ref([
  { id: 'DU-001', name: '朝阳化工有限公司', type: 'industrial', address: '朝阳路288号', contact: '王经理', phone: '139****0001', permitNo: 'PS-2024-001', waterVolume: 850, pollutant: 'COD,SS,NH3-N', status: 'normal', expireDate: '2025-06-30' },
  { id: 'DU-002', name: '翠湖商业广场', type: 'commercial', address: '新华街58号', contact: '李总', phone: '138****0002', permitNo: 'PS-2024-002', waterVolume: 320, pollutant: 'COD,BOD', status: 'normal', expireDate: '2025-08-15' },
  { id: 'DU-003', name: '美味轩酒楼', type: 'catering', address: '民生路120号', contact: '陈店长', phone: '137****0003', permitNo: 'PS-2024-003', waterVolume: 45, pollutant: 'COD,动植物油', status: 'warning', expireDate: '2024-04-30' },
  { id: 'DU-004', name: '和平区人民医院', type: 'medical', address: '和平路800号', contact: '赵主任', phone: '136****0004', permitNo: 'PS-2024-004', waterVolume: 280, pollutant: 'COD,NH3-N,粪大肠', status: 'normal', expireDate: '2025-12-31' },
  { id: 'DU-005', name: '东湖花园小区', type: 'residential', address: '东湖路56号', contact: '物业刘', phone: '135****0005', permitNo: 'PS-2024-005', waterVolume: 2200, pollutant: 'COD,SS', status: 'normal', expireDate: '2025-10-15' },
  { id: 'DU-006', name: '建设机械厂', type: 'industrial', address: '建设大道350号', contact: '孙厂长', phone: '134****0006', permitNo: 'PS-2023-006', waterVolume: 1500, pollutant: 'COD,重金属', status: 'overdue', expireDate: '2024-01-31' },
])

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    if (typeFilter.value !== 'all' && u.type !== typeFilter.value) return false
    if (searchText.value && !u.name.includes(searchText.value) && !u.address.includes(searchText.value)) return false
    return true
  })
})

function getTypeText(t: string) { return t === 'industrial' ? '工业' : t === 'commercial' ? '商业' : t === 'catering' ? '餐饮' : t === 'medical' ? '医疗' : '居民' }
function getTypeClass(t: string) { return t === 'industrial' ? 'bg-danger/15 text-danger' : t === 'commercial' ? 'bg-info/15 text-info' : t === 'catering' ? 'bg-warning/15 text-warning' : t === 'medical' ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success' }
function getStatusClass(s: string) { return s === 'normal' ? 'bg-success/15 text-success' : s === 'warning' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger' }
function getStatusText(s: string) { return s === 'normal' ? '正常' : s === 'warning' ? '即将过期' : '已过期' }

// 新增排水户弹窗
const showAddModal = ref(false)
const addForm = ref({ name: '', type: 'industrial', address: '', contact: '', phone: '' })
function openAdd() { addForm.value = { name: '', type: 'industrial', address: '', contact: '', phone: '' }; showAddModal.value = true }
function doAdd() {
  if (!addForm.value.name) { toast.value?.show('请输入排水户名称', 'warning'); return }
  users.value.unshift({ id: `DU-${String(users.value.length + 1).padStart(3, '0')}`, name: addForm.value.name, type: addForm.value.type, address: addForm.value.address, contact: addForm.value.contact, phone: addForm.value.phone, permitNo: '待申请', waterVolume: 0, pollutant: '待检测', status: 'normal', expireDate: '待设定' })
  showAddModal.value = false
  toast.value?.show('排水户新增成功', 'success')
}
</script>

<template>
  <div class="space-y-4">
    <!-- 搜索 + 筛选 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
          <button v-for="opt in typeOptions" :key="opt.key" @click="typeFilter = opt.key"
            class="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
            :class="typeFilter === opt.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
            {{ opt.label }}
          </button>
        </div>
        <div class="flex items-center gap-1 bg-input border border-themed rounded-md px-2 py-1.5">
          <Search class="w-3.5 h-3.5 text-dim" />
          <input v-model="searchText" type="text" placeholder="搜索名称或地址..."
            class="bg-transparent text-xs text-default placeholder:text-muted-themed focus:outline-none w-40" />
        </div>
      </div>
      <button @click="openAdd"
        class="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
        <Plus class="w-3.5 h-3.5" /> 新增排水户
      </button>
    </div>

    <!-- 表格 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-themed">
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">名称</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">地址</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">许可证号</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">日排量(m³)</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">主要污染物</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">有效期</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u.id"
            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
            <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ u.id }}</td>
            <td class="px-4 py-2.5 text-xs font-medium text-default">{{ u.name }}</td>
            <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md" :class="getTypeClass(u.type)">{{
              getTypeText(u.type) }}</span></td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ u.address }}</td>
            <td class="px-4 py-2.5 text-xs text-dim font-mono">{{ u.permitNo }}</td>
            <td class="px-4 py-2.5 text-xs text-default font-medium">{{ u.waterVolume.toLocaleString() }}</td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ u.pollutant }}</td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ u.expireDate }}</td>
            <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                :class="getStatusClass(u.status)">{{ getStatusText(u.status) }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增排水户弹窗 -->
    <ModalDialog :show="showAddModal" title="新增排水户" @close="showAddModal = false" @confirm="doAdd">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-dim mb-1 block">排水户名称 <span class="text-danger">*</span></label>
          <input v-model="addForm.name" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="请输入名称" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-dim mb-1 block">类型</label>
            <select v-model="addForm.type"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
              <option value="industrial">工业</option>
              <option value="commercial">商业</option>
              <option value="catering">餐饮</option>
              <option value="medical">医疗</option>
              <option value="residential">居民</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-dim mb-1 block">联系人</label>
            <input v-model="addForm.contact" type="text"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">地址</label>
          <input v-model="addForm.address" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="请输入地址" />
        </div>
      </div>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
