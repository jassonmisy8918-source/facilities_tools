import { useLocation, useNavigate } from 'react-router-dom';
import { systemMenus } from '@/stores/menu';
import { useAppStore } from '@/stores/app';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function SubSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sidebarCollapsed, toggleSidebar } = useAppStore();

    const currentSystem = location.pathname.split('/')[1] || 'dashboard';

    const currentMenu = systemMenus.find((m) => m.key === currentSystem);
    const hasSubMenu = currentMenu && currentMenu.children.length > 0;

    if (!hasSubMenu) return null;

    return (
        <aside
            className={`fixed left-0 top-14 bottom-0 z-40 flex flex-col transition-all duration-300 border-r border-themed bg-sidebar ${sidebarCollapsed ? 'w-16' : 'w-52'
                }`}
        >
            {/* 系统标题 + 折叠按钮 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                {!sidebarCollapsed && (
                    <span className="text-sm font-medium text-slate-300 truncate">
                        {currentMenu.label}
                    </span>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                >
                    {!sidebarCollapsed ? (
                        <ChevronsLeft className="w-4 h-4" />
                    ) : (
                        <ChevronsRight className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* 子菜单列表 */}
            <nav className="flex-1 overflow-y-auto py-2 px-2">
                {currentMenu.children.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.key}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-md text-sm transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-primary/20 text-primary-light border-l-2 border-primary font-medium'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent'
                                }`}
                            title={sidebarCollapsed ? item.label : undefined}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
