import { useState, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Radio, Droplets, Activity, Waves, FlaskConical, Download, RefreshCw, Video } from 'lucide-react';
import { toast } from '@/components/common/ToastNotify.store';

const monitorTabs = [
    { key: 'all', label: '全部', icon: Radio },
    { key: 'rainfall', label: '降雨监测', icon: Droplets },
    { key: 'flow', label: '流量监测', icon: Activity },
    { key: 'level', label: '水位监测', icon: Waves },
    { key: 'quality', label: '水质监测', icon: FlaskConical },
];

function getRainfallLevel(v: number) {
    if (v >= 16) return { text: '暴雨', cls: 'bg-danger text-white' };
    if (v >= 8) return { text: '大雨', cls: 'bg-warning text-white' };
    if (v >= 4) return { text: '中雨', cls: 'bg-info/20 text-info' };
    if (v > 0) return { text: '小雨', cls: 'bg-success/15 text-success' };
    return { text: '无雨', cls: 'bg-surface text-dim' };
}

interface MonitorPoint { id: number; name: string; type: string; value: number; unit: string; status: string; trend: number[] }

const monitorPoints: MonitorPoint[] = [
    { id: 1, name: '朝阳路DN600', type: 'flow', value: 342, unit: 'm³/h', status: 'normal', trend: [310, 320, 335, 342, 338, 345, 342] },
    { id: 2, name: '民生路DN400', type: 'level', value: 1.85, unit: 'm', status: 'warning', trend: [1.2, 1.4, 1.5, 1.7, 1.8, 1.85, 1.85] },
    { id: 3, name: '和平路雨量站', type: 'rainfall', value: 3.2, unit: 'mm/h', status: 'normal', trend: [0, 0.5, 1.2, 2.1, 2.8, 3.0, 3.2] },
    { id: 4, name: '新华街DN800', type: 'quality', value: 28, unit: 'mg/L(COD)', status: 'normal', trend: [25, 26, 27, 28, 27, 28, 28] },
    { id: 5, name: '东湖泵站进水', type: 'flow', value: 518, unit: 'm³/h', status: 'normal', trend: [490, 500, 510, 515, 520, 518, 518] },
    { id: 6, name: '建设大道DN300', type: 'level', value: 2.35, unit: 'm', status: 'danger', trend: [1.5, 1.7, 1.9, 2.1, 2.2, 2.3, 2.35] },
    { id: 7, name: '西城区进水口', type: 'quality', value: 45, unit: 'mg/L(COD)', status: 'warning', trend: [30, 33, 36, 39, 42, 44, 45] },
    { id: 8, name: '丰台路DN500', type: 'flow', value: 267, unit: 'm³/h', status: 'normal', trend: [250, 255, 260, 265, 267, 267, 267] },
    { id: 9, name: '丰台区雨量站', type: 'rainfall', value: 8.5, unit: 'mm/h', status: 'warning', trend: [2, 3, 4.5, 5.8, 7.0, 8.0, 8.5] },
    { id: 10, name: '海淀路DN600', type: 'level', value: 1.52, unit: 'm', status: 'normal', trend: [1.3, 1.35, 1.4, 1.42, 1.48, 1.5, 1.52] },
];

const cameras = [
    { id: 1, name: '朝阳路泵站', online: true },
    { id: 2, name: '东湖排放口', online: true },
    { id: 3, name: '和平路节点', online: false },
    { id: 4, name: '民生路截流井', online: true },
];

function getStatusColor(s: string) { return s === 'normal' ? 'text-success' : s === 'warning' ? 'text-warning' : 'text-danger'; }
function getStatusBg(s: string) { return s === 'normal' ? 'bg-success/15' : s === 'warning' ? 'bg-warning/15' : 'bg-danger/15'; }
function getStatusText(s: string) { return s === 'normal' ? '正常' : s === 'warning' ? '预警' : '报警'; }
function getTypeLabel(t: string) { return t === 'flow' ? '流量' : t === 'level' ? '水位' : t === 'rainfall' ? '雨量' : '水质'; }
function getTypeIcon(t: string) { return t === 'flow' ? Activity : t === 'level' ? Waves : t === 'rainfall' ? Droplets : FlaskConical; }

