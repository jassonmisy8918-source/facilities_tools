<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, Lock, Eye, EyeOff, Droplets } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
    username: '',
    password: '',
    remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const shakeError = ref(false)

async function handleLogin() {
    if (!form.username.trim()) {
        showError('请输入用户名')
        return
    }
    if (!form.password.trim()) {
        showError('请输入密码')
        return
    }

    loading.value = true
    error.value = ''

    const result = await userStore.login(form.username, form.password)

    loading.value = false

    if (result.success) {
        router.push('/dashboard')
    } else {
        showError(result.message)
    }
}

function showError(msg: string) {
    error.value = msg
    shakeError.value = true
    setTimeout(() => { shakeError.value = false }, 500)
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl">
            </div>
        </div>

        <!-- 登录卡片 -->
        <div
            class="relative z-10 w-full max-w-4xl mx-4 bg-card border border-themed rounded-2xl shadow-themed-lg flex overflow-hidden">
            <!-- 左侧品牌区 -->
            <div
                class="hidden lg:flex w-1/2 flex-col justify-center p-12 bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
                <div class="absolute inset-0 bg-black/20"></div>
                <div class="relative z-10">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Droplets class="w-7 h-7 text-white" />
                        </div>
                        <h1 class="text-2xl font-bold text-white">智慧排水</h1>
                    </div>
                    <h2 class="text-xl font-semibold text-white/90 mb-4">城市排水设施管理平台</h2>
                    <p class="text-sm text-white/60 leading-relaxed mb-8">
                        集排水设施资产管理、综合监测、巡查养护、泵站运维、提质增效于一体的智慧化管理平台。
                    </p>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 text-white/70 text-sm">
                            <div class="w-1.5 h-1.5 rounded-full bg-success"></div>
                            <span>GIS一张图可视化管理</span>
                        </div>
                        <div class="flex items-center gap-3 text-white/70 text-sm">
                            <div class="w-1.5 h-1.5 rounded-full bg-success"></div>
                            <span>全天候实时监测预警</span>
                        </div>
                        <div class="flex items-center gap-3 text-white/70 text-sm">
                            <div class="w-1.5 h-1.5 rounded-full bg-success"></div>
                            <span>智能化运维决策支持</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧表单区 -->
            <div class="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                <div class="mb-8">
                    <h3 class="text-2xl font-bold text-default">登录</h3>
                    <p class="text-sm text-dim mt-2">请输入您的账号信息</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <!-- 用户名 -->
                    <div>
                        <label class="block text-sm font-medium text-dim mb-2">用户名</label>
                        <div class="relative">
                            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
                            <input v-model="form.username" type="text" placeholder="请输入用户名"
                                class="w-full pl-10 pr-4 py-2.5 bg-input border border-themed rounded-lg text-sm text-default placeholder-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors" />
                        </div>
                    </div>

                    <!-- 密码 -->
                    <div>
                        <label class="block text-sm font-medium text-dim mb-2">密码</label>
                        <div class="relative">
                            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
                            <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                placeholder="请输入密码"
                                class="w-full pl-10 pr-10 py-2.5 bg-input border border-themed rounded-lg text-sm text-default placeholder-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors" />
                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-themed hover:text-dim transition-colors cursor-pointer">
                                <EyeOff v-if="showPassword" class="w-4 h-4" />
                                <Eye v-else class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <!-- 记住我 -->
                    <div class="flex items-center justify-between">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" v-model="form.remember"
                                class="w-4 h-4 rounded border-themed accent-primary" />
                            <span class="text-sm text-dim">记住我</span>
                        </label>
                    </div>

                    <!-- 错误提示 -->
                    <div v-if="error"
                        class="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5"
                        :class="{ 'animate-shake': shakeError }">
                        {{ error }}
                    </div>

                    <!-- 登录按钮 -->
                    <button type="submit" :disabled="loading"
                        class="w-full py-2.5 bg-primary hover:bg-primary-light text-white font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="loading" class="flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                                    class="opacity-25"></circle>
                                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"
                                    class="opacity-75"></path>
                            </svg>
                            登录中...
                        </span>
                        <span v-else>登 录</span>
                    </button>
                </form>

                <!-- 底部提示 -->
                <p class="text-xs text-muted-themed text-center mt-8">
                    测试账号：admin / admin123 或 operator / 123456
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-6px);
    }

    75% {
        transform: translateX(6px);
    }
}

.animate-shake {
    animation: shake 0.3s ease-in-out;
}
</style>
