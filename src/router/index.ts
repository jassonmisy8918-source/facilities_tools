import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/LoginPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: () => import('@/layouts/MainLayout.vue'),
        redirect: '/dashboard',
        meta: { requiresAuth: true },
        children: [
            // 运行驾驶舱
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/DashboardView.vue'),
                meta: { system: 'dashboard', title: '运行驾驶舱' }
            },
            // 排水设施资产管理
            {
                path: 'assets',
                redirect: '/assets/map',
                children: [
                    { path: 'map', name: 'AssetsMap', component: () => import('@/views/assets/MapView.vue'), meta: { system: 'assets', title: '设施一张图' } },
                    { path: 'ledger', name: 'AssetsLedger', component: () => import('@/views/assets/LedgerView.vue'), meta: { system: 'assets', title: '设施台账' } },
                    { path: 'data-quality', name: 'AssetsDataQuality', component: () => import('@/views/assets/DataQualityView.vue'), meta: { system: 'assets', title: '数据资源管理' } },
                    { path: 'analysis', name: 'AssetsAnalysis', component: () => import('@/views/assets/AnalysisView.vue'), meta: { system: 'assets', title: '网络/空间分析' } },
                    { path: 'district', name: 'AssetsDistrict', component: () => import('@/views/assets/DistrictView.vue'), meta: { system: 'assets', title: '排水分区管理' } },
                ]
            },
            // 综合监测
            {
                path: 'monitoring',
                redirect: '/monitoring/weather',
                children: [
                    { path: 'weather', name: 'MonitoringWeather', component: () => import('@/views/monitoring/WeatherView.vue'), meta: { system: 'monitoring', title: '气象信息' } },
                    { path: 'realtime', name: 'MonitoringRealtime', component: () => import('@/views/monitoring/RealtimeView.vue'), meta: { system: 'monitoring', title: '实时监测' } },
                    { path: 'analysis', name: 'MonitoringAnalysis', component: () => import('@/views/monitoring/DataAnalysisView.vue'), meta: { system: 'monitoring', title: '数据分析' } },
                    { path: 'alarm', name: 'MonitoringAlarm', component: () => import('@/views/monitoring/AlarmView.vue'), meta: { system: 'monitoring', title: '智能预警' } },
                    { path: 'devices', name: 'MonitoringDevices', component: () => import('@/views/monitoring/DevicesView.vue'), meta: { system: 'monitoring', title: '监测设备管理' } },
                ]
            },
            // 巡查养护
            {
                path: 'patrol',
                redirect: '/patrol/plan',
                children: [
                    { path: 'plan', name: 'PatrolPlan', component: () => import('@/views/patrol/PlanView.vue'), meta: { system: 'patrol', title: '巡查计划' } },
                    { path: 'work-order', name: 'PatrolWorkOrder', component: () => import('@/views/patrol/WorkOrderView.vue'), meta: { system: 'patrol', title: '巡查工单' } },
                    { path: 'issues', name: 'PatrolIssues', component: () => import('@/views/patrol/IssuesView.vue'), meta: { system: 'patrol', title: '问题上报' } },
                    { path: 'maintenance', name: 'PatrolMaintenance', component: () => import('@/views/patrol/MaintenanceView.vue'), meta: { system: 'patrol', title: '养护管理' } },
                    { path: 'statistics', name: 'PatrolStatistics', component: () => import('@/views/patrol/StatisticsView.vue'), meta: { system: 'patrol', title: '统计分析' } },
                ]
            },
            // 泵站运维
            {
                path: 'pump-station',
                redirect: '/pump-station/monitor',
                children: [
                    { path: 'monitor', name: 'PumpMonitor', component: () => import('@/views/pump-station/MonitorView.vue'), meta: { system: 'pump-station', title: '远程监控' } },
                    { path: 'equipment', name: 'PumpEquipment', component: () => import('@/views/pump-station/EquipmentView.vue'), meta: { system: 'pump-station', title: '设备管理' } },
                    { path: 'alarm', name: 'PumpAlarm', component: () => import('@/views/pump-station/AlarmView.vue'), meta: { system: 'pump-station', title: '报警管理' } },
                    { path: 'operation', name: 'PumpOperation', component: () => import('@/views/pump-station/OperationView.vue'), meta: { system: 'pump-station', title: '运维工单' } },
                    { path: 'energy', name: 'PumpEnergy', component: () => import('@/views/pump-station/EnergyView.vue'), meta: { system: 'pump-station', title: '能耗管理' } },
                ]
            },
            // 提质增效
            {
                path: 'quality',
                redirect: '/quality/pipe-health',
                children: [
                    { path: 'pipe-health', name: 'QualityPipeHealth', component: () => import('@/views/quality/PipeHealthView.vue'), meta: { system: 'quality', title: '管道健康' } },
                    { path: 'intrusion', name: 'QualityIntrusion', component: () => import('@/views/quality/IntrusionView.vue'), meta: { system: 'quality', title: '外水入侵' } },
                    { path: 'cross-connection', name: 'QualityCrossConnection', component: () => import('@/views/quality/CrossConnectionView.vue'), meta: { system: 'quality', title: '雨污混接' } },
                    { path: 'dispatch', name: 'QualityDispatch', component: () => import('@/views/quality/DispatchView.vue'), meta: { system: 'quality', title: '污水调度' } },
                    { path: 'drainage-users', name: 'QualityDrainageUsers', component: () => import('@/views/quality/DrainageUsersView.vue'), meta: { system: 'quality', title: '排水户管理' } },
                ]
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth !== false && !token) {
        next('/login')
    } else if (to.path === '/login' && token) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
