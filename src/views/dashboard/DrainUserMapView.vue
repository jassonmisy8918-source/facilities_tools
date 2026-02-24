<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, Eye, EyeOff, BarChart3 } from 'lucide-vue-next'
import AMapView from '@/components/common/AMapView.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'

const categories = ref([
    { key: 'industry', label: '工业', color: '#EF4444', visible: true },
    { key: 'commerce', label: '商业', color: '#F59E0B', visible: true },
    { key: 'catering', label: '餐饮', color: '#8B5CF6', visible: true },
    { key: 'resident', label: '居民', color: '#3B82F6', visible: true },
])

const drainUsers: Record<string, { lng: number; lat: number; title: string; info: Record<string, string> }[]> = {
    industry: [
        { lng: 113.035, lat: 28.140, title: '雨花区工业园A区', info: { 名称: '雨花区工业园A区', 类型: '工业', 排水许可证: 'YH-IND-2024-001', 日排水量: '500m³/d', 排水去向: '圭塘河污水管', 水质: '达标', 有效期: '2025-12-31' } },
        { lng: 113.060, lat: 28.125, title: '黎托街道制造企业', info: { 名称: '黎托街道制造企业', 类型: '工业', 排水许可证: 'YH-IND-2024-003', 日排水量: '300m³/d', 排水去向: '黎托污水管', 水质: '预警', 有效期: '2025-06-30' } },
    ],
    commerce: [
        { lng: 113.040, lat: 28.148, title: '万家丽广场', info: { 名称: '万家丽广场', 类型: '商业', 排水许可证: 'YH-COM-2024-010', 日排水量: '200m³/d', 排水去向: '万家丽路污水管', 水质: '达标', 有效期: '2026-03-15' } },
        { lng: 113.030, lat: 28.150, title: '侯家塘商业中心', info: { 名称: '侯家塘商业中心', 类型: '商业', 排水许可证: 'YH-COM-2024-015', 日排水量: '150m³/d', 排水去向: '芙蓉路污水管', 水质: '达标', 有效期: '2025-09-20' } },
        { lng: 113.048, lat: 28.135, title: '劳动路购物中心', info: { 名称: '劳动路购物中心', 类型: '商业', 排水许可证: 'YH-COM-2024-022', 日排水量: '120m³/d', 排水去向: '劳动路污水管', 水质: '达标', 有效期: '2026-01-10' } },
    ],
    catering: [
        { lng: 113.042, lat: 28.143, title: '韶山路美食街', info: { 名称: '韶山路美食街', 类型: '餐饮', 排水许可证: 'YH-CAT-2024-005', 日排水量: '80m³/d', 隔油设施: '有', 排水去向: '韶山路污水管', 水质: '达标' } },
        { lng: 113.052, lat: 28.130, title: '圭塘河畔餐饮区', info: { 名称: '圭塘河畔餐饮区', 类型: '餐饮', 排水许可证: 'YH-CAT-2024-008', 日排水量: '60m³/d', 隔油设施: '有', 排水去向: '圭塘河污水管', 水质: '达标' } },
    ],
    resident: [
        { lng: 113.038, lat: 28.155, title: '左家塘小区', info: { 名称: '左家塘小区', 类型: '居民', 户数: '2400户', 日排水量: '960m³/d', 排水体制: '分流制', 排水去向: '左家塘污水管', 雨污分流: '已完成' } },
        { lng: 113.045, lat: 28.138, title: '圭塘花园', info: { 名称: '圭塘花园', 类型: '居民', 户数: '1800户', 日排水量: '720m³/d', 排水体制: '分流制', 排水去向: '圭塘河污水管', 雨污分流: '已完成' } },
        { lng: 113.055, lat: 28.145, title: '万家丽花园', info: { 名称: '万家丽花园', 类型: '居民', 户数: '3200户', 日排水量: '1280m³/d', 排水体制: '合流制', 排水去向: '万家丽路污水管', 雨污分流: '改造中' } },
    ],
}

const visibleMarkers = computed(() => {
    const result: { lng: number; lat: number; title: string; label?: string; color?: string }[] = []
    categories.value.forEach(cat => {
        if (!cat.visible) return
            ; (drainUsers[cat.key] || []).forEach(u => result.push({ lng: u.lng, lat: u.lat, title: u.title, label: u.title, color: cat.color }))
    })
    return result
})

