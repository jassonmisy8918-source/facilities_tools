import { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

const tabs = [{ key: 'archive', label: '健康档案' }, { key: 'defect', label: '管道缺陷' }, { key: 'repair', label: '修复计划' }];

const healthRecords = [
    { id: 1, segment: '雨花路 P01-P05', material: 'HDPE', age: 6, score: 92, grade: 'A', defects: 0 },
    { id: 2, segment: '民生路 P01-P10', material: '钢筋混凝土', age: 12, score: 75, grade: 'B', defects: 3 },
    { id: 3, segment: '和平路 P05-P08', material: 'PVC', age: 15, score: 58, grade: 'C', defects: 5 },
    { id: 4, segment: '新华路 P01-P03', material: '钢筋混凝土', age: 20, score: 42, grade: 'D', defects: 8 },
    { id: 5, segment: '建设大道 P10-P15', material: 'PE', age: 3, score: 98, grade: 'A', defects: 0 },
    { id: 6, segment: '东湖路 P01-P06', material: '球墨铸铁', age: 10, score: 81, grade: 'B', defects: 2 },
];

const initDefects = [
    { id: 'DF-001', segment: '和平路 P05-P06', type: '裂缝', position: '距起点25.3m', grade: '中度', method: 'CCTV检测', date: '2024-03-10', status: 'confirmed', hasImage: true },
    { id: 'DF-002', segment: '新华路 P01-P02', type: '变形', position: '距起点12.8m', grade: '严重', method: 'CCTV检测', date: '2024-03-08', status: 'repairing', hasImage: true },
    { id: 'DF-003', segment: '民生路 P03-P04', type: '腐蚀', position: '距起点8.5m', grade: '轻度', method: 'QV检测', date: '2024-03-05', status: 'confirmed', hasImage: false },
    { id: 'DF-004', segment: '新华路 P02-P03', type: '渗漏', position: '距起点45.2m', grade: '严重', method: 'CCTV检测', date: '2024-03-01', status: 'repaired', hasImage: true },
    { id: 'DF-005', segment: '和平路 P06-P07', type: '错口', position: '距起点18.0m', grade: '中度', method: 'CCTV检测', date: '2024-02-28', status: 'confirmed', hasImage: true },
];

const initRepairs = [
    { id: 'RP-001', segment: '新华路 P01-P03', method: '非开挖修复(CIPP)', length: 65, estimatedCost: 185000, priority: '紧急', startDate: '2024-03-20', status: 'planning' },
    { id: 'RP-002', segment: '和平路 P05-P07', method: '局部修复(点状修复)', length: 28, estimatedCost: 42000, priority: '高', startDate: '2024-04-01', status: 'approved' },
    { id: 'RP-003', segment: '民生路 P03-P04', method: '管道内衬', length: 35, estimatedCost: 75000, priority: '一般', startDate: '2024-04-15', status: 'planning' },
];

function gCls(g: string) { return g === 'A' ? 'bg-success/15 text-success' : g === 'B' ? 'bg-info/15 text-info' : g === 'C' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'; }
function dgCls(g: string) { return g === '轻度' ? 'bg-info/15 text-info' : g === '中度' ? 'bg-warning/15 text-warning' : 'bg-danger/15 text-danger'; }
function dsCls(s: string) { return s === 'confirmed' ? 'bg-warning/15 text-warning' : s === 'repairing' ? 'bg-info/15 text-info' : 'bg-success/15 text-success'; }
function dsTxt(s: string) { return s === 'confirmed' ? '已确认' : s === 'repairing' ? '修复中' : '已修复'; }
function rsCls(s: string) { return s === 'planning' ? 'bg-warning/15 text-warning' : s === 'approved' ? 'bg-info/15 text-info' : s === 'executing' ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success'; }
function rsTxt(s: string) { return s === 'planning' ? '规划中' : s === 'approved' ? '已审批' : s === 'executing' ? '施工中' : '已完成'; }
function prCls(p: string) { return p === '紧急' ? 'text-danger' : p === '高' ? 'text-warning' : 'text-info'; }

const gradeOption = { backgroundColor: 'transparent', tooltip: { trigger: 'item' as const }, color: ['#00D4AA', '#3B82F6', '#FFB020', '#FF4757'], series: [{ type: 'pie' as const, radius: ['45%', '70%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 }, data: [{ value: 35, name: 'A级' }, { value: 28, name: 'B级' }, { value: 22, name: 'C级' }, { value: 15, name: 'D级' }] }] };
const trendOption = { backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const }, grid: { top: 20, right: 15, bottom: 25, left: 40 }, xAxis: { type: 'category' as const, data: ['2019', '2020', '2021', '2022', '2023', '2024'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } }, yAxis: { type: 'value' as const, name: '平均分', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } }, series: [{ type: 'line' as const, smooth: true, data: [82, 80, 78, 76, 74, 73], lineStyle: { color: '#FFB020', width: 2 }, itemStyle: { color: '#FFB020' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255,176,32,0.2)' }, { offset: 1, color: 'rgba(255,176,32,0)' }]) } }] };

const Th = ({ children }: { children: string }) => <th className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{children}</th>;

export default function PipeHealthView() {
    const [activeTab, setActiveTab] = useState('archive');
    const [defects, setDefects] = useState(initDefects);
    const [repairs, setRepairs] = useState(initRepairs);
    const [showDetail, setShowDetail] = useState(false);
    const [selected, setSelected] = useState<typeof initDefects[0] | null>(null);

    const advanceDefect = (id: string) => { const flow: Record<string, string> = { confirmed: 'repairing', repairing: 'repaired' }; setDefects(p => p.map(d => d.id === id ? { ...d, status: flow[d.status] || d.status } : d)); toast.success('缺陷状态已更新'); };
    const advanceRepair = (id: string) => { const flow: Record<string, string> = { planning: 'approved', approved: 'executing', executing: 'completed' }; setRepairs(p => p.map(r => r.id === id ? { ...r, status: flow[r.status] || r.status } : r)); toast.success('修复计划已推进'); };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5 w-fit">{tabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{t.label}</button>)}</div>

            {activeTab === 'archive' && <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>管段</Th><Th>材质</Th><Th>管龄</Th><Th>健康分</Th><Th>等级</Th><Th>缺陷数</Th></tr></thead><tbody>{healthRecords.map(r => <tr key={r.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors"><td className="px-4 py-2.5 text-xs font-medium text-default">{r.segment}</td><td className="px-4 py-2.5 text-xs text-dim">{r.material}</td><td className="px-4 py-2.5 text-xs text-dim">{r.age}年</td><td className={`px-4 py-2.5 text-xs font-bold ${r.score >= 80 ? 'text-success' : r.score >= 60 ? 'text-warning' : 'text-danger'}`}>{r.score}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${gCls(r.grade)}`}>{r.grade}级</span></td><td className={`px-4 py-2.5 text-xs ${r.defects > 0 ? 'text-danger font-medium' : 'text-dim'}`}>{r.defects}</td></tr>)}</tbody></table></div>
                <div className="space-y-4"><div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">健康等级分布</h4><div className="h-40"><ReactECharts option={gradeOption} style={{ height: '100%', width: '100%' }} /></div></div><div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">健康度趋势</h4><div className="h-40"><ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} /></div></div></div>
            </div>}

            {activeTab === 'defect' && <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed"><Th>编号</Th><Th>管段</Th><Th>缺陷类型</Th><Th>位置</Th><Th>等级</Th><Th>检测方式</Th><Th>发现日期</Th><Th>状态</Th><Th>操作</Th></tr></thead><tbody>{defects.map(d => <tr key={d.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors"><td className="px-4 py-2.5 text-xs font-mono text-primary">{d.id}</td><td className="px-4 py-2.5 text-xs font-medium text-default">{d.segment}</td><td className="px-4 py-2.5 text-xs text-default">{d.type}</td><td className="px-4 py-2.5 text-xs text-dim">{d.position}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${dgCls(d.grade)}`}>{d.grade}</span></td><td className="px-4 py-2.5 text-xs text-dim">{d.method}</td><td className="px-4 py-2.5 text-xs text-dim">{d.date}</td><td className="px-4 py-2.5">{d.status !== 'repaired' ? <button onClick={() => advanceDefect(d.id)} className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${dsCls(d.status)}`}>{dsTxt(d.status)}</button> : <span className={`text-[10px] px-2 py-0.5 rounded-md ${dsCls(d.status)}`}>{dsTxt(d.status)}</span>}</td><td className="px-4 py-2.5"><button onClick={() => { setSelected(d); setShowDetail(true); }} className="text-[10px] text-primary hover:underline cursor-pointer">详情</button></td></tr>)}</tbody></table></div>}

            {activeTab === 'repair' && <div className="space-y-3">{repairs.map(rp => <div key={rp.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed"><div className="flex items-start justify-between mb-3"><div><h4 className="text-sm font-semibold text-default flex items-center gap-2"><span className={prCls(rp.priority)}>●</span> {rp.segment}</h4><p className="text-xs text-dim mt-0.5">{rp.method} · 长度 {rp.length}m</p></div><div className="flex items-center gap-2"><span className={`text-[10px] font-medium ${prCls(rp.priority)}`}>{rp.priority}</span>{rp.status !== 'completed' ? <button onClick={() => advanceRepair(rp.id)} className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${rsCls(rp.status)}`}>{rsTxt(rp.status)}</button> : <span className={`text-[10px] px-2 py-0.5 rounded-md ${rsCls(rp.status)}`}>{rsTxt(rp.status)}</span>}</div></div><div className="flex items-center gap-6 text-xs text-dim"><span>预算: <span className="text-default font-medium">¥{rp.estimatedCost.toLocaleString()}</span></span><span>计划开始: {rp.startDate}</span></div></div>)}</div>}

            <ModalDialog show={showDetail} title="缺陷详情" onClose={() => setShowDetail(false)} onConfirm={() => setShowDetail(false)}>
                {selected && <div className="space-y-3 text-xs"><div className="grid grid-cols-2 gap-3"><div><span className="text-dim">编号：</span><span className="text-default font-mono">{selected.id}</span></div><div><span className="text-dim">管段：</span><span className="text-default">{selected.segment}</span></div><div><span className="text-dim">类型：</span><span className="text-default">{selected.type}</span></div><div><span className="text-dim">位置：</span><span className="text-default">{selected.position}</span></div><div><span className="text-dim">等级：</span><span className={`px-1.5 py-0.5 rounded ${dgCls(selected.grade)}`}>{selected.grade}</span></div><div><span className="text-dim">检测方式：</span><span className="text-default">{selected.method}</span></div><div><span className="text-dim">发现日期：</span><span className="text-default">{selected.date}</span></div><div><span className="text-dim">状态：</span><span className={`px-1.5 py-0.5 rounded ${dsCls(selected.status)}`}>{dsTxt(selected.status)}</span></div></div>{selected.hasImage && <div className="p-3 bg-surface rounded-lg text-center text-dim">📷 CCTV 检测影像（示意）</div>}</div>}
            </ModalDialog>
        </div>
    );
}
