import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import {
    Droplets, AlertTriangle, Gauge, Activity,
    ArrowUpRight, ArrowDownRight, Minus, TrendingUp
} from 'lucide-react';

// ============ Mock 数据 ============
const kpiCards = [
    { label: '管网总里程', value: '2,847', unit: 'km', trend: 'up', change: '+12.3%', icon: Droplets, color: '#1B65B9' },
    { label: '监测点位', value: '1,256', unit: '个', trend: 'up', change: '+8.7%', icon: Activity, color: '#00D4AA' },
    { label: '今日预警', value: '23', unit: '条', trend: 'down', change: '-15.2%', icon: AlertTriangle, color: '#FFB020' },
    { label: '泵站运行率', value: '96.8', unit: '%', trend: 'stable', change: '0%', icon: Gauge, color: '#3B82F6' },
];

const alarmList = [
    { id: 1, type: 'danger', title: '雨花路泵站#2水泵异常停机', time: '2分钟前', location: '雨花路泵站' },
    { id: 2, type: 'warning', title: '民生路管段水位超警戒', time: '15分钟前', location: '民生路D300管段' },
    { id: 3, type: 'warning', title: '和平路雨量超阈值', time: '32分钟前', location: '和平路监测站' },
    { id: 4, type: 'info', title: '新华街管段流量异常波动', time: '1小时前', location: '新华街DN600管段' },
    { id: 5, type: 'info', title: '东湖泵站能耗偏高', time: '2小时前', location: '东湖泵站' },
];

const pumpStations = [
    { name: '雨花路泵站', status: 'running', flow: 342, power: 78 },
    { name: '东湖泵站', status: 'running', flow: 518, power: 92 },
    { name: '民生路泵站', status: 'running', flow: 267, power: 65 },
    { name: '和平路泵站', status: 'warning', flow: 189, power: 45 },
    { name: '新华街泵站', status: 'offline', flow: 0, power: 0 },
];

// ============ ECharts Options ============
function getPipelineOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item' },
        legend: { bottom: 0, textStyle: { color: '#8899AA', fontSize: 11 } },
        series: [{
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 6, borderColor: '#213345', borderWidth: 2 },
            label: { show: false },
            emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#E8EDF3' } },
            data: [
                { value: 1248, name: '雨水管', itemStyle: { color: '#3B82F6' } },
                { value: 987, name: '污水管', itemStyle: { color: '#00D4AA' } },
                { value: 412, name: '合流管', itemStyle: { color: '#FFB020' } },
                { value: 200, name: '其他', itemStyle: { color: '#8899AA' } },
            ]
        }]
    };
}

function getWaterLevelOption() {
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { top: 30, right: 15, bottom: 25, left: 45 },
        xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } }, interval: 3 },
        yAxis: { type: 'value', name: 'm', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [
            { name: '雨花路', type: 'line', smooth: true, data: [1.2, 1.1, 1.0, 0.9, 0.8, 0.8, 0.9, 1.2, 1.5, 1.8, 2.1, 2.3, 2.5, 2.4, 2.2, 2.0, 1.8, 1.6, 1.5, 1.4, 1.3, 1.2, 1.2, 1.1], lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) } },
            { name: '民生路', type: 'line', smooth: true, data: [0.8, 0.7, 0.7, 0.6, 0.6, 0.5, 0.6, 0.8, 1.1, 1.4, 1.6, 1.8, 1.9, 1.8, 1.7, 1.5, 1.3, 1.2, 1.1, 1.0, 0.9, 0.9, 0.8, 0.8], lineStyle: { color: '#00D4AA' }, itemStyle: { color: '#00D4AA' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,212,170,0.3)' }, { offset: 1, color: 'rgba(0,212,170,0)' }]) } },
        ]
    };
}

