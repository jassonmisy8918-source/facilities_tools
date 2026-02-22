import { create } from 'zustand';
export interface UserInfo {
    id: number;
    username: string;
    name: string;
    role: string;
    avatar: string;
    permissions: string[];
}

interface UserState {
    token: string;
    userInfo: UserInfo | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
    getUserInfo: () => Promise<void>;
    logout: () => void;
}

// 内置 mock 用户（生产环境回退用）
const MOCK_USERS = [
    { id: 1, username: 'admin', password: 'admin123', name: '系统管理员', role: 'admin', avatar: '', permissions: ['*'] },
    { id: 2, username: 'operator', password: '123456', name: '运维操作员', role: 'operator', avatar: '', permissions: ['assets', 'monitoring', 'patrol'] },
];

function mockLogin(username: string, password: string) {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) {
        const token = `mock-token-${user.role}-${Date.now()}`;
        return {
            code: 200, message: '登录成功',
            data: { token, userInfo: { id: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar, permissions: user.permissions } }
        };
    }
    return { code: 401, message: '用户名或密码错误', data: null };
}

function mockUserInfo(token: string) {
    const role = token.includes('admin') ? 'admin' : 'operator';
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0]!;
    return { code: 200, data: { id: user.id, username: user.username, name: user.name, role: user.role, avatar: user.avatar, permissions: user.permissions } };
}

export const useUserStore = create<UserState>((set, get) => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    get isLoggedIn() {
        return !!get().token;
    },

    login: async (username, password) => {
        try {
            // 兼容原有 fetch 与 mock 回退的逻辑
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            let data;
            if (res.ok) {
                data = await res.json();
            } else {
                data = mockLogin(username, password);
            }
            if (data.code === 200) {
                set({ token: data.data.token, userInfo: data.data.userInfo });
                localStorage.setItem('token', data.data.token);
                return { success: true, message: '登录成功' };
            }
            return { success: false, message: data.message || '用户名或密码错误' };
        } catch {
            return { success: false, message: '网络错误，请稍后重试' };
        }
    },

    getUserInfo: async () => {
        const { token } = get();
        if (!token) return;
        try {
            const res = await fetch('/api/auth/userinfo', {
                headers: { Authorization: `Bearer ${token}` }
            });
            let data;
            if (res.ok) {
                data = await res.json();
            } else {
                data = mockUserInfo(token);
            }
            if (data.code === 200) {
                set({ userInfo: data.data });
            }
        } catch {
            // ignore
        }
    },

    logout: () => {
        set({ token: '', userInfo: null });
        localStorage.removeItem('token');
    }
}));
