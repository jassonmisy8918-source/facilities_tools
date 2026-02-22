<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShieldCheck, Wrench, GitPullRequestArrow, ClipboardList, PenSquare } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tabs = [
    { key: 'inspection', label: '数据质检', icon: ShieldCheck, path: '/assets/data-quality' },
    { key: 'repair', label: '数据修复', icon: Wrench, path: '/assets/data-quality/repair' },
    { key: 'edge', label: '数据接边处理', icon: GitPullRequestArrow, path: '/assets/data-quality/edge' },
    { key: 'census', label: '普查成果管理', icon: ClipboardList, path: '/assets/data-quality/census' },
    { key: 'online-edit', label: '在线编辑', icon: PenSquare, path: '/assets/data-quality/online-edit' },
]

const activeTab = computed(() => {
    const path = route.path
    if (path === '/assets/data-quality' || path === '/assets/data-quality/') return 'inspection'
    const found = tabs.find(t => t.key !== 'inspection' && path.includes(t.key))
    return found?.key || 'inspection'
})

function navigate(path: string) {
    router.push(path)
}
</script>

<template>
    <div class="space-y-4">
        <!-- 子导航 Tab -->
        <div class="bg-card border border-themed rounded-xl shadow-themed p-1.5">
            <div class="flex items-center gap-0.5">
                <button v-for="tab in tabs" :key="tab.key" @click="navigate(tab.path)"
                    class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    :class="activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-dim hover:text-default hover:bg-hover-themed'">
                    <component :is="tab.icon" class="w-3.5 h-3.5" />
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <!-- 子路由内容 -->
        <router-view />
    </div>
</template>
