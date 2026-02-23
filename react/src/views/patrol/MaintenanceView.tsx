import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

const tabs = [
    { key: 'records', label: '养护记录' }, { key: 'plan', label: '养护计划' },
    { key: 'instrument', label: '仪表维护' }, { key: 'equipment', label: '设备管理' },
];

const initRecords = [
    { id: 'MN-001', type: '管道清淤', target: '雨花路DN600 P01-P10段', team: '养护一队', startDate: '2024-03-14', endDate: '2024-03-16', status: 'processing', progress: 60, cost: 12500 },
    { id: 'MN-002', type: 'CCTV检测', target: '民生路DN400 全段', team: '检测组', startDate: '2024-03-13', endDate: '2024-03-18', status: 'processing', progress: 35, cost: 28000 },
    { id: 'MN-003', type: '管道修复', target: '和平路DN300 P05-P06段', team: '养护二队', startDate: '2024-03-12', endDate: '2024-03-13', status: 'completed', progress: 100, cost: 45000 },
    { id: 'MN-004', type: '检查井维修', target: '新华街 检查井#45~#50', team: '养护三队', startDate: '2024-03-15', endDate: '2024-03-17', status: 'pending', progress: 0, cost: 8000 },
    { id: 'MN-005', type: '雨水口清掏', target: '建设大道 全线雨水口', team: '养护一队', startDate: '2024-03-10', endDate: '2024-03-11', status: 'completed', progress: 100, cost: 6500 },
];

const plans = [
    { id: 'MP-001', name: '2024年Q1管道清淤计划', scope: '全市主干管', progress: 66, budget: 580000, spent: 382000, status: 'active' },
    { id: 'MP-002', name: '2024年检查井普查养护', scope: '雨花区+海淀区', progress: 58, budget: 150000, spent: 86000, status: 'active' },
    { id: 'MP-003', name: '排放口季度维护', scope: '全市排放口', progress: 0, budget: 45000, spent: 0, status: 'pending' },
];

const instruments = [
    { id: 'IC-001', device: '雨花路流量计 FM-201', type: '流量计校准', calibDate: '2024-03-10', nextCalib: '2024-06-10', result: '合格', deviation: '±0.5%' },
    { id: 'IC-002', device: '民生路液位计 LS-105', type: '液位计校准', calibDate: '2024-03-08', nextCalib: '2024-06-08', result: '合格', deviation: '±1mm' },
    { id: 'IC-003', device: '和平路水质分析仪 WQ-302', type: '水质仪校准', calibDate: '2024-02-25', nextCalib: '2024-05-25', result: '合格', deviation: '±2%' },
    { id: 'IC-004', device: '东湖雨量计 RG-051', type: '雨量计校准', calibDate: '2024-01-15', nextCalib: '2024-04-15', result: '需复检', deviation: '±5%' },
];

const equipment = [
    { id: 'VH-001', name: '清淤车 A-01', type: '车辆', model: '东风D9', status: 'in-use', assignee: '养护一队' },
    { id: 'VH-002', name: 'CCTV检测机器人', type: '检测仪器', model: 'ROVVER X', status: 'available', assignee: '检测组' },
    { id: 'VH-003', name: '管道封堵器', type: '工具', model: 'PB-600', status: 'available', assignee: '养护二队' },
    { id: 'VH-004', name: '抢修车 B-02', type: '车辆', model: '江铃域虎', status: 'in-use', assignee: '养护三队' },
    { id: 'VH-005', name: '声呐检测仪', type: '检测仪器', model: 'SL-300', status: 'maintenance', assignee: '检测组' },
];

function cls(s: string) {
    if (s === 'completed' || s === 'available') return 'bg-success/15 text-success';
    if (s === 'processing' || s === 'active' || s === 'in-use') return 'bg-info/15 text-info';
    if (s === 'maintenance') return 'bg-warning/15 text-warning';
    return 'bg-warning/15 text-warning';
}
function txt(s: string) {
    const m: Record<string, string> = { completed: '已完成', processing: '进行中', active: '执行中', pending: '待开始', 'in-use': '使用中', available: '可用', maintenance: '维修中' };
    return m[s] ?? s;
}

const Th = ({ children }: { children: string }) => <th className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{children}</th>;

