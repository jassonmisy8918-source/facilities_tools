import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react';
import { toast } from '@/components/common/ToastNotify.store';

const statTabs = [{ key: 'patrol', label: '巡查统计' }, { key: 'maintenance', label: '养护工作量' }, { key: 'performance', label: '绩效评估' }];

const patrolKPIs = [
    { label: '本月巡查次数', value: '286', change: '+12%', Icon: BarChart3, color: '#3B82F6' },
    { label: '发现问题', value: '34', change: '-8%', Icon: AlertTriangle, color: '#FFB020' },
    { label: '问题闭环率', value: '91%', change: '+5%', Icon: CheckCircle, color: '#00D4AA' },
    { label: '平均处理时长', value: '4.2h', change: '-15%', Icon: Clock, color: '#8B5CF6' },
];

const maintenanceStats = [
    { label: '本月工时', value: '1,248', unit: '小时' }, { label: '养护里程', value: '85.2', unit: 'km' },
    { label: '材料费用', value: '38,000', unit: '元' }, { label: '人工费用', value: '42,000', unit: '元' },
    { label: '设备费用', value: '20,000', unit: '元' }, { label: '总费用', value: '100,000', unit: '元' },
];

const performanceData = [
    { rank: 1, name: '张伟', team: '巡查一组', tasks: 68, completion: 100, avgTime: '2.8h', issues: 12, score: 96 },
    { rank: 2, name: '李明', team: '巡查一组', tasks: 62, completion: 98, avgTime: '3.1h', issues: 10, score: 93 },
    { rank: 3, name: '王强', team: '巡查二组', tasks: 55, completion: 96, avgTime: '3.5h', issues: 8, score: 89 },
    { rank: 4, name: '赵刚', team: '巡查三组', tasks: 48, completion: 95, avgTime: '3.8h', issues: 6, score: 85 },
    { rank: 5, name: '周磊', team: '检测组', tasks: 35, completion: 100, avgTime: '4.5h', issues: 15, score: 82 },
    { rank: 6, name: '陈静', team: '巡查三组', tasks: 42, completion: 93, avgTime: '4.0h', issues: 5, score: 80 },
];

const trendOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const },
    legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
    grid: { top: 30, right: 15, bottom: 25, left: 45 },
    xAxis: { type: 'category' as const, data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: { type: 'value' as const, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
    series: [
        { name: '巡查次数', type: 'bar' as const, data: [220, 235, 286, 0, 0, 0, 0, 0, 0, 0, 0, 0], itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
        { name: '发现问题', type: 'bar' as const, data: [28, 32, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0], itemStyle: { color: '#FFB020', borderRadius: [3, 3, 0, 0] } },
    ]
};

const categoryOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'item' as const },
    color: ['#3B82F6', '#00D4AA', '#FFB020', '#FF4757', '#8B5CF6'],
    series: [{
        type: 'pie' as const, radius: ['45%', '70%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 },
        data: [{ value: 12, name: '结构缺陷' }, { value: 8, name: '淤积堵塞' }, { value: 6, name: '井盖缺损' }, { value: 5, name: '设施损坏' }, { value: 3, name: '其他' }]
    }]
};

const maintenanceChartOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const },
    legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
    grid: { top: 30, right: 60, bottom: 25, left: 45 },
    xAxis: { type: 'category' as const, data: ['1月', '2月', '3月'], axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: [
        { type: 'value' as const, name: '工时(h)', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        { type: 'value' as const, name: '费用(万)', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
    ],
    series: [
        { name: '工时', type: 'bar' as const, data: [980, 1120, 1248], itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
        { name: '费用', type: 'line' as const, yAxisIndex: 1, data: [8.5, 9.2, 10.0], lineStyle: { color: '#FF4757' }, itemStyle: { color: '#FF4757' } },
    ]
};

export default function StatisticsView() {
    const [activeTab, setActiveTab] = useState('patrol');
    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5 w-fit">
                    {statTabs.map(t => <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${activeTab === t.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{t.label}</button>)}
                </div>
                <button onClick={() => toast.info('统计报表导出中...')} className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"><Download className="w-3 h-3" /> 导出报表</button>
            </div>

            {activeTab === 'patrol' && <>
                <div className="grid grid-cols-4 gap-3">{patrolKPIs.map(k => (
                    <div key={k.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                        <div className="flex items-center justify-between mb-2"><span className="text-xs text-dim">{k.label}</span><k.Icon className="w-4 h-4" style={{ color: k.color }} /></div>
                        <p className="text-2xl font-bold text-default">{k.value}</p>
                        <p className={`text-xs mt-1 ${k.change.startsWith('+') ? 'text-success' : 'text-warning'}`}>{k.change} 环比</p>
                    </div>
                ))}</div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">月度巡查趋势</h4><div className="h-52"><ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} /></div></div>
                    <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">问题分类</h4><div className="h-52"><ReactECharts option={categoryOption} style={{ height: '100%', width: '100%' }} /></div></div>
                </div>
            </>}

            {activeTab === 'maintenance' && <>
                <div className="grid grid-cols-6 gap-3">{maintenanceStats.map(ms => (
                    <div key={ms.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed text-center"><p className="text-xs text-dim mb-1">{ms.label}</p><p className="text-xl font-bold text-default">{ms.value}</p><p className="text-[10px] text-muted-themed">{ms.unit}</p></div>
                ))}</div>
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">养护工作量趋势</h4><div className="h-56"><ReactECharts option={maintenanceChartOption} style={{ height: '100%', width: '100%' }} /></div></div>
            </>}

            {activeTab === 'performance' && (
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">
                    {['排名', '姓名', '班组', '任务数', '完成率', '平均时长', '发现问题', '综合评分'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}
                </tr></thead><tbody>{performanceData.map(p => (
                    <tr key={p.rank} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                        <td className="px-4 py-2.5 text-xs"><span className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${p.rank <= 3 ? 'bg-primary/15 text-primary' : 'text-dim'}`}>{p.rank}</span></td>
                        <td className="px-4 py-2.5 text-xs font-medium text-default">{p.name}</td>
                        <td className="px-4 py-2.5 text-xs text-dim">{p.team}</td>
                        <td className="px-4 py-2.5 text-xs text-default">{p.tasks}</td>
                        <td className={`px-4 py-2.5 text-xs font-medium ${p.completion >= 98 ? 'text-success' : 'text-warning'}`}>{p.completion}%</td>
                        <td className="px-4 py-2.5 text-xs text-dim">{p.avgTime}</td>
                        <td className="px-4 py-2.5 text-xs text-default">{p.issues}</td>
                        <td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className="w-16 bg-surface rounded-full h-1.5"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${p.score}%` }} /></div><span className="text-xs font-bold text-primary">{p.score}</span></div></td>
                    </tr>
                ))}</tbody></table></div>
            )}
        </div>
    );
}
