import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Monitor, Power, Droplets, Zap, Thermometer, CheckCircle, XCircle, ArrowDown, ArrowUp } from 'lucide-react';

const stations = [
    { id: 1, name: '雨花路泵站', status: 'running', pumps: [{ id: 'P1', status: 'running', flow: 120, current: 32, temp: 45 }, { id: 'P2', status: 'running', flow: 115, current: 30, temp: 43 }, { id: 'P3', status: 'standby', flow: 0, current: 0, temp: 25 }], inletLevel: 2.8, outletLevel: 1.2, inletWarnLevel: 3.5, outletWarnLevel: 2.0, inFlow: 342, outFlow: 335, totalFlow: 342, alarms: 0 },
    { id: 2, name: '东湖泵站', status: 'running', pumps: [{ id: 'P1', status: 'running', flow: 180, current: 45, temp: 52 }, { id: 'P2', status: 'running', flow: 175, current: 44, temp: 50 }, { id: 'P3', status: 'running', flow: 163, current: 42, temp: 48 }], inletLevel: 3.5, outletLevel: 1.8, inletWarnLevel: 4.0, outletWarnLevel: 2.5, inFlow: 518, outFlow: 510, totalFlow: 518, alarms: 0 },
    { id: 3, name: '和平路泵站', status: 'warning', pumps: [{ id: 'P1', status: 'running', flow: 95, current: 28, temp: 55 }, { id: 'P2', status: 'fault', flow: 0, current: 0, temp: 65 }, { id: 'P3', status: 'running', flow: 94, current: 27, temp: 48 }], inletLevel: 4.1, outletLevel: 2.0, inletWarnLevel: 3.8, outletWarnLevel: 2.5, inFlow: 189, outFlow: 180, totalFlow: 189, alarms: 2 },
    { id: 4, name: '民生路泵站', status: 'running', pumps: [{ id: 'P1', status: 'running', flow: 135, current: 35, temp: 42 }, { id: 'P2', status: 'standby', flow: 0, current: 0, temp: 24 }], inletLevel: 2.1, outletLevel: 0.9, inletWarnLevel: 3.5, outletWarnLevel: 2.0, inFlow: 135, outFlow: 130, totalFlow: 135, alarms: 0 },
];

function getPumpIcon(s: string) { return s === 'running' ? CheckCircle : s === 'fault' ? XCircle : Power; }
function getPumpColor(s: string) { return s === 'running' ? 'text-success' : s === 'fault' ? 'text-danger' : 'text-muted-themed'; }
function getPumpText(s: string) { return s === 'running' ? '运行' : s === 'fault' ? '故障' : '待机'; }
function levelPct(l: number, w: number) { return Math.min((l / w) * 100, 100); }
function levelColor(l: number, w: number) { return l >= w ? 'bg-danger' : l >= w * 0.8 ? 'bg-warning' : 'bg-primary'; }

const flowOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const },
    legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
    grid: { top: 30, right: 15, bottom: 25, left: 45 },
    xAxis: { type: 'category' as const, data: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`), axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 3 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: { type: 'value' as const, name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
    series: [
        { name: '进水流量', type: 'line' as const, smooth: true, data: [280, 260, 240, 220, 200, 210, 250, 300, 340, 360, 380, 370, 350, 340, 360, 370, 350, 330, 310, 300, 290, 285, 280, 275], lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' } },
        { name: '出水流量', type: 'line' as const, smooth: true, data: [275, 255, 235, 215, 195, 205, 245, 295, 335, 355, 375, 365, 345, 335, 355, 365, 345, 325, 305, 295, 285, 280, 275, 270], lineStyle: { color: '#00D4AA' }, itemStyle: { color: '#00D4AA' } },
    ]
};

export default function MonitorView() {
    const [selected, setSelected] = useState(stations[0]);
    return (
        <div className="grid grid-cols-4 gap-4 p-4" style={{ height: 'calc(100vh - 160px)' }}>
            {/* 泵站列表 */}
            <div className="bg-card border border-themed rounded-xl shadow-themed flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-themed shrink-0"><div className="flex items-center gap-1.5"><Monitor className="w-4 h-4 text-primary" /><span className="text-sm font-semibold text-default">泵站列表</span></div></div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                    {stations.map(st => (
                        <button key={st.id} onClick={() => setSelected(st)} className={`w-full text-left p-3 rounded-lg transition-all cursor-pointer ${selected.id === st.id ? 'bg-primary/15 border border-primary/30' : 'bg-surface hover:bg-hover-themed border border-transparent'}`}>
                            <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium text-default">{st.name}</span><span className={`w-2 h-2 rounded-full ${st.status === 'running' ? 'bg-success' : st.status === 'warning' ? 'bg-warning' : 'bg-danger'}`} /></div>
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="text-dim">进水 <span className="text-default font-medium">{st.inletLevel}</span> m</div>
                                <div className="text-dim">出水 <span className="text-default font-medium">{st.outletLevel}</span> m</div>
                                <div className="text-dim">流量 <span className="text-default font-medium">{st.totalFlow}</span> m³/h</div>
                                <div className="text-dim">报警 <span className={st.alarms > 0 ? 'text-danger font-medium' : 'text-success font-medium'}>{st.alarms}</span></div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 详情 */}
            <div className="col-span-3 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-4 gap-3">
                    {[{ label: '前池水位', val: selected.inletLevel, warn: selected.inletWarnLevel, icon: <ArrowDown className="w-3.5 h-3.5 text-info" />, unit: 'm' },
                    { label: '后池水位', val: selected.outletLevel, warn: selected.outletWarnLevel, icon: <ArrowUp className="w-3.5 h-3.5 text-success" />, unit: 'm' }].map(item => (
                        <div key={item.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                            <div className="flex items-center justify-between mb-3"><span className="text-xs text-dim">{item.label}</span>{item.icon}</div>
                            <div className="flex items-end gap-2 mb-2"><span className={`text-2xl font-bold ${item.val >= item.warn ? 'text-danger' : 'text-default'}`}>{item.val}</span><span className="text-xs text-muted-themed mb-0.5">{item.unit}</span></div>
                            <div className="w-full bg-surface rounded-full h-2 mb-1"><div className={`h-2 rounded-full transition-all ${levelColor(item.val, item.warn)}`} style={{ width: `${levelPct(item.val, item.warn)}%` }} /></div>
                            <p className="text-[10px] text-muted-themed">预警值: {item.warn}m</p>
                        </div>
                    ))}
                    <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><div className="flex items-center justify-between mb-3"><span className="text-xs text-dim">进水流量</span><Droplets className="w-3.5 h-3.5 text-info" /></div><p className="text-2xl font-bold text-default">{selected.inFlow}</p><p className="text-xs text-muted-themed">m³/h</p></div>
                    <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><div className="flex items-center justify-between mb-3"><span className="text-xs text-dim">出水流量</span><Droplets className="w-3.5 h-3.5 text-success" /></div><p className="text-2xl font-bold text-default">{selected.outFlow}</p><p className="text-xs text-muted-themed">m³/h</p></div>
                </div>

                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h3 className="text-sm font-semibold text-default mb-3">{selected.name} — 水泵状态</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {selected.pumps.map(pump => {
                            const Icon = getPumpIcon(pump.status); return (
                                <div key={pump.id} className="bg-surface rounded-lg p-3 border border-themed">
                                    <div className="flex items-center justify-between mb-3"><span className="text-xs font-medium text-default">{pump.id} 号泵</span><div className={`flex items-center gap-1 ${getPumpColor(pump.status)}`}><Icon className="w-3.5 h-3.5" /><span className="text-[10px]">{getPumpText(pump.status)}</span></div></div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div><Droplets className="w-4 h-4 text-info mx-auto mb-1" /><p className="text-sm font-bold text-default">{pump.flow}</p><p className="text-[10px] text-muted-themed">m³/h</p></div>
                                        <div><Zap className="w-4 h-4 text-warning mx-auto mb-1" /><p className="text-sm font-bold text-default">{pump.current}</p><p className="text-[10px] text-muted-themed">A</p></div>
                                        <div><Thermometer className={`w-4 h-4 mx-auto mb-1 ${pump.temp > 55 ? 'text-danger' : 'text-success'}`} /><p className="text-sm font-bold text-default">{pump.temp}°</p><p className="text-[10px] text-muted-themed">温度</p></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h3 className="text-sm font-semibold text-default mb-2">24h 进/出水流量</h3>
                    <div className="h-48"><ReactECharts option={flowOption} style={{ height: '100%', width: '100%' }} /></div>
                </div>
            </div>
        </div>
    );
}
