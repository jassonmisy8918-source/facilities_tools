import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

const tabs = [{ key: 'list', label: '设备台账' }, { key: 'inspection', label: '设备巡检' }, { key: 'maintenance', label: '设备保养' }, { key: 'spare', label: '备品备件' }];

const equipment = [
    { id: 'EQ-001', name: '1号离心泵', station: '朝阳路泵站', model: 'WQ200-15-15', power: '15kW', runtime: 12450, mtbf: 2100, availability: 98.5, lastMaintenance: '2024-02-20', status: 'running' },
    { id: 'EQ-002', name: '2号离心泵', station: '朝阳路泵站', model: 'WQ200-15-15', power: '15kW', runtime: 11200, mtbf: 2050, availability: 97.8, lastMaintenance: '2024-01-15', status: 'standby' },
    { id: 'EQ-003', name: '3号离心泵', station: '朝阳路泵站', model: 'WQ200-15-15', power: '15kW', runtime: 8800, mtbf: 2200, availability: 99.1, lastMaintenance: '2024-03-05', status: 'running' },
    { id: 'EQ-004', name: '1号潜污泵', station: '东湖泵站', model: 'WQ300-25-30', power: '30kW', runtime: 18600, mtbf: 1800, availability: 96.2, lastMaintenance: '2024-02-10', status: 'running' },
    { id: 'EQ-005', name: '2号潜污泵', station: '东湖泵站', model: 'WQ300-25-30', power: '30kW', runtime: 17200, mtbf: 1650, availability: 92.5, lastMaintenance: '2024-01-25', status: 'fault' },
];

const inspections = [
    { id: 'IP-001', device: '1号离心泵', station: '朝阳路泵站', inspector: '张伟', date: '2024-03-15', items: 12, passCount: 12, result: '合格', nextDate: '2024-03-22' },
    { id: 'IP-002', device: '2号潜污泵', station: '东湖泵站', inspector: '李明', date: '2024-03-14', items: 12, passCount: 10, result: '需关注', nextDate: '2024-03-21' },
    { id: 'IP-003', device: '闸门控制柜', station: '和平路泵站', inspector: '王强', date: '2024-03-13', items: 8, passCount: 8, result: '合格', nextDate: '2024-03-20' },
    { id: 'IP-004', device: '配电柜', station: '朝阳路泵站', inspector: '赵刚', date: '2024-03-12', items: 10, passCount: 9, result: '需关注', nextDate: '2024-03-19' },
];

const mtRecords = [
    { id: 'MT-001', device: '1号离心泵', station: '朝阳路泵站', type: '定期保养', date: '2024-02-20', content: '轴承润滑、密封件检查、电气绝缘测试', cost: 3500, nextDate: '2024-05-20' },
    { id: 'MT-002', device: '2号潜污泵', station: '东湖泵站', type: '故障维修', date: '2024-03-10', content: '轴承更换、定子绝缘处理、出水口密封更换', cost: 18500, nextDate: '—' },
    { id: 'MT-003', device: '闸阀组', station: '和平路泵站', type: '定期保养', date: '2024-03-05', content: '阀体清洗、密封圈更换、电控系统检测', cost: 5200, nextDate: '2024-06-05' },
];

const initSpares = [
    { id: 'SP-001', name: '机械密封件', spec: 'WQ200配套', stock: 12, minStock: 5, unit: '套', price: 850 },
    { id: 'SP-002', name: '轴承 6310-2RS', spec: 'SKF原装', stock: 8, minStock: 4, unit: '个', price: 320 },
    { id: 'SP-003', name: '电缆 YJV-4×10', spec: '铜芯交联', stock: 200, minStock: 100, unit: '米', price: 25 },
    { id: 'SP-004', name: '接触器 CJ20-63', spec: '380V/63A', stock: 3, minStock: 3, unit: '个', price: 180 },
    { id: 'SP-005', name: '叶轮', spec: 'WQ300配套', stock: 2, minStock: 2, unit: '个', price: 6500 },
    { id: 'SP-006', name: '密封圈', spec: 'DN200丁腈橡胶', stock: 30, minStock: 10, unit: '个', price: 45 },
];

