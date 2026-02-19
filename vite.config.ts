import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// 自定义 Mock API 插件
function mockApiPlugin() {
  return {
    name: 'mock-api',
    configureServer(server: any) {
      // Mock 用户数据
      const users = [
        { id: 1, username: 'admin', password: 'admin123', name: '系统管理员', role: 'admin', avatar: '', permissions: ['*'] },
        { id: 2, username: 'operator', password: '123456', name: '运维操作员', role: 'operator', avatar: '', permissions: ['assets', 'monitoring', 'patrol'] }
      ]
      const tokens = new Map<string, typeof users[0]>()

      server.middlewares.use('/api/auth/login', (req: any, res: any) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', () => {
          try {
            const { username, password } = JSON.parse(body)
            const user = users.find(u => u.username === username && u.password === password)
            res.setHeader('Content-Type', 'application/json')
            if (user) {
              const token = `mock-token-${user.role}-${Date.now()}`
              tokens.set(token, user)
              res.end(JSON.stringify({
                code: 200,
                message: '登录成功',
                data: { token, userInfo: { id: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar, permissions: user.permissions } }
              }))
            } else {
              res.end(JSON.stringify({ code: 401, message: '用户名或密码错误', data: null }))
            }
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ code: 400, message: '请求格式错误' }))
          }
        })
      })

      server.middlewares.use('/api/auth/userinfo', (req: any, res: any) => {
        const auth = req.headers.authorization || ''
        const token = auth.replace('Bearer ', '')
        res.setHeader('Content-Type', 'application/json')
        const user = tokens.get(token) || users[0]
        if (token) {
          res.end(JSON.stringify({ code: 200, data: { id: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar, permissions: user.permissions } }))
        } else {
          res.end(JSON.stringify({ code: 401, message: '未授权' }))
        }
      })

      server.middlewares.use('/api/auth/logout', (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ code: 200, message: '退出成功' }))
      })
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    mockApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true
  }
})
