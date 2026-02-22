import type { ElementType } from 'react';
import {
    MapIcon, Activity, Search, Settings, Droplets, LayoutDashboard,
    MapPin, Database, GitBranch, Grid3x3,
    Cloud, Radio, BarChart3, AlertTriangle, Cpu,
    ClipboardList, FileText, AlertCircle, Wrench, TrendingUp,
    Monitor, HardDrive, Bell, Briefcase, Zap,
    HeartPulse, Waves, GitMerge, Navigation, Users
} from 'lucide-react';

export interface SubMenuItem {
    key: string;
    label: string;
    icon: ElementType;
    path: string;
}

export interface SystemMenu {
    key: string;
    label: string;
    icon: ElementType;
    basePath: string;
    children: SubMenuItem[];
}

export const systemMenus: SystemMenu[] = [
    {
        key: 'assets',
        label: '排水设施资产管理',
        icon: MapIcon, // lucide-react 中的 Map 导出是 MapIcon (或 Map，这里更推荐 MapIcon 防重名)
        basePath: '/assets',
        children: [
            { key: 'map', label: '设施一张图', icon: MapPin, path: '/assets/map' },
            { key: 'ledger', label: '设施台账', icon: Database, path: '/assets/ledger' },
            { key: 'data-quality', label: '数据资源管理', icon: GitBranch, path: '/assets/data-quality' },
            { key: 'analysis', label: '网络/空间分析', icon: Search, path: '/assets/analysis' },
            { key: 'district', label: '排水分区管理', icon: Grid3x3, path: '/assets/district' },
        ]
    },
    {
        key: 'monitoring',
        label: '综合监测',
        icon: Activity,
        basePath: '/monitoring',
        children: [
            { key: 'weather', label: '气象信息', icon: Cloud, path: '/monitoring/weather' },
            { key: 'realtime', label: '实时监测', icon: Radio, path: '/monitoring/realtime' },
            { key: 'analysis', label: '数据分析', icon: BarChart3, path: '/monitoring/analysis' },
            { key: 'alarm', label: '智能预警', icon: AlertTriangle, path: '/monitoring/alarm' },
            { key: 'devices', label: '监测设备管理', icon: Cpu, path: '/monitoring/devices' },
        ]
    },
    {
        key: 'patrol',
        label: '巡查养护',
        icon: Search,
        basePath: '/patrol',
        children: [
            { key: 'plan', label: '巡查计划', icon: ClipboardList, path: '/patrol/plan' },
            { key: 'work-order', label: '巡查工单', icon: FileText, path: '/patrol/work-order' },
            { key: 'issues', label: '问题上报', icon: AlertCircle, path: '/patrol/issues' },
            { key: 'maintenance', label: '养护管理', icon: Wrench, path: '/patrol/maintenance' },
            { key: 'statistics', label: '统计分析', icon: TrendingUp, path: '/patrol/statistics' },
        ]
    },
    {
        key: 'pump-station',
        label: '泵站运维',
        icon: Settings,
        basePath: '/pump-station',
        children: [
            { key: 'monitor', label: '远程监控', icon: Monitor, path: '/pump-station/monitor' },
            { key: 'equipment', label: '设备管理', icon: HardDrive, path: '/pump-station/equipment' },
            { key: 'alarm', label: '报警管理', icon: Bell, path: '/pump-station/alarm' },
            { key: 'operation', label: '运维工单', icon: Briefcase, path: '/pump-station/operation' },
            { key: 'energy', label: '能耗管理', icon: Zap, path: '/pump-station/energy' },
        ]
    },
    {
        key: 'quality',
        label: '提质增效',
        icon: Droplets,
        basePath: '/quality',
        children: [
            { key: 'pipe-health', label: '管道健康', icon: HeartPulse, path: '/quality/pipe-health' },
            { key: 'intrusion', label: '外水入侵', icon: Waves, path: '/quality/intrusion' },
            { key: 'cross-connection', label: '雨污混接', icon: GitMerge, path: '/quality/cross-connection' },
            { key: 'dispatch', label: '污水调度', icon: Navigation, path: '/quality/dispatch' },
            { key: 'drainage-users', label: '排水户管理', icon: Users, path: '/quality/drainage-users' },
        ]
    },
    {
        key: 'dashboard',
        label: '运行驾驶舱',
        icon: LayoutDashboard,
        basePath: '/dashboard',
        children: []
    }
];