const showDetail = ref(false)
const detailTitle = ref('')
const detailInfo = ref<Record<string, string>>({})
function viewDetail(title: string) {
    for (const key of Object.keys(drainUsers)) {
        const found = drainUsers[key]?.find(u => u.title === title)
        if (found) { detailTitle.value = found.title; detailInfo.value = found.info; showDetail.value = true; return }
    }
}

// 统计分析
const activeTab = ref<'map' | 'stats'>('map')
const stats = computed(() => categories.value.map(c => ({
    label: c.label, color: c.color,
    count: (drainUsers[c.key] || []).length,
    pct: Math.round((drainUsers[c.key] || []).length / Object.values(drainUsers).flat().length * 100),
})))
const totalUsers = computed(() => Object.values(drainUsers).flat().length)
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Users class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">排水户一张图</span>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-0.5 bg-surface rounded-lg p-0.5">
                    <button @click="activeTab = 'map'"
                        class="px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                        :class="activeTab === 'map' ? 'bg-primary text-white' : 'text-dim'">地图</button>
                    <button @click="activeTab = 'stats'"
                        class="px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer transition-colors"
                        :class="activeTab === 'stats' ? 'bg-primary text-white' : 'text-dim'">统计</button>
                </div>
                <div class="flex items-center gap-1">
                    <button v-for="c in categories" :key="c.key" @click="c.visible = !c.visible"
                        class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer"
                        :class="c.visible ? 'bg-primary/10 text-primary' : 'bg-surface text-dim'">
                        <component :is="c.visible ? Eye : EyeOff" class="w-3 h-3" />
                        <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: c.color }"></span>
                        {{ c.label }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 地图视图 -->
        <template v-if="activeTab === 'map'">
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <AMapView :markers="visibleMarkers" :center="[113.042, 28.140]" :zoom="14" height="400px" />
            </div>
            <div class="grid grid-cols-4 gap-3">
                <div v-for="s in stats" :key="s.label"
                    class="bg-card border border-themed rounded-xl p-3 shadow-themed text-center">
                    <div class="w-3 h-3 rounded-full mx-auto mb-1" :style="{ backgroundColor: s.color }"></div>
                    <p class="text-xl font-bold text-default">{{ s.count }}</p>
                    <p class="text-[10px] text-dim">{{ s.label }} ({{ s.pct }}%)</p>
                </div>
            </div>
        </template>

        <!-- 统计分析视图 -->
        <template v-if="activeTab === 'stats'">
            <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                <p class="text-3xl font-bold text-primary">{{ totalUsers }}</p>
                <p class="text-[10px] text-dim mt-1">排水户总数</p>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                <div class="flex items-center gap-2 mb-3">
                    <BarChart3 class="w-4 h-4 text-primary" /><span class="text-xs font-bold text-default">类型分布</span>
                </div>
                <div class="space-y-2">
                    <div v-for="s in stats" :key="s.label" class="flex items-center gap-3">
                        <span class="text-[10px] w-8 shrink-0" :style="{ color: s.color }">{{ s.label }}</span>
                        <div class="flex-1 h-5 bg-surface rounded-full overflow-hidden relative">
                            <div class="h-full rounded-full transition-all"
                                :style="{ width: s.pct + '%', backgroundColor: s.color }"></div>
                            <span
                                class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white mix-blend-difference">{{
                                    s.count }}户 ({{ s.pct }}%)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">名称</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">类型</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">日排水量</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="c in categories" :key="c.key">
                            <tr v-for="u in drainUsers[c.key]" :key="u.title"
                                class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                                <td class="px-3 py-2 text-default font-medium">{{ u.title }}</td>
                                <td class="text-center px-2 py-2"><span
                                        class="text-[9px] px-1.5 py-0.5 rounded font-medium text-white"
                                        :style="{ backgroundColor: c.color }">{{ c.label }}</span></td>
                                <td class="text-center px-2 py-2 text-default">{{ u.info['日排水量'] || '-' }}</td>
                                <td class="text-center px-2 py-2"><button @click="viewDetail(u.title)"
                                        class="text-primary text-[10px] cursor-pointer hover:underline">详情</button></td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>

        <ModalDialog :show="showDetail" :title="detailTitle" @close="showDetail = false" @confirm="showDetail = false">
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div v-for="(v, k) in detailInfo" :key="k" class="p-2.5 rounded-lg bg-surface">
                    <p class="text-dim text-[10px]">{{ k }}</p>
                    <p class="text-default font-medium mt-0.5">{{ v }}</p>
                </div>
            </div>
        </ModalDialog>
    </div>
</template>
