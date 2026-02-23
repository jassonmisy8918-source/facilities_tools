<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, Play, Pause, AlertTriangle, TrendingUp } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'

const activeFunc = ref('personnel')
const funcTabs = [
    { key: 'personnel', label: '人员管理' },
    { key: 'content', label: '养护内容' },
    { key: 'trajectory', label: '轨迹管理' },
    { key: 'progress', label: '进度可视化' },
    { key: 'warning', label: '滞后预警' },
]

const personnel = ref([
    { id: 'MW-001', name: '张伟', team: 'A班', role: '高级养护工', cert: '管道工/高级', skills: '清淤/修复/CCTV', attendance: '95%', status: 'active' },
    { id: 'MW-002', name: '李明', team: 'A班', role: '养护工', cert: '管道工/中级', skills: '清淤/排口维护', attendance: '92%', status: 'active' },
    { id: 'MW-003', name: '王强', team: 'B班', role: '高级养护工', cert: '管道工/高级', skills: '管道修复/焊接/检测', attendance: '98%', status: 'active' },
    { id: 'MW-004', name: '赵刚', team: 'B班', role: '养护工', cert: '管道工/初级', skills: '清淤/保养', attendance: '88%', status: 'on_leave' },
])

const maintContent = ref([
    { category: '管道清淤', items: ['高压水射流清洗', '机械疏通', '人工清掏', '淤积深度检测'], standard: '管内淤积不超过管径1/5' },
    { category: '管道修复', items: ['非开挖内衬修复', '局部开挖修复', '接口修复', '管壁修补'], standard: '修复后无渗漏，结构强度达标' },
    { category: '检查井维护', items: ['井盖更换', '井壁修补', '爬梯修复', '井室清理'], standard: '井盖完好，井壁无渗漏' },
    { category: '排口维护', items: ['格栅清理', '拍门检修', '排口清淤', '防护设施维护'], standard: '排口畅通，拍门启闭灵活' },
])

const trajectories = ref([
    { worker: '张伟', order: 'MO-001', date: '2024-03-15', route: '万家丽路清淤段', distance: '2.8km', duration: '4.5h', deviation: 0, status: 'completed' },
    { worker: '李明', order: 'MO-003', date: '2024-03-14', route: '侯家塘街道排口段', distance: '1.5km', duration: '3h', deviation: 0, status: 'completed' },
])

const progressByArea = ref([
    { area: '圭塘街道', total: 8, done: 5, rate: 62 },
    { area: '侯家塘街道', total: 5, done: 4, rate: 80 },
    { area: '左家塘街道', total: 6, done: 2, rate: 33 },
    { area: '黎托街道', total: 4, done: 1, rate: 25 },
])

const overdueOrders = ref([
    { id: 'MO-010', title: '黎托街道管道年检', deadline: '2024-03-10', overdueDays: 5, assignee: '赵刚', reason: '人员请假' },
    { id: 'MO-011', title: '左家塘街道排口季度保养', deadline: '2024-03-12', overdueDays: 3, assignee: '—', reason: '未分配人员' },
])

const playingId = ref('')
function togglePlay(w: string) { playingId.value = playingId.value === w ? '' : w }