function getAlarmTrendOption() {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { top: 30, right: 15, bottom: 25, left: 40 },
        xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: { type: 'value', axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [
            { name: '紧急', type: 'bar', stack: 'total', data: [3, 2, 4, 1, 3, 2, 1], itemStyle: { color: '#FF4757', borderRadius: [0, 0, 0, 0] } },
            { name: '警告', type: 'bar', stack: 'total', data: [8, 6, 9, 5, 7, 4, 6], itemStyle: { color: '#FFB020' } },
            { name: '提示', type: 'bar', stack: 'total', data: [12, 10, 15, 8, 11, 7, 9], itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] } },
        ]
    };
}

function getQualityOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15,25,40,0.9)',
            borderColor: '#2A3F54',
            textStyle: { color: '#E8EDF3', fontSize: 11 },
            formatter: (params: echarts.TooltipComponentFormatterCallbackParams | echarts.TooltipComponentFormatterCallbackParams[]) => {
                const indicators = ['COD', 'pH', 'TN', 'TP', 'SS', '氨氮'];
                // ECharts 的类型声明中部分对象化数据推导非常宽泛，我们在 Radar 图场景中断言为目标格式
                const p = (Array.isArray(params) ? params[0] : params) as unknown as { name: string; value: number[] };
                let html = `<b>${p.name}</b><br/>`;
                if (Array.isArray(p.value)) {
                    p.value.forEach((v: number, i: number) => {
                        html += `${indicators[i]}: <b>${v}</b>mg/L<br/>`;
                    });
                }
                return html;
            }
        },
        legend: {
            bottom: 0,
            itemWidth: 12,
            itemHeight: 8,
            textStyle: { color: '#8899AA', fontSize: 10 },
            data: ['进水', '出水', '达标线']
        },
        radar: {
            center: ['50%', '45%'],
            radius: '60%',
            indicator: [
                { name: 'COD', max: 100 }, { name: 'pH', max: 100 }, { name: 'TN', max: 100 },
                { name: 'TP', max: 100 }, { name: 'SS', max: 100 }, { name: '氨氮', max: 100 },
            ],
            shape: 'polygon',
            axisName: { color: '#A0B4C8', fontSize: 11, fontWeight: 'bold', padding: [0, 4] },
            splitNumber: 4,
            splitLine: { lineStyle: { color: 'rgba(100,140,180,0.4)', width: 1 } },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(100,140,180,0.03)', 'rgba(100,140,180,0.08)', 'rgba(100,140,180,0.03)', 'rgba(100,140,180,0.08)'] }
            },
            axisLine: { lineStyle: { color: 'rgba(100,140,180,0.35)' } },
        },
        series: [{
            type: 'radar',
            symbolSize: 4,
            data: [
                {
                    value: [78, 65, 88, 70, 82, 65],
                    name: '进水',
                    lineStyle: { color: '#FF6B6B', width: 2 },
                    itemStyle: { color: '#FF6B6B', borderWidth: 2, borderColor: '#fff' },
                    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255,107,107,0.35)' }, { offset: 1, color: 'rgba(255,107,107,0.05)' }]) }
                },
                {
                    value: [25, 95, 30, 15, 22, 18],
                    name: '出水',
                    lineStyle: { color: '#00D4AA', width: 2 },
                    itemStyle: { color: '#00D4AA', borderWidth: 2, borderColor: '#fff' },
                    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,212,170,0.35)' }, { offset: 1, color: 'rgba(0,212,170,0.05)' }]) }
                },
                {
                    value: [50, 90, 40, 30, 40, 35],
                    name: '达标线',
                    lineStyle: { color: '#FFB020', width: 1.5, type: 'dashed' },
                    itemStyle: { color: '#FFB020', borderWidth: 0 },
                    areaStyle: { opacity: 0 },
                    symbol: 'none'
                }
            ]
        }]
    };
}


function getStatusColor(status: string) {
    return status === 'running' ? 'bg-success' : status === 'warning' ? 'bg-warning' : 'bg-danger';
}

function getStatusText(status: string) {
    return status === 'running' ? '运行中' : status === 'warning' ? '预警' : '离线';
}

function getAlarmColor(type: string) {
    return type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning' : 'bg-info';
}


