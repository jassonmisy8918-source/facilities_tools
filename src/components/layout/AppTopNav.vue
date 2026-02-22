<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { systemMenus } from '@/stores/menu'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { Sun, Moon, Bell, Search, LogOut, User } from 'lucide-vue-next'
import logoUrl from '@/static/logo.png'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()

const currentSystem = computed(() => {
  return (route.meta.system as string) || 'dashboard'
})

const showUserMenu = ref(false)

function navigateSystem(basePath: string) {
  router.push(basePath)
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 bg-topnav border-b border-themed">
    <!-- Logo -->
    <div class="flex items-center gap-3 mr-8 shrink-0">
      <img :src="logoUrl" alt="Logo" class="w-8 h-8 rounded-lg object-contain" />
      <span class="text-base font-semibold text-white whitespace-nowrap">智慧排水管理平台</span>
    </div>

    <!-- 系统主菜单 -->
    <div class="flex items-center gap-1 flex-1">
      <button v-for="menu in systemMenus" :key="menu.key" @click="navigateSystem(menu.basePath)"
        class="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
        :class="currentSystem === menu.key
          ? 'text-white bg-white/10 border-b-2 border-primary'
          : 'text-slate-400 hover:text-white hover:bg-white/5'">
        <component :is="menu.icon" class="w-4 h-4" />
        <span>{{ menu.label }}</span>
      </button>
    </div>

    <!-- 右侧工具栏 -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- 搜索 -->
      <button class="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
        <Search class="w-4 h-4" />
      </button>

      <!-- 主题切换 -->
      <button @click="themeStore.toggle()"
        class="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        :title="themeStore.isDark ? '切换到浅色模式' : '切换到深色模式'">
        <Sun v-if="themeStore.isDark" class="w-4 h-4 transition-transform duration-300" />
        <Moon v-else class="w-4 h-4 transition-transform duration-300" />
      </button>

      <!-- 通知 -->
      <button
        class="relative p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
        <Bell class="w-4 h-4" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
      </button>

      <!-- 用户头像 -->
      <div class="relative ml-2">
        <button @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-2 p-1.5 rounded-md text-slate-300 hover:bg-white/10 transition-colors cursor-pointer">
          <div class="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center">
            <User class="w-4 h-4 text-primary-light" />
          </div>
          <span class="text-sm">{{ userStore.userInfo?.name || '用户' }}</span>
        </button>
        <!-- 下拉菜单 -->
        <div v-show="showUserMenu"
          class="absolute right-0 top-full mt-1 w-40 bg-card border border-themed rounded-lg shadow-themed-lg py-1 z-50">
          <button @click="handleLogout(); showUserMenu = false"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-dim hover:bg-hover-themed hover:text-default transition-colors cursor-pointer">
            <LogOut class="w-4 h-4" />
            退出登录
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
