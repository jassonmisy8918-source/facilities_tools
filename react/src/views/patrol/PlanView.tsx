import { useState, useMemo } from 'react';
import { Plus, MapPin, Users, Clock, Route, Trash2, Edit, Search } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

const planTabs = [{ key: 'plan', label: '巡查计划' }, { key: 'route', label: '巡查路线' }, { key: 'schedule', label: '人员排班' }];

const initialPlans = [
    { id: 1, name: '朝阳区日常巡查计划', frequency: '每日', assignee: '张伟、李明', area: '朝阳区全域', points: 45, nextRun: '2024-03-16 08:00', status: 'active', approval: 'approved' },
    { id: 2, name: '海淀区管网巡检', frequency: '每周', assignee: '王强', area: '海淀区主干管', points: 28, nextRun: '2024-03-18 09:00', status: 'active', approval: 'approved' },
    { id: 3, name: '泵站周边专项巡查', frequency: '每周', assignee: '赵刚、陈静', area: '全市泵站周边500m', points: 18, nextRun: '2024-03-19 08:30', status: 'active', approval: 'approved' },
    { id: 4, name: '排放口季度巡检', frequency: '每季', assignee: '周磊', area: '全市排放口', points: 89, nextRun: '2024-04-01 09:00', status: 'paused', approval: 'approved' },
    { id: 5, name: '雨季专项巡查', frequency: '汛期每日', assignee: '全员', area: '低洼易涝区', points: 36, nextRun: '2024-06-01 07:00', status: 'pending', approval: 'reviewing' },
];

const routes = [
    { id: 1, name: '朝阳路-民生路主线', length: '12.5km', points: 18, frequency: '每日', team: '一组', status: 'active' },
    { id: 2, name: '泵站环线巡检路线', length: '25.3km', points: 12, frequency: '每周', team: '二组', status: 'active' },
    { id: 3, name: '排放口巡查路线', length: '35.8km', points: 32, frequency: '每月', team: '三组', status: 'active' },
    { id: 4, name: '易涝点专项路线', length: '8.2km', points: 15, frequency: '汛期每日', team: '全员', status: 'pending' },
];

