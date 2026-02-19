<script setup lang="ts">
import { ref } from 'vue'
import { ClipboardList, Brain, FileCheck, Star, Plus } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// 运维管理 Tab —— 需求 9.1.4.4.4
const operationTabs = [
  { key: 'orders', label: '运维工单' },
  { key: 'predict', label: '预测性维护' },
  { key: 'knowledge', label: '知识库' },
]
const activeTab = ref('orders')

// 工单数据
const orders = ref([
  { id: 'WO-0315', title: '#2水泵过载维修', station: '朝阳路泵站', assignee: '张工', type: '故障维修', created: '2024-03-15 14:25', deadline: '2024-03-15 20:00', status: 'pending', priority: 'urgent', approval: 'approved', satisfaction: 0 },
  { id: 'WO-0314', title: '进水格栅清理', station: '东湖泵站', assignee: '李工', type: '日常维护', created: '2024-03-14 09:00', deadline: '2024-03-15 18:00', status: 'processing', priority: 'normal', approval: 'approved', satisfaction: 0 },
  { id: 'WO-0312', title: '进水突增流量调查', station: '东湖泵站', assignee: '王工', type: '应急处置', created: '2024-03-12 11:30', deadline: '2024-03-13 12:00', status: 'completed', priority: 'high', approval: 'approved', satisfaction: 5 },
  { id: 'WO-0310', title: '备用电源维修', station: '民生路泵站', assignee: '赵工', type: '故障维修', created: '2024-03-10 08:20', deadline: '2024-03-11 18:00', status: 'completed', priority: 'high', approval: 'approved', satisfaction: 4 },
  { id: 'WO-0316', title: '1号泵定期保养', station: '和平路泵站', assignee: '待分配', type: '定期保养', created: '2024-03-16 08:00', deadline: '2024-03-18 18:00', status: 'draft', priority: 'normal', approval: 'pending', satisfaction: 0 },
])

// 预测性维护
const predictions = ref([
  { id: 'PD-001', equipment: '1号离心泵', station: '朝阳路泵站', indicator: '轴承剩余寿命', currentValue: '约3200h', threshold: '2000h', risk: '低', suggestion: '计划在6月份进行轴承更换', confidence: 85 },
  { id: 'PD-002', equipment: '2号潜污泵', station: '东湖泵站', indicator: '绝缘电阻下降趋势', currentValue: '45MΩ (下降中)', threshold: '20MΩ', risk: '中', suggestion: '建议4月份安排绝缘处理', confidence: 72 },
  { id: 'PD-003', equipment: '配电柜开关', station: '和平路泵站', indicator: '触点磨损', currentValue: '操作8500次', threshold: '10000次', risk: '中', suggestion: '建议Q2更换接触器主触头', confidence: 80 },
])

// 知识库
const knowledgeBase = ref([
  { id: 'KB-001', title: '水泵过载故障排查指南', category: '故障诊断', views: 156, rating: 4.8, updateDate: '2024-02-20' },
  { id: 'KB-002', title: '暴雨期间泵站应急调度SOP', category: '应急处置', views: 234, rating: 4.9, updateDate: '2024-01-15' },
  { id: 'KB-003', title: 'SCADA系统通讯故障处理', category: '系统维护', views: 89, rating: 4.5, updateDate: '2024-03-01' },
  { id: 'KB-004', title: '变频器参数调整规范', category: '操作规范', views: 120, rating: 4.6, updateDate: '2024-02-10' },
  { id: 'KB-005', title: '阀门维护保养标准流程', category: '操作规范', views: 98, rating: 4.3, updateDate: '2024-01-28' },
])

