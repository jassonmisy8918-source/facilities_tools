import { useState } from 'react';
import { Brain, Star, Plus } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

const tabs = [{ key: 'orders', label: '运维工单' }, { key: 'predict', label: '预测性维护' }, { key: 'knowledge', label: '知识库' }];

const initOrders = [
    { id: 'WO-0315', title: '#2水泵过载维修', station: '雨花路泵站', assignee: '张工', type: '故障维修', deadline: '2024-03-15 20:00', status: 'pending', priority: 'urgent', approval: 'approved', satisfaction: 0 },
    { id: 'WO-0314', title: '进水格栅清理', station: '东湖泵站', assignee: '李工', type: '日常维护', deadline: '2024-03-15 18:00', status: 'processing', priority: 'normal', approval: 'approved', satisfaction: 0 },
    { id: 'WO-0312', title: '进水突增流量调查', station: '东湖泵站', assignee: '王工', type: '应急处置', deadline: '2024-03-13 12:00', status: 'completed', priority: 'high', approval: 'approved', satisfaction: 5 },
    { id: 'WO-0310', title: '备用电源维修', station: '民生路泵站', assignee: '赵工', type: '故障维修', deadline: '2024-03-11 18:00', status: 'completed', priority: 'high', approval: 'approved', satisfaction: 4 },
    { id: 'WO-0316', title: '1号泵定期保养', station: '和平路泵站', assignee: '待分配', type: '定期保养', deadline: '2024-03-18 18:00', status: 'draft', priority: 'normal', approval: 'pending', satisfaction: 0 },
];

const predictions = [
    { id: 'PD-001', equipment: '1号离心泵', station: '雨花路泵站', indicator: '轴承剩余寿命', currentValue: '约3200h', threshold: '2000h', risk: '低', suggestion: '计划在6月份进行轴承更换', confidence: 85 },
    { id: 'PD-002', equipment: '2号潜污泵', station: '东湖泵站', indicator: '绝缘电阻下降趋势', currentValue: '45MΩ (下降中)', threshold: '20MΩ', risk: '中', suggestion: '建议4月份安排绝缘处理', confidence: 72 },
    { id: 'PD-003', equipment: '配电柜开关', station: '和平路泵站', indicator: '触点磨损', currentValue: '操作8500次', threshold: '10000次', risk: '中', suggestion: '建议Q2更换接触器主触头', confidence: 80 },
];

const knowledgeBase = [
    { id: 'KB-001', title: '水泵过载故障排查指南', category: '故障诊断', views: 156, rating: 4.8, updateDate: '2024-02-20' },
    { id: 'KB-002', title: '暴雨期间泵站应急调度SOP', category: '应急处置', views: 234, rating: 4.9, updateDate: '2024-01-15' },
    { id: 'KB-003', title: 'SCADA系统通讯故障处理', category: '系统维护', views: 89, rating: 4.5, updateDate: '2024-03-01' },
    { id: 'KB-004', title: '变频器参数调整规范', category: '操作规范', views: 120, rating: 4.6, updateDate: '2024-02-10' },
    { id: 'KB-005', title: '阀门维护保养标准流程', category: '操作规范', views: 98, rating: 4.3, updateDate: '2024-01-28' },
];

