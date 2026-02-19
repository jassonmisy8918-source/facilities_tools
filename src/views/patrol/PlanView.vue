<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Plus, MapPin, Users, Clock, Route, CheckCircle, Trash2, Edit, Search } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

// Tab
const planTabs = [
  { key: 'plan', label: '巡查计划' },
  { key: 'route', label: '巡查路线' },
  { key: 'schedule', label: '人员排班' },
]
const activeTab = ref('plan')

// Toast
const toast = ref<InstanceType<typeof ToastNotify>>()

// 搜索
const searchText = ref('')

// 计划数据
const plans = ref([
  { id: 1, name: '朝阳区日常巡查计划', frequency: '每日', assignee: '张伟、李明', area: '朝阳区全域', points: 45, nextRun: '2024-03-16 08:00', status: 'active', approval: 'approved' },
  { id: 2, name: '海淀区管网巡检', frequency: '每周', assignee: '王强', area: '海淀区主干管', points: 28, nextRun: '2024-03-18 09:00', status: 'active', approval: 'approved' },
  { id: 3, name: '泵站周边专项巡查', frequency: '每周', assignee: '赵刚、陈静', area: '全市泵站周边500m', points: 18, nextRun: '2024-03-19 08:30', status: 'active', approval: 'approved' },
  { id: 4, name: '排放口季度巡检', frequency: '每季', assignee: '周磊', area: '全市排放口', points: 89, nextRun: '2024-04-01 09:00', status: 'paused', approval: 'approved' },
  { id: 5, name: '雨季专项巡查', frequency: '汛期每日', assignee: '全员', area: '低洼易涝区', points: 36, nextRun: '2024-06-01 07:00', status: 'pending', approval: 'reviewing' },
])

const filteredPlans = computed(() => {
  if (!searchText.value) return plans.value
  return plans.value.filter(p => p.name.includes(searchText.value) || p.assignee.includes(searchText.value) || p.area.includes(searchText.value))
})

// 路线数据
const routes = ref([
  { id: 1, name: '朝阳路-民生路主线', length: '12.5km', points: 18, frequency: '每日', team: '一组', status: 'active' },
  { id: 2, name: '泵站环线巡检路线', length: '25.3km', points: 12, frequency: '每周', team: '二组', status: 'active' },
  { id: 3, name: '排放口巡查路线', length: '35.8km', points: 32, frequency: '每月', team: '三组', status: 'active' },
  { id: 4, name: '易涝点专项路线', length: '8.2km', points: 15, frequency: '汛期每日', team: '全员', status: 'pending' },
])

const schedules = ref([
  { id: 1, name: '张伟', team: '巡查一组', role: '组长', thisWeek: ['日常巡查', '日常巡查', '日常巡查', '日常巡查', '日常巡查', '休息', '休息'], status: 'active' },
  { id: 2, name: '李明', team: '巡查一组', role: '组员', thisWeek: ['日常巡查', '日常巡查', '日常巡查', '日常巡查', '休息', '日常巡查', '休息'], status: 'active' },
  { id: 3, name: '王强', team: '巡查二组', role: '组长', thisWeek: ['管网巡检', '休息', '管网巡检', '休息', '管网巡检', '休息', '休息'], status: 'active' },
  { id: 4, name: '赵刚', team: '巡查三组', role: '组长', thisWeek: ['泵站巡查', '休息', '泵站巡查', '休息', '泵站巡查', '休息', '休息'], status: 'active' },
  { id: 5, name: '周磊', team: '检测组', role: '组长', thisWeek: ['排放口巡检', '排放口巡检', '休息', '排放口巡检', '排放口巡检', '休息', '休息'], status: 'active' },
])

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 新建/编辑计划弹窗
const showPlanModal = ref(false)
const isEdit = ref(false)
const editForm = ref({ name: '', frequency: '每日', assignee: '', area: '', points: 0 })

function openCreatePlan() {
  isEdit.value = false
  editForm.value = { name: '', frequency: '每日', assignee: '', area: '', points: 0 }
  showPlanModal.value = true
}
function openEditPlan(plan: typeof plans.value[0]) {
  isEdit.value = true
  editForm.value = { name: plan.name, frequency: plan.frequency, assignee: plan.assignee, area: plan.area, points: plan.points }
  showPlanModal.value = true
}
function savePlan() {
  if (!editForm.value.name) { toast.value?.show('请输入计划名称', 'warning'); return }
  if (isEdit.value) {
    toast.value?.show('计划更新成功', 'success')
  } else {
    const newPlan = { id: Date.now(), ...editForm.value, nextRun: '待设定', status: 'pending' as const, approval: 'draft' }
    plans.value.unshift(newPlan)
    toast.value?.show('计划创建成功', 'success')
  }
  showPlanModal.value = false
}

// 删除确认
const showDeleteModal = ref(false)
const deletingId = ref(0)
function confirmDelete(id: number) { deletingId.value = id; showDeleteModal.value = true }
function doDelete() {
  plans.value = plans.value.filter(p => p.id !== deletingId.value)
  showDeleteModal.value = false
  toast.value?.show('计划已删除', 'success')
}

// 状态切换
function toggleStatus(plan: typeof plans.value[0]) {
  plan.status = plan.status === 'active' ? 'paused' : 'active'
  toast.value?.show(`计划已${plan.status === 'active' ? '启用' : '暂停'}`, 'info')
}