function getStatusClass(s: string) { return s === 'completed' ? 'bg-success/15 text-success' : s === 'processing' ? 'bg-info/15 text-info' : s === 'pending' ? 'bg-warning/15 text-warning' : 'bg-surface text-dim' }
function getStatusText(s: string) { return s === 'completed' ? '已完成' : s === 'processing' ? '进行中' : s === 'pending' ? '待分配' : '草稿' }
function getPriorityClass(p: string) { return p === 'urgent' ? 'text-danger' : p === 'high' ? 'text-warning' : 'text-info' }
function getPriorityText(p: string) { return p === 'urgent' ? '紧急' : p === 'high' ? '高' : '一般' }
function getApprovalClass(a: string) { return a === 'approved' ? 'text-success' : 'text-warning' }
function getApprovalText(a: string) { return a === 'approved' ? '已审批' : '待审批' }
function getRiskClass(r: string) { return r === '高' ? 'bg-danger/15 text-danger' : r === '中' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success' }

// 新建工单弹窗
const showOrderModal = ref(false)
const orderForm = ref({ title: '', station: '', type: '日常维护', priority: 'normal', assignee: '' })
function openCreateOrder() { orderForm.value = { title: '', station: '', type: '日常维护', priority: 'normal', assignee: '' }; showOrderModal.value = true }
function doCreateOrder() {
  if (!orderForm.value.title) { toast.value?.show('请输入工单标题', 'warning'); return }
  orders.value.unshift({ id: `WO-${String(Math.floor(Math.random() * 9000) + 1000)}`, title: orderForm.value.title, station: orderForm.value.station, assignee: orderForm.value.assignee || '待分配', type: orderForm.value.type, created: new Date().toLocaleString(), deadline: '待设定', status: 'draft', priority: orderForm.value.priority, approval: 'pending', satisfaction: 0 })
  showOrderModal.value = false
  toast.value?.show('工单创建成功', 'success')
}

// 工单状态流转
function advanceOrder(o: typeof orders.value[0]) {
  const flow: Record<string, string> = { draft: 'pending', pending: 'processing', processing: 'completed' }
  const next = flow[o.status]
  if (next) {
    o.status = next
    if (next === 'pending') o.approval = 'approved'
    toast.value?.show(`工单状态已更新为「${getStatusText(next)}」`, 'success')
  }
}
function getNextActionText(s: string) { return s === 'draft' ? '提交审批' : s === 'pending' ? '开始处理' : s === 'processing' ? '完成' : '' }
</script>

<template>
  <div class="space-y-4">
    <!-- Tab -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
        <button v-for="tab in operationTabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }}
        </button>
      </div>
      <button v-if="activeTab === 'orders'" @click="openCreateOrder"
        class="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
        <Plus class="w-3.5 h-3.5" /> 新建工单
      </button>
    </div>

    <!-- 工单列表 -->
    <template v-if="activeTab === 'orders'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">工单号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">标题</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">泵站</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">负责人</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">优先级</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">审批</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">截止时间</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">满意度</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ o.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ o.title }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ o.station }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ o.assignee }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ o.type }}</td>
              <td class="px-4 py-2.5 text-xs font-medium" :class="getPriorityClass(o.priority)">{{
                getPriorityText(o.priority) }}</td>
              <td class="px-4 py-2.5 text-xs font-medium" :class="getApprovalClass(o.approval)">{{
                getApprovalText(o.approval) }}</td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ o.deadline }}</td>
              <td class="px-4 py-2.5">
                <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getStatusClass(o.status)">{{
                  getStatusText(o.status) }}</span>
                <button v-if="o.status !== 'completed'" @click="advanceOrder(o)"
                  class="ml-1 text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors">{{
                  getNextActionText(o.status) }}</button>
              </td>
              <td class="px-4 py-2.5 text-xs">
                <div v-if="o.satisfaction > 0" class="flex items-center gap-0.5">
                  <Star v-for="i in 5" :key="i" class="w-3 h-3"
                    :class="i <= o.satisfaction ? 'text-warning fill-warning' : 'text-surface'" />
                </div>
                <span v-else class="text-dim">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 预测性维护 -->
    <template v-if="activeTab === 'predict'">
      <div class="space-y-3">
        <div v-for="pd in predictions" :key="pd.id" class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h4 class="text-sm font-semibold text-default flex items-center gap-2">
                <Brain class="w-4 h-4 text-primary" /> {{ pd.equipment }} — {{ pd.indicator }}
              </h4>
              <p class="text-xs text-dim mt-0.5">{{ pd.station }}</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-md" :class="getRiskClass(pd.risk)">风险: {{ pd.risk }}</span>
          </div>
          <div class="grid grid-cols-3 gap-4 text-xs mb-3">
            <div><span class="text-dim">当前值:</span> <span class="text-default font-medium ml-1">{{ pd.currentValue
            }}</span></div>
            <div><span class="text-dim">阈值:</span> <span class="text-default font-medium ml-1">{{ pd.threshold }}</span>
            </div>
            <div><span class="text-dim">预测置信度:</span> <span class="text-primary font-bold ml-1">{{ pd.confidence
            }}%</span></div>
          </div>
          <div class="p-2 bg-surface rounded-lg text-xs text-dim">
            <span class="text-default font-medium">建议: </span>{{ pd.suggestion }}
          </div>
        </div>
      </div>
    </template>

    <!-- 知识库 -->
    <template v-if="activeTab === 'knowledge'">
      <div class="grid grid-cols-1 gap-3">
        <div v-for="kb in knowledgeBase" :key="kb.id"
          class="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow cursor-pointer">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="text-sm font-semibold text-default">{{ kb.title }}</h4>
              <p class="text-xs text-dim mt-1">
                <span class="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] mr-2">{{ kb.category }}</span>
                浏览 {{ kb.views }} · 更新于 {{ kb.updateDate }}
              </p>
            </div>
            <div class="flex items-center gap-1 text-xs text-warning">
              <Star class="w-3 h-3 fill-warning" /> {{ kb.rating }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 新建工单弹窗 -->
    <ModalDialog :show="showOrderModal" title="新建运维工单" @close="showOrderModal = false" @confirm="doCreateOrder">
      <div class="space-y-3">
        <div>
          <label class="text-xs text-dim mb-1 block">工单标题 <span class="text-danger">*</span></label>
          <input v-model="orderForm.title" type="text"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
            placeholder="请输入工单标题" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-dim mb-1 block">泵站</label>
            <select v-model="orderForm.station"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
              <option>朝阳路泵站</option>
              <option>东湖泵站</option>
              <option>和平路泵站</option>
              <option>民生路泵站</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-dim mb-1 block">类型</label>
            <select v-model="orderForm.type"
              class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
              <option>日常维护</option>
              <option>故障维修</option>
              <option>定期保养</option>
              <option>应急处置</option>
            </select>
          </div>
        </div>
        <div>
          <label class="text-xs text-dim mb-1 block">优先级</label>
          <select v-model="orderForm.priority"
            class="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
            <option value="urgent">紧急</option>
            <option value="high">高</option>
            <option value="normal">一般</option>
          </select>
        </div>
      </div>
    </ModalDialog>

    <ToastNotify ref="toast" />
  </div>
</template>
