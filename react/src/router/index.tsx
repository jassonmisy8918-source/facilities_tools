import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import DashboardView from '@/views/dashboard/DashboardView';
import MapView from '@/views/assets/MapView';
import LedgerView from '@/views/assets/LedgerView';
import DataQualityView from '@/views/assets/DataQualityView';
import AnalysisView from '@/views/assets/AnalysisView';
import DistrictView from '@/views/assets/DistrictView';
import RealtimeView from '@/views/monitoring/RealtimeView';
import AlarmView from '@/views/monitoring/AlarmView';
import DataAnalysisView from '@/views/monitoring/DataAnalysisView';
import DevicesView from '@/views/monitoring/DevicesView';
import WeatherView from '@/views/monitoring/WeatherView';
import PlanView from '@/views/patrol/PlanView';
import WorkOrderView from '@/views/patrol/WorkOrderView';
import IssuesView from '@/views/patrol/IssuesView';
import MaintenanceView from '@/views/patrol/MaintenanceView';
import StatisticsView from '@/views/patrol/StatisticsView';
import MonitorView from '@/views/pump-station/MonitorView';
import PumpAlarmView from '@/views/pump-station/AlarmView';
import EquipmentView from '@/views/pump-station/EquipmentView';
import OperationView from '@/views/pump-station/OperationView';
import EnergyView from '@/views/pump-station/EnergyView';
import PipeHealthView from '@/views/quality/PipeHealthView';
import IntrusionView from '@/views/quality/IntrusionView';
import CrossConnectionView from '@/views/quality/CrossConnectionView';
import DispatchView from '@/views/quality/DispatchView';
import DrainageUsersView from '@/views/quality/DrainageUsersView';
import QualityDistrictView from '@/views/quality/QualityDistrictView';
import LoginPage from '@/views/login/LoginPage';
import { useUserStore } from '@/stores/user';

// --- Auth Guard ---
function RequireAuth() {
    const token = useUserStore((state) => state.token);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

import MainLayout from '@/layouts/MainLayout';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/',
        element: <RequireAuth />, // 必须登录
        children: [
            {
                path: '',
                element: <MainLayout />,
                children: [
                    { path: 'dashboard', element: <DashboardView /> },
                    // 资产管理
                    {
                        path: 'assets',
                        children: [
                            { index: true, element: <Navigate to="map" replace /> },
                            { path: 'map', element: <MapView /> },
                            { path: 'ledger', element: <LedgerView /> },
                            { path: 'data-quality', element: <DataQualityView /> },
                            { path: 'analysis', element: <AnalysisView /> },
                            { path: 'district', element: <DistrictView /> },
                        ]
                    },
                    // 监控
                    {
                        path: 'monitoring',
                        children: [
                            { index: true, element: <Navigate to="weather" replace /> },
                            { path: 'weather', element: <WeatherView /> },
                            { path: 'realtime', element: <RealtimeView /> },
                            { path: 'analysis', element: <DataAnalysisView /> },
                            { path: 'alarm', element: <AlarmView /> },
                            { path: 'devices', element: <DevicesView /> },
                        ]
                    },
                    // 巡查
                    {
                        path: 'patrol',
                        children: [
                            { index: true, element: <Navigate to="plan" replace /> },
                            { path: 'plan', element: <PlanView /> },
                            { path: 'work-order', element: <WorkOrderView /> },
                            { path: 'issues', element: <IssuesView /> },
                            { path: 'maintenance', element: <MaintenanceView /> },
                            { path: 'statistics', element: <StatisticsView /> },
                        ]
                    },
                    // 泵站
                    {
                        path: 'pump-station',
                        children: [
                            { index: true, element: <Navigate to="monitor" replace /> },
                            { path: 'monitor', element: <MonitorView /> },
                            { path: 'equipment', element: <EquipmentView /> },
                            { path: 'alarm', element: <PumpAlarmView /> },
                            { path: 'operation', element: <OperationView /> },
                            { path: 'energy', element: <EnergyView /> },
                        ]
                    },
                    // 质量
                    {
                        path: 'quality',
                        children: [
                            { index: true, element: <Navigate to="pipe-health" replace /> },
                            { path: 'pipe-health', element: <PipeHealthView /> },
                            { path: 'intrusion', element: <IntrusionView /> },
                            { path: 'cross-connection', element: <CrossConnectionView /> },
                            { path: 'dispatch', element: <DispatchView /> },
                            { path: 'drainage-users', element: <DrainageUsersView /> },
                            { path: 'district', element: <QualityDistrictView /> },
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
