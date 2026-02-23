import { useState, useMemo } from 'react';
import { Search, Clock, User, MapPin } from 'lucide-react';

const statusTabs = [{ key: 'all', label: '全部', count: 24 }, { key: 'pending', label: '待处理', count: 5 }, { key: 'processing', label: '进行中', count: 8 }, { key: 'completed', label: '已完成', count: 11 }];

const workOrders = [
    { id: 'WO-2024001', title: '雨花路管段日常巡查', type: '日常巡查', assignee: '张伟', location: '雨花路 A01-A15段', status: 'processing', priority: 'normal', deadline: '2024-03-15 18:00', progress: 60 },
    { id: 'WO-2024002', title: '民生路管道渗漏处理', type: '紧急维修', assignee: '李明', location: '民生路 DN400 检查井#23', status: 'pending', priority: 'high', deadline: '2024-03-15 14:00', progress: 0 },
    { id: 'WO-2024003', title: '新华街排水口清理', type: '养护作业', assignee: '王强', location: '新华街排放口 OUT-018', status: 'processing', priority: 'normal', deadline: '2024-03-16 18:00', progress: 35 },
    { id: 'WO-2024004', title: '和平路检查井盖更换', type: '维修作业', assignee: '赵刚', location: '和平路 检查井#56', status: 'completed', priority: 'normal', deadline: '2024-03-14 18:00', progress: 100 },
    { id: 'WO-2024005', title: '东湖泵站周边管道巡检', type: '日常巡查', assignee: '陈静', location: '东湖泵站上游 500m范围', status: 'completed', priority: 'low', deadline: '2024-03-12 17:00', progress: 100 },
    { id: 'WO-2024006', title: '建设大道雨水口疏通', type: '养护作业', assignee: '周磊', location: '建设大道 雨水口 SW-032~SW-040', status: 'pending', priority: 'normal', deadline: '2024-03-17 18:00', progress: 0 },
    { id: 'WO-2024007', title: '丰台路管道CCTV检测', type: '检测作业', assignee: '吴涛', location: '丰台路 DN600 P03-P08段', status: 'processing', priority: 'normal', deadline: '2024-03-18 18:00', progress: 45 },
    { id: 'WO-2024008', title: '侯家塘区污水冒溢紧急处理', type: '紧急维修', assignee: '张伟', location: '侯家塘区 检查井#89', status: 'pending', priority: 'urgent', deadline: '2024-03-15 15:00', progress: 0 },
];

function getStatusClass(s: string) { return s === 'completed' ? 'bg-success/15 text-success' : s === 'processing' ? 'bg-info/15 text-info' : 'bg-warning/15 text-warning'; }
function getStatusText(s: string) { return s === 'completed' ? '已完成' : s === 'processing' ? '进行中' : '待处理'; }
function getPriorityClass(p: string) { return p === 'urgent' ? 'bg-danger/15 text-danger' : p === 'high' ? 'bg-warning/15 text-warning' : p === 'low' ? 'bg-success/15 text-success' : 'bg-info/15 text-info'; }
function getPriorityText(p: string) { return p === 'urgent' ? '紧急' : p === 'high' ? '高' : p === 'low' ? '低' : '普通'; }

export default function WorkOrderView() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const filteredOrders = useMemo(() => {
        let list = workOrders;
        if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
        if (searchQuery) { const q = searchQuery.toLowerCase(); list = list.filter(o => o.title.includes(q) || o.id.toLowerCase().includes(q)); }
        return list;
    }, [statusFilter, searchQuery]);

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
                    {statusTabs.map(tab => (<button key={tab.key} onClick={() => setStatusFilter(tab.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${statusFilter === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{tab.label} <span className="ml-1 opacity-70">({tab.count})</span></button>))}
                </div>
                <div className="relative max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="搜索工单..." className="w-full pl-9 pr-4 py-2 bg-input border border-themed rounded-lg text-sm text-default placeholder-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow group cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                            <div><div className="flex items-center gap-2 mb-1"><span className="text-xs text-primary font-mono">{order.id}</span><span className={`text-[10px] px-1.5 py-0.5 rounded ${getPriorityClass(order.priority)}`}>{getPriorityText(order.priority)}</span></div><h4 className="text-sm font-medium text-default">{order.title}</h4></div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md ${getStatusClass(order.status)}`}>{getStatusText(order.status)}</span>
                        </div>
                        <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-xs text-dim"><User className="w-3 h-3" /><span>{order.assignee}</span></div>
                            <div className="flex items-center gap-2 text-xs text-dim"><MapPin className="w-3 h-3" /><span className="truncate">{order.location}</span></div>
                            <div className="flex items-center gap-2 text-xs text-dim"><Clock className="w-3 h-3" /><span>截止: {order.deadline}</span></div>
                        </div>
                        {order.status !== 'pending' && <div className="flex items-center gap-2"><div className="flex-1 bg-surface rounded-full h-1.5"><div className={`h-1.5 rounded-full transition-all ${order.progress === 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${order.progress}%` }}></div></div><span className="text-[10px] text-muted-themed shrink-0">{order.progress}%</span></div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
