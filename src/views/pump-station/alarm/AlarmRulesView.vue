<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Shield, Search, ToggleLeft, ToggleRight } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('list')
const funcTabs = [
    { key: 'list', label: '规则列表' },
    { key: 'category', label: '分类管理' },
]

const rules = ref([
    { id: 1, name: '前池水位超高', device: '水位计', metric: '前池水位', condition: '> 3.5m', level: '告警', notify: '短信+APP', enabled: true },
    { id: 2, name: '前池水位极高', device: '水位计', metric: '前池水位', condition: '> 4.0m', level: '严重', notify: '短信+电话+APP', enabled: true },
    { id: 3, name: '进水流量异常', device: '流量计', metric: '进水流量', condition: '波动>15%', level: '预警', notify: 'APP', enabled: true },
    { id: 4, name: '电机过温', device: '电机', metric: '温度', condition: '> 80°C', level: '告警', notify: '短信+APP', enabled: true },
    { id: 5, name: '电机振动超标', device: '电机', metric: '振动值', condition: '> 10mm/s', level: '预警', notify: 'APP', enabled: false },
    { id: 6, name: '水泵故障停机', device: '水泵', metric: '运行状态', condition: '异常停机', level: '严重', notify: '短信+电话+APP', enabled: true },
    { id: 7, name: '格栅过载', device: '格栅机', metric: '电流', condition: '> 额定120%', level: '告警', notify: '短信+APP', enabled: true },
    { id: 8, name: '配电异常', device: '配电柜', metric: '电压', condition: '偏差>10%', level: '预警', notify: 'APP', enabled: false },
])

const filterLevel = ref('全部')
const levelOptions = ['全部', '预警', '告警', '严重']
const filteredRules = ref(rules)

function filterByLevel(l: string) {
    filterLevel.value = l
    filteredRules.value = l === '全部' ? rules.value : rules.value.filter(r => r.level === l)
}

function toggleRule(r: typeof rules.value[0]) {
    r.enabled = !r.enabled
    toast.value?.show(`规则"${r.name}"已${r.enabled ? '启用' : '停用'}`, r.enabled ? 'success' : 'warning')
}

const categories = ref([
    { type: '水位类', count: 2, rules: ['前池水位超高', '前池水位极高'] },
    { type: '流量类', count: 1, rules: ['进水流量异常'] },
    { type: '电机类', count: 2, rules: ['电机过温', '电机振动超标'] },
    { type: '水泵类', count: 1, rules: ['水泵故障停机'] },
    { type: '辅助设备', count: 1, rules: ['格栅过载'] },
    { type: '电气类', count: 1, rules: ['配电异常'] },
])

function levelClass(l: string) { return l === '严重' ? 'bg-danger/10 text-danger' : l === '告警' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info' }

const showAddRule = ref(false)
const addRuleForm = ref({ name: '', device: '', metric: '', condition: '', level: '预警', notify: 'APP' })
function openAddRule() { addRuleForm.value = { name: '', device: '', metric: '', condition: '', level: '预警', notify: 'APP' }; showAddRule.value = true }
function doAddRule() { showAddRule.value = false; toast.value?.show('规则新增成功', 'success') }
</script>

<template>
    <div class="space-y-4">
        <ToastNotify ref="toast" />
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <template v-if="activeFunc === 'list'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Shield class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">报警规则</span>
                    <div class="flex gap-1 ml-2"><button v-for="l in levelOptions" :key="l" @click="filterByLevel(l)"
                            class="px-2 py-0.5 rounded text-[10px] cursor-pointer"
                            :class="filterLevel === l ? 'bg-primary text-white' : 'bg-surface text-dim hover:text-default'">{{
                                l }}</button></div>
                </div>
                <button @click="openAddRule()"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />新增规则
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">规则名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">指标</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">触发条件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">等级</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">通知方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in filteredRules" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.name }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.device }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.metric }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ r.condition }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="levelClass(r.level)">{{ r.level }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ r.notify }}</td>
                            <td class="text-center px-2 py-2.5"><button @click="toggleRule(r)" class="cursor-pointer">
                                    <component :is="r.enabled ? ToggleRight : ToggleLeft" class="w-5 h-5"
                                        :class="r.enabled ? 'text-success' : 'text-dim'" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'category'">
            <div class="flex items-center gap-2 mb-1">
                <Search class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">规则分类管理</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div v-for="c in categories" :key="c.type"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                        c.type }}</span><span class="text-[10px] text-primary font-bold">{{ c.count }} 条规则</span>
                    </div>
                    <div class="flex gap-1 flex-wrap"><span v-for="r in c.rules" :key="r"
                            class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ r }}</span></div>
                </div>
            </div>
        </template>

        <!-- 新增规则弹窗 -->
        <ModalDialog :show="showAddRule" title="新增报警规则" @close="showAddRule = false" @confirm="doAddRule">
            <div class="space-y-3">
                <div>
                    <label class="text-[10px] text-dim block mb-1">规则名称</label>
                    <input v-model="addRuleForm.name" type="text" placeholder="如 后池水位超高"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">设备类型</label>
                        <input v-model="addRuleForm.device" type="text" placeholder="如 水位计"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">监测指标</label>
                        <input v-model="addRuleForm.metric" type="text" placeholder="如 后池水位"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                    </div>
                </div>
                <div>
                    <label class="text-[10px] text-dim block mb-1">触发条件</label>
                    <input v-model="addRuleForm.condition" type="text" placeholder="如 > 2.0m"
                        class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-dim block mb-1">报警等级</label>
                        <select v-model="addRuleForm.level"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                            <option>预警</option>
                            <option>告警</option>
                            <option>严重</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] text-dim block mb-1">通知方式</label>
                        <select v-model="addRuleForm.notify"
                            class="w-full px-3 py-2 bg-input border border-themed rounded-lg text-xs text-default focus:outline-none focus:border-primary">
                            <option>APP</option>
                            <option>短信+APP</option>
                            <option>短信+电话+APP</option>
                        </select>
                    </div>
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
