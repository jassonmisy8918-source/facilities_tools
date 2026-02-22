import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { toast } from '@/components/common/ToastNotify.store';

const kpis = [
    { label: '外水入侵点', value: 21, unit: '处', color: '#FF4757' }, { label: '影响管段', value: 38, unit: '段', color: '#FFB020' },
    { label: '外水占比', value: 28, unit: '%', color: '#3B82F6' }, { label: '已治理', value: 12, unit: '处', color: '#00D4AA' },
];

const initRecords = [
    { id: 'EW-001', segment: '朝阳路 P03-P04', type: '地下水入渗', rate: '15.2 m³/h', proportion: '32%', severity: 'high', status: 'investigating' },
    { id: 'EW-002', segment: '新华街 P08-P10', type: '河水倒灌', rate: '8.5 m³/h', proportion: '18%', severity: 'high', status: 'treating' },
    { id: 'EW-003', segment: '和平路 P12-P14', type: '雨水混接', rate: '5.8 m³/h', proportion: '12%', severity: 'medium', status: 'investigating' },
    { id: 'EW-004', segment: '建设大道 P20-P22', type: '地下水入渗', rate: '3.2 m³/h', proportion: '8%', severity: 'low', status: 'treated' },
    { id: 'EW-005', segment: '东湖路 P05-P06', type: '施工排水接入', rate: '12.0 m³/h', proportion: '25%', severity: 'high', status: 'investigating' },
];

function svCls(s: string) { return s === 'high' ? 'bg-danger/15 text-danger' : s === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'; }
function svTxt(s: string) { return s === 'high' ? '严重' : s === 'medium' ? '中等' : '轻微'; }
function stCls(s: string) { return s === 'investigating' ? 'bg-warning/15 text-warning' : s === 'treating' ? 'bg-info/15 text-info' : 'bg-success/15 text-success'; }
function stTxt(s: string) { return s === 'investigating' ? '排查中' : s === 'treating' ? '治理中' : '已治理'; }

const pieOption = { backgroundColor: 'transparent', tooltip: { trigger: 'item' as const }, color: ['#FF4757', '#FFB020', '#3B82F6', '#00D4AA', '#8B5CF6'], series: [{ type: 'pie' as const, radius: ['45%', '70%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 }, data: [{ value: 8, name: '地下水入渗' }, { value: 3, name: '河水倒灌' }, { value: 5, name: '雨水混接' }, { value: 2, name: '施工排水接入' }, { value: 3, name: '其他' }] }] };

export default function IntrusionView() {
    const [records, setRecords] = useState(initRecords);
    const advance = (id: string) => { const flow: Record<string, string> = { investigating: 'treating', treating: 'treated' }; setRecords(p => p.map(r => r.id === id ? { ...r, status: flow[r.status] || r.status } : r)); toast.success('状态已更新'); };

    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-4 gap-3">{kpis.map(k => <div key={k.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed text-center"><p className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</p><p className="text-xs text-dim mt-1">{k.label} ({k.unit})</p></div>)}</div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">{['编号', '管段', '入侵类型', '入侵量', '占比', '严重度', '状态'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{records.map(r => <tr key={r.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors"><td className="px-4 py-2.5 text-xs font-mono text-primary">{r.id}</td><td className="px-4 py-2.5 text-xs font-medium text-default">{r.segment}</td><td className="px-4 py-2.5 text-xs text-dim">{r.type}</td><td className="px-4 py-2.5 text-xs text-default font-mono">{r.rate}</td><td className="px-4 py-2.5 text-xs font-medium text-warning">{r.proportion}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${svCls(r.severity)}`}>{svTxt(r.severity)}</span></td><td className="px-4 py-2.5">{r.status !== 'treated' ? <button onClick={() => advance(r.id)} className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${stCls(r.status)}`}>{stTxt(r.status)}</button> : <span className={`text-[10px] px-2 py-0.5 rounded-md ${stCls(r.status)}`}>{stTxt(r.status)}</span>}</td></tr>)}</tbody></table></div>
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">入侵类型分布</h4><div className="h-56"><ReactECharts option={pieOption} style={{ height: '100%', width: '100%' }} /></div></div>
            </div>
        </div>
    );
}
