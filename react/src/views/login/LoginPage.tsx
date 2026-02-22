import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import logoUrl from '@/assets/logo.jpg';

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useUserStore((state) => state.login);

    const [form, setForm] = useState({
        username: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shakeError, setShakeError] = useState(false);

    const showError = (msg: string) => {
        setError(msg);
        setShakeError(true);
        setTimeout(() => {
            setShakeError(false);
        }, 500);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username.trim()) {
            showError('请输入用户名');
            return;
        }
        if (!form.password.trim()) {
            showError('请输入密码');
            return;
        }

        setLoading(true);
        setError('');

        const result = await login(form.username, form.password);

        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            showError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl"></div>
            </div>

            {/* 登录卡片 */}
            <div className="relative z-10 w-full max-w-4xl mx-4 bg-card border border-themed rounded-2xl shadow-themed-lg flex overflow-hidden">
                {/* 左侧品牌区 */}
                <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10 bg-linear-to-br from-primary-dark to-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    {/* 装饰光圈 */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Logo 大尺寸展示 */}
                        <div className="w-32 h-32 rounded-2xl bg-white p-3 shadow-lg shadow-black/30 mb-6">
                            <img src={logoUrl || '/logo.png'} alt="长沙水业 Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-wide mb-2">长沙水业</h1>
                        <h2 className="text-base font-medium text-white/80 mb-6">城市排水设施管理平台</h2>
                        <div className="w-12 h-px bg-white/30 mb-6"></div>
                        <p className="text-sm text-white/55 leading-relaxed mb-8 max-w-xs">
                            集排水设施资产管理、综合监测、巡查养护、泵站运维、提质增效于一体的智慧化管理平台。
                        </p>
                        <div className="space-y-2.5 text-left">
                            <div className="flex items-center gap-3 text-white/70 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                                <span>GIS一张图可视化管理</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/70 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                                <span>全天候实时监测预警</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/70 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0"></div>
                                <span>智能化运维决策支持</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧表单区 */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4 lg:hidden">
                            <img src={logoUrl || '/logo.png'} alt="Logo" className="w-10 h-10 rounded-lg" />
                            <span className="text-lg font-bold text-default">长沙水业</span>
                        </div>
                        <h3 className="text-2xl font-bold text-default">登录</h3>
                        <p className="text-sm text-dim mt-2">请输入您的账号信息</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* 用户名 */}
                        <div>
                            <label className="block text-sm font-medium text-dim mb-2">用户名</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
                                <input
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    type="text"
                                    placeholder="请输入用户名"
                                    className="w-full pl-10 pr-4 py-2.5 bg-input border border-themed rounded-lg text-sm text-default placeholder-(--text-muted) focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* 密码 */}
                        <div>
                            <label className="block text-sm font-medium text-dim mb-2">密码</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
                                <input
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="请输入密码"
                                    className="w-full pl-10 pr-10 py-2.5 bg-input border border-themed rounded-lg text-sm text-default placeholder-(--text-muted) focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-themed hover:text-dim transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* 记住我 */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.remember}
                                    onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                                    className="w-4 h-4 rounded border-themed accent-primary"
                                />
                                <span className="text-sm text-dim">记住我</span>
                            </label>
                        </div>

                        {/* 错误提示 */}
                        {error && (
                            <div
                                className={`text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5 ${shakeError ? 'animate-shake' : ''
                                    }`}
                            >
                                {error}
                            </div>
                        )}

                        {/* 登录按钮 */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-primary hover:bg-primary-light text-white font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                        <path
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            fill="currentColor"
                                            className="opacity-75"
                                        />
                                    </svg>
                                    登录中...
                                </span>
                            ) : (
                                <span>登 录</span>
                            )}
                        </button>
                    </form>

                    {/* 底部提示 */}
                    <p className="text-xs text-muted-themed text-center mt-8">
                        测试账号：admin / admin123 或 operator / 123456
                    </p>
                </div>
            </div>

            {/* 注入原 vue 组件内部的 keyframes 及 shake 样式，为了不在 tailwind 强绑定可以写在 style 中 */}
            <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
        }
        .animate-shake {
            animation: shake 0.3s ease-in-out;
        }
      `}</style>
        </div>
    );
}
