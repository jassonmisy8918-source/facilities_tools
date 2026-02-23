import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from '@/components/common/ToastNotify.store';

const alarmTabs = [{ key: 'list', label: '报警列表' }, { key: 'rules', label: '报警规则' }];
const statusFilters = [{ key: 'all', label: '全部' }, { key: 'active', label: '报警中' }, { key: 'acknowledged', label: '已确认' }, { key: 'resolved', label: '已处置' }];

const alarmStats = [
    { label: '紧急报警', value: 1, color: '#FF4757' }, { label: '重要报警', value: 3, color: '#FFB020' },
    { label: '一般报警', value: 5, color: '#3B82F6' }, { label: '已处置', value: 8, color: '#00D4AA' },
];

const initAlarms = [
    { id: 1, level: 'critical', title: '#2水泵异常停机 - 过载保护触发', station: '雨花路泵站', time: '2024-03-15 14:23', duration: '2分钟', status: 'active', workOrder: '' },
    { id: 2, level: 'warning', title: '#1水泵轴承温度过高 (65°C)', station: '和平路泵站', time: '2024-03-15 13:15', duration: '1小时8分', status: 'active', workOrder: '' },
    { id: 3, level: 'warning', title: '进水流量突增 (+35%)', station: '东湖泵站', time: '2024-03-15 11:30', duration: '2小时53分', status: 'acknowledged', workOrder: 'WO-0312' },
    { id: 4, level: 'info', title: '前池水位达到预警线', station: '和平路泵站', time: '2024-03-15 10:45', duration: '3小时38分', status: 'acknowledged', workOrder: '' },
    { id: 5, level: 'info', title: '备用电源自检异常', station: '民生路泵站', time: '2024-03-15 08:20', duration: '6小时3分', status: 'resolved', workOrder: 'WO-0310' },
];

const initRules = [
    { id: 'R-001', name: '水泵过载保护', condition: '电流 > 额定值120%', level: 'critical', enabled: true, action: '立即停机+短信+派单' },
    { id: 'R-002', name: '轴承温度过高', condition: '温度 > 60°C', level: 'warning', enabled: true, action: '短信通知+工单' },
    { id: 'R-003', name: '前池水位超限', condition: '水位 > 预警值', level: 'warning', enabled: true, action: '联动启泵+短信' },
    { id: 'R-004', name: '进水流量异常', condition: '流量波动 > ±30%', level: 'info', enabled: true, action: '记录+通知' },
    { id: 'R-005', name: '设备离线', condition: '心跳超时 > 5min', level: 'info', enabled: true, action: '通知值班人员' },
    { id: 'R-006', name: '电压异常', condition: '电压偏差 > ±10%', level: 'warning', enabled: false, action: '短信通知' },
];

function lvlCls(l: string) { return l === 'critical' ? 'bg-danger text-white' : l === 'warning' ? 'bg-warning text-white' : 'bg-info/20 text-info'; }
function lvlTxt(l: string) { return l === 'critical' ? '紧急' : l === 'warning' ? '重要' : '一般'; }
function stCls(s: string) { return s === 'active' ? 'text-danger' : s === 'acknowledged' ? 'text-warning' : 'text-success'; }
function stTxt(s: string) { return s === 'active' ? '报警中' : s === 'acknowledged' ? '已确认' : '已处置'; }

export default function PumpAlarmView() {
    const [activeTab, setActiveTab] = useState('list');
    const [statusFilter, setStatusFilter] = useState('all');
    const [alarms, setAlarms] = useState(initAlarms);
    const [rules, setRules] = useState(initRules);

    const filtered = useMemo(() => statusFilter === 'all' ? alarms : alarms.filter(a => a.status === statusFilter), [alarms, statusFilter]);

    const update = (id: number, status: string) => setAlarms(p => p.map(a => a.id === id ? { ...a, status } : a));

    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-4 gap-3">{alarmStats.map(s => <div key={s.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed text-center"><p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p><p className="text-xs text-dim mt-1">{s.label}</p></div>)}</div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">{alarmTabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{t.label}</button>)}</div>
                {activeTab === 'list' && <div className="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">{statusFilters.map(sf => <button key={sf.key} onClick={() => setStatusFilter(sf.key)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${statusFilter === sf.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{sf.label}</button>)}</div>}
            </div>

            {activeTab === 'list' && <div className="space-y-2">{filtered.map(a => (
                <div key={a.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3"><span className={`text-[10px] px-2 py-0.5 rounded-md mt-0.5 ${lvlCls(a.level)}`}>{lvlTxt(a.level)}</span><div><h4 className="text-sm font-semibold text-default">{a.title}</h4><p className="text-xs text-dim mt-1">{a.station} · {a.time} · 持续 {a.duration}</p>{a.workOrder && <p className="text-xs text-primary mt-0.5">关联工单: {a.workOrder}</p>}</div></div>
                        <div className="flex items-center gap-3 shrink-0"><span className={`text-xs font-medium ${stCls(a.status)}`}>{stTxt(a.status)}</span><div className="flex items-center gap-1">
                            {a.status === 'active' && <button onClick={() => { update(a.id, 'acknowledged'); toast.info('已确认'); }} className="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /></button>}
                            {a.status !== 'resolved' && <button onClick={() => { update(a.id, 'resolved'); toast.success('已处置'); }} className="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors cursor-pointer"><XCircle className="w-3.5 h-3.5" /></button>}
                            {a.status !== 'resolved' && <button className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"><Send className="w-3.5 h-3.5" /></button>}
                        </div></div>
                    </div>
                </div>
            ))}</div>}

            {activeTab === 'rules' && <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">{['编号', '规则名称', '触发条件', '等级', '处置动作', '状态'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{rules.map(r => (
                <tr key={r.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                    <td className="px-4 py-2.5 text-xs font-mono text-primary">{r.id}</td>
                    <td className="px-4 py-2.5 text-xs font-medium text-default">{r.name}</td>
                    <td className="px-4 py-2.5 text-xs text-dim font-mono">{r.condition}</td>
                    <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${lvlCls(r.level)}`}>{lvlTxt(r.level)}</span></td>
                    <td className="px-4 py-2.5 text-xs text-dim">{r.action}</td>
                    <td className="px-4 py-2.5"><button onClick={() => setRules(p => p.map(x => x.id === r.id ? { ...x, enabled: !x.enabled } : x))} className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${r.enabled ? 'bg-success/15 text-success hover:bg-success/25' : 'bg-surface text-dim hover:bg-hover-themed'}`}>{r.enabled ? '已启用' : '已停用'}</button></td>
                </tr>
            ))}</tbody></table></div>}
        </div>
    );
}
