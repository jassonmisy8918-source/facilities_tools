<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Eye, Trash2, ArrowRightLeft, Edit } from 'lucide-vue-next'
import ModalDialog from '@/components/common/ModalDialog.vue'
import ToastNotify from '@/components/common/ToastNotify.vue'

const toast = ref<InstanceType<typeof ToastNotify>>()
const activeFunc = ref('info')
const funcTabs = [
    { key: 'info', label: '设备信息' },
    { key: 'category', label: '类别管理' },
    { key: 'scrap', label: '报废管理' },
    { key: 'change', label: '变动记录' },
    { key: 'transfer', label: '调拨跟踪' },
]

// ── 设备列表 ──
const devices = ref([
    { id: 1, name: '1号水泵', type: '离心泵', station: '朝阳泵站', model: 'QW200-300-15', power: '15kW', installDate: '2020-03-15', status: '运行', location: '泵房A区' },
    { id: 2, name: '2号水泵', type: '离心泵', station: '朝阳泵站', model: 'QW200-300-15', power: '15kW', installDate: '2020-03-15', status: '备用', location: '泵房A区' },
    { id: 3, name: '主电机', type: '电机', station: '西城泵站', model: 'YE3-160M', power: '11kW', installDate: '2021-06-20', status: '运行', location: '配电室' },
    { id: 4, name: '进水阀门', type: '阀门', station: '通州泵站', model: 'DN300', power: '-', installDate: '2019-08-10', status: '运行', location: '进水口' },
    { id: 5, name: '格栅除污机', type: '辅助设备', station: '丰台泵站', model: 'GS-800', power: '3kW', installDate: '2022-01-05', status: '检修', location: '进水渠' },
])

const showDetail = ref(false)
const selectedDevice = ref<typeof devices.value[0] | null>(null)
function viewDevice(d: typeof devices.value[0]) { selectedDevice.value = d; showDetail.value = true }

// ── 设备类别 ──
const categories = ref([
    { id: 1, name: '离心泵', count: 12, attrs: ['流量', '扬程', '功率', '转速', '叶轮直径'] },
    { id: 2, name: '电机', count: 8, attrs: ['功率', '电压', '转速', '防护等级', '绝缘等级'] },
    { id: 3, name: '阀门', count: 15, attrs: ['口径', '压力等级', '材质', '驱动方式'] },
    { id: 4, name: '辅助设备', count: 6, attrs: ['功率', '处理能力', '规格型号'] },
    { id: 5, name: '仪表', count: 10, attrs: ['量程', '精度', '信号类型', '供电方式'] },
])

// ── 报废 ──
const scrapRecords = ref([
    { id: 1, device: '旧格栅机', station: '丰台泵站', reason: '超期服役/严重锈蚀', applyDate: '2024-02-10', status: '已审批', handler: '王强' },
    { id: 2, device: '3号水泵', station: '海淀泵站', reason: '电机烧毁/无维修价值', applyDate: '2024-03-01', status: '待审批', handler: '张伟' },
])

// ── 变动 ──
const changeRecords = ref([
    { id: 1, device: '1号水泵', station: '朝阳泵站', type: '参数变更', content: '更换叶轮，流量参数更新', date: '2024-02-20', operator: '李明' },
    { id: 2, device: '进水阀门', station: '通州泵站', type: '位置变更', content: '由进水口A移至进水口B', date: '2024-01-15', operator: '赵刚' },
    { id: 3, device: '主电机', station: '西城泵站', type: '配件更换', content: '更换轴承及密封件', date: '2024-03-05', operator: '王强' },
])

// ── 调拨 ──
const transferRecords = ref([
    { id: 1, device: '备用水泵', from: '朝阳泵站', to: '丰台泵站', reason: '应急调配', date: '2024-03-10', status: '已完成', tracker: '张伟' },
    { id: 2, device: '流量计 FL-05', from: '西城泵站', to: '通州泵站', reason: '设备升级替换', date: '2024-03-12', status: '运输中', tracker: '李明' },
    { id: 3, device: '高压冲洗泵', from: '通州泵站', to: '海淀泵站', reason: '计划调拨', date: '2024-03-08', status: '待出库', tracker: '赵刚' },
])

