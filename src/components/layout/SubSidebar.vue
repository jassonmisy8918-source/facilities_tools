<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { systemMenus } from '@/stores/menu'
import { useAppStore } from '@/stores/app'
import { ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const currentSystem = computed(() => {
    return (route.meta.system as string) || 'dashboard'
})

const currentMenu = computed(() => {
    return systemMenus.find(m => m.key === currentSystem.value)
})

const hasSubMenu = computed(() => {
    return currentMenu.value && currentMenu.value.children.length > 0
})

function isActive(path: string): boolean {
    return route.path === path
}

function navigate(path: string) {
    router.push(path)
}
</script>

<template>
    <aside v-if="hasSubMenu" class="fixed left-0 top-14 bottom-0 z-40 flex flex-col transition-all duration-300"
        :class="appStore.sidebarCollapsed ? 'w-16' : 'w-52'"
        style="background-color: var(--bg-sidebar); border-right: 1px solid var(--border-nav);">
        <!-- 系统标题 + 折叠按钮 -->
        <div class="flex items-center justify-between px-4 py-3" style="border-bottom: 1px solid var(--border-nav);">
            <span v-show="!appStore.sidebarCollapsed" class="text-sm font-medium truncate"
                style="color: var(--nav-text-dim);">
                {{ currentMenu?.label }}
            </span>
            <button @click="appStore.toggleSidebar()"
                class="p-1 rounded transition-colors cursor-pointer hover-nav-item" style="color: var(--nav-text-dim);">
                <ChevronsLeft v-if="!appStore.sidebarCollapsed" class="w-4 h-4" />
                <ChevronsRight v-else class="w-4 h-4" />
            </button>
        </div>

        <!-- 子菜单列表 -->
        <nav class="flex-1 overflow-y-auto py-2 px-2">
            <button v-for="item in currentMenu?.children" :key="item.key" @click="navigate(item.path)"
                class="w-full flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-md text-sm transition-all duration-200 cursor-pointer border-l-2"
                :class="isActive(item.path)
                    ? 'border-primary font-medium'
                    : 'border-transparent'" :style="isActive(item.path)
                        ? { color: 'var(--color-primary)', backgroundColor: 'var(--nav-active-bg)' }
                        : { color: 'var(--nav-text-dim)' }" :title="appStore.sidebarCollapsed ? item.label : ''">
                <component :is="item.icon" class="w-4 h-4 shrink-0" />
                <span v-show="!appStore.sidebarCollapsed" class="truncate">{{ item.label }}</span>
            </button>
        </nav>
    </aside>
</template>

<style scoped>
.hover-nav-item:hover {
    background-color: var(--nav-hover-bg);
    color: var(--nav-text);
}

button:not(.border-primary):hover {
    background-color: var(--nav-hover-bg);
    color: var(--nav-text);
}
</style>