// 养护轨迹地图 polylines
const maintPolylines = computed(() => [
    { path: [[113.045, 28.130], [113.048, 28.133], [113.052, 28.135], [113.055, 28.132], [113.058, 28.128]] as [number, number][], color: '#3B82F6', weight: 4, label: '万家丽路清淤段' },
    { path: [[113.025, 28.148], [113.028, 28.150], [113.030, 28.152], [113.032, 28.149]] as [number, number][], color: '#10B981', weight: 4, label: '侯家塘街道排口段' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 人员 -->
        <div v-if="activeFunc === 'personnel'"
            class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
            <div class="px-4 py-3 border-b border-themed flex items-center gap-2">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">养护人员台账</span>
            </div>
            <table class="w-full text-xs">
                <thead>
                    <tr class="border-b border-themed bg-surface/50">
                        <th class="text-left px-3 py-2.5 text-dim font-medium">工号</th>
                        <th class="text-left px-3 py-2.5 text-dim font-medium">姓名</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">班组</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">岗位</th>
                        <th class="text-left px-3 py-2.5 text-dim font-medium">资质</th>
                        <th class="text-left px-3 py-2.5 text-dim font-medium">技能</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">出勤</th>
                        <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in personnel" :key="p.id"
                        class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                        <td class="px-3 py-2.5 text-primary font-mono text-[10px]">{{ p.id }}</td>
                        <td class="px-3 py-2.5 text-default font-medium">{{ p.name }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ p.team }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ p.role }}</td>
                        <td class="px-3 py-2.5 text-default">{{ p.cert }}</td>
                        <td class="px-3 py-2.5 text-dim">{{ p.skills }}</td>
                        <td class="text-center px-2 py-2.5 text-default">{{ p.attendance }}</td>
                        <td class="text-center px-2 py-2.5"><span class="text-[10px] font-medium"
                                :class="p.status === 'active' ? 'text-success' : 'text-warning'">{{ p.status ===
                                    'active' ? '在岗' : '请假' }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 养护内容 -->
        <div v-if="activeFunc === 'content'" class="space-y-3">
            <div v-for="c in maintContent" :key="c.category"
                class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-default">{{
                    c.category }}</span><span class="text-[10px] text-dim">{{ c.items.length }}项</span></div>
                <div class="flex flex-wrap gap-1.5 mb-2"><span v-for="item in c.items" :key="item"
                        class="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded">{{ item }}</span></div>
                <p class="text-[10px] text-dim">✅ 验收标准: {{ c.standard }}</p>
            </div>
        </div>

        <!-- 轨迹 -->
        <template v-if="activeFunc === 'trajectory'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <AMapView :polylines="maintPolylines" :center="[113.045, 28.135]" :zoom="14" height="280px" />
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-4 py-2.5 text-dim font-medium">人员</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">工单</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">日期</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">里程</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">工时</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">偏离</th>
                            <th class="text-center px-4 py-2.5 text-dim font-medium">回放</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in trajectories" :key="t.worker + t.date"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-4 py-2.5 text-default font-medium">{{ t.worker }}</td>
                            <td class="text-center px-4 py-2.5 text-primary font-mono text-[10px]">{{ t.order }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ t.date }}</td>
                            <td class="text-center px-4 py-2.5 text-primary font-bold">{{ t.distance }}</td>
                            <td class="text-center px-4 py-2.5 text-default">{{ t.duration }}</td>
                            <td class="text-center px-4 py-2.5"><span
                                    :class="t.deviation > 0 ? 'text-danger' : 'text-success'">{{ t.deviation > 0 ?
                                        t.deviation + '次' : '无' }}</span></td>
                            <td class="text-center px-4 py-2.5"><button @click="togglePlay(t.worker)"
                                    class="p-1 rounded cursor-pointer"
                                    :class="playingId === t.worker ? 'bg-primary/10 text-primary' : 'hover:bg-hover-themed text-dim'">
                                    <component :is="playingId === t.worker ? Pause : Play" class="w-3.5 h-3.5" />
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 进度 -->
        <div v-if="activeFunc === 'progress'" class="bg-card border border-themed rounded-xl shadow-themed p-4">
            <div class="flex items-center gap-2 mb-3">
                <TrendingUp class="w-4 h-4 text-primary" /><span
                    class="text-sm font-semibold text-default">区域养护进度</span>
            </div>
            <div class="space-y-3">
                <div v-for="a in progressByArea" :key="a.area" class="flex items-center gap-3">
                    <span class="text-xs text-default w-14 shrink-0">{{ a.area }}</span>
                    <div class="flex-1 h-4 bg-surface rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                            :class="a.rate >= 70 ? 'bg-success' : a.rate >= 40 ? 'bg-warning' : 'bg-danger'"
                            :style="{ width: a.rate + '%' }"></div>
                    </div>
                    <span class="text-xs text-dim w-16 text-right">{{ a.done }}/{{ a.total }} ({{ a.rate }}%)</span>
                </div>
            </div>
        </div>

        <!-- 预警 -->
        <div v-if="activeFunc === 'warning'" class="space-y-3">
            <div v-for="o in overdueOrders" :key="o.id"
                class="bg-card border border-danger/30 rounded-xl shadow-themed p-4">
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-2">
                        <AlertTriangle class="w-4 h-4 text-danger mt-0.5 shrink-0" />
                        <div>
                            <p class="text-xs font-bold text-default">{{ o.title }}</p>
                            <div class="text-[10px] text-dim mt-0.5">{{ o.id }} · 截止: {{ o.deadline }} · 执行人: {{
                                o.assignee }}
                            </div>
                            <p class="text-[10px] text-default mt-1">原因: {{ o.reason }}</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-danger shrink-0">超期 {{ o.overdueDays }} 天</span>
                </div>
            </div>
            <div v-if="overdueOrders.length === 0"
                class="bg-card border border-themed rounded-xl shadow-themed p-8 text-center">
                <p class="text-success text-xs">✅ 暂无超期工单</p>
            </div>
        </div>
    </div>
</template>
