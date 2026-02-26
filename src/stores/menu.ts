import type { Component } from 'vue'
import {
    Map, Activity, Search, Settings, Droplets, LayoutDashboard,
    MapPin, Database, GitBranch, Grid3x3,
    Cloud, Radio, BarChart3, AlertTriangle, Cpu,
    ClipboardList, FileText, AlertCircle, Wrench, TrendingUp,
    Monitor, HardDrive, Bell, Briefcase, Zap,
    HeartPulse, Waves, GitMerge, Navigation, Users, Target
} from 'lucide-vue-next'

export interface SubMenuItem {
    key: string
    label: string
    icon: Component
    path: string
}

export interface SystemMenu {
    key: string
    label: string
    icon: Component
    basePath: string
    children: SubMenuItem[]
    externalUrl?: string
}

export const systemMenus: SystemMenu[] = [
    {
        key: 'assets',
        label: '排水设施资产管理',
        icon: Map,
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
            { key: 'reports', label: '报表与决策', icon: FileText, path: '/pump-station/reports' },
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
            { key: 'pay-for-performance', label: '按效付费', icon: Target, path: '/quality/pay-for-performance' },
        ]
    },
    {
        key: 'dashboard',
        label: '运行驾驶舱',
        icon: LayoutDashboard,
        basePath: '/dashboard',
        children: [
            { key: 'layers', label: '专题图层', icon: Map, path: '/dashboard/layers' },
            { key: 'intro', label: '情况介绍', icon: ClipboardList, path: '/dashboard/intro' },
            { key: 'facilities', label: '设施信息', icon: Database, path: '/dashboard/facilities' },
            { key: 'weather', label: '降雨预报', icon: Cloud, path: '/dashboard/weather' },
            { key: 'devices', label: '监测设备', icon: Radio, path: '/dashboard/devices' },
            { key: 'defects', label: '缺陷信息', icon: AlertTriangle, path: '/dashboard/defects' },
            { key: 'patrol', label: '巡查养护', icon: Wrench, path: '/dashboard/patrol' },
            { key: 'pump-ops', label: '泵站运维', icon: Settings, path: '/dashboard/pump-ops' },
            { key: 'efficiency', label: '提质增效', icon: TrendingUp, path: '/dashboard/efficiency' },
            { key: 'alarms', label: '信息报警', icon: Bell, path: '/dashboard/alarms' },
        ]
    },
    {
        key: 'data-center',
        label: '数据中台',
        icon: Database,
        basePath: '/data-center',
        externalUrl: 'http://10.81.32.88/#/login',
        children: []
    }
]
