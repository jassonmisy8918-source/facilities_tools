<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { User, Lock, Eye, EyeOff } from 'lucide-vue-next'
import logoUrl from '@/static/shuidi.jpg'
import ModalDialog from '@/components/common/ModalDialog.vue'

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
const showDingDing = ref(false)

function handleDingDingLogin() {
    showDingDing.value = true
}
function confirmDingDing() {
    showDingDing.value = false
    window.open('https://login.dingtalk.com/oauth2/auth', '_blank')
}

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
                class="hidden lg:flex w-1/2 flex-col items-center justify-center p-10 bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
                <div class="absolute inset-0 bg-black/20"></div>
                <!-- 装饰光圈 -->
                <div
                    class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-2xl">
                </div>
                <div class="relative z-10 flex flex-col items-center text-center">
                    <!-- Logo 大尺寸展示 -->
                    <div class="w-32 h-32 rounded-2xl bg-white p-3 shadow-lg shadow-black/30 mb-6">
                        <img :src="logoUrl" alt="XX水业 Logo" class="w-full h-full object-contain" />
                    </div>
                    <h1 class="text-3xl font-bold text-white tracking-wide mb-2">XX水业</h1>
                    <h2 class="text-base font-medium text-white/80 mb-6">城市排水设施管理平台</h2>
                    <div class="w-12 h-px bg-white/30 mb-6"></div>
                    <p class="text-sm text-white/55 leading-relaxed mb-8 max-w-xs">
                        集排水设施资产管理、综合监测、巡查养护、泵站运维、提质增效于一体的智慧化管理平台。
                    </p>
                    <div class="space-y-2.5 text-left">
                        <div class="flex items-center gap-3 text-white/70 text-sm">
                            <div class="w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                            <span>GIS一张图可视化管理</span>
                        </div>
                        <div class="flex items-center gap-3 text-white/70 text-sm">
                            <div class="w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                            <span>全天候实时监测预警</span>
                        </div>
                        <div class="flex items-center gap-3 text-white/70 text-sm">
                            <div class="w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                            <span>智能化运维决策支持</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧表单区 -->
            <div class="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
                <img src="@/static/dingding.webp" alt="钉钉登录"
                    class="absolute top-4 right-4 w-12 h-12 rounded-lg shadow-md object-contain cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    @click="handleDingDingLogin" />
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4 lg:hidden">
                        <img :src="logoUrl" alt="Logo" class="w-10 h-10 rounded-lg" />
                        <span class="text-lg font-bold text-default">长沙水业</span>
                    </div>
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
            </div>
        </div>
    </div>

    <!-- 钉钉登录弹窗 -->
    <ModalDialog :show="showDingDing" title="钉钉授权登录" @close="showDingDing = false" @confirm="confirmDingDing">
        <div class="text-center py-4">
            <img src="@/static/dingding.webp" alt="钉钉" class="w-16 h-16 mx-auto mb-4 rounded-xl" />
            <p class="text-sm text-default font-medium mb-2">即将跳转钉钉授权登录</p>
            <p class="text-xs text-dim">点击确定后将打开钉钉授权页面，授权后自动登录系统</p>
        </div>
    </ModalDialog>
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
