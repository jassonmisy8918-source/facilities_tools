import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

const typeOptions = [{ key: 'all', label: '全部' }, { key: 'industrial', label: '工业' }, { key: 'commercial', label: '商业' }, { key: 'catering', label: '餐饮' }, { key: 'medical', label: '医疗' }, { key: 'residential', label: '居民' }];

const initUsers = [
    { id: 'DU-001', name: '雨花化工有限公司', type: 'industrial', address: '雨花路288号', contact: '王经理', permitNo: 'PS-2024-001', waterVolume: 850, pollutant: 'COD,SS,NH3-N', status: 'normal', expireDate: '2025-06-30' },
    { id: 'DU-002', name: '翠湖商业广场', type: 'commercial', address: '新华街58号', contact: '李总', permitNo: 'PS-2024-002', waterVolume: 320, pollutant: 'COD,BOD', status: 'normal', expireDate: '2025-08-15' },
    { id: 'DU-003', name: '美味轩酒楼', type: 'catering', address: '民生路120号', contact: '陈店长', permitNo: 'PS-2024-003', waterVolume: 45, pollutant: 'COD,动植物油', status: 'warning', expireDate: '2024-04-30' },
    { id: 'DU-004', name: '和平区人民医院', type: 'medical', address: '和平路800号', contact: '赵主任', permitNo: 'PS-2024-004', waterVolume: 280, pollutant: 'COD,NH3-N,粪大肠', status: 'normal', expireDate: '2025-12-31' },
    { id: 'DU-005', name: '东湖花园小区', type: 'residential', address: '东湖路56号', contact: '物业刘', permitNo: 'PS-2024-005', waterVolume: 2200, pollutant: 'COD,SS', status: 'normal', expireDate: '2025-10-15' },
    { id: 'DU-006', name: '建设机械厂', type: 'industrial', address: '建设大道350号', contact: '孙厂长', permitNo: 'PS-2023-006', waterVolume: 1500, pollutant: 'COD,重金属', status: 'overdue', expireDate: '2024-01-31' },
];

function tyTxt(t: string) { const m: Record<string, string> = { industrial: '工业', commercial: '商业', catering: '餐饮', medical: '医疗', residential: '居民' }; return m[t] ?? t; }
function tyCls(t: string) { const m: Record<string, string> = { industrial: 'bg-danger/15 text-danger', commercial: 'bg-info/15 text-info', catering: 'bg-warning/15 text-warning', medical: 'bg-primary/15 text-primary', residential: 'bg-success/15 text-success' }; return m[t] ?? ''; }
function stCls(s: string) { return s === 'normal' ? 'bg-success/15 text-success' : s === 'warning' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'; }
function stTxt(s: string) { return s === 'normal' ? '正常' : s === 'warning' ? '即将过期' : '已过期'; }

export default function DrainageUsersView() {
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState(initUsers);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'industrial', address: '', contact: '' });

    const filtered = useMemo(() => users.filter(u => {
        if (typeFilter !== 'all' && u.type !== typeFilter) return false;
        if (searchText && !u.name.includes(searchText) && !u.address.includes(searchText)) return false;
        return true;
    }), [users, typeFilter, searchText]);

    const doAdd = () => {
        if (!form.name) { toast.warning('请输入排水户名称'); return; }
        setUsers(p => [{ id: `DU-${String(p.length + 1).padStart(3, '0')}`, name: form.name, type: form.type, address: form.address, contact: form.contact, permitNo: '待申请', waterVolume: 0, pollutant: '待检测', status: 'normal', expireDate: '待设定' }, ...p]);
        setShowAdd(false); toast.success('排水户新增成功');
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">{typeOptions.map(o => <button key={o.key} onClick={() => setTypeFilter(o.key)} className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${typeFilter === o.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{o.label}</button>)}</div>
                    <div className="flex items-center gap-1 bg-input border border-themed rounded-md px-2 py-1.5"><Search className="w-3.5 h-3.5 text-dim" /><input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="搜索名称或地址..." className="bg-transparent text-xs text-default placeholder:text-muted-themed focus:outline-none w-40" /></div>
                </div>
                <button onClick={() => { setForm({ name: '', type: 'industrial', address: '', contact: '' }); setShowAdd(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> 新增排水户</button>
            </div>

            <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">{['编号', '名称', '类型', '地址', '许可证号', '日排量(m³)', '主要污染物', '有效期', '状态'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{filtered.map(u => <tr key={u.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors"><td className="px-4 py-2.5 text-xs font-mono text-primary">{u.id}</td><td className="px-4 py-2.5 text-xs font-medium text-default">{u.name}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${tyCls(u.type)}`}>{tyTxt(u.type)}</span></td><td className="px-4 py-2.5 text-xs text-dim">{u.address}</td><td className="px-4 py-2.5 text-xs text-dim font-mono">{u.permitNo}</td><td className="px-4 py-2.5 text-xs text-default font-medium">{u.waterVolume.toLocaleString()}</td><td className="px-4 py-2.5 text-xs text-dim">{u.pollutant}</td><td className="px-4 py-2.5 text-xs text-dim">{u.expireDate}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${stCls(u.status)}`}>{stTxt(u.status)}</span></td></tr>)}</tbody></table></div>

            <ModalDialog show={showAdd} title="新增排水户" onClose={() => setShowAdd(false)} onConfirm={doAdd}>
                <div className="space-y-3">
                    <div><label className="text-xs text-dim mb-1 block">排水户名称 <span className="text-danger">*</span></label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="请输入名称" /></div>
                    <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-dim mb-1 block">类型</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option value="industrial">工业</option><option value="commercial">商业</option><option value="catering">餐饮</option><option value="medical">医疗</option><option value="residential">居民</option></select></div><div><label className="text-xs text-dim mb-1 block">联系人</label><input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" /></div></div>
                    <div><label className="text-xs text-dim mb-1 block">地址</label><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="请输入地址" /></div>
                </div>
            </ModalDialog>
        </div>
    );
}
