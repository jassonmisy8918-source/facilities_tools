import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Send } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

interface Alarm { id: number; level: string; title: string; location: string; time: string; value: string; status: string }

const levelOptions = [
    { key: 'all', label: '全部' }, { key: 'critical', label: '紧急' },
    { key: 'warning', label: '严重' }, { key: 'info', label: '一般' }, { key: 'notice', label: '提示' },
];
const statusOptions = [
    { key: 'all', label: '全部' }, { key: 'active', label: '报警中' },
    { key: 'acknowledged', label: '已确认' }, { key: 'resolved', label: '已消警' },
];

const initialAlarms: Alarm[] = [
    { id: 1, level: 'critical', title: '建设大道DN300水位超限', location: '建设大道DN300 监测点#06', time: '2024-03-15 14:23', value: '2.35m (阈值: 2.0m)', status: 'active' },
    { id: 2, level: 'warning', title: '侯家塘区进水口COD超标', location: '侯家塘区进水口 WQ-302', time: '2024-03-15 13:45', value: '45mg/L (阈值: 40mg/L)', status: 'active' },
    { id: 3, level: 'warning', title: '民生路DN400水位预警', location: '民生路DN400 监测点#02', time: '2024-03-15 12:30', value: '1.85m (阈值: 1.8m)', status: 'acknowledged' },
    { id: 4, level: 'info', title: '丰台区降雨量增加', location: '丰台区雨量站 RG-051', time: '2024-03-15 11:20', value: '8.5mm/h', status: 'acknowledged' },
    { id: 5, level: 'notice', title: '雨花路流量波动提醒', location: '雨花路DN600 FM-201', time: '2024-03-15 10:15', value: '波动幅度: ±15%', status: 'resolved' },
    { id: 6, level: 'critical', title: '和平路泵站进水位超高', location: '和平路泵站 前池', time: '2024-03-15 09:30', value: '4.1m (阈值: 3.8m)', status: 'active' },
];

function getLevelClass(l: string) { return l === 'critical' ? 'bg-danger text-white' : l === 'warning' ? 'bg-warning text-white' : l === 'info' ? 'bg-info/20 text-info' : 'bg-surface text-dim'; }
function getLevelText(l: string) { return l === 'critical' ? '紧急' : l === 'warning' ? '严重' : l === 'info' ? '一般' : '提示'; }
function getStatusClass(s: string) { return s === 'active' ? 'text-danger' : s === 'acknowledged' ? 'text-warning' : 'text-success'; }
function getStatusText(s: string) { return s === 'active' ? '报警中' : s === 'acknowledged' ? '已确认' : '已消警'; }

