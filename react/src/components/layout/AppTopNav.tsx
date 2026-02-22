import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { systemMenus } from '@/stores/menu';
import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import { Sun, Moon, Bell, Search, LogOut, User } from 'lucide-react';
// @ts-ignore
import logoUrl from '@/assets/logo.png'; // 假设图片资源能正常引入，后续可以根据实际情况对齐

export default function AppTopNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark, toggle } = useThemeStore();
    const { userInfo, logout } = useUserStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // 从路径提取当前选中的 system
    const currentSystem = location.pathname.split('/')[1] || 'dashboard';

    const navigateSystem = (basePath: string) => {
        navigate(basePath);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 bg-topnav border-b border-themed">
            {/* Logo */}
            <div className="flex items-center gap-3 mr-8 shrink-0">
                <img src={logoUrl || '/logo.png'} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                <span className="text-base font-semibold text-white whitespace-nowrap">智慧排水管理平台</span>
            </div>

            {/* 系统主菜单 */}
            <div className="flex items-center gap-1 flex-1">
                {systemMenus.map((menu) => {
                    const Icon = menu.icon;
                    const isActive = currentSystem === menu.key;
                    return (
                        <button
                            key={menu.key}
                            onClick={() => navigateSystem(menu.basePath)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${isActive
                                    ? 'text-white bg-white/10 border-b-2 border-primary'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{menu.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-2 shrink-0">
                {/* 搜索 */}
                <button className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                    <Search className="w-4 h-4" />
                </button>

                {/* 主题切换 */}
                <button
                    onClick={toggle}
                    className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title={isDark ? '切换到浅色模式' : '切换到深色模式'}
                >
                    {isDark ? (
                        <Sun className="w-4 h-4 transition-transform duration-300" />
                    ) : (
                        <Moon className="w-4 h-4 transition-transform duration-300" />
                    )}
                </button>

                {/* 通知 */}
                <button className="relative p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                </button>

                {/* 用户头像 */}
                <div className="relative ml-2">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-1.5 rounded-md text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-light" />
                        </div>
                        <span className="text-sm">{userInfo?.name || '用户'}</span>
                    </button>

                    {/* 下拉菜单 */}
                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-themed rounded-lg shadow-themed-lg py-1 z-50">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setShowUserMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dim hover:bg-hover-themed hover:text-default transition-colors cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                退出登录
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
