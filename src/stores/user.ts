import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
    id: number
    username: string
    name: string
    role: string
    avatar: string
    permissions: string[]
}

// 内置 mock 用户（生产环境回退用）
const MOCK_USERS = [
    { id: 1, username: 'admin', password: 'admin123', name: '系统管理员', role: 'admin', avatar: '', permissions: ['*'] },
    { id: 2, username: 'operator', password: '123456', name: '运维操作员', role: 'operator', avatar: '', permissions: ['assets', 'monitoring', 'patrol'] },
]

function mockLogin(username: string, password: string) {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password)
    if (user) {
        const token = `mock-token-${user.role}-${Date.now()}`
        return {
            code: 200, message: '登录成功',
            data: { token, userInfo: { id: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar, permissions: user.permissions } }
        }
    }
    return { code: 401, message: '用户名或密码错误', data: null }
}

function mockUserInfo(token: string) {
    // 从 token 推断角色
    const role = token.includes('admin') ? 'admin' : 'operator'
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0]!
    return { code: 200, data: { id: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar, permissions: user.permissions } }
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
            let data
            if (res.ok) {
                data = await res.json()
            } else {
                // 生产环境无后端：客户端 mock 验证
                data = mockLogin(username, password)
            }
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
            let data
            if (res.ok) {
                data = await res.json()
            } else {
                data = mockUserInfo(token.value)
            }
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
