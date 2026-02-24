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
                component: () => import('@/views/dashboard/DashboardLayout.vue'),
                meta: { system: 'dashboard', title: '运行驾驶舱' },
                children: [
                    { path: '', name: 'Dashboard', component: () => import('@/views/dashboard/DashboardView.vue') },
                    { path: 'layers', name: 'DashboardLayers', component: () => import('@/views/dashboard/LayersView.vue'), meta: { title: '专题图层' } },
                    { path: 'intro', name: 'DashboardIntro', component: () => import('@/views/dashboard/IntroView.vue'), meta: { title: '情况介绍' } },
                    { path: 'facilities', name: 'DashboardFacilities', component: () => import('@/views/dashboard/FacilitiesView.vue'), meta: { title: '设施信息' } },
                    { path: 'weather', name: 'DashboardWeather', component: () => import('@/views/dashboard/WeatherView.vue'), meta: { title: '降雨预报' } },
                    { path: 'devices', name: 'DashboardDevices', component: () => import('@/views/dashboard/DevicesView.vue'), meta: { title: '监测设备' } },
                    { path: 'defects', name: 'DashboardDefects', component: () => import('@/views/dashboard/DefectsView.vue'), meta: { title: '缺陷信息' } },
                    { path: 'patrol', name: 'DashboardPatrol', component: () => import('@/views/dashboard/PatrolView.vue'), meta: { title: '巡查养护' } },
                    { path: 'pump-ops', name: 'DashboardPumpOps', component: () => import('@/views/dashboard/PumpOpsView.vue'), meta: { title: '泵站运维' } },
                    { path: 'efficiency', name: 'DashboardEfficiency', component: () => import('@/views/dashboard/EfficiencyView.vue'), meta: { title: '提质增效' } },
                    { path: 'alarms', name: 'DashboardAlarms', component: () => import('@/views/dashboard/AlarmsView.vue'), meta: { title: '信息报警' } },
                    { path: 'facility-map', name: 'DashboardFacilityMap', component: () => import('@/views/dashboard/FacilityMapView.vue'), meta: { title: '排水设施一张图' } },
                    { path: 'drain-user-map', name: 'DashboardDrainUserMap', component: () => import('@/views/dashboard/DrainUserMapView.vue'), meta: { title: '排水户一张图' } },
                    { path: 'device-map', name: 'DashboardDeviceMap', component: () => import('@/views/dashboard/DeviceMapView.vue'), meta: { title: '监测设备一张图' } },
                ]
            },
            // 排水设施资产管理
            {
                path: 'assets',
                redirect: '/assets/map',
                children: [
                    { path: 'map', name: 'AssetsMap', component: () => import('@/views/assets/MapView.vue'), meta: { system: 'assets', title: '设施一张图' } },
                    {
                        path: 'ledger',
                        component: () => import('@/views/assets/ledger/LedgerLayout.vue'),
                        meta: { system: 'assets', title: '设施台账' },
                        children: [
                            { path: '', name: 'AssetsLedger', component: () => import('@/views/assets/ledger/LedgerView.vue') },
                            { path: 'location-query', name: 'AssetsLocationQuery', component: () => import('@/views/assets/ledger/LocationQueryView.vue'), meta: { title: '定位查询' } },
                            { path: 'chart-stats', name: 'AssetsChartStats', component: () => import('@/views/assets/ledger/ChartStatsView.vue'), meta: { title: '图表统计' } },
                            { path: 'measure-annotate', name: 'AssetsMeasureAnnotate', component: () => import('@/views/assets/ledger/MeasureAnnotateView.vue'), meta: { title: '测量标注' } },
                        ]
                    },
                    {
                        path: 'data-quality',
                        component: () => import('@/views/assets/data-quality/DataQualityLayout.vue'),
                        meta: { system: 'assets', title: '数据资源管理' },
                        children: [
                            { path: '', name: 'AssetsDataQuality', component: () => import('@/views/assets/data-quality/DataQualityView.vue') },
                            { path: 'repair', name: 'AssetsDataRepair', component: () => import('@/views/assets/data-quality/DataRepairView.vue'), meta: { title: '数据修复' } },
                            { path: 'edge', name: 'AssetsDataEdge', component: () => import('@/views/assets/data-quality/DataEdgeView.vue'), meta: { title: '数据接边处理' } },
                            { path: 'census', name: 'AssetsCensusData', component: () => import('@/views/assets/data-quality/CensusDataView.vue'), meta: { title: '普查成果管理' } },
                            { path: 'online-edit', name: 'AssetsOnlineEdit', component: () => import('@/views/assets/data-quality/OnlineEditView.vue'), meta: { title: '在线编辑' } },
                        ]
                    },
                    {
                        path: 'analysis',
                        component: () => import('@/views/assets/analysis/AnalysisLayout.vue'),
                        meta: { system: 'assets', title: '网络/空间分析' },
                        children: [
                            { path: '', name: 'AssetsAnalysis', component: () => import('@/views/assets/analysis/AnalysisView.vue') },
                            { path: 'upstream', name: 'AssetsUpstream', component: () => import('@/views/assets/analysis/UpstreamView.vue'), meta: { title: '上下游分析' } },
                            { path: 'slope', name: 'AssetsSlope', component: () => import('@/views/assets/analysis/SlopeAnalysisView.vue'), meta: { title: '坡度分析' } },
                            { path: 'profile', name: 'AssetsProfile', component: () => import('@/views/assets/analysis/ProfileAnalysisView.vue'), meta: { title: '剖面分析' } },
                            { path: 'buffer', name: 'AssetsBuffer', component: () => import('@/views/assets/analysis/BufferAnalysisView.vue'), meta: { title: '缓冲分析' } },
                            { path: 'collision', name: 'AssetsCollision', component: () => import('@/views/assets/analysis/CollisionAnalysisView.vue'), meta: { title: '管线碰撞分析' } },
                            { path: 'flood', name: 'AssetsFlood', component: () => import('@/views/assets/analysis/FloodAnalysisView.vue'), meta: { title: '淹没分析' } },
                            { path: 'loop', name: 'AssetsLoop', component: () => import('@/views/assets/analysis/LoopDiagnosisView.vue'), meta: { title: '环状管网诊断' } },
                            { path: 'service-area', name: 'AssetsServiceArea', component: () => import('@/views/assets/analysis/ServiceAreaView.vue'), meta: { title: '管段服务面积' } },
                        ]
                    },
                    {
                        path: 'district',
                        component: () => import('@/views/assets/district/DistrictLayout.vue'),
                        meta: { system: 'assets', title: '排水分区管理' },
                        children: [
                            { path: '', name: 'AssetsDistrict', component: () => import('@/views/assets/district/DistrictView.vue') },
                            { path: 'analysis', name: 'AssetsDistrictAnalysis', component: () => import('@/views/assets/district/DistrictAnalysisView.vue'), meta: { title: '分区数据分析' } },
                        ]
                    },
                ]
            },
            // 综合监测
            {
                path: 'monitoring',
                redirect: '/monitoring/weather',
                children: [
                    {
                        path: 'weather',
                        component: () => import('@/views/monitoring/weather/WeatherLayout.vue'),
                        meta: { system: 'monitoring', title: '气象信息' },
                        children: [
                            { path: '', name: 'MonitoringWeather', component: () => import('@/views/monitoring/weather/RealtimeWeatherView.vue') },
                            { path: 'precipitation', name: 'MonitoringPrecipitation', component: () => import('@/views/monitoring/weather/PrecipitationForecastView.vue'), meta: { title: '24小时降水预报' } },
                            { path: 'radar', name: 'MonitoringRadar', component: () => import('@/views/monitoring/weather/RadarView.vue'), meta: { title: '气象雷达信息' } },
                            { path: 'satellite', name: 'MonitoringSatellite', component: () => import('@/views/monitoring/weather/SatelliteView.vue'), meta: { title: '卫星云图信息' } },
                            { path: 'typhoon', name: 'MonitoringTyphoon', component: () => import('@/views/monitoring/weather/TyphoonView.vue'), meta: { title: '台风信息' } },
                        ]
                    },
                    {
                        path: 'realtime',
                        component: () => import('@/views/monitoring/realtime/RealtimeLayout.vue'),
                        meta: { system: 'monitoring', title: '实时监测' },
                        children: [
                            {
                                path: '',
                                component: () => import('@/views/monitoring/realtime/rainfall/RainfallLayout.vue'),
                                children: [
                                    { path: '', name: 'MonitoringRealtime', component: () => import('@/views/monitoring/realtime/rainfall/RealtimeRainfallView.vue') },
                                    { path: 'rainfall/intensity', name: 'MonitoringRainfallIntensity', component: () => import('@/views/monitoring/realtime/rainfall/RainfallIntensityView.vue'), meta: { title: '降雨强度等级分析' } },
                                    { path: 'rainfall/distribution', name: 'MonitoringRainfallDistribution', component: () => import('@/views/monitoring/realtime/rainfall/RainfallDistributionView.vue'), meta: { title: '降雨强度可视化分布' } },
                                    { path: 'rainfall/history', name: 'MonitoringRainfallHistory', component: () => import('@/views/monitoring/realtime/rainfall/RainfallHistoryView.vue'), meta: { title: '降雨历史数据查询' } },
                                    { path: 'rainfall/export', name: 'MonitoringRainfallExport', component: () => import('@/views/monitoring/realtime/rainfall/RainfallExportView.vue'), meta: { title: '降雨历史数据导出' } },
                                ]
                            },
                            {
                                path: 'video',
                                component: () => import('@/views/monitoring/realtime/video/VideoLayout.vue'),
                                children: [
                                    { path: '', name: 'MonitoringVideo', component: () => import('@/views/monitoring/realtime/video/VideoManageView.vue') },
                                    { path: 'live', name: 'MonitoringVideoLive', component: () => import('@/views/monitoring/realtime/video/VideoLiveView.vue'), meta: { title: '视频监控查看' } },
                                    { path: 'playback', name: 'MonitoringVideoPlayback', component: () => import('@/views/monitoring/realtime/video/VideoPlaybackView.vue'), meta: { title: '录像回放' } },
                                    { path: 'storage', name: 'MonitoringVideoStorage', component: () => import('@/views/monitoring/realtime/video/VideoStorageView.vue'), meta: { title: '视频存储管理' } },
                                ]
                            },
                            {
                                path: 'points',
                                component: () => import('@/views/monitoring/realtime/points/MonitorPointLayout.vue'),
                                children: [
                                    { path: '', name: 'MonitoringPoints', component: () => import('@/views/monitoring/realtime/points/MonitorPointMapView.vue') },
                                    { path: 'manage', name: 'MonitoringPointsManage', component: () => import('@/views/monitoring/realtime/points/MonitorPointManageView.vue'), meta: { title: '点位信息管理' } },
                                ]
                            },
                            {
                                path: 'instruments',
                                component: () => import('@/views/monitoring/realtime/instruments/InstrumentLayout.vue'),
                                children: [
                                    { path: '', name: 'MonitoringInstruments', component: () => import('@/views/monitoring/realtime/instruments/RainGaugeView.vue') },
                                    { path: 'flowmeter', name: 'MonitoringFlowmeter', component: () => import('@/views/monitoring/realtime/instruments/FlowmeterView.vue'), meta: { title: '流量计' } },
                                    { path: 'level-gauge', name: 'MonitoringLevelGauge', component: () => import('@/views/monitoring/realtime/instruments/LevelGaugeView.vue'), meta: { title: '液位计' } },
                                    { path: 'water-quality', name: 'MonitoringWaterQuality', component: () => import('@/views/monitoring/realtime/instruments/WaterQualityMeterView.vue'), meta: { title: '水质计' } },
                                ]
                            },
                        ]
                    },
                    {
                        path: 'analysis',
                        component: () => import('@/views/monitoring/analysis/DataAnalysisLayout.vue'),
                        meta: { system: 'monitoring', title: '数据分析' },
                        children: [
                            {
                                path: '',
                                component: () => import('@/views/monitoring/analysis/query/QueryLayout.vue'),
                                children: [
                                    { path: '', name: 'MonitoringAnalysis', component: () => import('@/views/monitoring/analysis/query/RainfallQueryView.vue') },
                                    { path: 'query/flow', name: 'MonitoringFlowQuery', component: () => import('@/views/monitoring/analysis/query/FlowQueryView.vue'), meta: { title: '流量查询' } },
                                    { path: 'query/level', name: 'MonitoringLevelQuery', component: () => import('@/views/monitoring/analysis/query/LevelQueryView.vue'), meta: { title: '水位查询' } },
                                    { path: 'query/quality', name: 'MonitoringQualityQuery', component: () => import('@/views/monitoring/analysis/query/QualityQueryView.vue'), meta: { title: '水质查询' } },
                                    { path: 'query/templates', name: 'MonitoringQueryTemplates', component: () => import('@/views/monitoring/analysis/query/QueryTemplateView.vue'), meta: { title: '查询模板' } },
                                ]
                            },
                            { path: 'compare', name: 'MonitoringCompare', component: () => import('@/views/monitoring/analysis/DataCompareView.vue'), meta: { title: '数据对比' } },
                            { path: 'deep-analysis', name: 'MonitoringDeepAnalysis', component: () => import('@/views/monitoring/analysis/DeepAnalysisView.vue'), meta: { title: '数据分析' } },
                            {
                                path: 'reports',
                                component: () => import('@/views/monitoring/analysis/reports/ReportLayout.vue'),
                                children: [
                                    { path: '', name: 'MonitoringReportSewage', component: () => import('@/views/monitoring/analysis/reports/SewageTreatmentView.vue') },
                                    { path: 'generate', name: 'MonitoringReportGenerate', component: () => import('@/views/monitoring/analysis/reports/ReportGenerateView.vue'), meta: { title: '报表生成' } },
                                    { path: 'overlay', name: 'MonitoringOverlay', component: () => import('@/views/monitoring/analysis/reports/OverlayAnalysisView.vue'), meta: { title: '信息叠加分析' } },
                                    { path: 'history', name: 'MonitoringHistoryAnalysis', component: () => import('@/views/monitoring/analysis/reports/HistoryAnalysisView.vue'), meta: { title: '历史数据分析' } },
                                    { path: 'thematic-map', name: 'MonitoringThematicMap', component: () => import('@/views/monitoring/analysis/reports/ThematicMapView.vue'), meta: { title: '专题图' } },
                                ]
                            },
                        ]
                    },
                    {
                        path: 'alarm',
                        component: () => import('@/views/monitoring/alarm/AlarmLayout.vue'),
                        meta: { system: 'monitoring', title: '智能预警' },
                        children: [
                            { path: '', name: 'MonitoringAlarm', component: () => import('@/views/monitoring/alarm/RealtimeAlarmView.vue') },
                            { path: 'assessment', name: 'MonitoringAlarmAssessment', component: () => import('@/views/monitoring/alarm/AlarmAssessmentView.vue'), meta: { title: '报警研判' } },
                            { path: 'history', name: 'MonitoringAlarmHistory', component: () => import('@/views/monitoring/alarm/AlarmHistoryView.vue'), meta: { title: '历史报警' } },
                            { path: 'handling', name: 'MonitoringAlarmHandling', component: () => import('@/views/monitoring/alarm/AlarmHandlingView.vue'), meta: { title: '报警处置' } },
                            { path: 'point-mgmt', name: 'MonitoringPointMgmt', component: () => import('@/views/monitoring/alarm/MonitorPointMgmtView.vue'), meta: { title: '监测点管理' } },
                            { path: 'device-mgmt', name: 'MonitoringDeviceMgmt', component: () => import('@/views/monitoring/alarm/DeviceMgmtView.vue'), meta: { title: '监测设备管理' } },
                            { path: 'factor-mgmt', name: 'MonitoringFactorMgmt', component: () => import('@/views/monitoring/alarm/FactorMgmtView.vue'), meta: { title: '监测因子管理' } },
                            { path: 'metric-mgmt', name: 'MonitoringMetricMgmt', component: () => import('@/views/monitoring/alarm/MetricMgmtView.vue'), meta: { title: '监测指标管理' } },
                        ]
                    },
                    { path: 'devices', name: 'MonitoringDevices', component: () => import('@/views/monitoring/DevicesView.vue'), meta: { system: 'monitoring', title: '监测设备管理' } },
                ]
            },
            // 巡查养护
            {
                path: 'patrol',
                redirect: '/patrol/plan',
                children: [
                    {
                        path: 'plan',
                        component: () => import('@/views/patrol/plan/PlanLayout.vue'),
                        meta: { system: 'patrol', title: '巡查计划' },
                        children: [
                            { path: '', name: 'PatrolPlan', component: () => import('@/views/patrol/plan/PlanInfoView.vue') },
                            { path: 'frequency', name: 'PatrolPlanFrequency', component: () => import('@/views/patrol/plan/PlanFrequencyView.vue'), meta: { title: '频率与优先级' } },
                            { path: 'route', name: 'PatrolPlanRoute', component: () => import('@/views/patrol/plan/PlanRouteView.vue'), meta: { title: '路线与检查点' } },
                            { path: 'personnel', name: 'PatrolPlanPersonnel', component: () => import('@/views/patrol/plan/PlanPersonnelView.vue'), meta: { title: '人员排班' } },
                            { path: 'content', name: 'PatrolPlanContent', component: () => import('@/views/patrol/plan/PlanContentView.vue'), meta: { title: '巡查内容' } },
                        ]
                    },
                    {
                        path: 'work-order',
                        component: () => import('@/views/patrol/work-order/WorkOrderLayout.vue'),
                        meta: { system: 'patrol', title: '巡查工单' },
                        children: [
                            { path: '', name: 'PatrolWorkOrder', component: () => import('@/views/patrol/work-order/WorkOrderInfoView.vue') },
                            { path: 'track', name: 'PatrolWorkOrderTrack', component: () => import('@/views/patrol/work-order/WorkOrderTrackView.vue'), meta: { title: '跟踪监控' } },
                            { path: 'stats', name: 'PatrolWorkOrderStats', component: () => import('@/views/patrol/work-order/WorkOrderStatsView.vue'), meta: { title: '模板与统计' } },
                        ]
                    },
                    { path: 'issues', name: 'PatrolIssues', component: () => import('@/views/patrol/issues/IssuesView.vue'), meta: { system: 'patrol', title: '问题上报' } },
                    { path: 'patrol-map', name: 'PatrolMap', component: () => import('@/views/patrol/PatrolMapView.vue'), meta: { system: 'patrol', title: '巡查工作地图' } },
                    {
                        path: 'emergency',
                        component: () => import('@/views/patrol/emergency/EmergencyLayout.vue'),
                        meta: { system: 'patrol', title: '应急事件' },
                        children: [
                            { path: '', name: 'PatrolEmergency', component: () => import('@/views/patrol/emergency/EmergencyPlanView.vue') },
                            { path: 'dispatch', name: 'PatrolEmergencyDispatch', component: () => import('@/views/patrol/emergency/EmergencyDispatchView.vue'), meta: { title: '调度与统计' } },
                            { path: 'records', name: 'PatrolEmergencyRecords', component: () => import('@/views/patrol/emergency/EmergencyRecordView.vue'), meta: { title: '查询与报告' } },
                        ]
                    },
                    {
                        path: 'maintenance',
                        component: () => import('@/views/patrol/maintenance/MaintenanceLayout.vue'),
                        meta: { system: 'patrol', title: '养护管理' },
                        children: [
                            { path: '', name: 'PatrolMaintenance', component: () => import('@/views/patrol/maintenance/MaintPlanView.vue') },
                            { path: 'order', name: 'PatrolMaintOrder', component: () => import('@/views/patrol/maintenance/MaintOrderView.vue'), meta: { title: '养护工单' } },
                            { path: 'map', name: 'PatrolMaintMap', component: () => import('@/views/patrol/maintenance/MaintMapView.vue'), meta: { title: '养护地图' } },
                            { path: 'instrument', name: 'PatrolInstrument', component: () => import('@/views/patrol/maintenance/InstrumentView.vue'), meta: { title: '仪表维护' } },
                            { path: 'equipment', name: 'PatrolEquipment', component: () => import('@/views/patrol/maintenance/EquipmentView.vue'), meta: { title: '设备管理' } },
                        ]
                    },
                    {
                        path: 'statistics',
                        component: () => import('@/views/patrol/statistics/StatisticsLayout.vue'),
                        meta: { system: 'patrol', title: '统计分析' },
                        children: [
                            { path: '', name: 'PatrolStatistics', component: () => import('@/views/patrol/statistics/PatrolStatsView.vue') },
                            { path: 'maint', name: 'PatrolMaintStats', component: () => import('@/views/patrol/statistics/MaintStatsView.vue'), meta: { title: '养护工作量统计' } },
                            { path: 'performance', name: 'PatrolPerformance', component: () => import('@/views/patrol/statistics/PerformanceView.vue'), meta: { title: '绩效评估' } },
                        ]
                    },
                ]
            },
            // 泵站运维
            {
                path: 'pump-station',
                redirect: '/pump-station/monitor',
                children: [
                    {
                        path: 'monitor',
                        component: () => import('@/views/pump-station/monitor/MonitorLayout.vue'),
                        meta: { system: 'pump-station', title: '远程监控' },
                        children: [
                            { path: '', name: 'PumpMonitor', component: () => import('@/views/pump-station/monitor/RealtimeDataView.vue') },
                            { path: 'video', name: 'PumpMonitorVideo', component: () => import('@/views/pump-station/monitor/VideoMonitorView.vue'), meta: { title: '视频监控' } },
                        ]
                    },
                    {
                        path: 'equipment',
                        component: () => import('@/views/pump-station/equipment/EquipmentLayout.vue'),
                        meta: { system: 'pump-station', title: '设备管理' },
                        children: [
                            { path: '', name: 'PumpEquipment', component: () => import('@/views/pump-station/equipment/DeviceLedgerView.vue') },
                            { path: 'inspection', name: 'PumpInspection', component: () => import('@/views/pump-station/equipment/InspectionView.vue'), meta: { title: '设备巡检' } },
                            { path: 'maintain', name: 'PumpMaintain', component: () => import('@/views/pump-station/equipment/MaintenanceView.vue'), meta: { title: '设备保养' } },
                            { path: 'comprehensive', name: 'PumpComprehensive', component: () => import('@/views/pump-station/equipment/ComprehensiveView.vue'), meta: { title: '综合管理' } },
                        ]
                    },
                    {
                        path: 'alarm',
                        component: () => import('@/views/pump-station/alarm/AlarmLayout.vue'),
                        meta: { system: 'pump-station', title: '报警管理' },
                        children: [
                            { path: '', name: 'PumpAlarm', component: () => import('@/views/pump-station/alarm/AlarmRulesView.vue') },
                            { path: 'events', name: 'PumpAlarmEvents', component: () => import('@/views/pump-station/alarm/AlarmEventsView.vue'), meta: { title: '报警事件' } },
                            { path: 'notify', name: 'PumpAlarmNotify', component: () => import('@/views/pump-station/alarm/AlarmNotifyView.vue'), meta: { title: '通知管理' } },
                            { path: 'dispose', name: 'PumpAlarmDispose', component: () => import('@/views/pump-station/alarm/AlarmDisposeView.vue'), meta: { title: '处置闭环' } },
                        ]
                    },
                    {
                        path: 'operation',
                        component: () => import('@/views/pump-station/operation/OperationLayout.vue'),
                        meta: { system: 'pump-station', title: '运维管理' },
                        children: [
                            { path: '', name: 'PumpOperation', component: () => import('@/views/pump-station/operation/PredictView.vue') },
                            { path: 'repair', name: 'PumpRepair', component: () => import('@/views/pump-station/operation/RepairView.vue'), meta: { title: '报修管理' } },
                            { path: 'review', name: 'PumpReview', component: () => import('@/views/pump-station/operation/ReviewDispatchView.vue'), meta: { title: '审核派发' } },
                            { path: 'process', name: 'PumpProcess', component: () => import('@/views/pump-station/operation/ProcessAcceptView.vue'), meta: { title: '工单处理' } },
                            { path: 'records', name: 'PumpRecords', component: () => import('@/views/pump-station/operation/RepairRecordView.vue'), meta: { title: '维修记录' } },
                        ]
                    },
                    {
                        path: 'energy',
                        component: () => import('@/views/pump-station/energy/EnergyLayout.vue'),
                        meta: { system: 'pump-station', title: '能耗管理' },
                        children: [
                            { path: '', name: 'PumpEnergy', component: () => import('@/views/pump-station/energy/EnergyMonitorView.vue') },
                            { path: 'history', name: 'PumpEnergyHistory', component: () => import('@/views/pump-station/energy/EnergyHistoryView.vue'), meta: { title: '历史分析' } },
                            { path: 'carbon', name: 'PumpEnergyCarbon', component: () => import('@/views/pump-station/energy/EnergyCarbonView.vue'), meta: { title: '节能优化' } },
                        ]
                    },
                    {
                        path: 'reports',
                        component: () => import('@/views/pump-station/reports/ReportLayout.vue'),
                        meta: { system: 'pump-station', title: '报表与决策' },
                        children: [
                            { path: '', name: 'PumpReports', component: () => import('@/views/pump-station/reports/RunReportView.vue') },
                            { path: 'analysis', name: 'PumpDataAnalysis', component: () => import('@/views/pump-station/reports/DataAnalysisView.vue'), meta: { title: '数据分析' } },
                            { path: 'quality', name: 'PumpQuality', component: () => import('@/views/pump-station/reports/QualityAssessView.vue'), meta: { title: '质量评估' } },
                            { path: 'decision', name: 'PumpDecision', component: () => import('@/views/pump-station/reports/DecisionView.vue'), meta: { title: '决策支持' } },
                        ]
                    },
                ]
            },
            // 提质增效
            {
                path: 'quality',
                redirect: '/quality/pipe-health',
                children: [
                    {
                        path: 'pipe-health',
                        component: () => import('@/views/quality/pipe-health/PipeHealthLayout.vue'),
                        meta: { system: 'quality', title: '管道健康' },
                        children: [
                            { path: '', name: 'QualityPipeHealth', component: () => import('@/views/quality/pipe-health/DefectView.vue') },
                            { path: 'health', name: 'QualityHealthAssess', component: () => import('@/views/quality/pipe-health/HealthAssessView.vue'), meta: { title: '健康度评价' } },
                            { path: 'repair', name: 'QualityPipeRepair', component: () => import('@/views/quality/pipe-health/RepairView.vue'), meta: { title: '管道修复' } },
                            { path: 'effect', name: 'QualityEffectTrack', component: () => import('@/views/quality/pipe-health/EffectTrackView.vue'), meta: { title: '效果跟踪' } },
                        ]
                    },
                    {
                        path: 'intrusion',
                        component: () => import('@/views/quality/intrusion/IntrusionLayout.vue'),
                        meta: { system: 'quality', title: '外水入侵' },
                        children: [
                            { path: '', name: 'QualityIntrusion', component: () => import('@/views/quality/intrusion/DetectView.vue') },
                            { path: 'source', name: 'QualityIntrusionSource', component: () => import('@/views/quality/intrusion/SourceView.vue'), meta: { title: '来源分析' } },
                            { path: 'action', name: 'QualityIntrusionAction', component: () => import('@/views/quality/intrusion/ActionView.vue'), meta: { title: '应对措施' } },
                        ]
                    },
                    {
                        path: 'cross-connection',
                        component: () => import('@/views/quality/cross-connection/CrossConnectionLayout.vue'),
                        meta: { system: 'quality', title: '雨污混接' },
                        children: [
                            { path: '', name: 'QualityCrossConnection', component: () => import('@/views/quality/cross-connection/IdentifyView.vue') },
                            { path: 'impact', name: 'QualityCrossImpact', component: () => import('@/views/quality/cross-connection/ImpactView.vue'), meta: { title: '影响评估' } },
                            { path: 'optimize', name: 'QualityCrossOptimize', component: () => import('@/views/quality/cross-connection/OptimizeView.vue'), meta: { title: '优化建议' } },
                        ]
                    },
                    {
                        path: 'dispatch',
                        component: () => import('@/views/quality/dispatch/DispatchLayout.vue'),
                        meta: { system: 'quality', title: '污水调度' },
                        children: [
                            { path: '', name: 'QualityDispatch', component: () => import('@/views/quality/dispatch/StrategyView.vue') },
                            { path: 'realtime', name: 'QualityDispatchRealtime', component: () => import('@/views/quality/dispatch/RealtimeView.vue'), meta: { title: '实时调度' } },
                            { path: 'analysis', name: 'QualityDispatchAnalysis', component: () => import('@/views/quality/dispatch/AnalysisView.vue'), meta: { title: '调度分析' } },
                        ]
                    },
                    {
                        path: 'drainage-users',
                        component: () => import('@/views/quality/drainage-users/DrainageUsersLayout.vue'),
                        meta: { system: 'quality', title: '排水户管理' },
                        children: [
                            { path: '', name: 'QualityDrainageUsers', component: () => import('@/views/quality/drainage-users/UserInfoView.vue') },
                            { path: 'connect', name: 'QualityDrainageConnect', component: () => import('@/views/quality/drainage-users/ConnectView.vue'), meta: { title: '接驳联动' } },
                            { path: 'monitor', name: 'QualityDrainageMonitor', component: () => import('@/views/quality/drainage-users/MonitorView.vue'), meta: { title: '水质水量' } },
                        ]
                    },
                    {
                        path: 'pay-for-performance',
                        component: () => import('@/views/quality/pay-for-performance/PayLayout.vue'),
                        meta: { system: 'quality', title: '按效付费' },
                        children: [
                            { path: '', name: 'QualityPayPerformance', component: () => import('@/views/quality/pay-for-performance/KpiView.vue') },
                            { path: 'assess', name: 'QualityPayAssess', component: () => import('@/views/quality/pay-for-performance/AssessView.vue'), meta: { title: '绩效评估' } },
                            { path: 'report', name: 'QualityPayReport', component: () => import('@/views/quality/pay-for-performance/ReportView.vue'), meta: { title: '付费报告' } },
                        ]
                    },
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