const schedules = [
    { id: 1, name: '张伟', team: '巡查一组', role: '组长', thisWeek: ['日常巡查', '日常巡查', '日常巡查', '日常巡查', '日常巡查', '休息', '休息'] },
    { id: 2, name: '李明', team: '巡查一组', role: '组员', thisWeek: ['日常巡查', '日常巡查', '日常巡查', '日常巡查', '休息', '日常巡查', '休息'] },
    { id: 3, name: '王强', team: '巡查二组', role: '组长', thisWeek: ['管网巡检', '休息', '管网巡检', '休息', '管网巡检', '休息', '休息'] },
    { id: 4, name: '赵刚', team: '巡查三组', role: '组长', thisWeek: ['泵站巡查', '休息', '泵站巡查', '休息', '泵站巡查', '休息', '休息'] },
    { id: 5, name: '周磊', team: '检测组', role: '组长', thisWeek: ['排放口巡检', '排放口巡检', '休息', '排放口巡检', '排放口巡检', '休息', '休息'] },
];
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function getStatusClass(s: string) { return s === 'active' ? 'bg-success/15 text-success' : s === 'paused' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'; }
function getStatusText(s: string) { return s === 'active' ? '执行中' : s === 'paused' ? '已暂停' : '待激活'; }
function getApprovalClass(a: string) { return a === 'approved' ? 'text-success' : a === 'reviewing' ? 'text-warning' : 'text-dim'; }
function getApprovalText(a: string) { return a === 'approved' ? '已审批' : a === 'reviewing' ? '审核中' : '待提交'; }

export default function PlanView() {
    const [activeTab, setActiveTab] = useState('plan');
    const [searchText, setSearchText] = useState('');
    const [plans, setPlans] = useState(initialPlans);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', frequency: '每日', assignee: '', area: '', points: 0 });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(0);

    const filteredPlans = useMemo(() => {
        if (!searchText) return plans;
        return plans.filter(p => p.name.includes(searchText) || p.assignee.includes(searchText) || p.area.includes(searchText));
    }, [plans, searchText]);

    const openCreatePlan = () => { setIsEdit(false); setEditForm({ name: '', frequency: '每日', assignee: '', area: '', points: 0 }); setShowPlanModal(true); };
    const savePlan = () => {
        if (!editForm.name) { toast.warning('请输入计划名称'); return; }
        if (isEdit) { toast.success('计划更新成功'); } else {
            setPlans(prev => [{ id: Date.now(), ...editForm, nextRun: '待设定', status: 'pending', approval: 'draft' }, ...prev]);
            toast.success('计划创建成功');
        }
        setShowPlanModal(false);
    };
    const confirmDelete = (id: number) => { setDeletingId(id); setShowDeleteModal(true); };
    const doDelete = () => { setPlans(prev => prev.filter(p => p.id !== deletingId)); setShowDeleteModal(false); toast.success('计划已删除'); };
    const toggleStatus = (plan: typeof initialPlans[0]) => {
        setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p));
        toast.info(`计划已${plan.status === 'active' ? '暂停' : '启用'}`);
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
                        {planTabs.map(tab => (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{tab.label}</button>))}
                    </div>
                    {activeTab === 'plan' && <div className="flex items-center gap-1 bg-input border border-themed rounded-md px-2 py-1.5"><Search className="w-3.5 h-3.5 text-dim" /><input value={searchText} onChange={e => setSearchText(e.target.value)} type="text" placeholder="搜索计划名称/负责人/区域..." className="bg-transparent text-xs text-default placeholder:text-muted-themed focus:outline-none w-48" /></div>}
                </div>
                {activeTab === 'plan' && <button onClick={openCreatePlan} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> 新建计划</button>}
            </div>

            {activeTab === 'plan' && (
                <div className="grid grid-cols-1 gap-3">
                    {filteredPlans.map(plan => (
                        <div key={plan.id} className="bg-card border border-themed rounded-xl p-5 shadow-themed hover:shadow-themed-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div><h4 className="text-sm font-semibold text-default">{plan.name}</h4><p className="text-xs text-dim mt-0.5">频率: {plan.frequency} · {plan.points} 个巡查点</p></div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleStatus(plan)} className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${getStatusClass(plan.status)}`}>{getStatusText(plan.status)}</button>
                                    <span className={`text-[10px] font-medium ${getApprovalClass(plan.approval)}`}>{getApprovalText(plan.approval)}</span>
                                    <button onClick={() => { setIsEdit(true); setEditForm({ name: plan.name, frequency: plan.frequency, assignee: plan.assignee, area: plan.area, points: plan.points }); setShowPlanModal(true); }} className="p-1 text-dim hover:text-primary rounded transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => confirmDelete(plan.id)} className="p-1 text-dim hover:text-danger rounded transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-dim">
                                <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {plan.assignee}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {plan.area}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 下次执行: {plan.nextRun}</span>
                            </div>
                        </div>
                    ))}
                    {filteredPlans.length === 0 && <div className="text-center py-12 text-dim text-sm">暂无匹配的巡查计划</div>}
                </div>
            )}

            {activeTab === 'route' && (
                <div className="grid grid-cols-2 gap-3">
                    {routes.map(route => (
                        <div key={route.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow">
                            <div className="flex items-start justify-between mb-2"><div className="flex items-center gap-2"><Route className="w-4 h-4 text-primary" /><h4 className="text-sm font-semibold text-default">{route.name}</h4></div><span className={`text-[10px] px-2 py-0.5 rounded-md ${getStatusClass(route.status)}`}>{getStatusText(route.status)}</span></div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-dim mt-3">
                                <div>路线长度: <span className="text-default font-medium">{route.length}</span></div>
                                <div>巡查点: <span className="text-default font-medium">{route.points} 个</span></div>
                                <div>频率: <span className="text-default font-medium">{route.frequency}</span></div>
                                <div>负责组: <span className="text-default font-medium">{route.team}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <table className="w-full text-sm"><thead><tr className="border-b border-themed">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">人员</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">班组</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">职务</th>
                        {weekDays.map(d => <th key={d} className="text-center px-3 py-3 text-xs font-semibold text-dim bg-surface">{d}</th>)}
                    </tr></thead><tbody>
                            {schedules.map(s => (<tr key={s.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                                <td className="px-4 py-2.5 text-xs font-medium text-default">{s.name}</td>
                                <td className="px-4 py-2.5 text-xs text-dim">{s.team}</td>
                                <td className="px-4 py-2.5 text-xs text-dim">{s.role}</td>
                                {s.thisWeek.map((task, idx) => <td key={idx} className="px-3 py-2.5 text-center"><span className={`text-[10px] px-1.5 py-0.5 rounded ${task === '休息' ? 'bg-surface text-dim' : 'bg-primary/10 text-primary'}`}>{task}</span></td>)}
                            </tr>))}
                        </tbody></table>
                </div>
            )}

            <ModalDialog show={showPlanModal} title={isEdit ? '编辑巡查计划' : '新建巡查计划'} onClose={() => setShowPlanModal(false)} onConfirm={savePlan}>
                <div className="space-y-3">
                    <div><label className="text-xs text-dim mb-1 block">计划名称 <span className="text-danger">*</span></label><input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} type="text" className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="请输入计划名称" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-dim mb-1 block">执行频率</label><select value={editForm.frequency} onChange={e => setEditForm(f => ({ ...f, frequency: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option>每日</option><option>每周</option><option>每月</option><option>每季</option><option>汛期每日</option></select></div>
                        <div><label className="text-xs text-dim mb-1 block">巡查点数</label><input value={editForm.points} onChange={e => setEditForm(f => ({ ...f, points: +e.target.value }))} type="number" className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" /></div>
                    </div>
                    <div><label className="text-xs text-dim mb-1 block">负责人</label><input value={editForm.assignee} onChange={e => setEditForm(f => ({ ...f, assignee: e.target.value }))} type="text" className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="请输入负责人" /></div>
                    <div><label className="text-xs text-dim mb-1 block">巡查区域</label><input value={editForm.area} onChange={e => setEditForm(f => ({ ...f, area: e.target.value }))} type="text" className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="请输入巡查区域" /></div>
                </div>
            </ModalDialog>
            <ModalDialog show={showDeleteModal} title="确认删除" onClose={() => setShowDeleteModal(false)} onConfirm={doDelete}><p className="text-xs text-dim">确定要删除该巡查计划吗？此操作不可撤销。</p></ModalDialog>
        </div>
    );
}