function getChartOption(point: MonitorPoint): echarts.EChartsOption {
    const hours = ['6h前', '5h前', '4h前', '3h前', '2h前', '1h前', '当前'];
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { top: 35, right: 15, bottom: 25, left: 50 },
        xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: { type: 'value', name: point.unit, nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [{
            type: 'line', smooth: true, data: point.trend,
            lineStyle: { color: '#3B82F6', width: 2 }, itemStyle: { color: '#3B82F6' },
            areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) }
        }]
    };
}

export default function RealtimeView() {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedPoint, setSelectedPoint] = useState(monitorPoints[0]);
    const [showVideoPanel, setShowVideoPanel] = useState(false);

    const filteredPoints = useMemo(() => {
        if (activeTab === 'all') return monitorPoints;
        return monitorPoints.filter(p => p.type === activeTab);
    }, [activeTab]);

    return (
        <div className="space-y-4 p-4">
            {/* 监测类型 Tab + 操作栏 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
                    {monitorTabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>
                                <Icon className="w-3.5 h-3.5" /> {tab.label}
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowVideoPanel(!showVideoPanel)}
                        className={`flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer ${showVideoPanel ? 'border-primary text-primary' : ''}`}>
                        <Video className="w-3.5 h-3.5" /> 视频监控
                    </button>
                    <button onClick={() => toast.info('监测数据导出中...')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> 导出数据
                    </button>
                </div>
            </div>

            {/* 视频监控面板 */}
            {showVideoPanel && (
                <div className="bg-card border border-themed rounded-xl shadow-themed p-4">
                    <h3 className="text-sm font-semibold text-default mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-primary" /> 视频监控</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {cameras.map(cam => (
                            <div key={cam.id} className="bg-surface border border-themed rounded-lg overflow-hidden aspect-video flex flex-col">
                                <div className="flex-1 flex items-center justify-center text-muted-themed bg-[#0a1929]"><Video className="w-8 h-8 opacity-30" /></div>
                                <div className="flex items-center justify-between px-2 py-1.5 text-[10px] border-t border-themed">
                                    <span className="text-default">{cam.name}</span>
                                    <span className={`flex items-center gap-1 ${cam.online ? 'text-success' : 'text-danger'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cam.online ? 'bg-success' : 'bg-danger'}`}></span>
                                        {cam.online ? '在线' : '离线'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 主内容区 */}
            <div className="grid grid-cols-3 gap-4" style={{ height: 'calc(100vh - 240px)' }}>
                {/* 监测点列表 */}
                <div className="bg-card border border-themed rounded-xl shadow-themed flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-themed shrink-0">
                        <div className="flex items-center gap-1.5">
                            <Radio className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-default">监测点位</span>
                            <span className="text-xs text-muted-themed ml-1">({filteredPoints.length})</span>
                        </div>
                        <button className="p-1 rounded hover:bg-hover-themed transition-colors cursor-pointer"><RefreshCw className="w-3.5 h-3.5 text-dim" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredPoints.map(point => {
                            const TypeIcon = getTypeIcon(point.type);
                            return (
                                <button key={point.id} onClick={() => setSelectedPoint(point)}
                                    className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer ${selectedPoint.id === point.id ? 'bg-primary/15 border border-primary/30' : 'bg-surface hover:bg-hover-themed border border-transparent'}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <TypeIcon className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-xs font-medium text-default">{point.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {point.type === 'rainfall' && <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRainfallLevel(point.value).cls}`}>{getRainfallLevel(point.value).text}</span>}
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${getStatusBg(point.status)} ${getStatusColor(point.status)}`}>{getStatusText(point.status)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-1 ml-5.5">
                                        <span className="text-lg font-bold text-default">{point.value}</span>
                                        <span className="text-[10px] text-muted-themed">{point.unit}</span>
                                    </div>
                                    <div className="text-[10px] text-muted-themed mt-1 ml-5.5">{getTypeLabel(point.type)}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 详情面板 */}
                <div className="col-span-2 bg-card border border-themed rounded-xl shadow-themed p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div>
                            <h3 className="text-base font-semibold text-default">{selectedPoint.name}</h3>
                            <p className="text-xs text-dim mt-0.5">{getTypeLabel(selectedPoint.type)} · 最后更新: 刚刚</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-3xl font-bold text-default">{selectedPoint.value}</p>
                                <p className="text-xs text-muted-themed">{selectedPoint.unit}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-md ${getStatusBg(selectedPoint.status)} ${getStatusColor(selectedPoint.status)}`}>{getStatusText(selectedPoint.status)}</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ReactECharts option={getChartOption(selectedPoint)} style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
