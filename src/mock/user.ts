// Mock 用户数据
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: '系统管理员',
        role: 'admin',
        avatar: '',
        token: 'mock-token-admin-' + Date.now(),
        permissions: ['*']
    },
    {
        id: 2,
        username: 'operator',
        password: '123456',
        name: '运维操作员',
        role: 'operator',
        avatar: '',
        token: 'mock-token-operator-' + Date.now(),
        permissions: ['assets', 'monitoring', 'patrol']
    }
]

// 存储已登录的 token -> user 映射
const tokenMap = new Map<string, typeof users[0]>()

export default [
    // 登录接口
    {
        url: '/api/auth/login',
        method: 'post',
        response: ({ body }: { body: { username: string; password: string } }) => {
            const { username, password } = body
            const user = users.find(u => u.username === username && u.password === password)
            if (user) {
                const token = `mock-token-${user.role}-${Date.now()}`
                tokenMap.set(token, { ...user, token })
                return {
                    code: 200,
                    message: '登录成功',
                    data: {
                        token,
                        userInfo: {
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            role: user.role,
                            avatar: user.avatar,
                            permissions: user.permissions
                        }
                    }
                }
            }
            return {
                code: 401,
                message: '用户名或密码错误',
                data: null
            }
        }
    },
    // 获取用户信息
    {
        url: '/api/auth/userinfo',
        method: 'get',
        response: ({ headers }: { headers: Record<string, string> }) => {
            const auth = headers.authorization || headers.Authorization || ''
            const token = auth.replace('Bearer ', '')
            // 简单模拟：如果有 token 就返回 admin 用户
            if (token) {
                const user = tokenMap.get(token) || users[0]
                return {
                    code: 200,
                    data: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        role: user.role,
                        avatar: user.avatar,
                        permissions: user.permissions
                    }
                }
            }
            return { code: 401, message: '未授权' }
        }
    },
    // 退出登录
    {
        url: '/api/auth/logout',
        method: 'post',
        response: () => ({ code: 200, message: '退出成功' })
    }
]
