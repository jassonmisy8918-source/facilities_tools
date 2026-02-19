<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle, XCircle, Settings, Plus, Send } from 'lucide-vue-next'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()

// Tab
const alarmTabs = [
  { key: 'list', label: '报警列表' },
  { key: 'rules', label: '报警规则' },
]
const activeTab = ref('list')

// 报警统计
const alarmStats = ref([
  { label: '紧急报警', value: 1, color: '#FF4757' },
  { label: '重要报警', value: 3, color: '#FFB020' },
  { label: '一般报警', value: 5, color: '#3B82F6' },
  { label: '已处置', value: 8, color: '#00D4AA' },
])

const statusFilter = ref('all')

const alarms = ref([
  { id: 1, level: 'critical', title: '#2水泵异常停机 - 过载保护触发', station: '朝阳路泵站', time: '2024-03-15 14:23', duration: '2分钟', status: 'active', workOrder: '' },
  { id: 2, level: 'warning', title: '#1水泵轴承温度过高 (65°C)', station: '和平路泵站', time: '2024-03-15 13:15', duration: '1小时8分', status: 'active', workOrder: '' },
  { id: 3, level: 'warning', title: '进水流量突增 (+35%)', station: '东湖泵站', time: '2024-03-15 11:30', duration: '2小时53分', status: 'acknowledged', workOrder: 'WO-0312' },
  { id: 4, level: 'info', title: '前池水位达到预警线', station: '和平路泵站', time: '2024-03-15 10:45', duration: '3小时38分', status: 'acknowledged', workOrder: '' },
  { id: 5, level: 'info', title: '备用电源自检异常', station: '民生路泵站', time: '2024-03-15 08:20', duration: '6小时3分', status: 'resolved', workOrder: 'WO-0310' },
])

// 报警规则
const rules = ref([
  { id: 'R-001', name: '水泵过载保护', condition: '电流 > 额定值120%', level: 'critical', enabled: true, action: '立即停机+短信+派单' },
  { id: 'R-002', name: '轴承温度过高', condition: '温度 > 60°C', level: 'warning', enabled: true, action: '短信通知+工单' },
  { id: 'R-003', name: '前池水位超限', condition: '水位 > 预警值', level: 'warning', enabled: true, action: '联动启泵+短信' },
  { id: 'R-004', name: '进水流量异常', condition: '流量波动 > ±30%', level: 'info', enabled: true, action: '记录+通知' },
  { id: 'R-005', name: '设备离线', condition: '心跳超时 > 5min', level: 'info', enabled: true, action: '通知值班人员' },
  { id: 'R-006', name: '电压异常', condition: '电压偏差 > ±10%', level: 'warning', enabled: false, action: '短信通知' },
])

const filteredAlarms = computed(() => {
  if (statusFilter.value === 'all') return alarms.value
  return alarms.value.filter(a => a.status === statusFilter.value)
})

function getLevelClass(l: string) { return l === 'critical' ? 'bg-danger text-white' : l === 'warning' ? 'bg-warning text-white' : 'bg-info/20 text-info' }
function getLevelText(l: string) { return l === 'critical' ? '紧急' : l === 'warning' ? '重要' : '一般' }
function getStatusClass(s: string) { return s === 'active' ? 'text-danger' : s === 'acknowledged' ? 'text-warning' : 'text-success' }
function getStatusText(s: string) { return s === 'active' ? '报警中' : s === 'acknowledged' ? '已确认' : '已处置' }

function confirmAlarm(a: typeof alarms.value[0]) {
  a.status = 'acknowledged'
  toast.value?.show(`报警 "${a.title.substring(0, 15)}..." 已确认`, 'info')
}
function resolveAlarm(a: typeof alarms.value[0]) {
  a.status = 'resolved'
  toast.value?.show('报警已处置', 'success')
}
function toggleRule(r: typeof rules.value[0]) {
  r.enabled = !r.enabled
  toast.value?.show(`规则 "${r.name}" 已${r.enabled ? '启用' : '停用'}`, r.enabled ? 'success' : 'info')
}
</script>

<template>
  <div class="space-y-4">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-3">
      <div v-for="stat in alarmStats" :key="stat.label"
        class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
        <p class="text-3xl font-bold" :style="{ color: stat.color }">{{ stat.value }}</p>
        <p class="text-xs text-dim mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Tab -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
        <button v-for="tab in alarmTabs" :key="tab.key" @click="activeTab = tab.key"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer"
          :class="activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ tab.label }}
        </button>
      </div>
      <div v-if="activeTab === 'list'" class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
        <button
          v-for="st in [{ key: 'all', label: '全部' }, { key: 'active', label: '报警中' }, { key: 'acknowledged', label: '已确认' }, { key: 'resolved', label: '已处置' }]"
          :key="st.key" @click="statusFilter = st.key"
          class="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
          :class="statusFilter === st.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">
          {{ st.label }}
        </button>
      </div>
    </div>

    <!-- 报警列表 -->
    <template v-if="activeTab === 'list'">
      <div class="space-y-2">
        <div v-for="alarm in filteredAlarms" :key="alarm.id"
          class="bg-card border border-themed rounded-xl p-4 shadow-themed">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <span class="text-[10px] px-2 py-0.5 rounded-md mt-0.5" :class="getLevelClass(alarm.level)">{{
                getLevelText(alarm.level) }}</span>
              <div>
                <h4 class="text-sm font-semibold text-default">{{ alarm.title }}</h4>
                <p class="text-xs text-dim mt-1">{{ alarm.station }} · {{ alarm.time }} · 持续 {{ alarm.duration }}</p>
                <p v-if="alarm.workOrder" class="text-xs text-primary mt-0.5">关联工单: {{ alarm.workOrder }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-xs font-medium" :class="getStatusClass(alarm.status)">{{ getStatusText(alarm.status)
              }}</span>
              <div class="flex items-center gap-1">
                <button v-if="alarm.status === 'active'" @click="confirmAlarm(alarm)" title="确认"
                  class="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors cursor-pointer">
                  <CheckCircle class="w-3.5 h-3.5" />
                </button>
                <button v-if="alarm.status !== 'resolved'" @click="resolveAlarm(alarm)" title="处置"
                  class="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors cursor-pointer">
                  <XCircle class="w-3.5 h-3.5" />
                </button>
                <button v-if="alarm.status !== 'resolved'" title="派单"
                  class="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                  <Send class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 报警规则 -->
    <template v-if="activeTab === 'rules'">
      <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-themed">
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">编号</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">规则名称</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">触发条件</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">等级</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">处置动作</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rule in rules" :key="rule.id"
              class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
              <td class="px-4 py-2.5 text-xs font-mono text-primary">{{ rule.id }}</td>
              <td class="px-4 py-2.5 text-xs font-medium text-default">{{ rule.name }}</td>
              <td class="px-4 py-2.5 text-xs text-dim font-mono">{{ rule.condition }}</td>
              <td class="px-4 py-2.5"><span class="text-[10px] px-2 py-0.5 rounded-md"
                  :class="getLevelClass(rule.level)">{{ getLevelText(rule.level) }}</span></td>
              <td class="px-4 py-2.5 text-xs text-dim">{{ rule.action }}</td>
              <td class="px-4 py-2.5">
                <button @click="toggleRule(rule)"
                  class="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  :class="rule.enabled ? 'bg-success/15 text-success hover:bg-success/25' : 'bg-surface text-dim hover:bg-hover-themed'">{{
                    rule.enabled ? '已启用' : '已停用' }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <ToastNotify ref="toast" />
  </div>
</template>