export default function DashboardView() {
    return (
        <div className="h-[calc(100vh-56px)] overflow-auto p-4 space-y-4">
            {/* KPI 卡片 */}
            <div className="grid grid-cols-4 gap-4">
                {kpiCards.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-card border border-themed rounded-xl p-5 shadow-themed flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: kpi.color + '20' }}
                            >
                                <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-dim text-xs mb-1">{kpi.label}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-bold text-default">{kpi.value}</span>
                                    <span className="text-xs text-muted-themed">{kpi.unit}</span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 text-xs shrink-0 ${kpi.trend === 'up' ? 'text-success' : kpi.trend === 'down' ? 'text-danger' : 'text-muted-themed'}`}>
                                {kpi.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                                {kpi.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                                {kpi.trend === 'stable' && <Minus className="w-3 h-3" />}
                                <span>{kpi.change}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 图表行1: 管网类型 + 水位趋势 */}
            <div className="grid grid-cols-3 gap-4">
                {/* 管网类型分布 */}
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-default">管网类型分布</h3>
                        <span className="text-xs text-muted-themed">总计 2,847km</span>
                    </div>
                    <div className="h-52">
                        <ReactECharts option={getPipelineOption()} style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* 水位趋势 */}
                <div className="col-span-2 bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-default">24h 水位趋势</h3>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-success" />
                            <span className="text-xs text-success">正常</span>
                        </div>
                    </div>
                    <div className="h-52">
                        <ReactECharts option={getWaterLevelOption()} style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>
            </div>

            {/* 图表行2: 预警趋势 + 水质雷达 + 泵站状态 + 实时预警 */}
            <div className="grid grid-cols-4 gap-4">
                {/* 预警趋势 */}
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h3 className="text-sm font-semibold text-default mb-2">本周预警趋势</h3>
                    <div className="h-48">
                        <ReactECharts option={getAlarmTrendOption()} style={{ height: '100%', width: '100%' }} />
                    </div>
                </div>

                {/* 水质雷达 */}
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-default">污水处理水质</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success font-medium">达标</span>
                    </div>
                    <div className="h-40">
                        <ReactECharts option={getQualityOption()} style={{ height: '100%', width: '100%' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mt-1">
                        <div className="text-center p-1.5 rounded-lg bg-surface">
                            <p className="text-[10px] text-dim">COD去除率</p>
                            <p className="text-xs font-bold text-success">96.8%</p>
                        </div>
                        <div className="text-center p-1.5 rounded-lg bg-surface">
                            <p className="text-[10px] text-dim">氨氮去除率</p>
                            <p className="text-xs font-bold text-success">97.2%</p>
                        </div>
                        <div className="text-center p-1.5 rounded-lg bg-surface">
                            <p className="text-[10px] text-dim">SS去除率</p>
                            <p className="text-xs font-bold text-success">95.1%</p>
                        </div>
                    </div>
                </div>

                {/* 泵站状态 */}
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h3 className="text-sm font-semibold text-default mb-3">泵站运行状态</h3>
                    <div className="space-y-2.5">
                        {pumpStations.map(station => (
                            <div key={station.name} className="flex items-center gap-3 p-2 rounded-lg bg-surface">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(station.status)}`}></span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-default truncate">{station.name}</p>
                                    <p className="text-[10px] text-muted-themed">{station.flow} m³/h · {station.power} kW</p>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${station.status === 'running' ? 'bg-success/15 text-success' :
                                    station.status === 'warning' ? 'bg-warning/15 text-warning' :
                                        'bg-danger/15 text-danger'
                                    }`}>
                                    {getStatusText(station.status)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 实时预警 */}
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-default">实时预警</h3>
                        <span className="text-xs text-primary cursor-pointer hover:underline">查看全部</span>
                    </div>
                    <div className="space-y-2">
                        {alarmList.map(alarm => (
                            <div key={alarm.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-surface">
                                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getAlarmColor(alarm.type)}`}></span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-default leading-relaxed line-clamp-2">{alarm.title}</p>
                                    <p className="text-[10px] text-muted-themed mt-0.5">{alarm.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
