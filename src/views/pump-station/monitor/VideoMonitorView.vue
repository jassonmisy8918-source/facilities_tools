<script setup lang="ts">
import { ref } from 'vue'
import { Video, Play, Pause, Bookmark, HardDrive, Search, Clock, Tag } from 'lucide-vue-next'

const activeFunc = ref('live')
const funcTabs = [
    { key: 'live', label: '实时调阅' },
    { key: 'playback', label: '录像回放' },
    { key: 'keyframe', label: '关键帧标记' },
    { key: 'storage', label: '存储管理' },
]

// ── 实时视频 ──
const cameras = ref([
    { id: 1, station: '雨花泵站', name: '进水口摄像头', status: '在线', resolution: '1080P', ptz: true },
    { id: 2, station: '雨花泵站', name: '泵房内部', status: '在线', resolution: '1080P', ptz: false },
    { id: 3, station: '侯家塘泵站', name: '前池监控', status: '在线', resolution: '720P', ptz: true },
    { id: 4, station: '黎托泵站', name: '配电室', status: '离线', resolution: '1080P', ptz: false },
    { id: 5, station: '黎托泵站', name: '出水口摄像头', status: '在线', resolution: '1080P', ptz: true },
    { id: 6, station: '左家塘泵站', name: '泵房全景', status: '在线', resolution: '4K', ptz: true },
])

const selectedCamera = ref(1)
const isPlaying = ref(true)

// ── 录像 ──
const recordings = ref([
    { id: 1, camera: '进水口摄像头', station: '雨花泵站', start: '2024-03-15 00:00', end: '2024-03-15 23:59', size: '12.5GB', status: '可用' },
    { id: 2, camera: '泵房内部', station: '雨花泵站', start: '2024-03-15 00:00', end: '2024-03-15 23:59', size: '11.2GB', status: '可用' },
    { id: 3, camera: '前池监控', station: '侯家塘泵站', start: '2024-03-14 00:00', end: '2024-03-14 23:59', size: '8.6GB', status: '可用' },
    { id: 4, camera: '配电室', station: '黎托泵站', start: '2024-03-13 00:00', end: '2024-03-13 12:30', size: '5.1GB', status: '已归档' },
])

// ── 关键帧 ──
const keyframes = ref([
    { id: 1, camera: '进水口摄像头', station: '雨花泵站', time: '2024-03-15 14:32:15', tag: '设备启动', desc: '3号泵开机', creator: '张伟' },
    { id: 2, camera: '泵房内部', station: '雨花泵站', time: '2024-03-15 16:20:05', tag: '异常事件', desc: '水位告警触发', creator: '系统' },
    { id: 3, camera: '前池监控', station: '侯家塘泵站', time: '2024-03-14 09:15:30', tag: '设备停机', desc: '2号泵计划停机', creator: '李明' },
    { id: 4, camera: '出水口摄像头', station: '黎托泵站', time: '2024-03-13 22:00:10', tag: '异常事件', desc: '流量异常', creator: '系统' },
])

