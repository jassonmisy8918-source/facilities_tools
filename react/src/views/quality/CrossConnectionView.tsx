import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { toast } from '@/components/common/ToastNotify.store';

const kpis = [
    { label: '混接点位', value: 34, unit: '处', color: '#FF4757' }, { label: '已整改', value: 18, unit: '处', color: '#00D4AA' },
    { label: '整改中', value: 10, unit: '处', color: '#3B82F6' }, { label: '整改率', value: 52.9, unit: '%', color: '#FFB020' },
];

const initRecords = [
    { id: 'CC-001', location: '雨花路28号', type: '雨接污', source: '餐饮排水', pipeSpec: 'DN150→DN300 污水管', method: 'CCTV', status: 'completed' },
    { id: 'CC-002', location: '新华街56号', type: '污接雨', source: '生活排水', pipeSpec: 'DN100→DN400 雨水管', method: '水质检测', status: 'rectifying' },
    { id: 'CC-003', location: '和平路商业中心', type: '雨接污', source: '屋面雨水', pipeSpec: 'DN200→DN600 污水管', method: '现场巡查', status: 'confirmed' },
    { id: 'CC-004', location: '民生路12号', type: '污接雨', source: '洗车废水', pipeSpec: 'DN75→DN300 雨水管', method: '水质检测', status: 'completed' },
    { id: 'CC-005', location: '建设大道88号', type: '雨接污', source: '地面径流', pipeSpec: 'DN150→DN400 污水管', method: 'CCTV', status: 'confirmed' },
];

function tyCls(t: string) { return t === '雨接污' ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'; }
function stCls(s: string) { return s === 'completed' ? 'bg-success/15 text-success' : s === 'rectifying' ? 'bg-info/15 text-info' : 'bg-warning/15 text-warning'; }
function stTxt(s: string) { return s === 'completed' ? '已整改' : s === 'rectifying' ? '整改中' : '已确认'; }

const chartOption = { backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const }, legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } }, grid: { top: 30, right: 15, bottom: 30, left: 45 }, xAxis: { type: 'category' as const, data: ['雨花区', '海淀区', '侯家塘区', '东城区', '丰台区'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } }, yAxis: { type: 'value' as const, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } }, series: [{ name: '雨接污', type: 'bar' as const, stack: 'total', data: [5, 3, 4, 2, 6], itemStyle: { color: '#FF4757' } }, { name: '污接雨', type: 'bar' as const, stack: 'total', data: [3, 2, 3, 1, 5], itemStyle: { color: '#FFB020' } }] };

export default function CrossConnectionView() {
    const [records, setRecords] = useState(initRecords);
    const advance = (id: string) => { const flow: Record<string, string> = { confirmed: 'rectifying', rectifying: 'completed' }; setRecords(p => p.map(r => r.id === id ? { ...r, status: flow[r.status] || r.status } : r)); toast.success('状态已更新'); };

    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-4 gap-3">{kpis.map(k => <div key={k.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed text-center"><p className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</p><p className="text-xs text-dim mt-1">{k.label} ({k.unit})</p></div>)}</div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">{['编号', '位置', '类型', '污染源', '管径连接', '检测方式', '状态'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{records.map(r => <tr key={r.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors"><td className="px-4 py-2.5 text-xs font-mono text-primary">{r.id}</td><td className="px-4 py-2.5 text-xs font-medium text-default">{r.location}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${tyCls(r.type)}`}>{r.type}</span></td><td className="px-4 py-2.5 text-xs text-dim">{r.source}</td><td className="px-4 py-2.5 text-xs text-dim font-mono">{r.pipeSpec}</td><td className="px-4 py-2.5 text-xs text-dim">{r.method}</td><td className="px-4 py-2.5">{r.status !== 'completed' ? <button onClick={() => advance(r.id)} className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${stCls(r.status)}`}>{stTxt(r.status)}</button> : <span className={`text-[10px] px-2 py-0.5 rounded-md ${stCls(r.status)}`}>{stTxt(r.status)}</span>}</td></tr>)}</tbody></table></div>
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">各区混接分布</h4><div className="h-56"><ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} /></div></div>
            </div>
        </div>
    );
}
