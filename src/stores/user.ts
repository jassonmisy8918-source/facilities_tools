import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export interface UserInfo {
    id: number
    username: string
    name: string
    role: string
    avatar: string
    permissions: string[]
}

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref<UserInfo | null>(null)

    const isLoggedIn = computed(() => !!token.value)

    async function login(username: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()
            if (data.code === 200) {
                token.value = data.data.token
                userInfo.value = data.data.userInfo
                localStorage.setItem('token', data.data.token)
                return { success: true, message: '登录成功' }
            }
            return { success: false, message: data.message || '用户名或密码错误' }
        } catch {
            return { success: false, message: '网络错误，请稍后重试' }
        }
    }

    async function getUserInfo() {
        if (!token.value) return
        try {
            const res = await fetch('/api/auth/userinfo', {
                headers: { Authorization: `Bearer ${token.value}` }
            })
            const data = await res.json()
            if (data.code === 200) {
                userInfo.value = data.data
            }
        } catch {
            // ignore
        }
    }

    function logout() {
        token.value = ''
        userInfo.value = null
        localStorage.removeItem('token')
    }

    return { token, userInfo, isLoggedIn, login, getUserInfo, logout }
})