export default function MaintenanceView() {
    const [activeTab, setActiveTab] = useState('records');
    const [records, setRecords] = useState(initRecords);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ type: '管道清淤', target: '', team: '养护一队' });

    const doAdd = () => {
        if (!form.target) { toast.warning('请输入养护对象'); return; }
        setRecords(p => [{ id: `MN-${String(p.length + 1).padStart(3, '0')}`, ...form, startDate: new Date().toISOString().slice(0, 10), endDate: '待定', status: 'pending', progress: 0, cost: 0 }, ...p]);
        setShowAdd(false); toast.success('养护记录已创建');
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
                    {tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{t.label}</button>)}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => toast.info('导出中...')} className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"><Download className="w-3 h-3" /> 导出</button>
                    <button onClick={() => { setForm({ type: '管道清淤', target: '', team: '养护一队' }); setShowAdd(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"><Plus className="w-3 h-3" /> 新增记录</button>
                </div>
            </div>

            {activeTab === 'records' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>养护类型</Th><Th>养护对象</Th><Th>执行团队</Th><Th>起止时间</Th><Th>费用(¥)</Th><Th>进度</Th><Th>状态</Th></tr></thead>
                        <tbody>{records.map(r => <tr key={r.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td className="px-4 py-2.5 text-xs font-mono text-primary">{r.id}</td>
                            <td className="px-4 py-2.5 text-xs text-default">{r.type}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{r.target}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{r.team}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{r.startDate} ~ {r.endDate}</td>
                            <td className="px-4 py-2.5 text-xs text-default font-medium">{r.cost.toLocaleString()}</td>
                            <td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className="w-16 bg-surface rounded-full h-1.5"><div className={`h-1.5 rounded-full ${r.progress === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${r.progress}%` }} /></div><span className="text-[10px] text-muted-themed">{r.progress}%</span></div></td>
                            <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${cls(r.status)}`}>{txt(r.status)}</span></td>
                        </tr>)}</tbody></table>
                </div>
            )}

            {activeTab === 'plan' && <div className="space-y-3">{plans.map(p => (
                <div key={p.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-start justify-between mb-3"><div><h4 className="text-sm font-semibold text-default">{p.name}</h4><p className="text-xs text-dim mt-0.5">{p.scope}</p></div><span className={`text-[10px] px-2 py-0.5 rounded-md ${cls(p.status)}`}>{txt(p.status)}</span></div>
                    <div className="flex items-center gap-6 text-xs mb-3"><div className="text-dim">进度: <span className="text-default font-medium">{p.progress}%</span></div><div className="text-dim">预算: <span className="text-default font-medium">¥{p.budget.toLocaleString()}</span></div><div className="text-dim">已用: <span className={p.spent > p.budget * 0.9 ? 'text-danger font-medium' : 'text-default font-medium'}>¥{p.spent.toLocaleString()}</span></div></div>
                    <div className="w-full bg-surface rounded-full h-2"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${p.progress}%` }} /></div>
                </div>
            ))}</div>}

            {activeTab === 'instrument' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>设备</Th><Th>校准类型</Th><Th>校准日期</Th><Th>下次校准</Th><Th>偏差</Th><Th>结果</Th></tr></thead>
                        <tbody>{instruments.map(ic => <tr key={ic.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td className="px-4 py-2.5 text-xs font-mono text-primary">{ic.id}</td>
                            <td className="px-4 py-2.5 text-xs text-default">{ic.device}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{ic.type}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{ic.calibDate}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{ic.nextCalib}</td>
                            <td className="px-4 py-2.5 text-xs text-default font-mono">{ic.deviation}</td>
                            <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${ic.result === '合格' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>{ic.result}</span></td>
                        </tr>)}</tbody></table>
                </div>
            )}

            {activeTab === 'equipment' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>名称</Th><Th>类型</Th><Th>型号</Th><Th>分配</Th><Th>状态</Th></tr></thead>
                        <tbody>{equipment.map(eq => <tr key={eq.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                            <td className="px-4 py-2.5 text-xs font-mono text-primary">{eq.id}</td>
                            <td className="px-4 py-2.5 text-xs font-medium text-default">{eq.name}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{eq.type}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{eq.model}</td>
                            <td className="px-4 py-2.5 text-xs text-dim">{eq.assignee}</td>
                            <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${cls(eq.status)}`}>{txt(eq.status)}</span></td>
                        </tr>)}</tbody></table>
                </div>
            )}

            <ModalDialog show={showAdd} title="新增养护记录" onClose={() => setShowAdd(false)} onConfirm={doAdd}>
                <div className="space-y-3">
                    <div><label className="text-xs text-dim mb-1 block">养护类型</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option>管道清淤</option><option>CCTV检测</option><option>管道修复</option><option>检查井维修</option><option>雨水口清掘</option></select></div>
                    <div><label className="text-xs text-dim mb-1 block">养护对象 <span className="text-danger">*</span></label><input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="例如：雨花路 DN600 P01-P10段" /></div>
                    <div><label className="text-xs text-dim mb-1 block">执行团队</label><select value={form.team} onChange={e => setForm(f => ({ ...f, team: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option>养护一队</option><option>养护二队</option><option>养护三队</option><option>检测组</option></select></div>
                </div>
            </ModalDialog>
        </div>
    );
}