function getStatusClass(s: string) { return s === 'active' ? 'bg-success/15 text-success' : s === 'paused' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info' }
function getStatusText(s: string) { return s === 'active' ? '执行中' : s === 'paused' ? '已暂停' : '待激活' }
function getApprovalClass(a: string) { return a === 'approved' ? 'text-success' : a === 'reviewing' ? 'text-warning' : 'text-dim' }
function getApprovalText(a: string) { return a === 'approved' ? '已审批' : a === 'reviewing' ? '审核中' : '待提交' }
</script>

<template>
  <div class="space-y-4">
    <!-- Tab + 操作 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
          <button v-for="tab in planTabs" :key="tab.key" @click="activeTab = tab.key"
            class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
            :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
            {{ tab.label }}
          </button>
        </div>
        <div v-if="activeTab === 'plan'"
          class="flex items-center gap-1 bg-input border border-themed rounded-md px-2 py-1.5">
          <Search class="w-3.5 h-3.5 text-dim" />
          <input v-model="searchText" type="text" placeholder="搜索计划名称/负责人/区域..."
            class="bg-transparent text-xs text-default placeholder:text-muted-themed focus:outline-none w-48" />
        </div>
      </div>
      <button v-if="activeTab === 'plan'" @click="openCreatePlan"
        class="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
        <Plus class="w-3.5 h-3.5" /> 新建计划
      </button>
    </div>

    <!-- 巡查计划列表 -->
    <template v-if="activeTab === 'plan'">
      <div class="grid grid-cols-1 gap-3">
        <div v-for="plan in filteredPlans" :key="plan.id"
          class="bg-card border border-themed rounded-xl p-5 shadow-themed hover:shadow-themed-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="text-sm font-semibold text-default">{{ plan.name }}</h4>
              <p class="text-xs text-dim mt-0.5">频率: {{ plan.frequency }} · {{ plan.points }} 个巡查点</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="toggleStatus(plan)"
                class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                :class="getStatusClass(plan.status)">
                {{ getStatusText(plan.status) }}
              </button>
              <span class="text-[10px] font-medium" :class="getApprovalClass(plan.approval)">{{
                getApprovalText(plan.approval) }}</span>
              <button @click="openEditPlan(plan)"
                class="p-1 text-dim hover:text-primary rounded transition-colors cursor-pointer">
                <Edit class="w-3.5 h-3.5" />
              </button>
              <button @click="confirmDelete(plan.id)"
                class="p-1 text-dim hover:text-danger rounded transition-colors cursor-pointer">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="flex items-center gap-6 text-xs text-dim">
            <span class="flex items-center gap-1.5">
              <Users class="w-3 h-3" /> {{ plan.assignee }}
            </span>
            <span class="flex items-center gap-1.5">
              <MapPin class="w-3 h-3" /> {{ plan.area }}
            </span>
            <span class="flex items-center gap-1.5">
              <Clock class="w-3 h-3" /> 下次执行: {{ plan.nextRun }}
            </span>
          </div>
        </div>
        <div v-if="filteredPlans.length === 0" class="text-center py-12 text-dim text-sm">暂无匹配的巡查计划</div>
      </div>
    </template>

    <!-- 巡查路线 -->
    <template v-if="activeTab === 'route'">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="route in routes" :key="route.id"
          class="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <Route class="w-4 h-4 text-primary" />
              <h4 class="text-sm font-semibold text-default">{{ route.name }}</h4>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(route.status)">{{
              getStatusText(route.status) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-dim mt-3">
            <div>路线长度: <span class="text-default font-medium">{{ route.length }}</span></div>
            <div>巡查点: <span class="text-default font-medium">{{ route.points }} 个</span></div>
            <div>频率: <span class="text-default font-medium">{{ route.frequency }}</span></div>
            <div>负责组: <span class="text-default font-medium">{{ route.team }}</span></div>
          </div>
        </div>
      </div>
    </template>

    <!-- 人员排班 -->
    <template v-if="activeTab === 'schedule'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">人员</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">班组</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">职务</th>
              <th v-for="day in weekDays" :key="day"
                class="text-center px-3 py-3 text-xs font-semibold text-dim bg-surface">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in schedules" :key="s.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ s.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ s.team }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ s.role }}</td>
              <td v-for="(task, idx) in s.thisWeek" :key="idx" class="px-3 py-2.5 text-center">
                <span class="text-[10px] px-1.5 py-0.5 rounded"
                  :class="task === '休息' ? 'bg-surface text-dim' : 'bg-primary/10 text-primary'">{{ task }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 新建/编辑计划弹窗 -->
    <ModalDialog :show="showPlanModal" :title="isEdit ? '编辑巡查计划' : '新建巡查计划'" @close="showPlanModal = false"
      @confirm="savePlan">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-dim mb-1 block">计划名称 <span class="text-danger">*</span></label>
          <input v-model="editForm.name" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="请输入计划名称" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-dim mb-1 block">执行频率</label>
            <select v-model="editForm.frequency"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
              <option>每日</option>
              <option>每周</option>
              <option>每月</option>
              <option>每季</option>
              <option>汛期每日</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-dim mb-1 block">巡查点数</label>
            <input v-model.number="editForm.points" type="number"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">负责人</label>
          <input v-model="editForm.assignee" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="请输入负责人" />
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">巡查区域</label>
          <input v-model="editForm.area" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="请输入巡查区域" />
        </div>
      </div>
    </ModalDialog>

    <!-- 删除确认弹窗 -->
    <ModalDialog :show="showDeleteModal" title="确认删除" @close="showDeleteModal = false" @confirm="doDelete">
      <p class="text-xs text-dim">确定要删除该巡查计划吗？此操作不可撤销。</p>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