function sCls(s: string) { return s === 'running' ? 'bg-success/15 text-success' : s === 'standby' ? 'bg-info/15 text-info' : 'bg-danger/15 text-danger'; }
function sTxt(s: string) { return s === 'running' ? '运行中' : s === 'standby' ? '待机' : '故障'; }
function rCls(r: string) { return r === '合格' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'; }
function stockCls(stock: number, min: number) { return stock > min ? 'bg-success/15 text-success' : stock === min ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'; }
function stockTxt(stock: number, min: number) { return stock > min ? '充足' : stock === min ? '预警' : '不足'; }

const Th = ({ children }: { children: string }) => <th className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{children}</th>;
const Td = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <td className={`px-4 py-2.5 text-xs ${className}`}>{children}</td>;

export default function EquipmentView() {
    const [activeTab, setActiveTab] = useState('list');
    const [spares, setSpares] = useState(initSpares);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', spec: '', stock: 10, minStock: 5, unit: '个', price: 0 });

    const doAdd = () => {
        if (!form.name) { toast.warning('请输入备件名称'); return; }
        setSpares(p => [{ id: `SP-${String(p.length + 1).padStart(3, '0')}`, ...form }, ...p]);
        setShowAdd(false); toast.success('备件已入库登记');
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">{tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{t.label}</button>)}</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => toast.info('数据导出中...')} className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"><Download className="w-3 h-3" /> 导出</button>
                    {activeTab === 'spare' && <button onClick={() => { setForm({ name: '', spec: '', stock: 10, minStock: 5, unit: '个', price: 0 }); setShowAdd(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> 入库登记</button>}
                </div>
            </div>

            {activeTab === 'list' && <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>设备名称</Th><Th>泵站</Th><Th>型号/功率</Th><Th>运行时长(h)</Th><Th>MTBF(h)</Th><Th>可用率</Th><Th>上次保养</Th><Th>状态</Th></tr></thead><tbody>{equipment.map(eq => <tr key={eq.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                <Td className="font-mono text-primary">{eq.id}</Td><Td className="font-medium text-default">{eq.name}</Td><Td className="text-dim">{eq.station}</Td><Td className="text-dim">{eq.model} / {eq.power}</Td><Td className="text-default">{eq.runtime.toLocaleString()}</Td><Td className="text-default">{eq.mtbf.toLocaleString()}</Td><Td className={`font-medium ${eq.availability >= 97 ? 'text-success' : eq.availability >= 95 ? 'text-warning' : 'text-danger'}`}>{eq.availability}%</Td><Td className="text-dim">{eq.lastMaintenance}</Td><Td><span className={`text-[10px] px-2 py-0.5 rounded-md ${sCls(eq.status)}`}>{sTxt(eq.status)}</span></Td>
            </tr>)}</tbody></table></div>}

            {activeTab === 'inspection' && <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>设备</Th><Th>泵站</Th><Th>巡检人</Th><Th>日期</Th><Th>检查项</Th><Th>下次巡检</Th><Th>结果</Th></tr></thead><tbody>{inspections.map(ip => <tr key={ip.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                <Td className="font-mono text-primary">{ip.id}</Td><Td className="font-medium text-default">{ip.device}</Td><Td className="text-dim">{ip.station}</Td><Td className="text-dim">{ip.inspector}</Td><Td className="text-dim">{ip.date}</Td><Td className="text-default">{ip.passCount}/{ip.items} 通过</Td><Td className="text-dim">{ip.nextDate}</Td><Td><span className={`text-[10px] px-2 py-0.5 rounded-md ${rCls(ip.result)}`}>{ip.result}</span></Td>
            </tr>)}</tbody></table></div>}

            {activeTab === 'maintenance' && <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>设备</Th><Th>泵站</Th><Th>类型</Th><Th>日期</Th><Th>内容</Th><Th>费用(¥)</Th><Th>下次保养</Th></tr></thead><tbody>{mtRecords.map(mt => <tr key={mt.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                <Td className="font-mono text-primary">{mt.id}</Td><Td className="font-medium text-default">{mt.device}</Td><Td className="text-dim">{mt.station}</Td><Td className="text-dim">{mt.type}</Td><Td className="text-dim">{mt.date}</Td><Td className="text-dim max-w-[200px] truncate">{mt.content}</Td><Td className="text-default font-medium">{mt.cost.toLocaleString()}</Td><Td className="text-dim">{mt.nextDate}</Td>
            </tr>)}</tbody></table></div>}

            {activeTab === 'spare' && <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>名称</Th><Th>规格</Th><Th>库存</Th><Th>最低库存</Th><Th>单价(¥)</Th><Th>库存状态</Th></tr></thead><tbody>{spares.map(sp => <tr key={sp.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                <Td className="font-mono text-primary">{sp.id}</Td><Td className="font-medium text-default">{sp.name}</Td><Td className="text-dim">{sp.spec}</Td><Td className="text-default font-medium">{sp.stock} {sp.unit}</Td><Td className="text-dim">{sp.minStock} {sp.unit}</Td><Td className="text-dim">{sp.price}</Td><Td><span className={`text-[10px] px-2 py-0.5 rounded-md ${stockCls(sp.stock, sp.minStock)}`}>{stockTxt(sp.stock, sp.minStock)}</span></Td>
            </tr>)}</tbody></table></div>}

            <ModalDialog show={showAdd} title="备件入库登记" onClose={() => setShowAdd(false)} onConfirm={doAdd}>
                <div className="space-y-3">
                    <div><label className="text-xs text-dim mb-1 block">备件名称 <span className="text-danger">*</span></label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" placeholder="例如：机械密封件" /></div>
                    <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-dim mb-1 block">规格型号</label><input value={form.spec} onChange={e => setForm(f => ({ ...f, spec: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" /></div><div><label className="text-xs text-dim mb-1 block">单位</label><select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"><option>个</option><option>套</option><option>米</option><option>公斤</option></select></div></div>
                    <div className="grid grid-cols-3 gap-3"><div><label className="text-xs text-dim mb-1 block">入库数量</label><input value={form.stock} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} type="number" className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" /></div><div><label className="text-xs text-dim mb-1 block">最低库存</label><input value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: +e.target.value }))} type="number" className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" /></div><div><label className="text-xs text-dim mb-1 block">单价(¥)</label><input value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} type="number" className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary" /></div></div>
                </div>
            </ModalDialog>
        </div>
    );
}
