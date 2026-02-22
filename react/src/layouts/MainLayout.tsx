import { Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/app';
import { systemMenus } from '@/stores/menu';
import AppTopNav from '@/components/layout/AppTopNav';
import SubSidebar from '@/components/layout/SubSidebar';

export default function MainLayout() {
    const location = useLocation();
    const sidebarCollapsed = useAppStore((state) => state.sidebarCollapsed);

    const currentSystem = location.pathname.split('/')[1] || 'dashboard';
    const currentMenu = systemMenus.find((m) => m.key === currentSystem);
    const hasSubMenu = currentMenu && currentMenu.children.length > 0;
    const isDashboard = currentSystem === 'dashboard';

    let contentMarginLeft = '0px';
    if (hasSubMenu && !isDashboard) {
        contentMarginLeft = sidebarCollapsed ? '64px' : '208px';
    }

    // 简单匹配当前路由的名称做面包屑（由于不需要复杂路由，这里先基于 path 取余下节点的名称）
    const breadcrumbSystem = currentMenu?.label || '';
    const currentSubMenu = currentMenu?.children.find((child) => child.path === location.pathname);
    const breadcrumbPage = currentSubMenu?.label || '';

    return (
        <div className="min-h-screen bg-base transition-colors duration-300">
            <AppTopNav />
            <SubSidebar />

            {/* 主内容区 */}
            <main className="pt-14 transition-all duration-300" style={{ marginLeft: contentMarginLeft }}>
                {/* 面包屑 (驾驶舱不显示) */}
                {!isDashboard && (
                    <div className="px-6 pt-4 pb-2">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-themed">{breadcrumbSystem}</span>
                            {breadcrumbPage && <span className="text-muted-themed">/</span>}
                            {breadcrumbPage && <span className="text-default font-medium">{breadcrumbPage}</span>}
                        </div>
                    </div>
                )}

                {/* 页面内容 */}
                <div className={isDashboard ? '' : 'p-6 pt-2'}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