export default function AlarmView() {
    const [alarms, setAlarms] = useState(initialAlarms);
    const [levelFilter, setLevelFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const alarmStats = useMemo(() => [
        { label: '今日预警', value: alarms.length, color: '#FF4757' },
        { label: '未确认', value: alarms.filter(a => a.status === 'active').length, color: '#FFB020' },
        { label: '已确认', value: alarms.filter(a => a.status === 'acknowledged').length, color: '#3B82F6' },
        { label: '已消警', value: alarms.filter(a => a.status === 'resolved').length, color: '#00D4AA' },
    ], [alarms]);

    const filteredAlarms = useMemo(() => alarms.filter(a => {
        if (levelFilter !== 'all' && a.level !== levelFilter) return false;
        if (statusFilter !== 'all' && a.status !== statusFilter) return false;
        return true;
    }), [alarms, levelFilter, statusFilter]);

    const updateAlarmStatus = (id: number, status: string) => {
        setAlarms(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };
    const confirmAlarm = (alarm: Alarm) => { updateAlarmStatus(alarm.id, 'acknowledged'); toast.info(`预警 "${alarm.title}" 已确认`); };
    const resolveAlarm = (alarm: Alarm) => { updateAlarmStatus(alarm.id, 'resolved'); toast.success(`预警 "${alarm.title}" 已消警`); };

    // 派单弹窗
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [dispatchAlarm, setDispatchAlarm] = useState<Alarm | null>(null);
    const [dispatchForm, setDispatchForm] = useState({ assignee: '', priority: '高', remark: '' });
    const openDispatch = (alarm: Alarm) => { setDispatchAlarm(alarm); setDispatchForm({ assignee: '', priority: '高', remark: '' }); setShowDispatchModal(true); };
    const doDispatch = () => {
        if (!dispatchForm.assignee) { toast.warning('请选择派单人员'); return; }
        setShowDispatchModal(false);
        toast.success(`已派单给 ${dispatchForm.assignee}`);
    };

    return (
        <div className="space-y-4 p-4">
            {/* 统计概览 */}
            <div className="grid grid-cols-4 gap-3">
                {alarmStats.map(stat => (
                    <div key={stat.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed text-center">
                        <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-xs text-dim mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* 筛选栏 */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-dim">预警等级:</span>
                    <div className="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                        {levelOptions.map(opt => (
                            <button key={opt.key} onClick={() => setLevelFilter(opt.key)}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${levelFilter === opt.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{opt.label}</button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-dim">状态:</span>
                    <div className="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
                        {statusOptions.map(st => (
                            <button key={st.key} onClick={() => setStatusFilter(st.key)}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${statusFilter === st.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{st.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 预警列表 */}
            <div className="space-y-2">
                {filteredAlarms.map(alarm => (
                    <div key={alarm.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded-md mt-0.5 ${getLevelClass(alarm.level)}`}>{getLevelText(alarm.level)}</span>
                                <div>
                                    <h4 className="text-sm font-semibold text-default">{alarm.title}</h4>
                                    <p className="text-xs text-dim mt-1">{alarm.location}</p>
                                    <p className="text-xs text-dim mt-0.5">{alarm.time} · {alarm.value}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-xs font-medium ${getStatusClass(alarm.status)}`}>{getStatusText(alarm.status)}</span>
                                <div className="flex items-center gap-1">
                                    {alarm.status === 'active' && <button onClick={() => confirmAlarm(alarm)} title="确认" className="p-1.5 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /></button>}
                                    {alarm.status !== 'resolved' && <button onClick={() => resolveAlarm(alarm)} title="消警" className="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors cursor-pointer"><XCircle className="w-3.5 h-3.5" /></button>}
                                    <button onClick={() => openDispatch(alarm)} title="派单" className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredAlarms.length === 0 && <div className="text-center py-12 text-dim text-sm">暂无匹配的预警信息</div>}
            </div>

            {/* 派单弹窗 */}
            <ModalDialog show={showDispatchModal} title="派发工单" onClose={() => setShowDispatchModal(false)} onConfirm={doDispatch}>
                <div className="space-y-3">
                    {dispatchAlarm && <div className="p-3 bg-surface rounded-lg text-xs"><p className="text-default font-medium">{dispatchAlarm.title}</p><p className="text-dim mt-0.5">{dispatchAlarm.location}</p></div>}
                    <div>
                        <label className="text-xs text-dim mb-1 block">派单人员 <span className="text-danger">*</span></label>
                        <select value={dispatchForm.assignee} onChange={e => setDispatchForm(f => ({ ...f, assignee: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                            <option value="">请选择</option><option>张伟</option><option>李明</option><option>王强</option><option>赵刚</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-dim mb-1 block">优先级</label>
                        <select value={dispatchForm.priority} onChange={e => setDispatchForm(f => ({ ...f, priority: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary">
                            <option>高</option><option>中</option><option>低</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-dim mb-1 block">备注</label>
                        <textarea value={dispatchForm.remark} onChange={e => setDispatchForm(f => ({ ...f, remark: e.target.value }))} rows={2} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary resize-none" placeholder="可选备注" />
                    </div>
                </div>
            </ModalDialog>
        </div>
    );
}