// ── 存储 ──
const storageInfo = ref({
    total: '50TB', used: '32.5TB', free: '17.5TB', usedPct: 65,
    policy: { retentionDays: 90, autoDelete: true, archiveAfter: 30 },
    byStation: [
        { station: '雨花泵站', cameras: 2, used: '12.8TB', pct: 25.6 },
        { station: '侯家塘泵站', cameras: 1, used: '6.2TB', pct: 12.4 },
        { station: '黎托泵站', cameras: 2, used: '8.5TB', pct: 17.0 },
        { station: '左家塘泵站', cameras: 1, used: '3.2TB', pct: 6.4 },
        { station: '洞井泵站', cameras: 0, used: '1.8TB', pct: 3.6 },
    ]
})
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5 overflow-x-auto">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                    ft.label }}</button>
        </div>

        <!-- 实时调阅 -->
        <template v-if="activeFunc === 'live'">
            <div class="grid grid-cols-4 gap-3">
                <div class="col-span-3 bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <div class="bg-black aspect-video flex items-center justify-center relative">
                        <Video class="w-10 h-10 text-white/30" />
                        <span
                            class="absolute bottom-3 left-3 text-[10px] text-white/50 bg-black/50 px-2 py-1 rounded">{{
                                cameras.find(c => c.id === selectedCamera)?.station}} — {{cameras.find(c => c.id ===
                                selectedCamera)?.name}}</span>
                        <div class="absolute bottom-3 right-3 flex gap-2">
                            <button @click="isPlaying = !isPlaying"
                                class="p-1.5 bg-black/50 rounded-full text-white/70 hover:text-white cursor-pointer">
                                <component :is="isPlaying ? Pause : Play" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-3 max-h-80 overflow-y-auto">
                    <span class="text-[10px] font-bold text-dim block mb-2">监控点位</span>
                    <div class="space-y-1.5">
                        <button v-for="cam in cameras" :key="cam.id" @click="selectedCamera = cam.id"
                            class="w-full text-left p-2 rounded-lg text-[10px] cursor-pointer transition-colors"
                            :class="selectedCamera === cam.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-hover-themed'">
                            <div class="flex items-center justify-between"><span class="text-default font-medium">{{
                                cam.name }}</span><span class="w-1.5 h-1.5 rounded-full"
                                    :class="cam.status === '在线' ? 'bg-success' : 'bg-danger'"></span></div>
                            <span class="text-dim">{{ cam.station }} · {{ cam.resolution }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <!-- 录像回放 -->
        <template v-if="activeFunc === 'playback'">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">录像回放管理</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1 px-2 py-1 bg-surface rounded-lg text-[10px] text-dim">
                        <Search class="w-3 h-3" /><input type="text" placeholder="搜索录像..."
                            class="bg-transparent outline-none text-default w-24" />
                    </div>
                </div>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">摄像头</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">开始时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">结束时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">大小</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">状态</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in recordings" :key="r.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ r.camera }}</td>
                            <td class="px-2 py-2.5 text-dim">{{ r.station }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.start }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ r.end }}</td>
                            <td class="text-center px-2 py-2.5 text-primary font-bold">{{ r.size }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="r.status === '可用' ? 'bg-success/10 text-success' : 'bg-surface text-dim'">{{
                                        r.status }}</span></td>
                            <td class="text-center px-2 py-2.5"><button
                                    class="text-[10px] text-primary hover:underline cursor-pointer">播放</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 关键帧标记 -->
        <template v-if="activeFunc === 'keyframe'">
            <div class="flex items-center gap-2 mb-2">
                <Bookmark class="w-4 h-4 text-warning" /><span class="text-sm font-semibold text-default">关键帧标记管理</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-themed bg-surface/50">
                            <th class="text-left px-3 py-2.5 text-dim font-medium">摄像头</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">泵站</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">时间</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">标签</th>
                            <th class="text-left px-2 py-2.5 text-dim font-medium">描述</th>
                            <th class="text-center px-2 py-2.5 text-dim font-medium">标记人</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="k in keyframes" :key="k.id"
                            class="border-b border-themed/30 hover:bg-hover-themed transition-colors">
                            <td class="px-3 py-2.5 text-default font-medium">{{ k.camera }}</td>
                            <td class="px-2 py-2.5 text-dim">{{ k.station }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ k.time }}</td>
                            <td class="text-center px-2 py-2.5"><span
                                    class="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                    :class="k.tag === '异常事件' ? 'bg-danger/10 text-danger' : k.tag === '设备启动' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'">
                                    <Tag class="w-3 h-3 inline mr-0.5" />{{ k.tag }}
                                </span></td>
                            <td class="px-2 py-2.5 text-default">{{ k.desc }}</td>
                            <td class="text-center px-2 py-2.5 text-dim">{{ k.creator }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <!-- 存储管理 -->
        <template v-if="activeFunc === 'storage'">
            <div class="flex items-center gap-2 mb-2">
                <HardDrive class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">视频存储管理</span>
            </div>
            <div class="grid grid-cols-4 gap-3">
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-xl font-bold text-default">{{ storageInfo.total }}</p>
                    <p class="text-[10px] text-dim">总容量</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-xl font-bold text-primary">{{ storageInfo.used }}</p>
                    <p class="text-[10px] text-dim">已使用</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <p class="text-xl font-bold text-success">{{ storageInfo.free }}</p>
                    <p class="text-[10px] text-dim">剩余</p>
                </div>
                <div class="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                    <div class="w-12 h-12 rounded-full mx-auto mb-1 relative"><svg viewBox="0 0 36 36"
                            class="w-12 h-12">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="currentColor" class="text-surface" stroke-width="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                :stroke="storageInfo.usedPct > 80 ? '#ef4444' : storageInfo.usedPct > 60 ? '#f59e0b' : '#22c55e'"
                                stroke-width="3" :stroke-dasharray="storageInfo.usedPct + ', 100'" />
                        </svg><span
                            class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-default">{{
                                storageInfo.usedPct }}%</span></div>
                    <p class="text-[10px] text-dim">使用率</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-2">存储策略</span>
                    <div class="space-y-1.5 text-[10px]">
                        <div class="flex justify-between"><span class="text-dim">保留周期</span><span
                                class="text-default font-medium">{{ storageInfo.policy.retentionDays }} 天</span></div>
                        <div class="flex justify-between"><span class="text-dim">自动删除</span><span class="font-medium"
                                :class="storageInfo.policy.autoDelete ? 'text-success' : 'text-danger'">{{
                                    storageInfo.policy.autoDelete ? '已开启' : '已关闭' }}</span></div>
                        <div class="flex justify-between"><span class="text-dim">自动归档</span><span
                                class="text-default font-medium">{{ storageInfo.policy.archiveAfter }} 天后</span></div>
                    </div>
                </div>
                <div class="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <span class="text-xs font-bold text-default block mb-2">各泵站存储</span>
                    <div class="space-y-1.5">
                        <div v-for="s in storageInfo.byStation" :key="s.station"
                            class="flex items-center gap-2 text-[10px]">
                            <span class="text-default w-16 shrink-0">{{ s.station }}</span>
                            <div class="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                                <div class="h-full bg-primary rounded-full"
                                    :style="{ width: (s.pct / storageInfo.usedPct * 100) + '%' }"></div>
                            </div>
                            <span class="text-dim w-14 text-right">{{ s.used }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
