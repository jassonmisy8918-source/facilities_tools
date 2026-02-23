<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { systemMenus } from '@/stores/menu'
import { useAppStore } from '@/stores/app'
import AppTopNav from '@/components/layout/AppTopNav.vue'
import SubSidebar from '@/components/layout/SubSidebar.vue'

const route = useRoute()
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

const isDashboard = computed(() => currentSystem.value === 'dashboard')

const contentMarginLeft = computed(() => {
    if (!hasSubMenu.value) return '0px'
    return appStore.sidebarCollapsed ? '64px' : '208px'
})

const breadcrumbSystem = computed(() => {
    return currentMenu.value?.label || ''
})

const breadcrumbPage = computed(() => {
    return (route.meta.title as string) || ''
})
</script>

<template>
    <div class="min-h-screen bg-base transition-colors duration-300">
        <AppTopNav />
        <SubSidebar />

        <!-- 主内容区 -->
        <main class="pt-14 transition-all duration-300" :style="{ marginLeft: contentMarginLeft }">
            <!-- 面包屑 (驾驶舱不显示) -->
            <div v-if="!isDashboard" class="px-6 pt-4 pb-2">
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-muted-themed">{{ breadcrumbSystem }}</span>
                    <span v-if="breadcrumbPage" class="text-muted-themed">/</span>
                    <span v-if="breadcrumbPage" class="text-default font-medium">{{ breadcrumbPage }}</span>
                </div>
            </div>

            <!-- 页面内容 -->
            <div :class="isDashboard ? '' : 'p-6 pt-2'">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </main>
    </div>
</template>
