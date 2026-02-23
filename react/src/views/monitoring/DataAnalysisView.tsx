import { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Search, Download } from 'lucide-react';

const analysisTabs = [
    { key: 'correlation', label: '关联分析' },
    { key: 'compare', label: '数据对比' },
    { key: 'report', label: '报表管理' },
];

const monitorPointOptions = ['雨花路DN600', '民生路DN400', '和平路雨量站', '新华街DN800', '东湖泵站进水', '建设大道DN300'];
const timeRangeOptions = [{ key: '24h', label: '24小时' }, { key: '7d', label: '7天' }, { key: '30d', label: '30天' }, { key: '90d', label: '90天' }];
const metricOptions = [{ key: 'flow', label: '流量' }, { key: 'level', label: '水位' }, { key: 'rainfall', label: '雨量' }, { key: 'quality', label: '水质' }];

const reports = [
    { id: 'RPT-001', name: '2024年3月日处理量报表', type: '日报', createDate: '2024-03-15', creator: '系统', status: 'completed', format: 'Excel' },
    { id: 'RPT-002', name: '2024年Q1水质监测分析报告', type: '季报', createDate: '2024-03-10', creator: '张工', status: 'completed', format: 'PDF' },
    { id: 'RPT-003', name: '2024年2月BOD/COD分析', type: '月报', createDate: '2024-03-01', creator: '系统', status: 'completed', format: 'Excel' },
    { id: 'RPT-004', name: '暴雨事件应急监测报告', type: '专项', createDate: '2024-02-28', creator: '李工', status: 'completed', format: 'PDF' },
    { id: 'RPT-005', name: '2024年3月流量异常分析', type: '专项', createDate: '2024-03-14', creator: '系统', status: 'generating', format: 'Excel' },
];

function getCorrelationOption() {
    const hours = Array.from({ length: 48 }, (_, i) => `${Math.floor(i / 2).toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`);
    return {
        backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
        legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
        grid: { top: 30, right: 50, bottom: 25, left: 50 },
        xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 5 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: [
            { type: 'value', name: '水位(m)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
            { type: 'value', name: '雨量(mm)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, inverse: true, splitLine: { show: false } },
        ],
        series: [
            { name: '水位', type: 'line', smooth: true, data: hours.map(() => (1.2 + Math.random() * 1.5).toFixed(2)), lineStyle: { color: '#3B82F6', width: 2 }, itemStyle: { color: '#3B82F6' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(59,130,246,0.2)' }, { offset: 1, color: 'rgba(59,130,246,0)' }]) } },
            { name: '雨量', type: 'bar', yAxisIndex: 1, data: hours.map(() => (Math.random() * 3).toFixed(1)), itemStyle: { color: 'rgba(0,212,170,0.6)' } },
        ]
    };
}

function getCompareOption() {
    const days = Array.from({ length: 7 }, (_, i) => `03-${(9 + i).toString().padStart(2, '0')}`);
    return {
        backgroundColor: 'transparent', tooltip: { trigger: 'axis' },
        legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
        grid: { top: 30, right: 15, bottom: 25, left: 50 },
        xAxis: { type: 'category', data: days, axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: { type: 'value', name: 'm³/h', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [
            { name: '雨花路DN600', type: 'line', smooth: true, data: [320, 335, 340, 345, 338, 342, 340], lineStyle: { color: '#3B82F6' }, itemStyle: { color: '#3B82F6' } },
            { name: '民生路DN400', type: 'line', smooth: true, data: [180, 185, 192, 188, 195, 190, 187], lineStyle: { color: '#00D4AA' }, itemStyle: { color: '#00D4AA' } },
            { name: '东湖泵站进水', type: 'line', smooth: true, data: [500, 510, 518, 525, 520, 515, 518], lineStyle: { color: '#FFB020' }, itemStyle: { color: '#FFB020' } },
        ]
    };
}

export default function DataAnalysisView() {
    const [activeTab, setActiveTab] = useState('correlation');
    const [selectedPoint, setSelectedPoint] = useState(monitorPointOptions[0]);
    const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
    const [selectedMetric, setSelectedMetric] = useState('flow');

    return (
        <div className="space-y-4 p-4">
            {/* Tab */}
            <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5 w-fit">
                {analysisTabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{tab.label}</button>
                ))}
            </div>

            {/* 查询面板 */}
            {activeTab !== 'report' && (
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-dim">监测点:</span>
                        <select value={selectedPoint} onChange={e => setSelectedPoint(e.target.value)} className="bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                            {monitorPointOptions.map(pt => <option key={pt}>{pt}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-dim">时间:</span>
                        <div className="flex items-center gap-0.5 bg-surface border border-themed rounded-md p-0.5">
                            {timeRangeOptions.map(tr => (
                                <button key={tr.key} onClick={() => setSelectedTimeRange(tr.key)}
                                    className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${selectedTimeRange === tr.key ? 'bg-primary text-white' : 'text-dim hover:text-default'}`}>{tr.label}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-dim">指标:</span>
                        <select value={selectedMetric} onChange={e => setSelectedMetric(e.target.value)} className="bg-input border border-themed rounded-md px-2 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
                            {metricOptions.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                        </select>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer"><Search className="w-3 h-3" /> 查询</button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"><Download className="w-3 h-3" /> 导出</button>
                </div>
            )}

            {/* 关联分析 */}
            {activeTab === 'correlation' && (
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h4 className="text-sm font-semibold text-default mb-2">水位-雨量关联分析</h4>
                    <div className="h-64"><ReactECharts option={getCorrelationOption()} style={{ height: '100%', width: '100%' }} /></div>
                </div>
            )}

            {/* 数据对比 */}
            {activeTab === 'compare' && (
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h4 className="text-sm font-semibold text-default mb-2">多点位流量对比</h4>
                    <div className="h-64"><ReactECharts option={getCompareOption()} style={{ height: '100%', width: '100%' }} /></div>
                </div>
            )}

            {/* 报表管理 */}
            {activeTab === 'report' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-themed">
                            {['编号', '报表名称', '类型', '格式', '创建日期', '创建人', '状态', '操作'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {reports.map(r => (
                                <tr key={r.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                                    <td className="px-4 py-2.5 text-xs font-mono text-primary">{r.id}</td>
                                    <td className="px-4 py-2.5 text-xs font-medium text-default">{r.name}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim">{r.type}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim">{r.format}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim">{r.createDate}</td>
                                    <td className="px-4 py-2.5 text-xs text-dim">{r.creator}</td>
                                    <td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${r.status === 'completed' ? 'bg-success/15 text-success' : 'bg-info/15 text-info'}`}>{r.status === 'completed' ? '已生成' : '生成中'}</span></td>
                                    <td className="px-4 py-2.5"><button className="text-xs text-primary hover:text-primary-light transition-colors cursor-pointer"><Download className="w-3.5 h-3.5 inline mr-0.5" />下载</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
