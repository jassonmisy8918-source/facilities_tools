import { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Send } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

const kpis = [
    { label: '今日总处理量', value: '12.8', unit: '万m³', color: '#3B82F6' }, { label: '管网负荷率', value: '72', unit: '%', color: '#00D4AA' },
    { label: '调度指令', value: '6', unit: '条', color: '#FFB020' }, { label: '应急响应', value: '0', unit: '次', color: '#8B5CF6' },
];

const initCommands = [
    { id: 'DC-001', title: '东湖泵站 3号泵 启动', reason: '进水水位达预警值', issuer: '调度中心', time: '2024-03-15 14:20', target: '东湖泵站', status: 'executed', type: 'auto' },
    { id: 'DC-002', title: '朝阳路泵站 调度比例调整为85%', reason: '下游管网满载', issuer: '张调度', time: '2024-03-15 12:30', target: '朝阳路泵站', status: 'executed', type: 'manual' },
    { id: 'DC-003', title: '和平路闸门 开度调至60%', reason: '上游来水量减少', issuer: '调度中心', time: '2024-03-15 11:00', target: '和平路闸站', status: 'executed', type: 'auto' },
    { id: 'DC-004', title: '西城排放口 限流50%', reason: '水质超标，限制排放', issuer: '李调度', time: '2024-03-15 10:15', target: '西城排放口', status: 'pending', type: 'manual' },
];

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const flowOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const },
    legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
    grid: { top: 30, right: 50, bottom: 25, left: 50 },
    xAxis: { type: 'category' as const, data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 2 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: [
        { type: 'value' as const, name: '流量(m³/h)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        { type: 'value' as const, name: '负荷(%)', nameTextStyle: { color: '#5A6B7C' }, max: 100, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
    ],
    series: [
        { name: '总处理流量', type: 'line' as const, smooth: true, data: hours.map((_, i) => Math.round(350 + Math.sin(i / 4) * 150 + Math.random() * 50)), lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.3)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) } },
        { name: '管网负荷', type: 'line' as const, yAxisIndex: 1, smooth: true, data: hours.map((_, i) => Math.round(55 + Math.sin(i / 4) * 20 + Math.random() * 5)), lineStyle: { color: '#FFB020', type: 'dashed' as const }, itemStyle: { color: '#FFB020' }, symbol: 'none' as const },
    ]
};

export default function DispatchView() {
    const [commands, setCommands] = useState(initCommands);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ target: '', content: '', reason: '' });

    const doSend = () => {
        if (!form.target || !form.content) { toast.warning('请填写完整指令信息'); return; }
        setCommands(p => [{ id: `DC-${String(p.length + 1).padStart(3, '0')}`, title: form.content, reason: form.reason, issuer: '当前用户', time: new Date().toLocaleString(), target: form.target, status: 'pending', type: 'manual' }, ...p]);
        setShowModal(false); toast.success('指令已下发');
    };

    const execute = (id: string) => { setCommands(p => p.map(c => c.id === id ? { ...c, status: 'executed' } : c)); toast.success('指令已执行'); };

    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-4 gap-3">{kpis.map(k => <div key={k.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed"><div className="flex items-center justify-between mb-2"><span className="text-xs text-dim">{k.label}</span></div><p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p><p className="text-xs text-muted-themed mt-0.5">{k.unit}</p></div>)}</div>

            <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">24小时流量及负荷趋势</h4><div className="h-52"><ReactECharts option={flowOption} style={{ height: '100%', width: '100%' }} /></div></div>

            <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div className="px-4 py-3 border-b border-themed flex items-center justify-between"><h4 className="text-sm font-semibold text-default">调度指令</h4><button onClick={() => { setForm({ target: '', content: '', reason: '' }); setShowModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"><Send className="w-3 h-3" /> 下发指令</button></div>
                <table className="w-full text-sm"><thead><tr className="border-b border-themed">{['编号', '指令内容', '原因', '下发方', '时间', '类型', '状态'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{commands.map(c => <tr key={c.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors"><td className="px-4 py-2.5 text-xs font-mono text-primary">{c.id}</td><td className="px-4 py-2.5 text-xs font-medium text-default">{c.title}</td><td className="px-4 py-2.5 text-xs text-dim">{c.reason}</td><td className="px-4 py-2.5 text-xs text-dim">{c.issuer}</td><td className="px-4 py-2.5 text-xs text-dim">{c.time}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${c.type === 'auto' ? 'bg-info/15 text-info' : 'bg-primary/15 text-primary'}`}>{c.type === 'auto' ? '自动' : '人工'}</span></td><td className="px-4 py-2.5">{c.status === 'pending' ? <button onClick={() => execute(c.id)} className="text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors bg-warning/15 text-warning">待执行</button> : <span className="text-[10px] px-2 py-0.5 rounded-md bg-success/15 text-success">已执行</span>}</td></tr>)}</tbody></table>
            </div>

            <ModalDialog show={showModal} title="下发调度指令" onClose={() => setShowModal(false)} onConfirm={doSend}>
                <div className="space-y-3">
                    <div><label className="text-xs text-dim mb-1 block">目标设施 <span className="text-danger">*</span></label><select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option value="">请选择</option><option>东湖泵站</option><option>朝阳路泵站</option><option>和平路闸站</option><option>西城排放口</option></select></div>
                    <div><label className="text-xs text-dim mb-1 block">指令内容 <span className="text-danger">*</span></label><input value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="例如：3号泵 启动" /></div>
                    <div><label className="text-xs text-dim mb-1 block">原因</label><textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={2} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary resize-none" placeholder="调度原因" /></div>
                </div>
            </ModalDialog>
        </div>
    );
}