function sCls(s: string) { return s === 'completed' ? 'bg-success/15 text-success' : s === 'processing' ? 'bg-info/15 text-info' : s === 'pending' ? 'bg-warning/15 text-warning' : 'bg-surface text-dim'; }
function sTxt(s: string) { return s === 'completed' ? '已完成' : s === 'processing' ? '进行中' : s === 'pending' ? '待分配' : '草稿'; }
function pCls(p: string) { return p === 'urgent' ? 'text-danger' : p === 'high' ? 'text-warning' : 'text-info'; }
function pTxt(p: string) { return p === 'urgent' ? '紧急' : p === 'high' ? '高' : '一般'; }
function rCls(r: string) { return r === '高' ? 'bg-danger/15 text-danger' : r === '中' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'; }
function nextAction(s: string) { return s === 'draft' ? '提交审批' : s === 'pending' ? '开始处理' : s === 'processing' ? '完成' : ''; }

export default function OperationView() {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState(initOrders);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', station: '雨花路泵站', type: '日常维护', priority: 'normal' });

    const doCreate = () => {
        if (!form.title) { toast.warning('请输入工单标题'); return; }
        setOrders(p => [{ id: `WO-${Math.floor(Math.random() * 9000) + 1000}`, title: form.title, station: form.station, assignee: '待分配', type: form.type, deadline: '待设定', status: 'draft', priority: form.priority, approval: 'pending', satisfaction: 0 }, ...p]);
        setShowModal(false); toast.success('工单创建成功');
    };

    const advance = (id: string) => {
        const flow: Record<string, string> = { draft: 'pending', pending: 'processing', processing: 'completed' };
        setOrders(p => p.map(o => { if (o.id !== id) return o; const next = flow[o.status]; return next ? { ...o, status: next, approval: next === 'pending' ? 'approved' : o.approval } : o; }));
        toast.success('工单状态已更新');
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">{tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{t.label}</button>)}</div>
                {activeTab === 'orders' && <button onClick={() => { setForm({ title: '', station: '雨花路泵站', type: '日常维护', priority: 'normal' }); setShowModal(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> 新建工单</button>}
            </div>

            {activeTab === 'orders' && <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">{['工单号', '标题', '泵站', '负责人', '类型', '优先级', '审批', '截止时间', '状态', '满意度'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{orders.map(o => (
                <tr key={o.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                    <td className="px-4 py-2.5 text-xs font-mono text-primary">{o.id}</td><td className="px-4 py-2.5 text-xs font-medium text-default">{o.title}</td><td className="px-4 py-2.5 text-xs text-dim">{o.station}</td><td className="px-4 py-2.5 text-xs text-dim">{o.assignee}</td><td className="px-4 py-2.5 text-xs text-dim">{o.type}</td>
                    <td className={`px-4 py-2.5 text-xs font-medium ${pCls(o.priority)}`}>{pTxt(o.priority)}</td>
                    <td className={`px-4 py-2.5 text-xs font-medium ${o.approval === 'approved' ? 'text-success' : 'text-warning'}`}>{o.approval === 'approved' ? '已审批' : '待审批'}</td>
                    <td className="px-4 py-2.5 text-xs text-dim">{o.deadline}</td>
                    <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${sCls(o.status)}`}>{sTxt(o.status)}</span>{o.status !== 'completed' && <button onClick={() => advance(o.id)} className="ml-1 text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors">{nextAction(o.status)}</button>}</td>
                    <td className="px-4 py-2.5 text-xs">{o.satisfaction > 0 ? <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-3 h-3 ${i <= o.satisfaction ? 'text-warning fill-warning' : 'text-surface'}`} />)}</div> : <span className="text-dim">—</span>}</td>
                </tr>
            ))}</tbody></table></div>}

            {activeTab === 'predict' && <div className="space-y-3">{predictions.map(pd => (
                <div key={pd.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-start justify-between mb-3"><div><h4 className="text-sm font-semibold text-default flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> {pd.equipment} — {pd.indicator}</h4><p className="text-xs text-dim mt-0.5">{pd.station}</p></div><span className={`text-[10px] px-2 py-0.5 rounded-md ${rCls(pd.risk)}`}>风险: {pd.risk}</span></div>
                    <div className="grid grid-cols-3 gap-4 text-xs mb-3"><div><span className="text-dim">当前值:</span> <span className="text-default font-medium ml-1">{pd.currentValue}</span></div><div><span className="text-dim">阈值:</span> <span className="text-default font-medium ml-1">{pd.threshold}</span></div><div><span className="text-dim">预测置信度:</span> <span className="text-primary font-bold ml-1">{pd.confidence}%</span></div></div>
                    <div className="p-2 bg-surface rounded-lg text-xs text-dim"><span className="text-default font-medium">建议: </span>{pd.suggestion}</div>
                </div>
            ))}</div>}

            {activeTab === 'knowledge' && <div className="grid grid-cols-1 gap-3">{knowledgeBase.map(kb => (
                <div key={kb.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between"><div><h4 className="text-sm font-semibold text-default">{kb.title}</h4><p className="text-xs text-dim mt-1"><span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] mr-2">{kb.category}</span>浏览 {kb.views} · 更新于 {kb.updateDate}</p></div><div className="flex items-center gap-1 text-xs text-warning"><Star className="w-3 h-3 fill-warning" /> {kb.rating}</div></div>
                </div>
            ))}</div>}

            <ModalDialog show={showModal} title="新建运维工单" onClose={() => setShowModal(false)} onConfirm={doCreate}>
                <div className="space-y-3">
                    <div><label className="text-xs text-dim mb-1 block">工单标题 <span className="text-danger">*</span></label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="请输入工单标题" /></div>
                    <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-dim mb-1 block">泵站</label><select value={form.station} onChange={e => setForm(f => ({ ...f, station: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option>雨花路泵站</option><option>东湖泵站</option><option>和平路泵站</option><option>民生路泵站</option></select></div><div><label className="text-xs text-dim mb-1 block">类型</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option>日常维护</option><option>故障维修</option><option>定期保养</option><option>应急处置</option></select></div></div>
                    <div><label className="text-xs text-dim mb-1 block">优先级</label><select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option value="urgent">紧急</option><option value="high">高</option><option value="normal">一般</option></select></div>
                </div>
            </ModalDialog>
        </div>
    );
}
