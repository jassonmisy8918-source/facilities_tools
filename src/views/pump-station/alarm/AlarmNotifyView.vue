<script setup lang="ts">
import { ref } from 'vue'
import { Send, Settings, Search } from 'lucide-vue-next'
const activeFunc = ref('config')
const funcTabs = [
    { key: 'config', label: '通知配置' },
    { key: 'records', label: '发送记录' },
]

const notifyConfigs = ref([
    { id: 1, person: '张伟', role: '站长', station: '朝阳泵站', sms: true, app: true, email: false, phone: false, levels: ['告警', '严重'] },
    { id: 2, person: '李明', role: '值班员', station: '西城泵站', sms: true, app: true, email: true, phone: false, levels: ['预警', '告警', '严重'] },
    { id: 3, person: '王强', role: '维修主管', station: '全部', sms: true, app: true, email: false, phone: true, levels: ['严重'] },
    { id: 4, person: '赵刚', role: '值班员', station: '通州泵站', sms: false, app: true, email: false, phone: false, levels: ['预警', '告警'] },
])

const sendRecords = ref([
    { id: 1, alarm: '前池水位超高', station: '通州泵站', receiver: '赵刚', method: 'APP', time: '2024-03-15 16:20:05', ack: true, ackTime: '2024-03-15 16:22:30' },
    { id: 2, alarm: '前池水位超高', station: '通州泵站', receiver: '王强', method: '短信', time: '2024-03-15 16:20:08', ack: true, ackTime: '2024-03-15 16:25:00' },
    { id: 3, alarm: '进水流量异常', station: '朝阳泵站', receiver: '张伟', method: 'APP', time: '2024-03-15 14:30:02', ack: true, ackTime: '2024-03-15 14:32:15' },
    { id: 4, alarm: '格栅过载', station: '丰台泵站', receiver: '李明', method: '短信', time: '2024-03-13 11:20:10', ack: false, ackTime: '' },
    { id: 5, alarm: '水泵故障', station: '海淀泵站', receiver: '王强', method: '电话', time: '2024-03-14 22:15:03', ack: true, ackTime: '2024-03-14 22:16:00' },
])
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

        <template v-if="activeFunc === 'config'">
            <div class="flex items-center gap-2 mb-1">
                <Settings class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">通知方式配置</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">责任人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">角色</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">短信</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">APP</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">邮件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">电话</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">接收等级</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in notifyConfigs" :key="c.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ c.person }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ c.role }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ c.station }}</td>
                            <td class="text-center px-2 py-2.5"><span :class="c.sms ? 'text-success' : 'text-dim'">{{
                                c.sms ? '✓' : '✗' }}</span></td>
                            <td class="text-center px-2 py-2.5"><span :class="c.app ? 'text-success' : 'text-dim'">{{
                                c.app ? '✓' : '✗' }}</span></td>
                            <td class="text-center px-2 py-2.5"><span :class="c.email ? 'text-success' : 'text-dim'">{{
                                c.email ? '✓' : '✗' }}</span></td>
                            <td class="text-center px-2 py-2.5"><span :class="c.phone ? 'text-success' : 'text-dim'">{{
                                c.phone ? '✓' : '✗' }}</span></td>
                            <td class="px-2 py-2.5">
                                <div class="flex gap-1"><span v-for="l in c.levels" :key="l"
                                        class="text-[10px] px-1 py-0.5 rounded font-medium"
                                        :class="l === '严重' ? 'bg-danger/10 text-danger' : l === '告警' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'">{{
                                            l }}</span></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-if="activeFunc === 'records'">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Send class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">通知发送记录</span>
                </div>
                <div class="flex items-center gap-1 px-2 py-1 bg-surface rounded border border-themed">
                    <Search class="w-3 h-3 text-dim" /><input type="text" placeholder="搜索记录..."
                        class="bg-transparent outline-none text-[10px] text-default w-20" />
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">报警事件</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">接收人</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">方式</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">发送时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">已确认</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">确认时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in sendRecords" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.alarm }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.station }}</td>
                            <td class="text-center px-2 py-2.5 text-default">{{ r.receiver }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded bg-surface text-dim">{{ r.method }}</span>
                            </td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ r.time }}</td>
                            <td class="text-center px-2 py-2.5"><span :class="r.ack ? 'text-success' : 'text-danger'"
                                    class="font-bold">{{ r.ack ? '✓' : '✗' }}</span></td>
                            <td class="text-center px-2 py-2.5 text-dim text-[10px]">{{ r.ackTime || '-' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>