function statusClass(s: string) {
    const m: Record<string, string> = { '运行': 'bg-success/10 text-success', '备用': 'bg-info/10 text-info', '检修': 'bg-warning/10 text-warning', '报废': 'bg-danger/10 text-danger', '已审批': 'bg-success/10 text-success', '待审批': 'bg-warning/10 text-warning', '已完成': 'bg-success/10 text-success', '运输中': 'bg-primary/10 text-primary', '待出库': 'bg-warning/10 text-warning' }
    return m[s] || 'bg-surface text-dim'
}
</script>

<template>
    <div class="space-y-4">
        <ToastNotify ref="toast" />
        <ModalDialog :show="showDetail" title="设备详情" @close="showDetail = false">
            <div v-if="selectedDevice" class="space-y-2 text-xs">
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="[k, v] in [['名称', selectedDevice.name], ['类型', selectedDevice.type], ['泵站', selectedDevice.station], ['型号', selectedDevice.model], ['功率', selectedDevice.power], ['位置', selectedDevice.location], ['安装日期', selectedDevice.installDate], ['状态', selectedDevice.status]]"
                        :key="k" class="flex gap-2"><span class="text-dim w-16 shrink-0">{{ k }}</span><span
                            class="text-default font-medium">{{ v }}</span></div>
                </div>
            </div>
        </ModalDialog>

        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>

        <!-- 设备信息 -->
        <template v-if="activeFunc === 'info'">
            <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-default">设备台账</span>
                <button @click="toast?.show('新增设备功能开发中', 'info')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />新增设备
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">型号</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">功率</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">位置</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="d in devices" :key="d.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ d.name }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.type }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ d.station }}</td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ d.model }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ d.power }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ d.location }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="statusClass(d.status)">{{ d.status }}</span></td>
                            <td class="text-center px-2 py-2.5"><button @click="viewDevice(d)"
                                    class="text-primary hover:underline cursor-pointer">
                                    <Eye class="w-3.5 h-3.5 inline" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 类别管理 -->
        <template v-if="activeFunc === 'category'">
            <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-default">设备类别管理</span>
                <button @click="toast?.show('新增类别功能开发中', 'info')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light cursor-pointer">
                    <Plus class="w-3.5 h-3.5" />新增类别
                </button>
            </div>
            <div class="grid grid-cols-3 gap-3">
                <div v-for="c in categories" :key="c.id"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-default">{{ c.name }}</span>
                        <span class="text-[10px] text-primary font-bold">{{ c.count }} 台</span>
                    </div>
                    <div class="flex gap-1 flex-wrap">
                        <span v-for="a in c.attrs" :key="a"
                            class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ a }}</span>
                    </div>
                    <button
                        class="mt-2 text-[10px] text-primary hover:underline cursor-pointer flex items-center gap-0.5">
                        <Edit class="w-3 h-3" />编辑属性
                    </button>
                </div>
            </div>
        </template>

        <!-- 报废管理 -->
        <template v-if="activeFunc === 'scrap'">
            <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-default">设备报废管理</span>
                <button @click="toast?.show('报废申请功能开发中', 'info')"
                    class="flex items-center gap-1 px-3 py-1.5 bg-danger text-white rounded-lg text-xs font-medium hover:bg-red-600 cursor-pointer">
                    <Trash2 class="w-3.5 h-3.5" />报废申请
                </button>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">报废原因</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">申请日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">经办人</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in scrapRecords" :key="s.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ s.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ s.station }}</td>
                            <td class="px-2 py-2.5 text-default">{{ s.reason }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ s.applyDate }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="statusClass(s.status)">{{ s.status }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ s.handler }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 变动记录 -->
        <template v-if="activeFunc === 'change'">
            <span class="text-sm font-semibold text-default block">设备变动记录</span>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">变动类型</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">变动内容</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作人</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in changeRecords" :key="c.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ c.device }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.station }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-info/10 text-info">{{ c.type }}</span>
                            </td>
                            <td class="px-2 py-2.5 text-default">{{ c.content }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.date }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.operator }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 调拨跟踪 -->
        <template v-if="activeFunc === 'transfer'">
            <div class="flex items-center gap-2 mb-1">
                <ArrowRightLeft class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">设备调拨跟踪</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">设备</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">调出站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">调入站</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">原因</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">跟踪人</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in transferRecords" :key="t.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ t.device }}</td>
                            <td class="text-center px-2 py-2.5 text-danger">{{ t.from }}</td>
                            <td class="text-center px-2 py-2.5 text-success">{{ t.to }}</td>
                            <td class="px-2 py-2.5 text-default">{{ t.reason }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ t.date }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="statusClass(t.status)">{{ t.status }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ t.tracker }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
