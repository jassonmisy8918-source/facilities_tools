import { useState } from 'react';
import { Download, Upload, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/components/common/ToastNotify.store';

const dataTabs = [
    { key: 'catalog', label: '数据目录' },
    { key: 'rules', label: '质检规则' },
    { key: 'report', label: '质检报告' },
];

const initialDatasets = [
    { id: 1, name: '排水管网基础信息', category: '管网数据', records: 15680, quality: 94, lastUpdate: '2024-03-15', format: 'SHP/GDB' },
    { id: 2, name: '检查井台账数据', category: '设施数据', records: 12456, quality: 91, lastUpdate: '2024-03-14', format: 'Excel' },
    { id: 3, name: '实时监测数据', category: '监测数据', records: 2840000, quality: 98, lastUpdate: '2024-03-15', format: 'DB' },
    { id: 4, name: '巡查记录数据', category: '运维数据', records: 8650, quality: 87, lastUpdate: '2024-03-12', format: 'JSON' },
    { id: 5, name: '泵站运行数据', category: '运行数据', records: 562000, quality: 96, lastUpdate: '2024-03-15', format: 'DB' },
    { id: 6, name: '排水户信息', category: '用户数据', records: 3420, quality: 82, lastUpdate: '2024-02-28', format: 'Excel' },
];

interface QualityRule { id: string; name: string; description: string; category: string; severity: string; enabled: boolean }

const initialRules: QualityRule[] = [
    { id: 'QR-001', name: '混错接检测', description: '检查雨水管接入污水管或污水管接入雨水管', category: '连接检查', severity: 'high', enabled: true },
    { id: 'QR-002', name: '大管接小管检测', description: '检查上游管径大于下游管径的异常连接', category: '管径检查', severity: 'high', enabled: true },
    { id: 'QR-003', name: '断头管检测', description: '检查末端无下游连接的管段', category: '连通检查', severity: 'medium', enabled: true },
    { id: 'QR-004', name: '逆坡管段检测', description: '检查起点标高低于终点标高的管段', category: '坡度检查', severity: 'medium', enabled: true },
    { id: 'QR-005', name: '孤立设施检测', description: '检查无任何管道连接的独立设施', category: '连通检查', severity: 'low', enabled: true },
    { id: 'QR-006', name: '重复要素检测', description: '检查坐标重叠或属性完全相同的记录', category: '唯一性检查', severity: 'low', enabled: true },
    { id: 'QR-007', name: '坐标异常检测', description: '检查超出行政区划范围的坐标点', category: '空间检查', severity: 'medium', enabled: false },
];

const qualityReports = [
    { id: 'QRP-001', name: '2024年Q1数据质检报告', date: '2024-03-15', totalChecked: 28136, passed: 26820, failed: 1316, passRate: 95.3 },
    { id: 'QRP-002', name: '排水管网数据专项质检', date: '2024-03-10', totalChecked: 15680, passed: 14892, failed: 788, passRate: 95.0 },
    { id: 'QRP-003', name: '新入库数据质检', date: '2024-03-14', totalChecked: 320, passed: 298, failed: 22, passRate: 93.1 },
];

function getSeverityClass(s: string) { return s === 'high' ? 'bg-danger/15 text-danger' : s === 'medium' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'; }
function getSeverityText(s: string) { return s === 'high' ? '严重' : s === 'medium' ? '一般' : '轻微'; }

export default function DataQualityView() {
    const [activeTab, setActiveTab] = useState('catalog');
    const [rules, setRules] = useState(initialRules);

    const toggleRule = (ruleId: string) => {
        setRules(prev => prev.map(r => {
            if (r.id === ruleId) {
                const next = { ...r, enabled: !r.enabled };
                toast.info(`规则 "${r.name}" 已${next.enabled ? '启用' : '停用'}`);
                return next;
            }
            return r;
        }));
    };

    return (
        <div className="space-y-4 p-4">
            {/* Tab + 操作 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">
                    {dataTabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}
                        >{tab.label}</button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => toast.info('请选择要导入的数据文件...')} className="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"><Upload className="w-3.5 h-3.5" /> 导入</button>
                    <button onClick={() => toast.info('数据导出中，请稍候...')} className="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"><Download className="w-3.5 h-3.5" /> 导出</button>
                </div>
            </div>

            {/* 数据目录 */}
            {activeTab === 'catalog' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-themed">
                                {['数据集名称', '分类', '记录数', '格式', '最后更新', '质量评分'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {initialDatasets.map(ds => (
                                <tr key={ds.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                                    <td className="px-4 py-2.5 text-xs font-medium text-default">{ds.name}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim">{ds.category}</td>
                                    <td className="px-4 py-2.5 text-xs text-default">{ds.records.toLocaleString()}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim font-mono">{ds.format}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim">{ds.lastUpdate}</td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-surface rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full transition-all ${ds.quality >= 95 ? 'bg-success' : ds.quality >= 85 ? 'bg-primary' : 'bg-warning'}`} style={{ width: `${ds.quality}%` }}></div>
                                            </div>
                                            <span className={`text-[10px] font-medium ${ds.quality >= 95 ? 'text-success' : ds.quality >= 85 ? 'text-default' : 'text-warning'}`}>{ds.quality}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 质检规则 */}
            {activeTab === 'rules' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-themed">
                                {['编号', '规则名称', '描述', '分类', '严重度', '状态'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map(r => (
                                <tr key={r.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                                    <td className="px-4 py-2.5 text-xs font-mono text-primary">{r.id}</td>
                                    <td className="px-4 py-2.5 text-xs font-medium text-default">{r.name}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim max-w-[250px]">{r.description}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim">{r.category}</td>
                                    <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${getSeverityClass(r.severity)}`}>{getSeverityText(r.severity)}</span></td>
                                    <td className="px-4 py-2.5">
                                        <button onClick={() => toggleRule(r.id)}
                                            className={`text-[10px] px-2 py-0.5 rounded-md cursor-pointer transition-colors ${r.enabled ? 'bg-success/15 text-success hover:bg-success/25' : 'bg-surface text-dim hover:bg-hover-themed'}`}
                                        >{r.enabled ? '已启用' : '已停用'}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 质检报告 */}
            {activeTab === 'report' && (
                <div className="space-y-3">
                    {qualityReports.map(rpt => (
                        <div key={rpt.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="text-sm font-semibold text-default">{rpt.name}</h4>
                                    <p className="text-xs text-dim mt-0.5">{rpt.date}</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-success/15 text-success">已完成</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-xs">
                                <div><span className="text-dim">总检查数:</span> <span className="text-default font-medium ml-1">{rpt.totalChecked.toLocaleString()}</span></div>
                                <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-success" /> <span className="text-dim">通过:</span> <span className="text-success font-medium ml-1">{rpt.passed.toLocaleString()}</span></div>
                                <div className="flex items-center gap-1"><XCircle className="w-3 h-3 text-danger" /> <span className="text-dim">不通过:</span> <span className="text-danger font-medium ml-1">{rpt.failed.toLocaleString()}</span></div>
                                <div><span className="text-dim">通过率:</span> <span className={`font-bold ml-1 ${rpt.passRate >= 95 ? 'text-success' : 'text-warning'}`}>{rpt.passRate}%</span></div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-themed/50">
                                <button onClick={() => toast.info(`正在下载 "${rpt.name}"...`)} className="flex items-center gap-1 text-xs text-primary hover:text-primary-light cursor-pointer">
                                    <Download className="w-3 h-3" /> 下载报告
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
